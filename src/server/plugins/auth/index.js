import { AuthenticationError } from '../../../errors'
import { User, Token } from '../../../models'

const validateToken = (token) => new Promise((resolve, reject) => {
  if (token.isExpired()) {
    reject(new AuthenticationError('Token expired!'))
    return
  }

  token.save({ last_updated: new Date() }, { patch: true })
    .then((updatedToken) => resolve(updatedToken))
    .catch((error) => reject(error))
})

const basic = (request, username, password, callback) => {
  User.authenticate(username, password)
    .then((user) => callback(null, true, { user: user, authType: 'basic' }))
    .catch((err) => callback(err, false))
}

const jwt = (decoded, request, callback) => {
  new Token({ cuid: decoded.cuid })
    .fetch({ require: true })
    .then((token) => validateToken(token))
    .then((token) => token.user().fetch({ require: true }))
    .then((user) => callback(null, true, { user: user, authType: 'jwt' }))
    .catch((err) => callback(err, false))
}

export const register = (server, options, next) => {
  server.auth.strategy('basic', 'basic', { validateFunc: basic })
  server.auth.strategy('jwt', 'jwt', {
    key: process.env.SECRET,
    validateFunc: jwt,
    verifyOptions: { algorithms: ['HS256'] }
  })

  server.auth.default({ strategies: ['basic', 'jwt'] })

  next()
}

register.attributes = {
  name: 'auth',
  version: '1.0.0'
}
