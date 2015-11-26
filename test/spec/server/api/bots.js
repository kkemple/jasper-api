import chai from 'chai'
import Joi from 'joi'

import tokenize from '../../../../services/tokenize'
import {
  botGetSuccessSchema,
  botsGetSuccessSchema,
} from '../../../validations'
import { User, Bot } from '../../../../models'
import { userConfig, botConfig } from '../../../helpers/config'

import { getServer, loadPlugins } from '../../../../server'

chai.should()

describe('Hapi Server', () => {
  let server

  before((done) => {
    server = getServer('0.0.0.0', 8080)
    loadPlugins(server)
      .then(() => done())
      .catch((err) => done(err))
  })

  describe('Api Plugin', () => {
    let userModel
    let botModel
    let botUrl
    let botsUrl
    let token

    before((done) => {
      User.forge(userConfig({ password: 'test' }))
        .save()
        .then((user) => {
          userModel = user

          Bot.forge(botConfig({ user_id: userModel.get('id') }))
            .save()
            .then((bot) => {
              botModel = bot
              botUrl = `/api/bots/${botModel.get('id')}`
              botsUrl = `/api/bots`

              tokenize(userModel)
                .then((userToken) => token = userToken)
                .then(() => done())
            })
        })
        .catch(done)
    })

    after((done) => {
      Bot.collection()
        .fetch()
        .then((bots) => bots.invokeThen('destroy'))
        .then(() => userModel.destroy())
        .then(() => done())
        .catch(done)
    })

    describe('Bots Endpoint', () => {
      describe('GET /api/bots', () => {
        describe('with a valid token', () => {
          it('should return bots belonging to user', (done) => {
            server.inject({
              method: 'GET',
              url: botsUrl,
              headers: {
                authorization: `Bearer ${token}`,
              },
            }, (res) => {
              const payload = JSON.parse(res.payload)

              Joi.validate(payload, botsGetSuccessSchema, (err) => {
                if (err) return done(err)
                done()
              })
            })
          })
        })

        describe('with an invalid token', () => {
          it('should return with Unauthorized Error', (done) => {
            server.inject({
              method: 'GET',
              url: botUrl,
            }, (res) => {
              const payload = JSON.parse(res.payload)

              payload.error.should.eq('Unauthorized')
              done()
            })
          })
        })
      })

      describe('GET /api/bots/{botId}', () => {
        describe('with a valid token', () => {
          it('should return bot data', (done) => {
            server.inject({
              method: 'GET',
              url: botUrl,
              headers: {
                authorization: `Bearer ${token}`,
              },
            }, (res) => {
              const payload = JSON.parse(res.payload)

              Joi.validate(payload, botGetSuccessSchema, (err) => {
                if (err) return done(err)
                done()
              })
            })
          })
        })

        describe('with an invalid token', () => {
          it('should return with Unauthorized Error', (done) => {
            server.inject({
              method: 'GET',
              url: botUrl,
            }, (res) => {
              const payload = JSON.parse(res.payload)

              payload.error.should.eq('Unauthorized')
              done()
            })
          })
        })
      })

      describe('POST /api/bots', () => {
        describe('with a valid token', () => {
          it('should return newly created bot', (done) => {
            server.inject({
              method: 'POST',
              url: botsUrl,
              payload: {
                name: 'test-bot',
              },
              headers: {
                authorization: `Bearer ${token}`,
              },
            }, (res) => {
              const payload = JSON.parse(res.payload)

              Joi.validate(payload, botGetSuccessSchema, (err) => {
                if (err) return done(err)
                done()
              })
            })
          })
        })

        describe('with an invalid token', () => {
          it('should return with Unauthorized Error', (done) => {
            server.inject({
              method: 'POST',
              url: botsUrl,
              payload: {
                name: 'test-bot',
              },
            }, (res) => {
              const payload = JSON.parse(res.payload)

              payload.error.should.eq('Unauthorized')
              done()
            })
          })
        })
      })

      describe('PATCH /api/bots/{botId}', () => {
        describe('with a valid token', () => {
          it('should return an updated bot', (done) => {
            server.inject({
              method: 'PATCH',
              url: botUrl,
              headers: {
                authorization: `Bearer ${token}`,
              },
              payload: {
                name: 'test-bot-3',
              },
            }, (res) => {
              const payload = JSON.parse(res.payload)
              payload.payload.bot.name.should.eq('test-bot-3')

              Joi.validate(payload, botGetSuccessSchema, (err) => {
                if (err) return done(err)
                done()
              })
            })
          })
        })

        describe('with an invalid token', () => {
          it('should return with Unauthorized Error', (done) => {
            server.inject({
              method: 'PATCH',
              url: botUrl,
            }, (res) => {
              const payload = JSON.parse(res.payload)

              payload.error.should.eq('Unauthorized')
              done()
            })
          })
        })
      })

      describe('PUT /api/bots/{botId}', () => {
        describe('with a valid token', () => {
          it('should return an updated bot', (done) => {
            server.inject({
              method: 'PUT',
              url: botUrl,
              headers: {
                authorization: `Bearer ${token}`,
              },
              payload: {
                name: 'test-bot-3',
              },
            }, (res) => {
              const payload = JSON.parse(res.payload)
              payload.payload.bot.name.should.eq('test-bot-3')

              Joi.validate(payload, botGetSuccessSchema, (err) => {
                if (err) return done(err)
                done()
              })
            })
          })
        })

        describe('with an invalid token', () => {
          it('should return with Unauthorized Error', (done) => {
            server.inject({
              method: 'PUT',
              url: botUrl,
            }, (res) => {
              const payload = JSON.parse(res.payload)

              payload.error.should.eq('Unauthorized')
              done()
            })
          })
        })
      })

      describe('DELETE /api/bots/{botId}', () => {
        describe('with a valid token', () => {
          it('should delete the bot', (done) => {
            server.inject({
              method: 'DELETE',
              url: botUrl,
              headers: {
                authorization: `Bearer ${token}`,
              },
            }, (res) => {
              const payload = JSON.parse(res.payload)
              payload.success.should.eq(true)
              done()
            })
          })
        })

        describe('with an invalid token', () => {
          it('should return with Unauthorized Error', (done) => {
            server.inject({
              method: 'DELETE',
              url: botUrl,
            }, (res) => {
              const payload = JSON.parse(res.payload)

              payload.error.should.eq('Unauthorized')
              done()
            })
          })
        })
      })
    })
  })
})
