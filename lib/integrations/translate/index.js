import Promise from 'bluebird'

export default {
  text: (speech) => {
    return Promise.resolve({ speech })
  },
}
