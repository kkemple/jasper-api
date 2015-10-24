import Promise from 'bluebird'

export default {
  greetings: (speech) => {
    return new Promise((res) => res(speech))
  },
}
