import map from 'lodash.map'
import mg from 'nodemailer-mailgun-transport'
import nodemailer from 'nodemailer'
import request from 'superagent'

import { Email } from '../../../models'
import skynet from '../../../skynet'
import logger from '../../../logger'

const unauthMessage = 'I\'m sorry, you are not authorized. ' +
  'Sign up at https://skynet.releasable.io'


const auth = {
  auth: {
    api_key: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN,
  },
}

const mailer = nodemailer.createTransport(mg(auth))

const getCleanEmail = (dirtyEmail) => {
  const matches = dirtyEmail.match(/\<(.*)\>/)
  return matches[1]
}

const sendMail = (messageConfig) => {
  mailer.sendMail(messageConfig, (err, info) => {
    if (err) logger.error(err)
    logger.info(info, 'mailgun response')
  })
}

const processSkynetResponse = (payload, response) => new Promise((res, rej) => {
  const messageConfig = {
    to: payload.From,
    from: payload.To,
    subject: `Skynet - ${payload['body-plain']}`,
  }

  messageConfig.text = response.speech

  if (response.images) {
    const attachmentPromises = map(response.images, (image) => new Promise((imageRes, imageRej) => {
      request
        .get(image)
        .end((err, imgResponse) => {
          if (err) return imageRej(err)
          imageRes(imgResponse.body)
        })
    }))

    Promise.all(attachmentPromises)
      .then((buffers) => {
        const attachments = map(buffers, (buffer, index) => {
          return {
            filename: `image${index}.jpg`,
            path: buffer,
          }
        })

        messageConfig.attachments = attachments

        res(messageConfig)
      })
      .catch((err) => rej(err))
  } else {
    res(messageConfig)
  }
})

export const register = (server, options, next) => {
  server.route({
    method: 'POST',
    path: '/mailgun/email',
    config: {
      auth: false,
      handler(req, reply) {
        new Email({ email: getCleanEmail(req.payload.From) })
          .fetch({ require: true })
          .then(() => skynet(req.payload['body-plain']))
          .then((response) => processSkynetResponse(req.payload, response))
          .then((messageConfig) => sendMail(messageConfig))
          .catch((err) => {
            logger.error(err)
            if (err.message === 'EmptyResponse') {
              const messageConfig = {
                to: req.payload.From,
                from: req.payload.To,
                subject: `Skynet - ${unauthMessage}`,
                text: unauthMessage,
              }

              sendMail(messageConfig)
            }
          })

        reply('ok')
      },
    },
  })

  next()
}

register.attributes = {
  name: 'mailgun',
  version: '1.0.0',
}
