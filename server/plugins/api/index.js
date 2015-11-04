import jwt from 'jsonwebtoken'
import Promise from 'bluebird'

import { UnauthorizedError } from '../../../errors'
import { User } from '../../../models'

const verifyToken = (req) => {
  return new Promise((res, rej) => {
    if (!req.header['x-access-token']) {
      rej(new UnauthorizedError('Must provide authentication token!'))
      return
    }

    jwt.verify(
      req.header['x-access-token'],
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

export const register = (server, options, next) => {
  server.route([
    {
      method: 'POST',
      path: '/authenticate',
      handler(req, reply) {
        User.authenticate(req.payload.email, req.payload.password)
          .then((token) => reply({
            success: true,
            token: token,
            timestamp: Date.now(),
          }))
          .catch((err) => reply({
            success: false,
            error: err,
            message: err.message,
            timestamp: Date.now(),
          }))
      },
    },
    {
      method: 'GET',
      path: '/profile/:id',
      handler(req, reply) {
        verifyToken(req)
          .then((decoded) => reply(decoded))
          .catch((tokenErr) => reply(tokenErr))
      },
    },
  ])

  next()
}

register.attributes = {
  name: 'api',
  version: '1.0.0',
}
