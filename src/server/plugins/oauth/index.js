import { post } from 'highwire'

import logger from '../../../logger'

const clientId = process.env.SPOTIFY_CLIENT_ID
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET

const spotifyHandler = (req, reply) => {
  const { code, grant_type, redirect_uri } = req.payload

  const data = {
    code,
    grant_type,
    redirect_uri,
    client_id: clientId,
    client_secret: clientSecret
  }

  logger.info(data, '[Spotify] request data')

  post('https://accounts.spotify.com/api/token', data)
    .then((response) => {
      logger.info(response.body, '[Spotify] response data')
      reply(response.body)
    })
    .catch((error) => {
      logger.error(error, '[Spotify] token error')

      reply({
        success: false,
        timestamp: Date.now(),
        error: error.name,
        stack: error.stack
      })
    })
}

export const register = (server, options, next) => {
  server.route([
    {
      method: 'POST',
      path: '/oauth/spotify',
      handler: spotifyHandler
    }
  ])

  next()
}

register.attributes = {
  name: 'oauth',
  version: '1.0.0'
}
