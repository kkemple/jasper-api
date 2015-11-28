import Joi from 'joi'
import request from 'superagent'

import logger from '../../../logger'

const mailchimpDomain = process.env.MAILCHIMP_API_DOMAIN
const mailchimpBetaList = process.env.MAILCHIMP_BETA_LIST_ID
const mailchimpUrl = `https://${mailchimpDomain}.api.mailchimp.com/3.0`
const betaListUrl = `/lists/${mailchimpBetaList}/members`

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
