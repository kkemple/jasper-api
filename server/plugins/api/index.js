import assign from 'lodash.assign'
import jwt from 'jsonwebtoken'
import Promise from 'bluebird'

import { UnauthorizedError } from '../../../errors'
import models from '../../../models'

const { User } = models

const verifyToken = (req) => {
  return new Promise((res, rej) => {
    if (!req.headers['x-access-token']) {
      rej(new UnauthorizedError('Must provide authentication token!'))
      return
    }

    jwt.verify(
      req.headers['x-access-token'],
      process.env.ENCRYPTION_KEY,
      (err, decoded) => {
        if (err) {
          rej(new UnauthorizedError('Invalid authentication token!'))
          return
        }

        res(decoded)
      }
    )
  })
}

const getUser = (id, email) => {
  return new User({ id: id, email: email })
    .fetch({ required: true, withRelated: 'bots' })
    .then((user) => assign(
      {},
      user.omit(['password', 'stripe_id']),
      { bots: user.related('bots').toJSON() }
    ))
}

export const register = (server, options, next) => {
  server.route([
    {
      method: 'POST',
      path: '/api/authenticate',
      handler(req, reply) {
        User.authenticate(req.payload.email, req.payload.password)
          .then((token) => reply({
            success: true,
            payload: { token },
            timestamp: Date.now(),
          }))
          .catch((err) => reply({
            success: false,
            error: err.name,
            message: err.message,
            stack: err.stack,
            timestamp: Date.now(),
          }))
      },
    },
    {
      method: 'GET',
      path: '/api/profile/{id}',
      handler(req, reply) {
        verifyToken(req)
          .then((decoded) => getUser(req.params.id, decoded.email))
          .then((user) => reply({
            success: true,
            payload: { user },
            timestamp: Date.now(),
          }))
          .catch((err) => reply({
            success: false,
            error: err.name,
            message: err.message,
            stack: err.stack,
            timestamp: Date.now(),
          }))
      },
    },
  ])

  next()
}

register.attributes = {
  name: 'api',
  version: '1.0.0',
}
