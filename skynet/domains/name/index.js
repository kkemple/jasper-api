import Promise from 'bluebird'

export default {
  get: () => {
    return Promise.resolve({ speech: 'My name is Skynet.' })
  },
}
