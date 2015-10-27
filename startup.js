import Grant from 'grant-hapi'
import grantConfig from './server/config/grant'
import logger from './lib/logger'
import server from './server'

server.register([
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
  {
    register: new Grant(),
    options: grantConfig,
  },
  {
    register: require('./server/plugins/twilio'),
  },
  {
    register: require('./server/plugins/oauth'),
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
