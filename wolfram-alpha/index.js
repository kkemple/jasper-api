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

          let wikipediaUrl = ''
          let imageUrl = ''
          let initialResponse = result.queryresult.pod[1].subpod[0].plaintext

          result.queryresult.pod.forEach((pod) => {
            if (pod.$.title === 'Wikipedia summary') {
              wikipediaUrl = pod.infos[0].info[0].link[0].$.url
            }

            if (pod.$.title === 'Image') {
              imageUrl = pod.subpod[0].img[0].$.src
            }
          })

          if (wikipediaUrl) {
            initialResponse = `${initialResponse}\nwikipedia | ${wikipediaUrl}`
          }

          const respObj = { speech: initialResponse }

          if (imageUrl) respObj.mediaUrl = imageUrl

          logger.info(result.queryresult.pod, 'wolfram alpha response')
          res(respObj)
        })
      })
  })
}
