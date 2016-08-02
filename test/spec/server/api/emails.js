import chai from 'chai'
import Joi from 'joi'

import tokenize from '../../../../services/tokenize'
import {
  emailGetSuccessSchema,
  emailsGetSuccessSchema
} from '../../../validations'
import { User, Bot, Email } from '../../../../models'
import { userConfig, botConfig, emailConfig } from '../../../helpers/config'

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
    let emailUrl
    let emailsUrl
    let token

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
                  emailUrl = `/api/bots/${botModel.get('id')}/emails/${email.get('id')}`
                  emailsUrl = `/api/bots/${botModel.get('id')}/emails`

                  tokenize(user)
                    .then((userToken) => token = userToken)
                    .then(() => done())
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
      describe('GET /api/bots/{botId}/emails', () => {
        describe('with a valid token', () => {
          it('should return emails belonging to bot', (done) => {
            server.inject({
              method: 'GET',
              url: emailsUrl,
              headers: {
                authorization: `Bearer ${token}`
              }
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
          it('should return with Unauthorized Error', (done) => {
            server.inject({
              method: 'GET',
              url: emailUrl
            }, (res) => {
              const payload = JSON.parse(res.payload)

              payload.error.should.eq('Unauthorized')
              done()
            })
          })
        })
      })

      describe('GET /api/bots/{botId}/emails/{emailId}', () => {
        describe('with a valid token', () => {
          it('should return email data', (done) => {
            server.inject({
              method: 'GET',
              url: emailUrl,
              headers: {
                authorization: `Bearer ${token}`
              }
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
          it('should return with Unauthorized Error', (done) => {
            server.inject({
              method: 'GET',
              url: emailUrl
            }, (res) => {
              const payload = JSON.parse(res.payload)

              payload.error.should.eq('Unauthorized')
              done()
            })
          })
        })
      })

      describe('POST /api/bots/{botId}/emails', () => {
        describe('with a valid token', () => {
          it('should return newly created email', (done) => {
            server.inject({
              method: 'POST',
              url: emailsUrl,
              payload: {
                email: 'test@releasable.io'
              },
              headers: {
                authorization: `Bearer ${token}`
              }
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
              url: emailsUrl
            }, (res) => {
              const payload = JSON.parse(res.payload)

              payload.error.should.eq('Unauthorized')
              done()
            })
          })
        })
      })

      describe('PATCH /api/bots/{botId}/emails/{emailId}', () => {
        describe('with a valid token', () => {
          it('should return an updated email', (done) => {
            server.inject({
              method: 'PATCH',
              url: emailUrl,
              headers: {
                authorization: `Bearer ${token}`
              },
              payload: {
                email: 'test@releasable.io'
              }
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
          it('should return with Unauthorized Error', (done) => {
            server.inject({
              method: 'PATCH',
              url: emailUrl
            }, (res) => {
              const payload = JSON.parse(res.payload)

              payload.error.should.eq('Unauthorized')
              done()
            })
          })
        })
      })

      describe('PUT /api/bots/{botId}/emails/{emailId}', () => {
        describe('with a valid token', () => {
          it('should return an updated email', (done) => {
            server.inject({
              method: 'PUT',
              url: emailUrl,
              headers: {
                authorization: `Bearer ${token}`
              },
              payload: {
                email: 'test@releasable.io'
              }
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
          it('should return with Unauthorized Error', (done) => {
            server.inject({
              method: 'PUT',
              url: emailUrl
            }, (res) => {
              const payload = JSON.parse(res.payload)

              payload.error.should.eq('Unauthorized')
              done()
            })
          })
        })
      })

      describe('DELETE /api/bots/{botId}/emails/{emailId}', () => {
        describe('with a valid token', () => {
          it('should delete the bot', (done) => {
            server.inject({
              method: 'DELETE',
              url: emailUrl,
              headers: {
                authorization: `Bearer ${token}`
              }
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
              url: emailUrl
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
