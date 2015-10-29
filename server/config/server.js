import Grant from 'grant-hapi'
import grantConfig from './grant'

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
    register: new Grant(),
    options: grantConfig,
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
