import reduce from 'lodash.reduce'
import { parseString } from 'xml2js'
import { parseNumbers, parseBooleans } from 'xml2js/lib/processors'

const artifactReducer = (memo, val) => {
  if (!memo) return undefined
  return memo[val]
}

const parseEmpty = (str) => {
  if (str === '') return undefined
  return str
}

export function find(artifact, source) {
  const scrubbedArtifact = artifact
    .replace(/\[(\w+)\]/g, '.$1')
    .replace(/^\./, '')
    .replace(/\.$/, '')

  return reduce(
    scrubbedArtifact.split('.'),
    artifactReducer,
    source
  )
}

export function excavate(xml) {
  return new Promise((resolve, reject) => {
    parseString(xml, {
      trim: true,
      explicitArray: true,
      attrValueProcessors: [parseEmpty, parseNumbers, parseBooleans],
      valueProcessors: [parseEmpty, parseNumbers, parseBooleans]
    }, (error, result) => {
      if (error) {
        reject(error)
        return
      }

      resolve(result)
    })
  })
}
