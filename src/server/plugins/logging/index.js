import logger from '../../../logger'

const logEvent = (name, data) => new Promise((resolve) => {
  logger.info(data, name)
  resolve()
})

export const register = (server, options, next) => {
  server.ext('onPreHandler', (request, reply) => {
    if (process.env.NODE_ENV !== 'test') {
      logEvent('[request query]', request.query)
      logEvent('[request payload]', request.payload)
      logEvent('[request parameters]', request.params)
    }

    reply.continue()
  })

  next()
}

register.attributes = {
  name: 'logging',
  version: '1.0.0'
}
