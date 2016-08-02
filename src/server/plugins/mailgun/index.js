import map from 'lodash.map'
import mgTransport from 'nodemailer-mailgun-transport'
import nodemailer from 'nodemailer'
import { get } from 'highwire'

import { Email } from '../../../models'
import jasper from '../../../jasper'
import logger from '../../../logger'

const unauthMessage = 'I\'m sorry, you are not authorized.'

const auth = {
  auth: {
    api_key: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN
  }
}

const mailer = nodemailer.createTransport(mgTransport(auth))

const getCleanEmail = (dirtyEmail) => {
  const matches = dirtyEmail.match(/<(.*)>/)
  return matches[1]
}

const sendMail = (messageConfig) => {
  mailer.sendMail(messageConfig, (err, info) => {
    if (err) return logger.error(err)
    logger.info(info, 'mailgun response')
  })
}

const processjasperResponse = (payload, response) => new Promise((resolve, reject) => {
  const messageConfig = {
    to: payload.From,
    from: payload.To,
    subject: `jasper - ${payload['body-plain']}`
  }

  messageConfig.text = response.speech

  if (response.images) {
    const attachmentPromises = map(response.images, (image) =>
      get(image).then((imgResponse) => imgResponse.body))

    Promise.all(attachmentPromises)
      .then((buffers) => {
        const attachments = map(buffers, (buffer, index) => {
          return {
            filename: `image-${index}.jpg`,
            path: buffer
          }
        })

        messageConfig.attachments = attachments

        resolve(messageConfig)
      })
      .catch((err) => reject(err))
  } else {
    resolve(messageConfig)
  }
})

export const register = (server, options, next) => {
  server.route({
    method: 'POST',
    path: '/mailgun/email',
    config: {
      tags: ['api'],
      auth: false,
      handler (req, reply) {
        new Email({ email: getCleanEmail(req.payload.From) })
          .fetch({ require: true })
          .then((email) => jasper(req.payload['body-plain'], email.get('bot_id')))
          .then((response) => processjasperResponse(req.payload, response))
          .then((messageConfig) => sendMail(messageConfig))
          .catch((err) => {
            logger.error(err)

            if (err.message === 'EmptyResponse') {
              const messageConfig = {
                to: req.payload.From,
                from: req.payload.To,
                subject: `Jasper - ${unauthMessage}`,
                text: unauthMessage
              }

              sendMail(messageConfig)
            }
          })

        reply('ok')
      }
    }
  })

  next()
}

register.attributes = {
  name: 'mailgun',
  version: '1.0.0'
}
