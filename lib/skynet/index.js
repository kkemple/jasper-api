import Promise from 'bluebird'
import request from 'superagent'

import integrations from '../integrations'

export default (text) => {
  const unableToProcess = 'Sorry, I was unable to process that.'

  return new Promise((res, rej) => {
    request
      .post('https://api.api.ai/v1/query')
      .send({ query: text, lang: 'en', sessionId: '001' })
      .set({
        'Authorization': `Bearer ${process.env.API_AI_ACCESS_TOKEN}`,
        'ocp-apim-subscription-key': `${process.env.API_AI_SUBSCRIPTION_KEY}`,
      })
      .end((err, response) => {
        if (err) {
          rej(err)
          return
        }

        const commands = response.body.result.action.split('.')
        const speech = response.body.result.speech
        const params = response.body.result.parameters

        const action = commands.reduce((prev, curr) => {
          if (!prev) return integrations[curr]
          return prev[curr]
        })

        if (!action) {
          res(unableToProcess)
          return
        }

        action(speech, params)
          .then((fulfillment) => res(fulfillment))
          .catch((fulfillmentErr) => rej(fulfillmentErr))
      })
  })
}
