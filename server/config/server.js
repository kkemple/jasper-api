const goodOptions = {
  reporters: [
    {
      reporter: require('good-console'),
      events: { log: '*', response: '*' },
    },
  ],
}

const apiOptions = {
  routes: {
    prefix: '/api',
  },
}

export default [
  { register: require('good'), options: goodOptions },
  { register: require('../plugins/twilio') },
  { register: require('../plugins/oauth') },
  { register: require('../plugins/logging') },
  { register: require('../plugins/api'), options: apiOptions },
]
