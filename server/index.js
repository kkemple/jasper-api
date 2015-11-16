import Hapi from 'hapi'
import Promise from 'bluebird'
import serverConfig from './config'

export const getServer = (host, port) => {
  const server = new Hapi.Server({
    connections: {
      routes: {
        cors: true,
      },
    },
  })

  server.connection({
    host: host || process.env.HOST,
    port: port || process.env.PORT,
  })

  return server
}

export const loadPlugins = (server) => new Promise((res, rej) => {
  server.register(serverConfig, (err) => {
    if (err) {
      rej(err)
      return
    }

    res(server)
  })
})

export const start = (server) => new Promise((res, rej) => {
  server.start((startErr) => {
    if (startErr) rej(startErr)
    res(server)
  })
})
