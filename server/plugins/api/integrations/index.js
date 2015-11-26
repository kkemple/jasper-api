import {
  createIntegrationHandler,
  deleteIntegrationHandler,
  getIntegrationHandler,
  getIntegrationsHandler,
  patchIntegrationHandler,
  putIntegrationHandler,
} from './handlers'

import {
  botParams,
  integrationPostPayload,
  integrationParams,
} from '../../../../validations'

export const register = (server, options, next) => {
  server.route([
    {
      method: 'GET',
      path: '/api/bots/{botId}/integrations',
      config: {
        validate: {
          params: botParams,
        },
        handler: getIntegrationsHandler,
      },
    },
    {
      method: 'GET',
      path: '/api/bots/{botId}/integrations/{integrationId}',
      config: {
        validate: {
          params: integrationParams,
        },
        handler: getIntegrationHandler,
      },
    },
    {
      method: 'POST',
      path: '/api/bots/{botId}/integrations',
      config: {
        validate: {
          params: botParams,
          payload: integrationPostPayload,
        },
        handler: createIntegrationHandler,
      },
    },
    {
      method: 'PATCH',
      path: '/api/bots/{botId}/integrations/{integrationId}',
      config: {
        validate: {
          params: integrationParams,
        },
        handler: patchIntegrationHandler,
      },
    },
    {
      method: 'PUT',
      path: '/api/bots/{botId}/integrations/{integrationId}',
      config: {
        validate: {
          params: integrationParams,
        },
        handler: putIntegrationHandler,
      },
    },
    {
      method: 'DELETE',
      path: '/api/bots/{botId}/integrations/{integrationId}',
      config: {
        validate: {
          params: integrationParams,
        },
        handler: deleteIntegrationHandler,
      },
    },
  ])

  next()
}

register.attributes = {
  name: 'api.integrations',
  version: '1.0.0',
}
