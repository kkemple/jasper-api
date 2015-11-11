import models from '../../../models'
import verifyUser from '../../verify-user'
import verifyToken from '../../verify-token'
import {
  headers,
  integrationPostPayload,
  integrationParams,
} from '../../../validations'

const { Integration, Bot } = models

const getIntegrations = (bot) => {
  return bot.integrations().fetch()
}

const getIntegrationProfiles = (integrations) => {
  return Promise.all(
    integrations.map((integration) => Integration.profile(integration.get('id')))
  )
}

const deleteIntegration = (integration) => {
  return integration.destroy()
}

const patchIntegration = (integration, payload) => {
  return integration.save(payload, { patch: true })
}

const putIntegration = (integration, payload) => {
  return integration.save(payload)
}

const verifyOwnership = (token, botId) => {
  return new Bot({ id: botId, user_id: token.id }).fetch({ required: true })
}

export const register = (server, options, next) => {
  server.route([
    {
      method: 'GET',
      path: '/api/users/{userId}/bots',
      config: {
        validate: {
          headers: headers,
          params: integrationParams,
        },
        handler(req, reply) {
          verifyToken(req.headers['x-access-token'])
            .then((token) => verifyUser(req.params.userId, token))
            .then((token) => getIntegrations(token))
            .then((bots) => getIntegrationProfiles(bots))
            .then((bots) => reply({
              success: true,
              payload: { bots },
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
      path: '/api/users/{userId}/bots/{botId}',
      config: {
        validate: {
          headers: headers,
          params: integrationParams,
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
          payload: integrationPostPayload,
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
          params: integrationParams,
        },
        handler(req, reply) {
          verifyToken(req.headers['x-access-token'])
            .then((token) => verifyUser(req.params.userId, token))
            .then((token) => verifyOwnership(token, req.params.botId))
            .then((bot) => patchIntegration(bot, req.payload))
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
          params: integrationParams,
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
          params: integrationParams,
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
  name: 'api.integrations',
  version: '1.0.0',
}
