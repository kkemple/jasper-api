import each from 'lodash.foreach'
import flatten from 'lodash.flatten'
import map from 'lodash.map'
import { get } from 'highwire'

import { excavate, find } from '../archaeologist'
import logger from '../logger'

const wolframAlphaUrl = 'http://api.wolframalpha.com/v2/query'

const parseSubPod = (subPod) => {
  const text = find('plaintext[0]', subPod)
  const image = find('img[0].$.src', subPod)

  return { text, image }
}

const parsePod = (pod) => {
  const title = find('$.title', pod)
  const subpods = find('subpod', pod)
  const subdata = map(subpods, parseSubPod)

  let text = ''
  const images = []

  each(subdata, (sub) => {
    text += (sub.text.trim() !== '') ? `${sub.text}\n---------\n` : ''
    if (sub.text === '') images.push(sub.image)
  })

  if (text !== '') text = `${title}\n\n${text}\n`

  return { text, images }
}

export default (query) => new Promise((resolve, reject) => {
  get(wolframAlphaUrl, { query: { input: query, appid: process.env.WOLFRAM_ALPHA_APP_ID } })
    .then((response) => {
      excavate(response.body)
        .then((json) => {
          let speech = ''
          let images = []
          const success = find('queryresult.$.success', json)

          if (!success) {
            resolve({ speech })
            return
          }

          const pods = find('queryresult.pod', json)
          const dataSet = map(pods, parsePod)

          speech = map(dataSet, (data) => data.text).join('')
          images = flatten(map(dataSet, (data) => data.images), true).reverse()

          logger.info({ speech, images }, 'wolfram alpha response')
          resolve({ speech, images })
        })
    })
    .catch((error) => reject(error))
})
