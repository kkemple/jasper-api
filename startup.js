import logger from './lib/logger'
import server from './server'

server.register([
  { register: require('./server/plugins/twilio') },
  {
    register: require('good'),
    options: {
      reporters: [
        {
          reporter: require('good-console'),
          events: { log: '*', response: '*' },
        },
      ],
    },
  },
], (err) => {
  if (err) {
    logger.error(err)
    return
  }

  server.start((startErr) => {
    if (startErr) {
      logger.error(startErr)
      return
    }

    logger.info('server started')
  })
})
