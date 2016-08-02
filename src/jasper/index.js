import { post } from 'highwire'

import Commander from './commander'
import domains from './domains'
import logger from '../logger'

const apiAiBaseUrl = 'https://api.api.ai/v1/query'

const apiAiHeaders = {
  authorization: `Bearer ${process.env.API_AI_ACCESS_TOKEN}`
}

const processCommand = (resolve, reject) => (error, response) => {
  if (error) return reject(error)

  logger.info(response.body, 'api.ai response')

  const commander = new Commander(response.body.result)
  commander.execute(domains)
    .then((result) => resolve(result))
    .catch((commanderErr) => reject(commanderErr))
}

export default (text, botId = '001') => new Promise((resolve, reject) => {
  const apiAiData = { query: text, lang: 'en', sessionId: botId }

  logger.info(apiAiData, 'api.ai request info')

  post(apiAiBaseUrl, apiAiData, { headers: apiAiHeaders })
    .then(processCommand(resolve, reject))
})
