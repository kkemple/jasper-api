import chai from 'chai'
import nock from 'nock'

import tokenize from '../../../../services/tokenize'
import { getServer, loadPlugins } from '../../../../server'
import { User, Bot } from '../../../../models'
import { userConfig, botConfig } from '../../../helpers/config'


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

  describe('jasper Plugin', () => {
    let userModel
    let botModel
    let token

    beforeEach((done) => {
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

      User.forge(userConfig({ password: 'test' }))
        .save()
        .then((user) => {
          userModel = user

          Bot.forge(botConfig({ user_id: userModel.get('id') }))
            .save()
            .then((bot) => {
              botModel = bot

              tokenize(user)
                .then((userToken) => token = userToken)
                .then(() => done())
            })
        })
        .catch(done)
    })

    afterEach((done) => {
      nock.cleanAll()
      botModel.destroy()
        .then(() => userModel.destroy())
        .then(() => done())
        .catch(done)
    })

    describe('POST /api/bots/{botId}/jasper', () => {
      it('should return with a valid response', (done) => {
        server.inject({
          method: 'POST',
          url: `/api/bots/${botModel.get('id')}/jasper`,
          headers: {
            authorization: `Bearer ${token}`
          },
          payload: {
            query: '20% tip 66 dollars'
          }
        }, (res) => {
          const payload = JSON.parse(res.payload)
          payload.payload.text.should.eq('I was unable to process that request')

          done()
        })
      })
    })

    describe('GET /api/bots/{botId}/jasper', () => {
      it('should return with a valid response', (done) => {
        server.inject({
          method: 'GET',
          url: `/api/bots/${botModel.get('id')}/jasper?q=20% tip 66 dollars`,
          headers: {
            authorization: `Bearer ${token}`
          }
        }, (res) => {
          const payload = JSON.parse(res.payload)
          payload.payload.text.should.eq('I was unable to process that request')

          done()
        })
      })
    })
  })
})
