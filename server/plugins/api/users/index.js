import tokenize from '../../../../services/tokenize'
import { User } from '../../../../models'
import {
  authenticationPayload,
  userPostPayload,
  userParams,
} from '../../../../validations'

const deleteUser = (user) => {
  return user.destroy()
}

const patchUser = (user, payload) => {
  return user.save(payload, { patch: true })
}

const putUser = (user, payload) => {
  return user.save(payload)
}

export const register = (server, options, next) => {
  server.route([
    {
      method: 'POST',
      path: '/api/authenticate',
      config: {
        auth: false,
        validate: {
          payload: authenticationPayload,
        },
        handler(req, reply) {
          const { email, password } = req.payload

          User.authenticate(email, password)
            .then((user) => tokenize(user))
            .then((token) => {
              reply({
                success: true,
                payload: { token },
                timestamp: Date.now(),
              })
            })
            .catch((err) => reply({
              success: false,
              error: err.name,
              message: err.message,
              stack: err.stack,
              timestamp: Date.now(),
            }))
        },
      },
    },
    {
      method: 'GET',
      path: '/api/users/{id}',
      config: {
        validate: {
          params: userParams,
        },
        handler(req, reply) {
          req.auth.credentials.user.profile()
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
    },
    {
      method: 'POST',
      path: '/api/users',
      config: {
        validate: {
          payload: userPostPayload,
        },
        handler(req, reply) {
          User.forge(req.payload)
            .save()
            .then((user) => user.profile())
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
    },
    {
      method: 'PATCH',
      path: '/api/users/{id}',
      config: {
        validate: {
          params: userParams,
        },
        handler(req, reply) {
          patchUser(req.auth.credentials.user, req.payload)
            .then((user) => User.profile(user.get('id'), user.get('email')))
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
    },
    {
      method: 'PUT',
      path: '/api/users/{id}',
      config: {
        validate: {
          params: userParams,
        },
        handler(req, reply) {
          putUser(req.auth.credentials.user, req.payload)
            .then((user) => User.profile(user.get('id'), user.get('email')))
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
    },
    {
      method: 'DELETE',
      path: '/api/users/{id}',
      config: {
        validate: {
          params: userParams,
        },
        handler(req, reply) {
          deleteUser(req.auth.credentials.user)
            .then(() => reply({
              success: true,
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
    },
  ])

  next()
}

register.attributes = {
  name: 'api.users',
  version: '1.0.0',
}
