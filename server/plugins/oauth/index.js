import logger from '../../../logger'

import request from 'superagent'

export const register = (server, options, next) => {
  server.route([
    {
      method: 'POST',
      path: '/oauth/spotify',
      handler: (req, reply) => {
        const { code, grant_type, redirect_uri } = req.payload
        const clientId = process.env.SPOTIFY_CLIENT_ID
        const clientSecret = process.env.SPOTIFY_CLIENT_SECRET

        const data = {
          code,
          grant_type,
          redirect_uri,
          client_id: clientId,
          client_secret: clientSecret,
        }

        logger.info(data, 'spotify data')

        request
          .post('https://accounts.spotify.com/api/token')
          .type('form')
          .send(data)
          .end((err, response) => {
            if (err) {
              logger.error(err, 'spotify token error')
              reply({
                status: 'error',
                timestamp: Date.now(),
                error: err,
              })
              return
            }

            reply({
              status: 'ok',
              timestamp: Date.now(),
              payload: response.body,
            })
          })
      },
    },
    {
      method: 'POST',
      path: '/oauth/facebook',
      handler: (req, reply) => {
        logger.info(req.query)
        reply(JSON.stringify(req.query))
      },
    },
    {
      method: 'POST',
      path: '/oauth/twitter',
      handler: (req, reply) => {
        logger.info(req.query)
        reply(JSON.stringify(req.query))
      },
    },
    {
      method: 'POST',
      path: '/oauth/uber',
      handler: (req, reply) => {
        logger.info(req.query)
        reply(JSON.stringify(req.query))
      },
    },
    {
      method: 'POST',
      path: '/oauth/airbnb',
      handler: (req, reply) => {
        logger.info(req.query)
        reply(JSON.stringify(req.query))
      },
    },
    {
      method: 'POST',
      path: '/oauth/nest',
      handler: (req, reply) => {
        logger.info(req.query)
        reply(JSON.stringify(req.query))
      },
    },
    {
      method: 'POST',
      path: '/oauth/pandora',
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
