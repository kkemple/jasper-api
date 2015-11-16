import map from 'lodash.map'
import mg from 'nodemailer-mailgun-transport'
import nodemailer from 'nodemailer'
import request from 'superagent'

import skynet from '../../../skynet'
import logger from '../../../logger'

const auth = {
  auth: {
    api_key: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN,
  },
}

const mailer = nodemailer.createTransport(mg(auth))

const processSkynetResponse = (req, reply) => (response) => {
  const messageConfig = {
    to: req.payload.From,
    from: req.payload.To,
    subject: `Skynet - ${req.payload['body-plain']}`,
  }

  messageConfig.text = response.speech

  if (response.images) {
    const attachmentPromises = map(response.images, (image) => new Promise((res, rej) => {
      request
        .get(image)
        .end((err, imgResponse) => {
          if (err) return rej(err)
          res(imgResponse.body)
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

        mailer.sendMail(messageConfig, (err, info) => {
          if (err) logger.error(err)
          logger.info(info, 'mailgun response')
        })
      })
  } else {
    mailer.sendMail(messageConfig, (err, info) => {
      if (err) logger.error(err)
      logger.info(info, 'mailgun response')
    })
  }

  reply('ok')
}

export const register = (server, options, next) => {
  server.route({
    method: 'POST',
    path: '/mailgun/email',
    config: {
      auth: false,
      handler(req, reply) {
        skynet(req.payload['body-plain'])
          .then(processSkynetResponse(req, reply))
          .catch((err) => logger.error(err))
      },
    },
  })

  next()
}

register.attributes = {
  name: 'mailgun',
  version: '1.0.0',
}
