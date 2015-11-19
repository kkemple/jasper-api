import twilioFactory from 'twilio'

import { PhoneNumber } from '../../../models'
import skynet from '../../../skynet'
import logger from '../../../logger'

const twilio = twilioFactory(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
)

const unauthMessage = 'I\'m sorry, you are not authorized. ' +
  'Sign up at https://skynet.releasable.io'

const processSkynetResponse = (payload, response) => new Promise((res, rej) => {
  const messageConfig = {
    to: payload.From,
    from: payload.To,
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
      rej(err)
      return
    }

    if (response.speech.length > 1600) {
      logger.info('twilio second MMS message')
      messageConfig.mediaUrl.length = 0
      messageConfig.body = `...${response.speech.substring(1597)}`

      twilio.messages.create(messageConfig, (err2) => {
        if (err2) {
          logger.error(err2)
          rej(err2)
          return
        }

        logger.info(messageConfig, 'twilio second payload')
        res()
      })
    } else {
      logger.info(messageConfig, 'twilio payload')
      res()
    }
  })
})

export const register = (server, options, next) => {
  server.route({
    method: 'POST',
    path: '/twilio/sms',
    config: {
      auth: false,
      handler(req, reply) {
        const { From, To, Body } = req.payload

        new PhoneNumber({ phone_number: From })
          .fetch({ require: true })
          .then((phoneNumber) => skynet(Body, phoneNumber.get('bot_id')))
          .then((response) => processSkynetResponse(req.payload, response))
          .catch((err) => {
            if (err.message === 'EmptyResponse') {
              twilio.messages.create({
                to: From,
                from: To,
                body: unauthMessage,
              })
            } else {
              twilio.messages.create({
                to: From,
                from: To,
                body: 'How embarrassing! Looks like something went wrong!',
              })
            }

            logger.error(err)
          })

        reply('ok')
      },
    },
  })

  next()
}

register.attributes = {
  name: 'twilio',
  version: '1.0.0',
}
