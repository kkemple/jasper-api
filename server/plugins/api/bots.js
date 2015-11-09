import models from '../../../models'
import verifyUser from '../../verify-user'
import verifyToken from '../../verify-token'
import {
  headers,
  botPostPayload,
  botParams,
} from '../../../validations'

const { Bot } = models

const deleteBot = (bot) => {
  return bot.destroy()
}

const patchBot = (bot, payload) => {
  return bot.save(payload, { patch: true })
}

const putBot = (bot, payload) => {
  return bot.save(payload)
}

const verifyOwnership = (token, botId) => {
  return new Bot({ id: botId, user_id: token.id }).fetch({ required: true })
}

export const register = (server, options, next) => {
  server.route([
    {
      method: 'GET',
      path: '/api/users/{userId}/bots/{botId}',
      config: {
        validate: {
          headers: headers,
          params: botParams,
        },
        handler(req, reply) {
          verifyToken(req.headers['x-access-token'])
            .then((token) => verifyUser(req.params.userId, token))
            .then((token) => verifyOwnership(token, req.params.botId))
            .then((bot) => Bot.profile(bot.get('id')))
            .then((bot) => reply({
              success: true,
              payload: { bot },
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
      path: '/api/users/{userId}/bots',
      config: {
        validate: {
          payload: botPostPayload,
        },
        handler(req, reply) {
          Bot.forge(req.payload)
            .save()
            .then((bot) => reply({
              success: true,
              payload: { bot },
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
      path: '/api/users/{userId}/bots/{botId}',
      config: {
        validate: {
          headers: headers,
          params: botParams,
        },
        handler(req, reply) {
          verifyToken(req.headers['x-access-token'])
            .then((token) => verifyUser(req.params.userId, token))
            .then((token) => verifyOwnership(token, req.params.botId))
            .then((bot) => patchBot(bot, req.payload))
            .then((bot) => Bot.profile(bot.get('id')))
            .then((bot) => reply({
              success: true,
              payload: { bot },
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
      path: '/api/users/{userId}/bots/{botId}',
      config: {
        validate: {
          headers: headers,
          params: botParams,
        },
        handler(req, reply) {
          verifyToken(req.headers['x-access-token'])
            .then((token) => verifyUser(req.params.userId, token))
            .then((token) => verifyOwnership(token, req.params.botId))
            .then((bot) => putBot(bot, req.payload))
            .then((bot) => Bot.profile(bot.get('id')))
            .then((bot) => reply({
              success: true,
              payload: { bot },
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
      path: '/api/users/{userId}/bots/{botId}',
      config: {
        validate: {
          headers: headers,
          params: botParams,
        },
        handler(req, reply) {
          verifyToken(req.headers['x-access-token'])
            .then((token) => verifyUser(req.params.userId, token))
            .then((token) => verifyOwnership(token, req.params.botId))
            .then((bot) => deleteBot(bot))
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
  name: 'api.bots',
  version: '1.0.0',
}
