import {
  createEmailHandler,
  deleteEmailHandler,
  getEmailHandler,
  getEmailsHandler,
  patchEmailHandler,
  putEmailHandler
} from './handlers'

import {
  botParams,
  emailPostPayload,
  emailParams
} from '../../../../validations'

export const register = (server, options, next) => {
  server.route([
    {
      method: 'GET',
      path: '/api/bots/{botId}/emails',
      config: {
        tags: ['api'],
        validate: {
          params: botParams
        },
        handler: getEmailsHandler
      }
    },
    {
      method: 'GET',
      path: '/api/bots/{botId}/emails/{emailId}',
      config: {
        tags: ['api'],
        validate: {
          params: emailParams
        },
        handler: getEmailHandler
      }
    },
    {
      method: 'POST',
      path: '/api/bots/{botId}/emails',
      config: {
        tags: ['api'],
        validate: {
          params: botParams,
          payload: emailPostPayload
        },
        handler: createEmailHandler
      }
    },
    {
      method: 'PATCH',
      path: '/api/bots/{botId}/emails/{emailId}',
      config: {
        tags: ['api'],
        validate: {
          params: emailParams
        },
        handler: patchEmailHandler
      }
    },
    {
      method: 'PUT',
      path: '/api/bots/{botId}/emails/{emailId}',
      config: {
        tags: ['api'],
        validate: {
          params: emailParams
        },
        handler: putEmailHandler
      }
    },
    {
      method: 'DELETE',
      path: '/api/bots/{botId}/emails/{emailId}',
      config: {
        tags: ['api'],
        validate: {
          params: emailParams
        },
        handler: deleteEmailHandler
      }
    }
  ])

  next()
}

register.attributes = {
  name: 'api.emails',
  version: '1.0.0'
}
