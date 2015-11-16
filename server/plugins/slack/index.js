import map from 'lodash.map'

import skynet from '../../../skynet'
import logger from '../../../logger'

const slackToken = process.env.SLACK_VERIFICATION_TOKEN

const processSkynetResponse = (req, reply) => (response) => {
  const text = (response.speech !== '') ?
    response.speech :
    'I was unable to process that request'
  let attachments = []

  if (response.images) {
    attachments = map(response.images, (image) => {
      return {
        fallback: image,
        image_url: image,
      }
    })
  }

  logger.info({ text, attachments }, 'slack response')

  reply({ text, attachments })
}

export const register = (server, options, next) => {
  server.route({
    method: 'POST',
    path: '/slack/messages',
    config: {
      auth: false,
      handler(req, reply) {
        if (req.payload.token !== slackToken) {
          reply('Unauthorized!')
          return
        }

        skynet(req.payload.text)
          .then(processSkynetResponse(req, reply))
          .catch((err) => logger.error(err))
      },
    },
  })

  next()
}

register.attributes = {
  name: 'slack',
  version: '1.0.0',
}
