import chai from 'chai'
import Hapi from 'hapi'
import Joi from 'joi'
import jwt from 'jsonwebtoken'

import { botGetSuccessSchema } from '../../../validations'
import config from '../../../../server/config/server'
import models from '../../../../models'
import { userConfig, botConfig } from '../../../helpers/config'

chai.should()

const { User, Bot } = models

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

  describe('Api Plugin', () => {
    describe('Bot Endpoint', () => {
      describe('GET /api/users/{userId}/bots/{botId}', () => {
        let userModel
        let botModel
        let botUrl

        before((done) => {
          User.forge(userConfig({ password: 'test' }))
            .save()
            .then((user) => {
              userModel = user

              Bot.forge(botConfig({ user_id: userModel.get('id') }))
                .save()
                .then((bot) => {
                  botModel = bot

                  botUrl = `/api/users/${userModel.get('id')}/bots/${botModel.get('id')}`
                  done()
                })
            })
            .catch(done)
        })

        after((done) => {
          botModel.destroy()
            .then(() => userModel.destroy())
            .then(() => done())
            .catch(done)
        })

        describe('with a valid token', () => {
          it('should return a valid response', (done) => {
            server.inject({
              method: 'GET',
              url: botUrl,
              headers: {
                'x-access-token': jwt.sign({
                  id: userModel.get('id'),
                  email: userModel.get('email'),
                }, process.env.ENCRYPTION_KEY),
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
          it('should return with an Bad Request', (done) => {
            server.inject({
              method: 'GET',
              url: botUrl,
            }, (res) => {
              const payload = JSON.parse(res.payload)

              payload.error.should.eq('Bad Request')
              done()
            })
          })
        })
      })

      describe('PATCH /api/users/{userId}/bots/{botId}', () => {
        let userModel
        let botModel
        let botUrl

        before((done) => {
          User.forge(userConfig({ password: 'test' }))
            .save()
            .then((user) => {
              userModel = user

              Bot.forge(botConfig({ user_id: userModel.get('id') }))
                .save()
                .then((bot) => {
                  botModel = bot

                  botUrl = `/api/users/${userModel.get('id')}/bots/${botModel.get('id')}`
                  done()
                })
            })
            .catch(done)
        })

        after((done) => {
          botModel.destroy()
            .then(() => userModel.destroy())
            .then(() => done())
            .catch(done)
        })

        describe('with a valid token', () => {
          it('should return an updated user', (done) => {
            server.inject({
              method: 'PATCH',
              url: botUrl,
              headers: {
                'x-access-token': jwt.sign({
                  id: userModel.get('id'),
                  email: userModel.get('email'),
                }, process.env.ENCRYPTION_KEY),
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
          it('should return with an Bad Request', (done) => {
            server.inject({
              method: 'PATCH',
              url: botUrl,
            }, (res) => {
              const payload = JSON.parse(res.payload)

              payload.error.should.eq('Bad Request')
              done()
            })
          })
        })
      })

      describe('PUT /api/users/{userId}/bots/{botId}', () => {
        let userModel
        let botModel
        let botUrl

        before((done) => {
          User.forge(userConfig({ password: 'test' }))
            .save()
            .then((user) => {
              userModel = user

              Bot.forge(botConfig({ user_id: userModel.get('id') }))
                .save()
                .then((bot) => {
                  botModel = bot

                  botUrl = `/api/users/${userModel.get('id')}/bots/${botModel.get('id')}`
                  done()
                })
            })
            .catch(done)
        })

        after((done) => {
          botModel.destroy()
            .then(() => userModel.destroy())
            .then(() => done())
            .catch(done)
        })

        describe('with a valid token', () => {
          it('should return an updated user', (done) => {
            server.inject({
              method: 'PUT',
              url: botUrl,
              headers: {
                'x-access-token': jwt.sign({
                  id: userModel.get('id'),
                  email: userModel.get('email'),
                }, process.env.ENCRYPTION_KEY),
              },
              payload: {
                name: 'test-bot-3',
                phone_number: '+18888888888',
              },
            }, (res) => {
              const payload = JSON.parse(res.payload)
              payload.payload.bot.name.should.eq('test-bot-3')
              payload.payload.bot.phone_number.should.eq('+18888888888')

              Joi.validate(payload, botGetSuccessSchema, (err) => {
                if (err) return done(err)
                done()
              })
            })
          })
        })

        describe('with an invalid token', () => {
          it('should return with an Bad Request', (done) => {
            server.inject({
              method: 'GET',
              url: botUrl,
            }, (res) => {
              const payload = JSON.parse(res.payload)

              payload.error.should.eq('Bad Request')
              done()
            })
          })
        })
      })

      describe('DELETE /api/users/{userId}/bots/{botId}', () => {
        let userModel
        let botModel
        let botUrl

        before((done) => {
          User.forge(userConfig({ password: 'test' }))
            .save()
            .then((user) => {
              userModel = user

              Bot.forge(botConfig({ user_id: userModel.get('id') }))
                .save()
                .then((bot) => {
                  botModel = bot

                  botUrl = `/api/users/${userModel.get('id')}/bots/${botModel.get('id')}`
                  done()
                })
            })
            .catch(done)
        })

        after((done) => {
          botModel.destroy()
            .then(() => userModel.destroy())
            .then(() => done())
            .catch(done)
        })

        describe('with a valid token', () => {
          it('should delete the user', (done) => {
            server.inject({
              method: 'DELETE',
              url: botUrl,
              headers: {
                'x-access-token': jwt.sign({
                  id: userModel.get('id'),
                  email: userModel.get('email'),
                }, process.env.ENCRYPTION_KEY),
              },
            }, (res) => {
              const payload = JSON.parse(res.payload)
              payload.success.should.eq(true)
              done()
            })
          })
        })

        describe('with an invalid token', () => {
          it('should return with an Bad Request', (done) => {
            server.inject({
              method: 'DELETE',
              url: botUrl,
            }, (res) => {
              const payload = JSON.parse(res.payload)

              payload.error.should.eq('Bad Request')
              done()
            })
          })
        })
      })
    })
  })
})
