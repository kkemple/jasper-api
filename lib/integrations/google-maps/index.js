import Promise from 'bluebird'

const baseMapsUrl = 'http://maps.google.com/maps'

export default {
  search: (speech, params) => {
    return Promise.resolve({
      speech: `${baseMapsUrl}?q=${encodeURIComponent(params.q)}`,
    })
  },
}
