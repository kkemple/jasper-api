import request from 'superagent'

import logger from '../../../logger'

const clientId = process.env.SPOTIFY_CLIENT_ID
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET

const spotifyResponse = (reply) => (spotifyErr, response) => {
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

  reply(response.body)
}

const spotifyHandler = (req, reply) => {
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
    .end(spotifyResponse(reply))
}

export const register = (server, options, next) => {
  server.route([
    {
      method: 'POST',
      path: '/oauth/spotify',
      handler: spotifyHandler,
    },
  ])

  next()
}

register.attributes = {
  name: 'oauth',
  version: '1.0.0',
}
