import twilioFactory from 'twilio'

import { Bot } from '../../../models'
import skynet from '../../../skynet'
import logger from '../../../logger'

const twilio = twilioFactory(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
)

const unauthMessage = 'I\'m sorry, you are not authorized. ' +
  'Sign up at https://skynet.releasable.io'

const processSkynetResponse = (request, reply) => (response) => {
  const messageConfig = {
    to: request.payload.From,
    from: request.payload.To,
  }

  if (response.speech.length > 1600) {
    messageConfig.body = response.speech.substring(0, 1597) + '...'
  } else {
    messageConfig.body = response.speech
  }

  if (response.images) messageConfig.mediaUrl = response.images.slice(0, 10)

  twilio.messages.create(messageConfig, (err) => {
    if (err) {
      logger.error(err)
      return
    }

    if (response.speech.length > 1600) {
      messageConfig.mediaUrl.length = 0
      messageConfig.body = `...${response.speech.substring(1597)}`

      twilio.messages.create(messageConfig, (err2) => {
        if (err2) {
          logger.error(err2)
          return
        }
      })
    }
  })

  reply('ok')
}

export const register = (server, options, next) => {
  server.route({
    method: 'POST',
    path: '/twilio/sms',
    config: {
      auth: false,
      handler(req, reply) {
        const { From, To, Body } = req.payload

        Bot.getByPhoneNumber(From)
          .then(() => skynet(Body))
          .then(processSkynetResponse(req, reply))
          .catch((err) => {
            if (err.message === 'EmptyResponse') {
              twilio.messages.create({
                to: From,
                from: To,
                body: unauthMessage,
              })
            }

            logger.error(err)
          })
      },
    },
  })

  next()
}

register.attributes = {
  name: 'twilio',
  version: '1.0.0',
}
