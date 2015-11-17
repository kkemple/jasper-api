import assign from 'lodash.assign'
import provisionNumber from './twilio'

import { Bot } from '../../../../models'

const getBot = (user, botId) => {
  return user.bots().fetchOne({ id: botId })
}

const getBots = (user) => {
  return user.bots().fetch()
}

const getBotProfiles = (bots) => {
  return Promise.all(bots.map((bot) => bot.profile()))
}

const deleteBot = (bot) => {
  const integrations = bot.integrations()
  const emails = bot.emails()

  return integrations.invokeThen('destroy')
    .then(() => emails.invokeThen('destroy'))
    .then(() => bot.destroy())
}

const patchBot = (bot, payload) => {
  return bot.save(payload, { patch: true })
}

const putBot = (bot, payload) => {
  return bot.save(payload)
}

export const allBotsHandler = (req, reply) => {
  getBots(req.auth.credentials.user)
    .then((bots) => getBotProfiles(bots))
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
}

export const botHandler = (req, reply) => {
  getBot(req.auth.credentials.user, req.params.botId)
    .then((bot) => bot.profile())
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
}

export const createBotHandler = (req, reply) => {
  const data = assign({}, req.payload, {
    user_id: req.auth.credentials.user.get('id'),
  })

  provisionNumber()
    .then((number) => {
      const botData = assign({}, data, {
        phone_number: number,
      })

      Bot.forge(botData)
        .save()
        .then((bot) => bot.fetch())
        .then((bot) => reply({
          success: true,
          payload: { bot },
          timestamp: Date.now(),
        }))
    })
    .catch((err) => reply({
      success: false,
      error: err.name,
      message: err.message,
      stack: err.stack,
      timestamp: Date.now(),
    }))
}

export const patchBotHandler = (req, reply) => {
  getBot(req.auth.credentials.user, req.params.botId)
    .then((bot) => patchBot(bot, req.payload))
    .then((bot) => bot.profile())
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
}

export const putBotHandler = (req, reply) => {
  getBot(req.auth.credentials.user, req.params.botId)
    .then((bot) => putBot(bot, req.payload))
    .then((bot) => bot.profile())
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
}

export const deleteBotHandler = (req, reply) => {
  getBot(req.auth.credentials.user, req.params.botId)
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
}
