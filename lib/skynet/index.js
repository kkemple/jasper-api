import Promise from 'bluebird'
import request from 'superagent'

import integrations from '../integrations'

const apiAiHeaders = {
  'Authorization': `Bearer ${process.env.API_AI_ACCESS_TOKEN}`,
  'ocp-apim-subscription-key': `${process.env.API_AI_SUBSCRIPTION_KEY}`,
};

const processCommand = (err, response, res, rej) => {
  const unableToProcess = 'Sorry, I was unable to process that.'

  if (err) return rej(err)

  const commands = response.body.result.action.split('.')
  const speech = response.body.result.speech
  const params = response.body.result.parameters

  const action = commands.reduce((prev, curr, index) => {
    if (!prev && index > 0) return undefined
    if (!prev) return integrations[curr]
    return prev[curr]
  }, undefined)

  if (!action) return res(unableToProcess)

  action(speech, params)
    .then((fulfillment) => res(fulfillment))
    .catch((fulfillmentErr) => rej(fulfillmentErr))
};

export default (text) => {
  return new Promise((res, rej) => {
    request
      .post('https://api.api.ai/v1/query')
      .send({ query: text, lang: 'en', sessionId: '001' })
      .set(apiAiHeaders)
      .end((err, response) => processCommand(err, response, res, rej))
  })
}
