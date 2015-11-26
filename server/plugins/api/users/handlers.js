import tokenize from '../../../../services/tokenize'
import { User } from '../../../../models'

const deleteUser = (user) => {
  return user.archive()
}

const patchUser = (user, payload) => {
  return user.save(payload, { patch: true })
}

const putUser = (user, payload) => {
  return user.save(payload)
}

export const authenticateHandler = (req, reply) => {
  const { email, password } = req.payload

  User.authenticate(email, password)
    .then((user) => tokenize(user))
    .then((token) => {
      reply({
        success: true,
        payload: { token },
        timestamp: Date.now(),
      })
    })
    .catch((err) => reply({
      success: false,
      error: err.name,
      message: err.message,
      stack: err.stack,
      timestamp: Date.now(),
    }))
}

export const getUserHandler = (req, reply) => {
  req.auth.credentials.user.profile()
    .then((user) => reply({
      success: true,
      payload: { user },
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

export const createUserHandler = (req, reply) => {
  User.forge(req.payload)
    .save()
    .then((user) => user.profile())
    .then((user) => reply({
      success: true,
      payload: { user },
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

export const patchUserHandler = (req, reply) => {
  patchUser(req.auth.credentials.user, req.payload)
    .then((user) => User.profile(user.get('id'), user.get('email')))
    .then((user) => reply({
      success: true,
      payload: { user },
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

export const putUserHandler = (req, reply) => {
  putUser(req.auth.credentials.user, req.payload)
    .then((user) => User.profile(user.get('id'), user.get('email')))
    .then((user) => reply({
      success: true,
      payload: { user },
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

export const deleteUserHandler = (req, reply) => {
  deleteUser(req.auth.credentials.user)
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
