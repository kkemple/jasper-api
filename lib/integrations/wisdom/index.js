import Promise from 'bluebird'

export default {
  unknown: (speech) => {
    return Promise.resolve(speech)
  },
  words: (speech) => {
    return Promise.resolve(speech)
  },
}
