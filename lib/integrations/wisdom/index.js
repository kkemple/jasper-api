import Promise from 'bluebird'

export default {
  unknown: (speech) => {
    return new Promise((res) => res(speech))
  },
}
