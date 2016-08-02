import assign from 'lodash.assign'
import mg from 'nodemailer-mailgun-transport'
import nodemailer from 'nodemailer'

import hash from '../../../../services/hash'
import tokenize from '../../../../services/tokenize'
import { User } from '../../../../models'

const auth = {
  auth: {
    api_key: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN
  }
}

const mailer = nodemailer.createTransport(mg(auth))

const sendMail = (messageConfig) => new Promise((resolve, reject) => {
  mailer.sendMail(messageConfig, (error, info) => {
    if (error) return reject(error)
    resolve(info)
  })
})

const getEmailText = (url, token) => {
  return `
  Here is the link to reset your password!

  ${url}?token=${encodeURIComponent(token)}

  If you did not request this email please contact us at help@relesable.io

  Cheers,
  The jasper Team
  `
}

const deleteUser = (user) => {
  return user.archive()
}

const patchUser = (user, payload) => {
  if (!payload.password) return user.save(payload, { patch: true })

  return hash(payload.password)
    .then((hashed) => assign({}, payload, { password: hashed }))
    .then((data) => user.save(data, { patch: true }))
}

const putUser = (user, payload) => {
  if (!payload.password) return user.save(payload)

  return hash(payload.password)
    .then((hashed) => assign({}, payload, { password: hashed }))
    .then((data) => user.save(data))
}

export const authenticateHandler = (req, reply) => {
  const { email, password } = req.payload

  User.authenticate(email, password)
    .then((user) => tokenize(user))
    .then((token) => {
      reply({
        success: true,
        payload: { token },
        timestamp: Date.now()
      })
    })
    .catch((err) => reply({
      success: false,
      error: err.name,
      message: err.message,
      stack: err.stack,
      timestamp: Date.now()
    }))
}

export const passwordResetHandler = (req, reply) => {
  const { email, url } = req.payload

  new User({ email })
    .fetch({ require: true })
    .then((user) => tokenize(user))
    .then((token) => {
      const messageConfig = {
        to: email,
        from: 'no-reply@jasper.releasable.io',
        subject: 'jasper - Reset Password',
        text: getEmailText(url, token)
      }

      return sendMail(messageConfig)
    })
    .then(() => reply({
      success: true,
      timestamp: Date.now()
    }))
    .catch((err) => reply({
      success: false,
      error: err.name,
      message: err.message,
      stack: err.stack,
      timestamp: Date.now()
    }))
}

export const getUserHandler = (req, reply) => {
  req.auth.credentials.user.profile()
    .then((user) => reply({
      success: true,
      payload: { user },
      timestamp: Date.now()
    }))
    .catch((err) => reply({
      success: false,
      error: err.name,
      message: err.message,
      stack: err.stack,
      timestamp: Date.now()
    }))
}

export const createUserHandler = (req, reply) => {
  User.forge(req.payload)
    .save()
    .then((user) => user.profile())
    .then((user) => reply({
      success: true,
      payload: { user },
      timestamp: Date.now()
    }))
    .catch((err) => reply({
      success: false,
      error: err.name,
      message: err.message,
      stack: err.stack,
      timestamp: Date.now()
    }))
}

export const patchUserHandler = (req, reply) => {
  patchUser(req.auth.credentials.user, req.payload)
    .then((user) => User.profile(user.get('id'), user.get('email')))
    .then((user) => reply({
      success: true,
      payload: { user },
      timestamp: Date.now()
    }))
    .catch((err) => reply({
      success: false,
      error: err.name,
      message: err.message,
      stack: err.stack,
      timestamp: Date.now()
    }))
}

export const putUserHandler = (req, reply) => {
  putUser(req.auth.credentials.user, req.payload)
    .then((user) => User.profile(user.get('id'), user.get('email')))
    .then((user) => reply({
      success: true,
      payload: { user },
      timestamp: Date.now()
    }))
    .catch((err) => reply({
      success: false,
      error: err.name,
      message: err.message,
      stack: err.stack,
      timestamp: Date.now()
    }))
}

export const deleteUserHandler = (req, reply) => {
  deleteUser(req.auth.credentials.user)
    .then(() => reply({
      success: true,
      timestamp: Date.now()
    }))
    .catch((err) => reply({
      success: false,
      error: err.name,
      message: err.message,
      stack: err.stack,
      timestamp: Date.now()
    }))
}
