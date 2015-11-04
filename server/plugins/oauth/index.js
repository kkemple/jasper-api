import request from 'superagent'

import logger from '../../../logger'
import models from '../../../models'
import verifyToken from '../../verify-token'

const clientId = process.env.SPOTIFY_CLIENT_ID
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET

const { User, Integration } = models

const spotifyResponse = (bot, reply) => (spotifyErr, response) => {
  if (spotifyErr) {
    logger.error(spotifyErr, 'spotify token error')
    reply({
      success: false,
      timestamp: Date.now(),
      error: spotifyErr.name,
      stack: spotifyErr.stack,
    })
    return
  }

  const integration = new Integration({
    bot_id: bot.id,
    type: 'spotify',
    access_token: response.body.access_token,
    refresh_token: response.body.refresh_token,
    expires_in: response.body.expires_in,
  })

  integration.save()
    .then((saved) => new Integration({ id: saved.id }).fetch())
    .then((int) => reply({
      success: true,
      timestamp: Date.now(),
      payload: int.toJSON(),
    }))
    .catch((err) => reply({
      success: false,
      timestamp: Date.now(),
      error: err.name,
      message: err.message,
      stack: err.stack,
    }))
}

const spotifyHandler = (bot, req, reply) => {
  const { code, grant_type, redirect_uri } = req.payload

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
    .end(spotifyResponse(bot, reply))
}

export const register = (server, options, next) => {
  server.route([
    {
      method: 'POST',
      path: '/oauth/spotify',
      handler: (req, reply) => {
        verifyToken(req)
          .then((decoded) => new User({
            id: decoded.id,
            email: decoded.email,
          }).fetch({ required: true, withRelated: 'bots' }))
          .then((user) => user.related('bots').get(req.payload.bot_id))
          .then((bot) => spotifyHandler(bot, req, reply))
          .catch((err) => reply({
            success: false,
            error: err.name,
            message: err.message,
            stack: err.stack,
            timestamp: Date.now(),
          }))
      },
    },
  ])

  next()
}

register.attributes = {
  name: 'oauth',
  version: '1.0.0',
}
