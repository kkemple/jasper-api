const goodOptions = process.env.NODE_ENV === 'test' ? {} : {
  reporters: [
    {
      reporter: require('good-console'),
      events: { log: '*', response: '*' },
    },
  ],
}

export default [
  { register: require('good'), options: goodOptions },
  { register: require('hapi-auth-basic') },
  { register: require('hapi-auth-jwt2') },
  { register: require('./plugins/auth') },
  { register: require('./plugins/twilio') },
  { register: require('./plugins/mailgun') },
  { register: require('./plugins/slack') },
  { register: require('./plugins/oauth') },
  { register: require('./plugins/logging') },
  { register: require('./plugins/api/users') },
  { register: require('./plugins/api/bots') },
  { register: require('./plugins/api/integrations') },
  { register: require('./plugins/api/emails') },
]
