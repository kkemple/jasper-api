import models from '../../../models'
import verifyToken from '../../verify-token'

const { User } = models

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
      path: '/api/users/{id}',
      handler(req, reply) {
        verifyToken(req)
          .then((decoded) => User.profile(req.params.id, decoded.email))
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
    {
      method: 'GET',
      path: '/api/users/current',
      handler(req, reply) {
        verifyToken(req)
          .then((decoded) => User.profile(decoded.id, decoded.email))
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
