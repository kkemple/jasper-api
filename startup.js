import logger from './logger'
import server from './server'
import serverConfig from './server/config/server'

server.register(serverConfig, (err) => {
  if (err) return logger.error(err)

  server.start((startErr) => {
    if (startErr) return logger.error(startErr)
    logger.info('server started')
  })
})
