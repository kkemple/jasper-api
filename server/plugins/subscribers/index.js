import Joi from 'joi'
import mg from 'nodemailer-mailgun-transport'
import nodemailer from 'nodemailer'
import request from 'superagent'

import logger from '../../../logger'

const mailchimpDomain = process.env.MAILCHIMP_API_DOMAIN
const mailchimpBetaList = process.env.MAILCHIMP_BETA_LIST_ID
const mailchimpUrl = `https://${mailchimpDomain}.api.mailchimp.com/3.0`
const betaListUrl = `/lists/${mailchimpBetaList}/members`

const auth = {
  auth: {
    api_key: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN,
  },
}

const mailer = nodemailer.createTransport(mg(auth))

const sendMail = (messageConfig) => {
  mailer.sendMail(messageConfig, (err, info) => {
    if (err) logger.error(err)
    logger.info(info, 'mailgun response')
  })
}

const signUpText = `
Hey there!

Thank you for requesting an invite to Skynet AI! We will be sending out the first batch soon!

In the meantime, feel free to share with your friends!
http://skynet.releasable.io

Cheers,
The Skynet AI Team
`

export const register = (server, options, next) => {
  server.route([
    {
      method: 'POST',
      path: '/subscribe/beta',
      config: {
        auth: false,
        validate: {
          payload: { email: Joi.string().email().required() },
        },
        handler(req, reply) {
          const { email } = req.payload

          const data = {
            email_address: email,
            status: 'subscribed',
          }

          request.post(`${mailchimpUrl}${betaListUrl}`)
            .auth('user', process.env.MAILCHIMP_API_KEY)
            .send(data)
            .end((err, response) => {
              if (err) {
                logger.error(err)
                reply(500, {
                  success: false,
                  message: err.message,
                })

                return
              }

              const messageConfig = {
                to: email,
                from: 'no-reply@skynet.releasable.io',
                subject: `Skynet - Thank you for requesting an invite!`,
                text: signUpText,
              }

              sendMail(messageConfig)

              reply({
                success: true,
                payload: response.body,
                message: 'Subscription successful!',
              })
            })
        },
      },
    },
  ])

  next()
}

register.attributes = {
  name: 'subscribers',
  version: '1.0.0',
}
