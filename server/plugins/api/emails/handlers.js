import assign from 'lodash.assign'

import { Email } from '../../../../models'

const getBot = (user, botId) => {
  return user.bots().fetchOne({ id: botId }, { required: true })
}

const getEmail = (bot, emailId) => {
  return bot.emails().fetchOne({ id: emailId }, { required: true })
}

const getEmails = (bot) => {
  return bot.emails().fetch()
}

const getEmailProfiles = (emails) => {
  return emails.toJSON()
}

const createEmail = (bot, payload) => {
  return Email.forge(assign({}, { bot_id: bot.get('id') }, payload)).save()
}

const patchEmail = (email, payload) => {
  return email.save(payload, { patch: true })
}

const putEmail = (email, payload) => {
  return email.save(payload)
}

export const getEmailsHandler = (req, reply) => {
  const { botId } = req.params

  getBot(req.auth.credentials.user, botId)
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
}

export const getEmailHandler = (req, reply) => {
  const { botId, emailId } = req.params

  getBot(req.auth.credentials.user, botId)
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
}

export const createEmailHandler = (req, reply) => {
  const { botId } = req.params

  getBot(req.auth.credentials.user, botId)
    .then((bot) => createEmail(bot, req.payload))
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
}

export const patchEmailHandler = (req, reply) => {
  const { botId, emailId } = req.params
  const { payload } = req

  getBot(req.auth.credentials.user, botId)
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
}

export const putEmailHandler = (req, reply) => {
  const { botId, emailId } = req.params
  const { payload } = req

  getBot(req.auth.credentials.user, botId)
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
}

export const deleteEmailHandler = (req, reply) => {
  const { botId, emailId } = req.params

  getBot(req.auth.credentials.user, botId)
    .then((bot) => getEmail(bot, emailId))
    .then((email) => email.archive())
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
