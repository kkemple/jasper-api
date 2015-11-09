import assign from 'lodash.assign'
import bcrypt from 'bcryptjs'
import Joi from 'joi'
import jwt from 'jsonwebtoken'
import Promise from 'bluebird'

import { AuthenticationError } from '../errors'
import orm from '../db'
import { userValidation } from '../validations'

const validate = (model, attrs) => {
  return Joi.validate(attrs, userValidation)
}

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

const config = {
  tableName: 'users',

  hasTimestamps: true,

  initialize() {
    this.on('creating', convertPassword)
    this.on('updating', convertPassword)
    this.on('saving', validate)
  },

  bots() {
    return this.hasMany('Bot')
  },
}

const virtuals = {
  authenticate(email, password) {
    return new Promise((res, rej) => {
      if (!email || !password) {
        rej(new AuthenticationError('Email and password are both required!'))
        return
      }

      new this({ email: email.toLowerCase().trim() })
        .fetch({ require: true })
        .then((user) => {
          bcrypt.compare(password, user.get('password'), (err, same) => {
            if (err || !same) {
              rej(new AuthenticationError('Invalid password!'))
              return
            }

            const token = jwt.sign({
              email, id: user.get('id'),
            }, process.env.ENCRYPTION_KEY)

            res(token)
          })
        })
        .catch((err) => rej(err))
    })
  },

  profile(id, email) {
    return new this({ id: id, email: email })
      .fetch({ required: true, withRelated: 'bots' })
      .then((user) => assign(
        {},
        user.omit(['password', 'stripe_id']),
        { bots: user.related('bots').toJSON() }
      ))
  },
}

const User = orm.Model.extend(config, virtuals)
orm.model('User', User)

export default User
