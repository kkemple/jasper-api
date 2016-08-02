import Joi from 'joi'
import mg from 'nodemailer-mailgun-transport'
import nodemailer from 'nodemailer'
import { post } from 'highwire'

import logger from '../../../logger'

const mailchimpDomain = process.env.MAILCHIMP_API_DOMAIN
const mailchimpBetaList = process.env.MAILCHIMP_BETA_LIST_ID
const mailchimpUrl = `https://${mailchimpDomain}.api.mailchimp.com/3.0`
const betaListUrl = `/lists/${mailchimpBetaList}/members`

const auth = {
  auth: {
    api_key: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN
  }
}

const mailer = nodemailer.createTransport(mg(auth))

const sendMail = (messageConfig) => {
  mailer.sendMail(messageConfig, (err, info) => {
    if (err) logger.error(err)
    logger.info(info, '[Mailgun] response')
  })
}

const signUpText = `
Hey there!

Thank you for requesting an invite to jasper AI! We will be sending out the first batch soon!

In the meantime, feel free to share with your friends!
http://jasper.releasable.io

Cheers,
The jasper AI Team
`

export const register = (server, options, next) => {
  server.route([
    {
      method: 'POST',
      path: '/subscribe/beta',
      config: {
        auth: false,
        validate: {
          payload: { email: Joi.string().email().required() }
        },
        handler (req, reply) {
          const { email } = req.payload

          const data = {
            email_address: email,
            status: 'subscribed'
          }

          post(`${mailchimpUrl}${betaListUrl}`, data, {
            headers: {
              'Authorization': process.env.MAILCHIMP_API_KEY
            }
          })
            .then((response) => {
              const messageConfig = {
                to: email,
                from: 'no-reply@jasper.releasable.io',
                subject: 'Jasper - Thank you for requesting an invite!',
                text: signUpText
              }

              sendMail(messageConfig)

              reply({
                success: true,
                payload: response.body,
                message: 'Subscription successful!'
              })
            })
            .catch((error) => {
              logger.error(error)

              reply(500, {
                success: false,
                message: error.message
              })
            })
        }
      }
    }
  ])

  next()
}

register.attributes = {
  name: 'subscribers',
  version: '1.0.0'
}
