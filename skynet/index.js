import Promise from 'bluebird'
import request from 'superagent'

import integrations from '../integrations'
import logger from '../logger'

const apiAiBaseUrl = 'https://api.api.ai/v1/query'

const apiAiHeaders = {
  'Authorization': `Bearer ${process.env.API_AI_ACCESS_TOKEN}`,
  'ocp-apim-subscription-key': `${process.env.API_AI_SUBSCRIPTION_KEY}`,
};

// this needs more structure, need to discover the data model behind a command
const processCommand = (err, response, res, rej) => {
  const unableToProcess = 'Sorry, I was unable to process that.'

  if (err) return rej(err)

  logger.info(response.body, 'api.ai response')

  const speech = response.body.result.speech
  if (response.body.result.action === '' && speech !== '') return res({ speech })

  const commands = response.body.result.action.split('.')
  const params = response.body.result.parameters
  const result = response.body.result

  const action = commands.reduce((prev, curr, index) => {
    if (!prev && index > 0) return undefined
    if (!prev) return integrations[curr]
    return prev[curr]
  }, undefined)

  if (!action) return res(unableToProcess)

  action(speech, params, result)
    .then((config) => {
      if (config.speech === '') config.speech = unableToProcess
      res(config)
    })
    .catch((fulfillmentErr) => rej(fulfillmentErr))
};

export default (text) => {
  return new Promise((res, rej) => {
    request
      .post(apiAiBaseUrl)
      .send({ query: text, lang: 'en', sessionId: '001' })
      .set(apiAiHeaders)
      .end((err, response) => processCommand(err, response, res, rej))
  })
}
