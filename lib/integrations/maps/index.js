import Promise from 'bluebird'
import request from 'superagent'

const baseMapsUrl = 'http://maps.google.com/maps'
const basePlacesUrl = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json'

export default {
  search: (speech, params) => {
    return Promise.resolve({
      mediaUrl: `${baseMapsUrl}?q=${encodeURIComponent(params.q)}`,
    })
  },
  places: (speech, params) => {

  },
}
