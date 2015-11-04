import Hapi from 'hapi'

const server = new Hapi.Server({
  connections: {
    routes: {
      cors: true,
    },
  },
})

server.connection({
  host: process.env.HOST,
  port: process.env.PORT,
})

export default server
