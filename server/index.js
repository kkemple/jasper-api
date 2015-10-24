const Hapi = require('hapi')

const server = new Hapi.Server()

server.connection({
  host: 'localhost',
  port: 2029,
})

export default server
