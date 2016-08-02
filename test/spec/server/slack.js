import chai from 'chai'
import nock from 'nock'

import { getServer, loadPlugins } from '../../../server'

chai.should()

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

  describe('Slack Plugin', () => {
    describe('POST /slack/messages', () => {
      beforeEach(() => {
        nock('https://api.api.ai')
          .post('/v1/query')
          .reply(200, {
            result: {
              speech: 'test',
              action: 'smalltalk.greetings',
              parameters: {}
            }
          })

        nock('http://api.wolframalpha.com')
          .get('/v2/query')
          .query(true)
          .reply(200, wolframResponse)

        nock('https://api.mailgun.net/v3')
          .post('/messages')
          .reply(200, {})
      })

      afterEach(() => {
        nock.cleanAll()
      })

      it('should return with a valid response', (done) => {
        server.inject({
          method: 'POST',
          url: '/slack/messages',
          payload: {
            text: '20% tip 66 dollars',
            token: process.env.SLACK_VERIFICATION_TOKEN
          }
        }, (res) => {
          const payload = JSON.parse(res.payload)
          payload.text.should.eq('I was unable to process that request')
          payload.attachments.should.eql([])
          done()
        })
      })
    })
  })
})
