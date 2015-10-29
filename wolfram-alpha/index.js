import Promise from 'bluebird'
import request from 'superagent'
import {parseString} from 'xml2js'

import logger from '../logger'

const wolframAlphaUrl = 'http://api.wolframalpha.com/v2/query'

export default (query) => {
  return new Promise((res, rej) => {
    request
      .get(wolframAlphaUrl)
      .query({ input: query, appid: process.env.WOLFRAM_ALPHA_APP_ID })
      .end((err, response) => {
        if (err) return rej(err)

        parseString(response.text, (xmlErr, result) => {
          if (xmlErr) return rej(xmlErr)

          logger.info(result.queryresult.pod, 'wolfram alpha response')
          res({ speech: result.queryresult.pod[1].subpod[0].plaintext })
        })
      })
  })
}
