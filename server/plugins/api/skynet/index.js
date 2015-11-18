import Joi from 'joi'

import skynet from '../../../../skynet'
import logger from '../../../../logger'

const getBot = (user, botId) => {
  return user.bots().fetchOne({ id: botId })
}

const processSkynetResponse = (req, reply) => (response) => {
  const text = (response.speech !== '') ?
    response.speech :
    'I was unable to process that request'
  const { images } = response

  logger.info({ text, images }, 'skynet api response')

  reply({
    success: true,
    payload: {
      text,
      images,
    },
    timestamp: Date.now(),
  })
}

export const register = (server, options, next) => {
  server.route([
    {
      method: 'POST',
      path: '/api/bots/{botId}/skynet',
      config: {
        validate: {
          params: { botId: Joi.number().required() },
          payload: { query: Joi.string().required() },
        },
        handler(req, reply) {
          const { user } = req.auth.credentials
          const { botId } = req.params
          const { query } = req.payload

          getBot(user, botId)
            .then(() => skynet(query, botId))
            .then(processSkynetResponse(req, reply))
            .catch((err) => reply({
              success: false,
              error: err.name,
              message: err.message,
              stack: err.stack,
              timestamp: Date.now(),
            }))
        },
      },
    },

    {
      method: 'GET',
      path: '/api/bots/{botId}/skynet',
      config: {
        validate: {
          params: { botId: Joi.number().required() },
          query: { q: Joi.string().required() },
        },
        handler(req, reply) {
          const { user } = req.auth.credentials
          const { botId } = req.params
          const { q } = req.query

          getBot(user, botId)
            .then(() => skynet(q, botId))
            .then(processSkynetResponse(req, reply))
            .catch((err) => reply({
              success: false,
              error: err.name,
              message: err.message,
              stack: err.stack,
              timestamp: Date.now(),
            }))
        },
      },
    },
  ])

  next()
}

register.attributes = {
  name: 'skynet',
  version: '1.0.0',
}
