import {
  authenticateHandler,
  createUserHandler,
  deleteUserHandler,
  getUserHandler,
  patchUserHandler,
  putUserHandler,
} from './handlers'

import {
  authenticationPayload,
  userPostPayload,
  userParams,
} from '../../../../validations'

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
        handler: authenticateHandler,
      },
    },
    {
      method: 'GET',
      path: '/api/users/{id}',
      config: {
        validate: {
          params: userParams,
        },
        handler: getUserHandler,
      },
    },
    {
      method: 'POST',
      path: '/api/users',
      config: {
        validate: {
          payload: userPostPayload,
        },
        handler: createUserHandler,
      },
    },
    {
      method: 'PATCH',
      path: '/api/users/{id}',
      config: {
        validate: {
          params: userParams,
        },
        handler: patchUserHandler,
      },
    },
    {
      method: 'PUT',
      path: '/api/users/{id}',
      config: {
        validate: {
          params: userParams,
        },
        handler: putUserHandler,
      },
    },
    {
      method: 'DELETE',
      path: '/api/users/{id}',
      config: {
        validate: {
          params: userParams,
        },
        handler: deleteUserHandler,
      },
    },
  ])

  next()
}

register.attributes = {
  name: 'api.users',
  version: '1.0.0',
}
