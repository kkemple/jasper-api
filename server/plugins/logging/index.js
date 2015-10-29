import logger from '../../../logger'

function logEvent(name, data) {
  return new Promise((res) => {
    logger.info(data, name)
    res()
  })
}

const register = (server, options, next) => {
  server.ext('onPreHandler', (request, reply) => {
    logEvent('request query', request.query)
    logEvent('request payload', request.payload)
    logEvent('request parameters', request.params)
    reply.continue()
  })

  next()
}

register.attributes = {
  name: 'logging',
  version: '1.0.0',
}

export default { register }
