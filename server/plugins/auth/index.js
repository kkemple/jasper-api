import { User } from '../../../models'

const basic = (request, username, password, callback) => {
  User.authenticate(username, password)
    .then((user) => callback(null, true, { user: user, authType: 'basic' }))
    .catch((err) => callback(err, false))
}

const jwt = (decoded, request, callback) => {
  new User({ id: decoded.id, email: decoded.email })
    .fetch({ require: true })
    .then((user) => callback(null, true, { user: user, authType: 'jwt' }))
    .catch((err) => callback(err, false))
}


export const register = (server, options, next) => {
  server.auth.strategy('basic', 'basic', { validateFunc: basic })
  server.auth.strategy('jwt', 'jwt', {
    key: process.env.ENCRYPTION_KEY,
    validateFunc: jwt,
    verifyOptions: { algorithms: ['HS256'] },
  })

  server.auth.default({ strategies: ['basic', 'jwt'] })

  next()
}

register.attributes = {
  name: 'auth',
  version: '1.0.0',
}
