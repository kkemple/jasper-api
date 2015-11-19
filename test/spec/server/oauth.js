import chai from 'chai'
import nock from 'nock'

import { User, Bot } from '../../../models'
import { userConfig, botConfig } from '../../helpers/config'

import { getServer, loadPlugins } from '../../../server'

chai.should()

describe('Hapi Server', () => {
  let server

  before((done) => {
    server = getServer('0.0.0.0', 8080)
    loadPlugins(server)
      .then(() => done())
      .catch((err) => done(err))
  })

  describe('OAuth Plugin', () => {
    describe('POST /oauth/spotify', () => {
      let userModel
      let botModel

      const data = {
        access_token: 'access_token',
        refresh_token: 'refresh_token',
        expires_in: 2029,
      }

      before((done) => {
        nock('https://accounts.spotify.com')
          .post('/api/token')
          .reply(200, data)

        new User(userConfig())
          .save()
          .then((savedUser) => {
            userModel = savedUser
            return new Bot(botConfig({ user_id: userModel.get('id') }))
              .save()
              .then((savedBot) => {
                botModel = savedBot
                done()
              })
          })
          .catch(done)
      })

      after((done) => {
        nock.cleanAll()
        botModel.destroy()
          .then(() => userModel.destroy())
          .then(() => done())
          .catch((err) => done(err))
      })

      it('should return with a valid integration response', (done) => {
        server.inject({
          method: 'POST',
          url: '/oauth/spotify',
          payload: {
            grant_type: 'authorization_code',
            code: 'code',
            redirect_uri: 'redirect_uri',
            user_id: userModel.get('id'),
            bot_id: botModel.get('id'),
          },
          headers: {
            authorization: `Bearer ${userModel.token()}`,
          },
        }, (res) => {
          const payload = JSON.parse(res.payload)
          payload.access_token.should.eq(data.access_token)
          done()
        })
      })
    })
  })
})
