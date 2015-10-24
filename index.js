require('babel/register')

var server = require('./server')

server.register([
  {
    register: require('./server/plugins/twilio')
  },
  {
    register: require('good'),
    options: {
      reporters: [
        {
          reporter: require('good-console'),
          events: { log: '*', response: '*' }
        }
      ]
    }
  }
], function (err) {
  if (err) {
    console.error(err)
    return
  }

  server.start(function (err) {
    if (err) {
      console.error(err)
      return
    }

    console.info('server started')
  })
})
