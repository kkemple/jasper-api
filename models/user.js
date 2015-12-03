import assign from 'lodash.assign'
import bcrypt from 'bcryptjs'
import Joi from 'joi'
import Promise from 'bluebird'

import orm from '../db'
import { AuthenticationError } from '../errors'
import { userValidation } from '../validations'

const destroyDependencies = (model) => {
  const bots = model.bots()
  const tokens = model.tokens()


  return Promise.all([
    bots.fetch(),
    tokens.fetch(),
  ])
  .then(() => Promise.all([
    bots.invokeThen('destroy'),
    tokens.invokeThen('destroy'),
  ]))
}

const archiveDependencies = (model) => {
  const bots = model.bots()
  const tokens = model.tokens()


  return Promise.all([
    bots.fetch(),
    tokens.fetch(),
  ])
  .then(() => Promise.all([
    bots.invokeThen('archive'),
    tokens.invokeThen('archive'),
  ]))
}

const validate = (model, attrs) => {
  return Joi.validate(attrs, userValidation)
}

const comparePassword = (password, user) => new Promise((res, rej) => {
  bcrypt.compare(password, user.get('password'), (err, same) => {
    if (err || !same) {
      rej(new AuthenticationError('Invalid password!'))
      return
    }

    res(user)
  })
})

const hashPassword = (model) => new Promise((res, rej) => {
  bcrypt.genSalt(10, (saltGenErr, salt) => {
    if (saltGenErr) return rej(saltGenErr)

    bcrypt.hash(model.get('password'), salt, (hashErr, hash) => {
      if (hashErr) return rej(hashErr)

      model.set('password', hash)
      return res()
    })
  })
})

const convertPassword = (model) => {
  if (model.hasChanged('password') || model.isNew()) {
    return hashPassword(model)
  }

  return Promise.resolve()
}

const buildProfile = (user, bots) => {
  return assign({}, user.omit(['password', 'stripe_id']), {
    bots: bots.toJSON(),
  })
}

const config = {
  tableName: 'users',

  hasTimestamps: true,

  initialize() {
    this.on('creating', convertPassword)
    this.on('saving', convertPassword)
    this.on('destroying', destroyDependencies)
    this.on('saving', validate)
  },

  activeTokens() {
    const today = new Date()
    const thirtyDays = new Date().setDate(today.getDate() - 30)

    return this.hasMany('Token').query((queryBuilder) => {
      queryBuilder.where('last_updated', '>', thirtyDays)
    })
  },

  tokens() {
    return this.hasMany('Token')
  },

  activeBots() {
    return this.hasMany('Bot').query({ where: { active: true } })
  },

  inactiveBots() {
    return this.hasMany('Bot').query({ where: { active: false } })
  },

  bots() {
    return this.hasMany('Bot')
  },

  profile() {
    return new Promise((res, rej) => {
      this.bots().fetch()
        .then((bots) => res(buildProfile(this, bots)))
        .catch((err) => rej(err))
    })
  },

  archive() {
    return archiveDependencies(this)
      .then(() => this.save({ active: false }, { patch: true }))
  },
}

const virtuals = {
  profile(id, email) {
    return new this({ id: id, email: email })
      .fetch({ require: true })
      .then((user) => user.profile())
  },

  authenticate(email, password) {
    if (!email || !password) {
      return Promise.reject(new AuthenticationError('Email and password are both required!'))
    }

    return new this({ email: email.toLowerCase().trim() })
      .fetch({ require: true })
      .then((user) => comparePassword(password, user))
  },
}

const User = orm.Model.extend(config, virtuals)
orm.model('User', User)

export default User
