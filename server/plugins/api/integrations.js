import assign from 'lodash.assign'

import models from '../../../models'
import verifyUser from '../../verify-user'
import verifyToken from '../../verify-token'
import {
  headers,
  botParams,
  integrationPostPayload,
  integrationParams,
} from '../../../validations'

const { Integration, Bot } = models

const getBot = (userId, botId) => {
  return new Bot({ user_id: userId, id: botId }).fetch()
}

const getIntegration = (bot, integrationId) => {
  return bot.integrations().fetchOne({ id: integrationId })
}

const getIntegrations = (bot) => {
  return bot.integrations().fetch()
}

const getIntegrationProfiles = (integrations) => {
  return integrations.toJSON()
}

const createIntegration = (botId, payload) => {
  return Integration.forge(assign({}, { bot_id: botId }, payload)).save()
}

const patchIntegration = (integration, payload) => {
  return integration.save(payload, { patch: true })
}

const putIntegration = (integration, payload) => {
  return integration.save(payload)
}

export const register = (server, options, next) => {
  server.route([
    {
      method: 'GET',
      path: '/api/users/{userId}/bots/{botId}/integrations',
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
            .then((bot) => getIntegrations(bot))
            .then((integrations) => getIntegrationProfiles(integrations))
            .then((integrations) => reply({
              success: true,
              payload: { integrations },
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
      path: '/api/users/{userId}/bots/{botId}/integrations/{integrationId}',
      config: {
        validate: {
          headers: headers,
          params: integrationParams,
        },
        handler(req, reply) {
          const { userId, botId, integrationId } = req.params

          verifyToken(req.headers['x-access-token'])
            .then((token) => verifyUser(userId, token))
            .then(() => getBot(userId, botId))
            .then((bot) => getIntegration(bot, integrationId))
            .then((integration) => integration.toJSON())
            .then((integration) => reply({
              success: true,
              payload: { integration },
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
      path: '/api/users/{userId}/bots/{botId}/integrations',
      config: {
        validate: {
          params: botParams,
          payload: integrationPostPayload,
        },
        handler(req, reply) {
          createIntegration(req.params.botId, req.payload)
            .then((integration) => integration.fetch())
            .then((integration) => reply({
              success: true,
              payload: { integration },
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
      path: '/api/users/{userId}/bots/{botId}/integrations/{integrationId}',
      config: {
        validate: {
          headers: headers,
          params: integrationParams,
        },
        handler(req, reply) {
          const { userId, botId, integrationId } = req.params
          const { payload } = req

          verifyToken(req.headers['x-access-token'])
            .then((token) => verifyUser(userId, token))
            .then(() => getBot(userId, botId))
            .then((bot) => getIntegration(bot, integrationId))
            .then((integration) => patchIntegration(integration, payload))
            .then((integration) => integration.toJSON())
            .then((integration) => reply({
              success: true,
              payload: { integration },
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
      path: '/api/users/{userId}/bots/{botId}/integrations/{integrationId}',
      config: {
        validate: {
          headers: headers,
          params: integrationParams,
        },
        handler(req, reply) {
          const { userId, botId, integrationId } = req.params
          const { payload } = req

          verifyToken(req.headers['x-access-token'])
            .then((token) => verifyUser(userId, token))
            .then(() => getBot(userId, botId))
            .then((bot) => getIntegration(bot, integrationId))
            .then((integration) => putIntegration(integration, payload))
            .then((integration) => integration.toJSON())
            .then((integration) => reply({
              success: true,
              payload: { integration },
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
      path: '/api/users/{userId}/bots/{botId}/integrations/{integrationId}',
      config: {
        validate: {
          headers: headers,
          params: integrationParams,
        },
        handler(req, reply) {
          const { userId, botId, integrationId } = req.params

          verifyToken(req.headers['x-access-token'])
            .then((token) => verifyUser(userId, token))
            .then(() => getBot(userId, botId))
            .then((bot) => getIntegration(bot, integrationId))
            .then((integration) => integration.destroy())
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
