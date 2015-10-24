import skynet from '../../../lib/skynet'
import logger from '../../../lib/logger'
import twilioFactory from 'twilio'

const twilio = twilioFactory(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
)

const register = (server, options, next) => {
  server.route({
    method: 'POST',
    path: '/twilio/sms',
    handler: (request, reply) => {
      logger.info(request.payload.Body)

      skynet(request.payload.Body)
        .then((response) => {
          logger.info(response)

          twilio.messages.create({
            to: request.payload.From,
            from: request.payload.To,
            body: response,
          }, (err) => {
            if (err) {
              logger.error(err)
              return
            }
          })

          reply('ok')
        })
    },
  })

  next()
}

register.attributes = {
  name: 'twilio',
  version: '1.0.0',
}

export default { register }
