import Promise from 'bluebird'

const baseMapsUrl = 'http://maps.google.com/maps'

export default {
  search: (speech, params) => {
    return Promise.resolve(
      `${baseMapsUrl}?q=${params.q.replace(/\s/g, '%20')}`
    )
  },
}
