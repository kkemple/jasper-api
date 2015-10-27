import logger from '../../../lib/logger'

const register = (server, options, next) => {
  server.route([
    {
      method: 'GET',
      path: '/connect/spotify/callback',
      handler: (req, reply) => {
        logger.info(req.query)
        reply(JSON.stringify(req.query))
      },
    },
  ])

  next()
}

register.attributes = {
  name: 'oauth',
  version: '1.0.0',
}

export default { register }
