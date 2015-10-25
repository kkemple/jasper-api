import Promise from 'bluebird'

export default {
  search: (speech, params) => {
    return Promise.resolve(
      `http://maps.google.com/maps?ftid=${params.q.replace(' ', '%20')}`
    )
  },
}
