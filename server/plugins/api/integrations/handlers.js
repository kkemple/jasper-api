import assign from 'lodash.assign'

import { Integration } from '../../../../models'

const getBot = (user, botId) => {
  return user.bots().fetchOne({ id: botId }, { required: true })
}

const getIntegration = (bot, integrationId) => {
  return bot.integrations().fetchOne({ id: integrationId }, { required: true })
}

const getIntegrations = (bot) => {
  return bot.integrations().fetch()
}

const getIntegrationProfiles = (integrations) => {
  return integrations.toJSON()
}

const createIntegration = (bot, payload) => {
  return Integration
    .forge(assign({}, { bot_id: bot.get('id') }, payload))
    .save()
}

const patchIntegration = (integration, payload) => {
  return integration.save(payload, { patch: true })
}

const putIntegration = (integration, payload) => {
  return integration.save(payload)
}

export const getIntegrationsHandler = (req, reply) => {
  const { botId } = req.params

  getBot(req.auth.credentials.user, botId)
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
}

export const getIntegrationHandler = (req, reply) => {
  const { botId, integrationId } = req.params

  getBot(req.auth.credentials.user, botId)
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
}

export const createIntegrationHandler = (req, reply) => {
  const { botId } = req.params

  getBot(req.auth.credentials.user, botId)
    .then((bot) => createIntegration(bot, req.payload))
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
}

export const patchIntegrationHandler = (req, reply) => {
  const { botId, integrationId } = req.params
  const { payload } = req

  getBot(req.auth.credentials.user, botId)
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
}

export const putIntegrationHandler = (req, reply) => {
  const { botId, integrationId } = req.params
  const { payload } = req

  getBot(req.auth.credentials.user, botId)
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
}

export const deleteIntegrationHandler = (req, reply) => {
  const { botId, integrationId } = req.params

  getBot(req.auth.credentials.user, botId)
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
}
