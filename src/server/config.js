export default [
  // authentication
  { register: require('hapi-auth-basic') },
  { register: require('hapi-auth-jwt2') },
  { register: require('./plugins/auth') },

  // documentation
  { register: require('inert') },
  { register: require('vision') },
  { register: require('hapi-swagger') },

  // logging
  { register: require('hapi-pino') },

  // metrics
  { register: require('./plugins/metrics') },

  // app
  { register: require('./plugins/twilio') },
  { register: require('./plugins/mailgun') },
  { register: require('./plugins/slack') },
  { register: require('./plugins/oauth') },
  { register: require('./plugins/logging') },
  { register: require('./plugins/subscribers') },
  { register: require('./plugins/api/jasper') },
  { register: require('./plugins/api/users') },
  { register: require('./plugins/api/bots') },
  { register: require('./plugins/api/integrations') },
  { register: require('./plugins/api/emails') },
  { register: require('./plugins/api/phone-numbers') }
]
