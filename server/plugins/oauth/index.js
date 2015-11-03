import logger from '../../../logger'

import request from 'superagent'

exports.register = (server, options, next) => {
  server.route([
    {
      method: 'GET',
      path: '/oauth/spotify',
      handler: (req, reply) => {
        const { code, grant_type, redirect_uri } = req.payload
        const clientId = process.env.SPOTIFY_CLIENT_ID
        const clientSecret = process.env.SPOTIFY_CLIENT_SECRET

        request
          .post('https://accounts.spotify.com/api/token')
          .send({
            code,
            grant_type,
            redirect_uri,
            client_id: clientId,
            client_secret: clientSecret,
          })
          .end((err, response) => reply(response.body))
      },
    },
    {
      method: 'GET',
      path: '/oauth/facebook',
      handler: (req, reply) => {
        logger.info(req.query)
        reply(JSON.stringify(req.query))
      },
    },
    {
      method: 'GET',
      path: '/oauth/twitter',
      handler: (req, reply) => {
        logger.info(req.query)
        reply(JSON.stringify(req.query))
      },
    },
    {
      method: 'GET',
      path: '/oauth/uber',
      handler: (req, reply) => {
        logger.info(req.query)
        reply(JSON.stringify(req.query))
      },
    },
    {
      method: 'GET',
      path: '/oauth/airbnb',
      handler: (req, reply) => {
        logger.info(req.query)
        reply(JSON.stringify(req.query))
      },
    },
    {
      method: 'GET',
      path: '/oauth/nest',
      handler: (req, reply) => {
        logger.info(req.query)
        reply(JSON.stringify(req.query))
      },
    },
    {
      method: 'GET',
      path: '/oauth/pandora',
      handler: (req, reply) => {
        logger.info(req.query)
        reply(JSON.stringify(req.query))
      },
    },
  ])

  next()
}

exports.register.attributes = {
  name: 'oauth',
  version: '1.0.0',
}
