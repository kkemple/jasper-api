import Spotify from 'spotify-web-api-node'

const spotify = new Spotify({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET
})

let apiToken = false

const getToken = () => {
  return spotify.clientCredentialsGrant()
}

const getTopTracks = (artist) => {
  return spotify.getArtistTopTracks(artist)
}

export default (speech, params) => new Promise((resolve, reject) => {
  if (!apiToken) {
    getToken()
      .then((data) => {
        spotify.setAccessToken(data.body.access_token)
        getTopTracks(params.artist)
          .then((tracksData) => resolve(tracksData))
          .catch((error) => reject(error))
        apiToken = true
      })
  } else {
    getTopTracks(params.artist)
      .then((data) => resolve(data))
      .catch((error) => reject(error))
  }
})
