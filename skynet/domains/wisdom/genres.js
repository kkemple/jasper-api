import Spotify from 'spotify-web-api-node'

const spotify = new Spotify({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
})

let apiToken = false

const getToken = () => {
  return spotify.clientCredentialsGrant()
}

const getTopTracks = (artist) => {
  return spotify.getArtistTopTracks(artist)
}

export default (speech, params) => new Promise((res, rej) => {
  if (!apiToken) {
    getToken()
      .then((data) => {
        spotify.setAccessToken(data.body.access_token)
        getTopTracks(params.artist)
          .then((tracksData) => res(tracksData))
          .catch((err) => rej(err))
        apiToken = true
      })
  } else {
    getTopTracks(params.artist)
      .then((data) => res(data))
      .catch((err) => rej(err))
  }
})
