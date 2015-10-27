import logger from '../../../logger'

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
    {
      method: 'GET',
      path: '/connect/facebook/callback',
      handler: (req, reply) => {
        logger.info(req.query)
        reply(JSON.stringify(req.query))
      },
    },
    {
      method: 'GET',
      path: '/connect/twitter/callback',
      handler: (req, reply) => {
        logger.info(req.query)
        reply(JSON.stringify(req.query))
      },
    },
    {
      method: 'GET',
      path: '/connect/uber/callback',
      handler: (req, reply) => {
        logger.info(req.query)
        reply(JSON.stringify(req.query))
      },
    },
    {
      method: 'GET',
      path: '/connect/airbnb/callback',
      handler: (req, reply) => {
        logger.info(req.query)
        reply(JSON.stringify(req.query))
      },
    },
    {
      method: 'GET',
      path: '/connect/nest/callback',
      handler: (req, reply) => {
        logger.info(req.query)
        reply(JSON.stringify(req.query))
      },
    },
    {
      method: 'GET',
      path: '/connect/pandora/callback',
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
