import twilioFactory from 'twilio'

import skynet from '../../../skynet'
import logger from '../../../logger'

const twilio = twilioFactory(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
)

const method = 'POST'
const path = '/twilio/sms'
const handler = (request, reply) => {
  skynet(request.payload.Body)
    .then((response) => {
      const messageConfig = {
        to: request.payload.From,
        from: request.payload.To,
        body: response.speech,
      };

      if (response.mediaUrl) messageConfig.mediaUrl = response.mediaUrl

      twilio.messages.create(messageConfig, (err) => {
        if (err) {
          logger.error(err)
          return
        }
      })

      reply('ok')
    })
}

exports.register = (server, options, next) => {
  server.route({ method, path, handler })
  next()
}

exports.register.attributes = {
  name: 'twilio',
  version: '1.0.0',
}
