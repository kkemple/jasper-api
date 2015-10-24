const Hapi = require('hapi')

const server = new Hapi.Server()

server.connection({
  host: process.env.HOST,
  port: process.env.PORT,
})

export default server
