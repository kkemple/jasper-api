import chai from 'chai'
import Joi from 'joi'

import tokenize from '../../../../services/tokenize'
import {
  phoneNumberGetSuccessSchema,
  phoneNumbersGetSuccessSchema,
} from '../../../validations'
import { User, Bot, PhoneNumber } from '../../../../models'
import { userConfig, botConfig, phoneNumberConfig } from '../../../helpers/config'

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
    let phoneNumberUrl
    let phoneNumbersUrl
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

              PhoneNumber.forge(phoneNumberConfig({ bot_id: botModel.get('id') }))
                .save()
                .then((phoneNumber) => {
                  phoneNumberUrl = `/api/bots/${botModel.get('id')}/phonenumbers/${phoneNumber.get('id')}`
                  phoneNumbersUrl = `/api/bots/${botModel.get('id')}/phonenumbers`

                  tokenize(user)
                    .then((userToken) => token = userToken)
                    .then(() => done())
                })
            })
        })
        .catch(done)
    })

    afterEach((done) => {
      PhoneNumber.collection()
        .fetch()
        .then((phoneNumbers) => phoneNumbers.invokeThen('destroy'))
        .then(() => botModel.destroy())
        .then(() => userModel.destroy())
        .then(() => done())
        .catch(done)
    })

    describe('PhoneNumbers Endpoint', () => {
      describe('GET /api/bots/{botId}/phonenumbers', () => {
        describe('with a valid token', () => {
          it('should return phoneNumbers belonging to bot', (done) => {
            server.inject({
              method: 'GET',
              url: phoneNumbersUrl,
              headers: {
                authorization: `Bearer ${token}`,
              },
            }, (res) => {
              const payload = JSON.parse(res.payload)

              Joi.validate(payload, phoneNumbersGetSuccessSchema, (err) => {
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
              url: phoneNumberUrl,
            }, (res) => {
              const payload = JSON.parse(res.payload)

              payload.error.should.eq('Unauthorized')
              done()
            })
          })
        })
      })

      describe('GET /api/bots/{botId}/phonenumbers/{phoneNumberId}', () => {
        describe('with a valid token', () => {
          it('should return phoneNumber data', (done) => {
            server.inject({
              method: 'GET',
              url: phoneNumberUrl,
              headers: {
                authorization: `Bearer ${token}`,
              },
            }, (res) => {
              const payload = JSON.parse(res.payload)

              Joi.validate(payload, phoneNumberGetSuccessSchema, (err) => {
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
              url: phoneNumberUrl,
            }, (res) => {
              const payload = JSON.parse(res.payload)

              payload.error.should.eq('Unauthorized')
              done()
            })
          })
        })
      })

      describe('POST /api/bots/{botId}/phonenumbers', () => {
        describe('with a valid token', () => {
          it('should return newly created phoneNumber', (done) => {
            server.inject({
              method: 'POST',
              url: phoneNumbersUrl,
              payload: {
                phone_number: '+15555555555',
              },
              headers: {
                authorization: `Bearer ${token}`,
              },
            }, (res) => {
              const payload = JSON.parse(res.payload)

              Joi.validate(payload, phoneNumberGetSuccessSchema, (err) => {
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
              url: phoneNumbersUrl,
            }, (res) => {
              const payload = JSON.parse(res.payload)

              payload.error.should.eq('Unauthorized')
              done()
            })
          })
        })
      })

      describe('PATCH /api/bots/{botId}/phonenumbers/{phoneNumberId}', () => {
        describe('with a valid token', () => {
          it('should return an updated phoneNumber', (done) => {
            server.inject({
              method: 'PATCH',
              url: phoneNumberUrl,
              headers: {
                authorization: `Bearer ${token}`,
              },
              payload: {
                phone_number: '+15555555556',
              },
            }, (res) => {
              const payload = JSON.parse(res.payload)

              payload.payload.phone_number.phone_number.should.eq('+15555555556')

              Joi.validate(payload, phoneNumberGetSuccessSchema, (err) => {
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
              url: phoneNumberUrl,
            }, (res) => {
              const payload = JSON.parse(res.payload)

              payload.error.should.eq('Unauthorized')
              done()
            })
          })
        })
      })

      describe('PUT /api/bots/{botId}/phonenumbers/{phoneNumberId}', () => {
        describe('with a valid token', () => {
          it('should return an updated phoneNumber', (done) => {
            server.inject({
              method: 'PUT',
              url: phoneNumberUrl,
              headers: {
                authorization: `Bearer ${token}`,
              },
              payload: {
                phone_number: '+15555555556',
              },
            }, (res) => {
              const payload = JSON.parse(res.payload)
              payload.payload.phone_number.phone_number.should.eq('+15555555556')

              Joi.validate(payload, phoneNumberGetSuccessSchema, (err) => {
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
              url: phoneNumberUrl,
            }, (res) => {
              const payload = JSON.parse(res.payload)

              payload.error.should.eq('Unauthorized')
              done()
            })
          })
        })
      })

      describe('DELETE /api/bots/{botId}/phonenumbers/{phoneNumberId}', () => {
        describe('with a valid token', () => {
          it('should delete the bot', (done) => {
            server.inject({
              method: 'DELETE',
              url: phoneNumberUrl,
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
              url: phoneNumberUrl,
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
