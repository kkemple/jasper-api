import chai from 'chai'
import nock from 'nock'

import { getServer, loadPlugins } from '../../../server'

chai.should()

const messagesUrl = `/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`

const wolframResponse = '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<queryresult success="false"></queryresult>'

describe('Hapi Server', () => {
  let server

  before((done) => {
    server = getServer('0.0.0.0', 8080)
    loadPlugins(server)
      .then(() => done())
      .catch((err) => done(err))
  })

  describe('Twilio Plugin', () => {
    describe('POST /twilio/sms', () => {
      beforeEach(() => {
        nock('https://api.api.ai')
          .post('/v1/query')
          .reply(200, {
            result: {
              speech: 'test',
              action: 'smalltalk.greetings',
              parameters: {},
            },
          })

        nock('http://api.wolframalpha.com')
          .get('/v2/query')
          .query(true)
          .reply(200, wolframResponse)

        nock('https://api.twilio.com/2010-04-01')
          .post(messagesUrl)
          .reply(200)
      })

      it('should return with a valid response', (done) => {
        server.inject({
          method: 'POST',
          url: '/twilio/sms',
          payload: {
            Body: '20% tip 66 dollars',
            To: process.env.TO_PHONE_NUMBER,
            From: process.env.FROM_PHONE_NUMBER,
          },
        }, (res) => {
          res.payload.should.eq('ok')
          done()
        })
      })
    })
  })
})
