import assign from 'lodash.assign'
import bcrypt from 'bcryptjs'
import Joi from 'joi'

import hash from '../services/hash'
import orm from '../db'
import { AuthenticationError } from '../errors'
import { userValidation } from '../validations'

const destroyDependencies = (model) => {
  const bots = model.bots()
  const tokens = model.tokens()

  return Promise.all([
    bots.fetch(),
    tokens.fetch()
  ])
  .then(() => Promise.all([
    bots.invokeThen('destroy'),
    tokens.invokeThen('destroy')
  ]))
}

const archiveDependencies = (model) => {
  const bots = model.bots()
  const tokens = model.tokens()

  return Promise.all([
    bots.fetch(),
    tokens.fetch()
  ])
  .then(() => Promise.all([
    bots.invokeThen('archive'),
    tokens.invokeThen('archive')
  ]))
}

const validate = (model) => {
  return Joi.validate(model.attributes, userValidation)
}

const comparePassword = (password, user) => new Promise((resolve, reject) => {
  bcrypt.compare(password, user.get('password'), (err, same) => {
    if (err || !same) {
      reject(new AuthenticationError('Invalid password!'))
      return
    }

    resolve(user)
  })
})

const convertPassword = (model) => new Promise((resolve, reject) => {
  if (!model.hasChanged('password') || !model.isNew()) {
    resolve()
    return
  }

  hash(model.get('password'))
    .then((password) => model.set({ password }))
    .then(() => resolve())
    .catch((error) => reject(error))
})

const buildProfile = (user, bots) => {
  return assign({}, user.omit(['password', 'stripe_id']), {
    bots: bots.toJSON()
  })
}

const config = {
  tableName: 'users',

  hasTimestamps: true,

  initialize () {
    this.on('creating', (model) => convertPassword(model))
    this.on('destroying', (model) => destroyDependencies(model))
    this.on('saving', (model) => validate(model))
  },

  activeTokens () {
    const today = new Date()
    const thirtyDays = new Date().setDate(today.getDate() - 30)

    return this.hasMany('Token').query((queryBuilder) => {
      queryBuilder.where('last_updated', '>', thirtyDays)
    })
  },

  tokens () {
    return this.hasMany('Token')
  },

  activeBots () {
    return this.hasMany('Bot').query({ where: { active: true } })
  },

  inactiveBots () {
    return this.hasMany('Bot').query({ where: { active: false } })
  },

  bots () {
    return this.hasMany('Bot')
  },

  profile () {
    return new Promise((resolve, reject) => {
      this.bots().fetch()
        .then((bots) => resolve(buildProfile(this, bots)))
        .catch((error) => reject(error))
    })
  },

  archive () {
    return archiveDependencies(this)
      .then(() => this.save({ active: false }, { patch: true }))
  }
}

const virtuals = {
  profile (id, email) {
    return new this({ id: id, email: email })
      .fetch({ require: true })
      .then((user) => user.profile())
  },

  authenticate (email, password) {
    if (!email || !password) {
      return Promise.reject(new AuthenticationError('Email and password are both required!'))
    }

    return new this({ email: email.toLowerCase().trim() })
      .fetch({ require: true })
      .catch(() => Promise.reject(new AuthenticationError('User not found!')))
      .then((user) => comparePassword(password, user))
  }
}

const User = orm.Model.extend(config, virtuals)
orm.model('User', User)

export default User
