import assign from 'lodash.assign'

import models from '../../../models'
import verifyUser from '../../verify-user'
import verifyToken from '../../verify-token'
import {
  headers,
  botParams,
  emailPostPayload,
  emailParams,
} from '../../../validations'

const { Email, Bot } = models

const getBot = (userId, botId) => {
  return new Bot({ user_id: userId, id: botId }).fetch()
}

const getEmail = (bot, emailId) => {
  return bot.emails().fetchOne({ id: emailId })
}

const getEmails = (bot) => {
  return bot.emails().fetch()
}

const getEmailProfiles = (emails) => {
  return emails.toJSON()
}

const createEmail = (botId, payload) => {
  return Email.forge(assign({}, { bot_id: botId }, payload)).save()
}

const patchEmail = (email, payload) => {
  return email.save(payload, { patch: true })
}

const putEmail = (email, payload) => {
  return email.save(payload)
}

export const register = (server, options, next) => {
  server.route([
    {
      method: 'GET',
      path: '/api/users/{userId}/bots/{botId}/emails',
      config: {
        validate: {
          headers: headers,
          params: botParams,
        },
        handler(req, reply) {
          const { userId, botId } = req.params

          verifyToken(req.headers['x-access-token'])
            .then((token) => verifyUser(userId, token))
            .then(() => getBot(userId, botId))
            .then((bot) => getEmails(bot))
            .then((emails) => getEmailProfiles(emails))
            .then((emails) => reply({
              success: true,
              payload: { emails },
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
      path: '/api/users/{userId}/bots/{botId}/emails/{emailId}',
      config: {
        validate: {
          headers: headers,
          params: emailParams,
        },
        handler(req, reply) {
          const { userId, botId, emailId } = req.params

          verifyToken(req.headers['x-access-token'])
            .then((token) => verifyUser(userId, token))
            .then(() => getBot(userId, botId))
            .then((bot) => getEmail(bot, emailId))
            .then((email) => email.toJSON())
            .then((email) => reply({
              success: true,
              payload: { email },
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
      path: '/api/users/{userId}/bots/{botId}/emails',
      config: {
        validate: {
          params: botParams,
          payload: emailPostPayload,
        },
        handler(req, reply) {
          createEmail(req.params.botId, req.payload)
            .then((email) => email.fetch())
            .then((email) => reply({
              success: true,
              payload: { email },
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
      path: '/api/users/{userId}/bots/{botId}/emails/{emailId}',
      config: {
        validate: {
          headers: headers,
          params: emailParams,
        },
        handler(req, reply) {
          const { userId, botId, emailId } = req.params
          const { payload } = req

          verifyToken(req.headers['x-access-token'])
            .then((token) => verifyUser(userId, token))
            .then(() => getBot(userId, botId))
            .then((bot) => getEmail(bot, emailId))
            .then((email) => patchEmail(email, payload))
            .then((email) => email.toJSON())
            .then((email) => reply({
              success: true,
              payload: { email },
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
      path: '/api/users/{userId}/bots/{botId}/emails/{emailId}',
      config: {
        validate: {
          headers: headers,
          params: emailParams,
        },
        handler(req, reply) {
          const { userId, botId, emailId } = req.params
          const { payload } = req

          verifyToken(req.headers['x-access-token'])
            .then((token) => verifyUser(userId, token))
            .then(() => getBot(userId, botId))
            .then((bot) => getEmail(bot, emailId))
            .then((email) => putEmail(email, payload))
            .then((email) => email.toJSON())
            .then((email) => reply({
              success: true,
              payload: { email },
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
      path: '/api/users/{userId}/bots/{botId}/emails/{emailId}',
      config: {
        validate: {
          headers: headers,
          params: emailParams,
        },
        handler(req, reply) {
          const { userId, botId, emailId } = req.params

          verifyToken(req.headers['x-access-token'])
            .then((token) => verifyUser(userId, token))
            .then(() => getBot(userId, botId))
            .then((bot) => getEmail(bot, emailId))
            .then((email) => email.destroy())
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
  name: 'api.emails',
  version: '1.0.0',
}
