import Promise from 'bluebird'

export default {
  search: (speech, params) => {
    return new Promise(
      (res) => res(`http://maps.google.com/maps?f=q&q=${params.q}`)
    )
  },
}
