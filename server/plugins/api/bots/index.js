import {
  allBotsHandler,
  botHandler,
  createBotHandler,
  patchBotHandler,
  putBotHandler,
  deleteBotHandler,
} from './handlers'

import {
  botPostPayload,
  botParams,
} from '../../../../validations'

export const register = (server, options, next) => {
  server.route([
    {
      method: 'GET',
      path: '/api/bots',
      handler: allBotsHandler,
    },
    {
      method: 'GET',
      path: '/api/bots/{botId}',
      config: {
        validate: {
          params: botParams,
        },
        handler: botHandler,
      },
    },
    {
      method: 'POST',
      path: '/api/bots',
      config: {
        validate: {
          payload: botPostPayload,
        },
        handler: createBotHandler,
      },
    },
    {
      method: 'PATCH',
      path: '/api/bots/{botId}',
      config: {
        validate: {
          params: botParams,
        },
        handler: patchBotHandler,
      },
    },
    {
      method: 'PUT',
      path: '/api/bots/{botId}',
      config: {
        validate: {
          params: botParams,
        },
        handler: putBotHandler,
      },
    },
    {
      method: 'DELETE',
      path: '/api/bots/{botId}',
      config: {
        validate: {
          params: botParams,
        },
        handler: deleteBotHandler,
      },
    },
  ])

  next()
}

register.attributes = {
  name: 'api.bots',
  version: '1.0.0',
}
