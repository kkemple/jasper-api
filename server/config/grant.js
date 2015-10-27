export default {
  server: {
    protocol: 'http',
    host: process.env.GRANT_HOST,
    callback: 'callback',
    transport: 'querystring',
    state: true,
  },
  spotify: {
    key: process.env.SPOTIFY_CLIENT_ID,
    secret: process.env.SPOTIFY_CLIENT_SECRET,
    scope: [
      'playlist-read-private',
      'playlist-read-collaborative',
      'playlist-modify-public',
      'playlist-modify-private',
      'user-library-read',
      'user-library-modify',
    ],
  },
}
