import bcrypt from 'bcrypt'
import Joi from 'joi'
import jwt from 'jsonwebtoken'
import Promise from 'bluebird'

import db from '../db'
import { userValidation } from '../validations'
import { AuthenticationError } from '../errors'

const validate = (model, attrs) => {
  return Joi.validate(attrs, userValidation)
}

const hashPassword = (model, attrs) => {
  return new Promise((res, rej) => {
    bcrypt.genSalt(10, (saltGenErr, salt) => {
      if (saltGenErr) return rej(saltGenErr)

      bcrypt.hash(attrs.password, salt, (hashErr, hash) => {
        if (hashErr) return rej(hashErr)

        model.set('password', hash)
        return res(hash)
      })
    })
  })
}

const config = {
  tableName: 'users',

  initialize() {
    this.on('creating', hashPassword)
    this.on('saving', validate)
  },

  bots() {
    return this.hasMany('Bot')
  },

  integrations() {
    return this.hasMany('Integration')
  },

  emails() {
    return this.hasMany('Email')
  },
}

const virtuals = {
  authenticate(email, password) {
    return new Promise((res, rej) => {
      if (!email || !password) {
        rej(new AuthenticationError('Email and password are both required!'))
        return
      }

      this({ email: email.toLowerCase().trim() })
        .fetch({require: true})
        .then((user) => {
          bcrypt.compare(password, user.get('password'), (err, same) => {
            if (err || !same) {
              rej(new AuthenticationError())
              return
            }

            const timestamp = Date.now()
            const token = jwt.sign({ email, timestamp }, process.env.ENCRYPTION_KEY)

            res(token)
          })
        })
        .catch(() => rej(new AuthenticationError()))
    })
  },
}

export default db.Model.extend(config, virtuals)
