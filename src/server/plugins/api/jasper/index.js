import Joi from 'joi'

import jasper from '../../../../jasper'
import logger from '../../../../logger'

const getBot = (user, botId) => {
  return user.bots().fetchOne({ id: botId })
}

const processJasperResponse = (req, reply) => (response) => {
  const text = (response.speech !== '')
    ? response.speech
    : 'I was unable to process that request'
  const { images } = response

  logger.info({ text, images }, 'jasper api response')

  reply({
    success: true,
    payload: {
      text,
      images
    },
    timestamp: Date.now()
  })
}

export const register = (server, options, next) => {
  server.route([
    {
      method: 'POST',
      path: '/api/bots/{botId}/jasper',
      config: {
        tags: ['api'],
        validate: {
          params: { botId: Joi.number().required() },
          payload: { query: Joi.string().required() }
        },
        handler (req, reply) {
          const { user } = req.auth.credentials
          const { botId } = req.params
          const { query } = req.payload

          getBot(user, botId)
            .then(() => jasper(query, botId))
            .then(processJasperResponse(req, reply))
            .catch((err) => reply({
              success: false,
              error: err.name,
              message: err.message,
              stack: err.stack,
              timestamp: Date.now()
            }))
        }
      }
    },

    {
      method: 'GET',
      path: '/api/bots/{botId}/jasper',
      config: {
        tags: ['api'],
        validate: {
          params: { botId: Joi.number().required() },
          query: { q: Joi.string().required() }
        },
        handler (req, reply) {
          const { user } = req.auth.credentials
          const { botId } = req.params
          const { query } = req.query

          getBot(user, botId)
            .then(() => jasper(query, botId))
            .then(processJasperResponse(req, reply))
            .catch((err) => reply({
              success: false,
              error: err.name,
              message: err.message,
              stack: err.stack,
              timestamp: Date.now()
            }))
        }
      }
    }
  ])

  next()
}

register.attributes = {
  name: 'jasper',
  version: '1.0.0'
}
