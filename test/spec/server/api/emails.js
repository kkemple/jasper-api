import chai from 'chai'
import Hapi from 'hapi'
import Joi from 'joi'
import jwt from 'jsonwebtoken'

import {
  emailGetSuccessSchema,
  emailsGetSuccessSchema,
} from '../../../validations'
import config from '../../../../server/config/server'
import models from '../../../../models'
import { userConfig, botConfig, emailConfig } from '../../../helpers/config'

chai.should()

const { User, Bot, Email } = models

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
    let userModel
    let botModel
    let emailUrl
    let emailsUrl

    beforeEach((done) => {
      User.forge(userConfig({ password: 'test' }))
        .save()
        .then((user) => {
          userModel = user

          Bot.forge(botConfig({ user_id: userModel.get('id') }))
            .save()
            .then((bot) => {
              botModel = bot

              Email.forge(emailConfig({ bot_id: botModel.get('id') }))
                .save()
                .then((email) => {
                  emailUrl = `/api/users/${userModel.get('id')}/bots/${botModel.get('id')}/emails/${email.get('id')}`
                  emailsUrl = `/api/users/${userModel.get('id')}/bots/${botModel.get('id')}/emails`
                  done()
                })
            })
        })
        .catch(done)
    })

    afterEach((done) => {
      Email.collection()
        .fetch()
        .then((emails) => emails.invokeThen('destroy'))
        .then(() => botModel.destroy())
        .then(() => userModel.destroy())
        .then(() => done())
        .catch(done)
    })

    describe('Emails Endpoint', () => {
      describe('GET /api/users/{userId}/bots/{botId}/emails', () => {
        describe('with a valid token', () => {
          it('should return emails belonging to bot', (done) => {
            server.inject({
              method: 'GET',
              url: emailsUrl,
              headers: {
                'x-access-token': jwt.sign({
                  id: userModel.get('id'),
                  email: userModel.get('email'),
                }, process.env.ENCRYPTION_KEY),
              },
            }, (res) => {
              const payload = JSON.parse(res.payload)

              Joi.validate(payload, emailsGetSuccessSchema, (err) => {
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
              url: emailUrl,
            }, (res) => {
              const payload = JSON.parse(res.payload)

              payload.error.should.eq('Bad Request')
              done()
            })
          })
        })
      })

      describe('GET /api/users/{userId}/bots/{botId}/emails/{emailId}', () => {
        describe('with a valid token', () => {
          it('should return email data', (done) => {
            server.inject({
              method: 'GET',
              url: emailUrl,
              headers: {
                'x-access-token': jwt.sign({
                  id: userModel.get('id'),
                  email: userModel.get('email'),
                }, process.env.ENCRYPTION_KEY),
              },
            }, (res) => {
              const payload = JSON.parse(res.payload)

              Joi.validate(payload, emailGetSuccessSchema, (err) => {
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
              url: emailUrl,
            }, (res) => {
              const payload = JSON.parse(res.payload)

              payload.error.should.eq('Bad Request')
              done()
            })
          })
        })
      })

      describe('POST /api/users/{userId}/bots/{botId}/emails', () => {
        describe('with a valid token', () => {
          it('should return newly created email', (done) => {
            server.inject({
              method: 'POST',
              url: emailsUrl,
              payload: {
                email: 'test@releasable.io',
              },
              headers: {
                'x-access-token': jwt.sign({
                  id: userModel.get('id'),
                  email: userModel.get('email'),
                }, process.env.ENCRYPTION_KEY),
              },
            }, (res) => {
              const payload = JSON.parse(res.payload)

              Joi.validate(payload, emailGetSuccessSchema, (err) => {
                if (err) return done(err)
                done()
              })
            })
          })
        })

        describe('with an invalid token', () => {
          it('should return with a Bad Request', (done) => {
            server.inject({
              method: 'POST',
              url: emailsUrl,
            }, (res) => {
              const payload = JSON.parse(res.payload)

              payload.error.should.eq('Bad Request')
              done()
            })
          })
        })
      })

      describe('PATCH /api/users/{userId}/bots/{botId}/emails/{emailId}', () => {
        describe('with a valid token', () => {
          it('should return an updated email', (done) => {
            server.inject({
              method: 'PATCH',
              url: emailUrl,
              headers: {
                'x-access-token': jwt.sign({
                  id: userModel.get('id'),
                  email: userModel.get('email'),
                }, process.env.ENCRYPTION_KEY),
              },
              payload: {
                email: 'test@releasable.io',
              },
            }, (res) => {
              const payload = JSON.parse(res.payload)

              payload.payload.email.email.should.eq('test@releasable.io')

              Joi.validate(payload, emailGetSuccessSchema, (err) => {
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
              url: emailUrl,
            }, (res) => {
              const payload = JSON.parse(res.payload)

              payload.error.should.eq('Bad Request')
              done()
            })
          })
        })
      })

      describe('PUT /api/users/{userId}/bots/{botId}/emails/{emailId}', () => {
        describe('with a valid token', () => {
          it('should return an updated email', (done) => {
            server.inject({
              method: 'PUT',
              url: emailUrl,
              headers: {
                'x-access-token': jwt.sign({
                  id: userModel.get('id'),
                  email: userModel.get('email'),
                }, process.env.ENCRYPTION_KEY),
              },
              payload: {
                email: 'test@releasable.io',
              },
            }, (res) => {
              const payload = JSON.parse(res.payload)
              payload.payload.email.email.should.eq('test@releasable.io')

              Joi.validate(payload, emailGetSuccessSchema, (err) => {
                if (err) return done(err)
                done()
              })
            })
          })
        })

        describe('with an invalid token', () => {
          it('should return with an Bad Request', (done) => {
            server.inject({
              method: 'PUT',
              url: emailUrl,
            }, (res) => {
              const payload = JSON.parse(res.payload)

              payload.error.should.eq('Bad Request')
              done()
            })
          })
        })
      })

      describe('DELETE /api/users/{userId}/bots/{botId}/emails/{emailId}', () => {
        describe('with a valid token', () => {
          it('should delete the bot', (done) => {
            server.inject({
              method: 'DELETE',
              url: emailUrl,
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
              url: emailUrl,
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
