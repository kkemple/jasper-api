import assign from 'lodash.assign'

import { PhoneNumber } from '../../../../models'
import {
  botParams,
  phoneNumberPostPayload,
  phoneNumberParams,
} from '../../../../validations'

const getBot = (user, botId) => {
  return user.bots().fetchOne({ id: botId }, { required: true })
}

const getPhoneNumber = (bot, phoneNumberId) => {
  return bot.phoneNumbers().fetchOne({ id: phoneNumberId }, { required: true })
}

const getPhoneNumbers = (bot) => {
  return bot.phoneNumbers().fetch()
}

const getPhoneNumberProfiles = (phoneNumbers) => {
  return phoneNumbers.toJSON()
}

const createPhoneNumber = (bot, payload) => {
  return PhoneNumber.forge(assign({}, { bot_id: bot.get('id') }, payload)).save()
}

const patchPhoneNumber = (phoneNumber, payload) => {
  return phoneNumber.save(payload, { patch: true })
}

const putPhoneNumber = (phoneNumber, payload) => {
  return phoneNumber.save(payload)
}

export const register = (server, options, next) => {
  server.route([
    {
      method: 'GET',
      path: '/api/bots/{botId}/phonenumbers',
      config: {
        validate: {
          params: botParams,
        },
        handler(req, reply) {
          const { botId } = req.params

          getBot(req.auth.credentials.user, botId)
            .then((bot) => getPhoneNumbers(bot))
            .then((phoneNumbers) => getPhoneNumberProfiles(phoneNumbers))
            .then((phoneNumbers) => reply({
              success: true,
              payload: { phone_numbers: phoneNumbers },
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
      method: 'GET',
      path: '/api/bots/{botId}/phonenumbers/{phoneNumberId}',
      config: {
        validate: {
          params: phoneNumberParams,
        },
        handler(req, reply) {
          const { botId, phoneNumberId } = req.params

          getBot(req.auth.credentials.user, botId)
            .then((bot) => getPhoneNumber(bot, phoneNumberId))
            .then((phoneNumber) => phoneNumber.toJSON())
            .then((phoneNumber) => reply({
              success: true,
              payload: { phone_number: phoneNumber },
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
      path: '/api/bots/{botId}/phonenumbers',
      config: {
        validate: {
          params: botParams,
          payload: phoneNumberPostPayload,
        },
        handler(req, reply) {
          const { botId } = req.params

          getBot(req.auth.credentials.user, botId)
            .then((bot) => createPhoneNumber(bot, req.payload))
            .then((phoneNumber) => phoneNumber.fetch())
            .then((phoneNumber) => reply({
              success: true,
              payload: { phone_number: phoneNumber },
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
      path: '/api/bots/{botId}/phonenumbers/{phoneNumberId}',
      config: {
        validate: {
          params: phoneNumberParams,
        },
        handler(req, reply) {
          const { botId, phoneNumberId } = req.params
          const { payload } = req

          getBot(req.auth.credentials.user, botId)
            .then((bot) => getPhoneNumber(bot, phoneNumberId))
            .then((phoneNumber) => patchPhoneNumber(phoneNumber, payload))
            .then((phoneNumber) => phoneNumber.toJSON())
            .then((phoneNumber) => reply({
              success: true,
              payload: { phone_number: phoneNumber },
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
      path: '/api/bots/{botId}/phonenumbers/{phoneNumberId}',
      config: {
        validate: {
          params: phoneNumberParams,
        },
        handler(req, reply) {
          const { botId, phoneNumberId } = req.params
          const { payload } = req

          getBot(req.auth.credentials.user, botId)
            .then((bot) => getPhoneNumber(bot, phoneNumberId))
            .then((phoneNumber) => putPhoneNumber(phoneNumber, payload))
            .then((phoneNumber) => phoneNumber.toJSON())
            .then((phoneNumber) => reply({
              success: true,
              payload: { phone_number: phoneNumber },
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
      path: '/api/bots/{botId}/phonenumbers/{phoneNumberId}',
      config: {
        validate: {
          params: phoneNumberParams,
        },
        handler(req, reply) {
          const { botId, phoneNumberId } = req.params

          getBot(req.auth.credentials.user, botId)
            .then((bot) => getPhoneNumber(bot, phoneNumberId))
            .then((phoneNumber) => phoneNumber.destroy())
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
  name: 'api.phonenumbers',
  version: '1.0.0',
}
