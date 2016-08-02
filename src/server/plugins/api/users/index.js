import {
  authenticateHandler,
  createUserHandler,
  deleteUserHandler,
  getUserHandler,
  passwordResetHandler,
  patchUserHandler,
  putUserHandler
} from './handlers'

import {
  authenticationPayload,
  passwordResetPayload,
  userPostPayload
} from '../../../../validations'

export const register = (server, options, next) => {
  server.route([
    {
      method: 'POST',
      path: '/api/pwreset',
      config: {
        tags: ['api'],
        auth: false,
        validate: {
          payload: passwordResetPayload
        },
        handler: passwordResetHandler
      }
    },
    {
      method: 'POST',
      path: '/api/authenticate',
      config: {
        tags: ['api'],
        auth: false,
        validate: {
          payload: authenticationPayload
        },
        handler: authenticateHandler
      }
    },
    {
      method: 'GET',
      path: '/api/users/current',
      config: {
        tags: ['api'],
        handler: getUserHandler
      }
    },
    {
      method: 'POST',
      path: '/api/users',
      config: {
        tags: ['api'],
        validate: {
          payload: userPostPayload
        },
        handler: createUserHandler
      }
    },
    {
      method: 'PATCH',
      path: '/api/users/current',
      handler: patchUserHandler
    },
    {
      method: 'PUT',
      path: '/api/users/current',
      handler: putUserHandler
    },
    {
      method: 'DELETE',
      path: '/api/users/current',
      handler: deleteUserHandler
    }
  ])

  next()
}

register.attributes = {
  name: 'api.users',
  version: '1.0.0'
}
