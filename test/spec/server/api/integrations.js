import chai from 'chai'
import Joi from 'joi'

import {
  integrationGetSuccessSchema,
  integrationsGetSuccessSchema,
} from '../../../validations'
import { User, Bot, Integration } from '../../../../models'
import { userConfig, botConfig, integrationConfig } from '../../../helpers/config'

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
    let integrationUrl
    let integrationsUrl

    beforeEach((done) => {
      User.forge(userConfig({ password: 'test' }))
        .save()
        .then((user) => {
          userModel = user

          Bot.forge(botConfig({ user_id: userModel.get('id') }))
            .save()
            .then((bot) => {
              botModel = bot

              Integration.forge(integrationConfig({ bot_id: botModel.get('id') }))
                .save()
                .then((integration) => {
                  integrationUrl = `/api/bots/${botModel.get('id')}/integrations/${integration.get('id')}`
                  integrationsUrl = `/api/bots/${botModel.get('id')}/integrations`
                  done()
                })
            })
        })
        .catch(done)
    })

    afterEach((done) => {
      Integration.collection()
        .fetch()
        .then((integrations) => integrations.invokeThen('destroy'))
        .then(() => botModel.destroy())
        .then(() => userModel.destroy())
        .then(() => done())
        .catch(done)
    })

    describe('Integrations Endpoint', () => {
      describe('GET /api/bots/{botId}/integrations', () => {
        describe('with a valid token', () => {
          it('should return integrations belonging to bot', (done) => {
            server.inject({
              method: 'GET',
              url: integrationsUrl,
              headers: {
                authorization: `Bearer ${userModel.token()}`,
              },
            }, (res) => {
              const payload = JSON.parse(res.payload)

              Joi.validate(payload, integrationsGetSuccessSchema, (err) => {
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
              url: integrationUrl,
            }, (res) => {
              const payload = JSON.parse(res.payload)

              payload.error.should.eq('Unauthorized')
              done()
            })
          })
        })
      })

      describe('GET /api/bots/{botId}/integrations/{integrationId}', () => {
        describe('with a valid token', () => {
          it('should return integration data', (done) => {
            server.inject({
              method: 'GET',
              url: integrationUrl,
              headers: {
                authorization: `Bearer ${userModel.token()}`,
              },
            }, (res) => {
              const payload = JSON.parse(res.payload)

              Joi.validate(payload, integrationGetSuccessSchema, (err) => {
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
              url: integrationUrl,
            }, (res) => {
              const payload = JSON.parse(res.payload)

              payload.error.should.eq('Unauthorized')
              done()
            })
          })
        })
      })

      describe('POST /api/bots/{botId}/integrations', () => {
        describe('with a valid token', () => {
          it('should return newly created integration', (done) => {
            server.inject({
              method: 'POST',
              url: integrationsUrl,
              payload: {
                type: 'test',
                access_token: 'access_token',
                refresh_token: 'refresh_token',
                expires_in: 1000,
              },
              headers: {
                authorization: `Bearer ${userModel.token()}`,
              },
            }, (res) => {
              const payload = JSON.parse(res.payload)

              Joi.validate(payload, integrationGetSuccessSchema, (err) => {
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
              url: integrationsUrl,
            }, (res) => {
              const payload = JSON.parse(res.payload)

              payload.error.should.eq('Unauthorized')
              done()
            })
          })
        })
      })

      describe('PATCH /api/bots/{botId}/integrations/{integrationId}', () => {
        describe('with a valid token', () => {
          it('should return an updated integration', (done) => {
            server.inject({
              method: 'PATCH',
              url: integrationUrl,
              headers: {
                authorization: `Bearer ${userModel.token()}`,
              },
              payload: {
                type: 'test-3',
              },
            }, (res) => {
              const payload = JSON.parse(res.payload)

              payload.payload.integration.type.should.eq('test-3')

              Joi.validate(payload, integrationGetSuccessSchema, (err) => {
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
              url: integrationUrl,
            }, (res) => {
              const payload = JSON.parse(res.payload)

              payload.error.should.eq('Unauthorized')
              done()
            })
          })
        })
      })

      describe('PUT /api/bots/{botId}/integrations/{integrationId}', () => {
        describe('with a valid token', () => {
          it('should return an updated integration', (done) => {
            server.inject({
              method: 'PUT',
              url: integrationUrl,
              headers: {
                authorization: `Bearer ${userModel.token()}`,
              },
              payload: {
                type: 'test-3',
                access_token: 'test',
              },
            }, (res) => {
              const payload = JSON.parse(res.payload)
              payload.payload.integration.type.should.eq('test-3')
              payload.payload.integration.access_token.should.eq('test')

              Joi.validate(payload, integrationGetSuccessSchema, (err) => {
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
              url: integrationUrl,
            }, (res) => {
              const payload = JSON.parse(res.payload)

              payload.error.should.eq('Unauthorized')
              done()
            })
          })
        })
      })

      describe('DELETE /api/bots/{botId}/integrations/{integrationId}', () => {
        describe('with a valid token', () => {
          it('should delete the bot', (done) => {
            server.inject({
              method: 'DELETE',
              url: integrationUrl,
              headers: {
                authorization: `Bearer ${userModel.token()}`,
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
              url: integrationUrl,
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
