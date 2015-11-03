export default [
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
    register: require('../plugins/twilio'),
  },
  {
    register: require('../plugins/oauth'),
  },
  {
    register: require('../plugins/logging'),
  },
]
