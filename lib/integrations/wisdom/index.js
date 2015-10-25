import Promise from 'bluebird'

export default {
  architecture: (speech) => {
    return Promise.resolve({ speech })
  },
  unknown: (speech) => {
    return Promise.resolve({ speech })
  },
  words: (speech) => {
    return Promise.resolve({ speech })
  },
}
