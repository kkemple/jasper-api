import assign from 'lodash.assign'

import { PhoneNumber } from '../../../../models'

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

export const getPhoneNumbersHandler = (req, reply) => {
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
}

export const getPhoneNumberHandler = (req, reply) => {
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
}

export const createPhoneNumberHandler = (req, reply) => {
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
}

export const patchPhoneNumberHandler = (req, reply) => {
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
}

export const putPhoneNumberHandler = (req, reply) => {
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
}

export const deletePhoneNumberHandler = (req, reply) => {
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
}
