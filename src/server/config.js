const defaultPlugins = [
  // authentication
  { register: require('hapi-auth-basic') },
  { register: require('hapi-auth-jwt2') },
  { register: require('./plugins/auth') },

  // metrics
  { register: require('./plugins/metrics') }
]

const developmentPlugins = [
  // logging
  { register: require('hapi-pino') },

  // app
  { register: require('./plugins/twilio') },
  { register: require('./plugins/mailgun') },
  { register: require('./plugins/slack') },
  { register: require('./plugins/oauth') },
  { register: require('./plugins/subscribers') },
  { register: require('./plugins/api/jasper') },
  { register: require('./plugins/api/users') },
  { register: require('./plugins/api/bots') },
  { register: require('./plugins/api/integrations') },
  { register: require('./plugins/api/emails') },
  { register: require('./plugins/api/phone-numbers') }
]

const testPlugins = [
  // app
  { register: require('./plugins/twilio') },
  { register: require('./plugins/mailgun') },
  { register: require('./plugins/slack') },
  { register: require('./plugins/oauth') },
  { register: require('./plugins/subscribers') },
  { register: require('./plugins/api/jasper') },
  { register: require('./plugins/api/users') },
  { register: require('./plugins/api/bots') },
  { register: require('./plugins/api/integrations') },
  { register: require('./plugins/api/emails') },
  { register: require('./plugins/api/phone-numbers') }
]

const productionPlugins = [
  // logging
  { register: require('hapi-pino') },

  // documentation
  { register: require('inert') },
  { register: require('vision') },
  { register: require('hapi-swagger') },

  // app
  { register: require('./plugins/twilio') },
  { register: require('./plugins/mailgun') },
  { register: require('./plugins/slack') },
  { register: require('./plugins/oauth') },
  { register: require('./plugins/subscribers') },
  { register: require('./plugins/api/jasper') },
  { register: require('./plugins/api/users') },
  { register: require('./plugins/api/bots') },
  { register: require('./plugins/api/integrations') },
  { register: require('./plugins/api/emails') },
  { register: require('./plugins/api/phone-numbers') }
]

let plugins

switch (process.env.NODE_ENV) {
  case 'development':
    plugins = defaultPlugins.concat(developmentPlugins)
    break
  case 'test':
    plugins = defaultPlugins.concat(testPlugins)
    break
  case 'production':
    plugins = defaultPlugins.concat(productionPlugins)
    break
  default:
    plugins = defaultPlugins.concat(developmentPlugins)
    break
}

export default plugins
