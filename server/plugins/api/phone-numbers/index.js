import {
  createPhoneNumberHandler,
  deletePhoneNumberHandler,
  getPhoneNumberHandler,
  getPhoneNumbersHandler,
  patchPhoneNumberHandler,
  putPhoneNumberHandler,
} from './handlers'

import {
  botParams,
  phoneNumberPostPayload,
  phoneNumberParams,
} from '../../../../validations'

export const register = (server, options, next) => {
  server.route([
    {
      method: 'GET',
      path: '/api/bots/{botId}/phonenumbers',
      config: {
        validate: {
          params: botParams,
        },
        handler: getPhoneNumbersHandler,
      },
    },
    {
      method: 'GET',
      path: '/api/bots/{botId}/phonenumbers/{phoneNumberId}',
      config: {
        validate: {
          params: phoneNumberParams,
        },
        handler: getPhoneNumberHandler,
      },
    },
    {
      method: 'POST',
      path: '/api/bots/{botId}/phonenumbers',
      config: {
        validate: {
          params: botParams,
          payload: phoneNumberPostPayload,
        },
        handler: createPhoneNumberHandler,
      },
    },
    {
      method: 'PATCH',
      path: '/api/bots/{botId}/phonenumbers/{phoneNumberId}',
      config: {
        validate: {
          params: phoneNumberParams,
        },
        handler: patchPhoneNumberHandler,
      },
    },
    {
      method: 'PUT',
      path: '/api/bots/{botId}/phonenumbers/{phoneNumberId}',
      config: {
        validate: {
          params: phoneNumberParams,
        },
        handler: putPhoneNumberHandler,
      },
    },
    {
      method: 'DELETE',
      path: '/api/bots/{botId}/phonenumbers/{phoneNumberId}',
      config: {
        validate: {
          params: phoneNumberParams,
        },
        handler: deletePhoneNumberHandler,
      },
    },
  ])

  next()
}

register.attributes = {
  name: 'api.phonenumbers',
  version: '1.0.0',
}
