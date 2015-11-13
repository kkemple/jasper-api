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
  { register: require('../plugins/twilio') },
  { register: require('../plugins/oauth') },
  { register: require('../plugins/logging') },
  { register: require('../plugins/api/users') },
  { register: require('../plugins/api/bots') },
  { register: require('../plugins/api/integrations') },
  { register: require('../plugins/api/emails') },
]
