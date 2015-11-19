import Promise from 'bluebird'
import request from 'superagent'

import Commander from './commander'
import domains from './domains'
import logger from '../logger'

const apiAiBaseUrl = 'https://api.api.ai/v1/query'

const apiAiHeaders = {
  'Authorization': `Bearer ${process.env.API_AI_ACCESS_TOKEN}`,
  'ocp-apim-subscription-key': `${process.env.API_AI_SUBSCRIPTION_KEY}`,
}

const processCommand = (res, rej) => (responseErr, response) => {
  if (responseErr) return rej(responseErr)

  logger.info(response.body, 'api.ai response')

  const commander = new Commander(response.body.result)
  commander.execute(domains)
    .then((result) => res(result))
    .catch((commanderErr) => rej(commanderErr))
}

export default (text, botId = '001') => new Promise((res, rej) => {
  const apiAiData = { query: text, lang: 'en', sessionId: botId }

  logger.info(apiAiData, 'api.ai request info')

  request
    .post(apiAiBaseUrl)
    .send(apiAiData)
    .set(apiAiHeaders)
    .end(processCommand(res, rej))
})
