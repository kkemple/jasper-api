import twilioFactory from 'twilio'

import { PhoneNumber } from '../../../models'
import jasper from '../../../jasper'
import logger from '../../../logger'

const twilio = twilioFactory(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
)

const unauthMessage = 'I\'m sorry, you are not authorized.'

const processJasperResponse = (payload, response) => new Promise((resolve, reject) => {
  const messageConfig = {
    to: payload.From,
    from: payload.To
  }

  if (response.speech.length > 1600) {
    messageConfig.body = response.speech.substring(0, 1597) + '...'
  } else {
    messageConfig.body = response.speech
  }

  if (response.images) messageConfig.mediaUrl = response.images.slice(0, 10)

  twilio.messages.create(messageConfig, (error) => {
    if (error) {
      logger.error(error)
      reject(error)
      return
    }

    if (response.speech.length > 1600) {
      logger.info('[Twilio] second MMS message')
      messageConfig.mediaUrl.length = 0
      messageConfig.body = `...${response.speech.substring(1597)}`

      twilio.messages.create(messageConfig, (error) => {
        if (error) {
          logger.error(error)
          reject(error)
          return
        }

        logger.info(messageConfig, '[Twilio] second payload')
        resolve()
      })
    } else {
      logger.info(messageConfig, '[Twilio] payload')
      resolve()
    }
  })
})

export const register = (server, options, next) => {
  server.route({
    method: 'POST',
    path: '/twilio/sms',
    config: {
      tags: ['api'],
      auth: false,
      handler (req, reply) {
        const { From, To, Body } = req.payload

        new PhoneNumber({ phone_number: From })
          .fetch({ require: true })
          .then((phoneNumber) => jasper(Body, phoneNumber.get('bot_id')))
          .then((response) => processJasperResponse(req.payload, response))
          .catch((error) => {
            if (error.message === 'EmptyResponse') {
              twilio.messages.create({
                to: From,
                from: To,
                body: unauthMessage
              })
            } else {
              twilio.messages.create({
                to: From,
                from: To,
                body: 'How embarrassing! Looks like something went wrong!'
              })
            }

            logger.error(error)
          })

        reply('ok')
      }
    }
  })

  next()
}

register.attributes = {
  name: 'twilio',
  version: '1.0.0'
}
