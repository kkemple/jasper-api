import chai from 'chai'
import Hapi from 'hapi'
import Joi from 'joi'
import jwt from 'jsonwebtoken'
import nock from 'nock'

import models from '../../../models'
import { userConfig, botConfig } from '../../helpers/config'
import { oauthSuccessSchema } from '../../validations'
import config from '../../../server/config/server'

chai.should()

const { User, Bot, Integration } = models

describe('Hapi Server', () => {
  let server

  before((done) => {
    server = new Hapi.Server()
    server.connection({ host: 'localhost', port: 8000 })
    server.register(config, (err) => {
      if (err) return done(err)
      done()
    })
  })

  describe('OAuth Plugin', () => {
    describe('POST /oauth/spotify', () => {
      let userModel
      let botModel

      before((done) => {
        nock('https://accounts.spotify.com')
          .post('/api/token')
          .reply(200, {
            access_token: 'access_token',
            refresh_token: 'refresh_token',
            expires_in: 2029,
          })

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
        Integration
          .fetchAll()
          .then((integrations) => Promise.all(
            integrations.map((int) => int.destroy())
          ))
          .then(() => botModel.destroy())
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
            'x-access-token': jwt.sign({
              id: userModel.get('id'),
              email: userModel.get('email'),
            }, process.env.ENCRYPTION_KEY),
          },
        }, (res) => {
          Joi.validate(res.payload, oauthSuccessSchema, (err) => {
            if (err) {
              done(err)
              return
            }
            done()
          })
        })
      })
    })
  })
})
