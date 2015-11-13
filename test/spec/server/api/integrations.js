import chai from 'chai'
import Hapi from 'hapi'
import Joi from 'joi'
import jwt from 'jsonwebtoken'

import {
  integrationGetSuccessSchema,
  integrationsGetSuccessSchema,
} from '../../../validations'
import config from '../../../../server/config/server'
import models from '../../../../models'
import { userConfig, botConfig, integrationConfig } from '../../../helpers/config'

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
                  integrationUrl = `/api/users/${userModel.get('id')}/bots/${botModel.get('id')}/integrations/${integration.get('id')}`
                  integrationsUrl = `/api/users/${userModel.get('id')}/bots/${botModel.get('id')}/integrations`
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
      describe('GET /api/users/{userId}/bots/{botId}/integrations', () => {
        describe('with a valid token', () => {
          it('should return integrations belonging to bot', (done) => {
            server.inject({
              method: 'GET',
              url: integrationsUrl,
              headers: {
                'x-access-token': jwt.sign({
                  id: userModel.get('id'),
                  integration: userModel.get('integration'),
                }, process.env.ENCRYPTION_KEY),
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
          it('should return with an Bad Request', (done) => {
            server.inject({
              method: 'GET',
              url: integrationUrl,
            }, (res) => {
              const payload = JSON.parse(res.payload)

              payload.error.should.eq('Bad Request')
              done()
            })
          })
        })
      })

      describe('GET /api/users/{userId}/bots/{botId}/integrations/{integrationId}', () => {
        describe('with a valid token', () => {
          it('should return integration data', (done) => {
            server.inject({
              method: 'GET',
              url: integrationUrl,
              headers: {
                'x-access-token': jwt.sign({
                  id: userModel.get('id'),
                  integration: userModel.get('integration'),
                }, process.env.ENCRYPTION_KEY),
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
          it('should return with an Bad Request', (done) => {
            server.inject({
              method: 'GET',
              url: integrationUrl,
            }, (res) => {
              const payload = JSON.parse(res.payload)

              payload.error.should.eq('Bad Request')
              done()
            })
          })
        })
      })

      describe('POST /api/users/{userId}/bots/{botId}/integrations', () => {
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
                'x-access-token': jwt.sign({
                  id: userModel.get('id'),
                  integration: userModel.get('integration'),
                }, process.env.ENCRYPTION_KEY),
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

              payload.error.should.eq('Bad Request')
              done()
            })
          })
        })
      })

      describe('PATCH /api/users/{userId}/bots/{botId}/integrations/{integrationId}', () => {
        describe('with a valid token', () => {
          it('should return an updated integration', (done) => {
            server.inject({
              method: 'PATCH',
              url: integrationUrl,
              headers: {
                'x-access-token': jwt.sign({
                  id: userModel.get('id'),
                  integration: userModel.get('integration'),
                }, process.env.ENCRYPTION_KEY),
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
          it('should return with an Bad Request', (done) => {
            server.inject({
              method: 'PATCH',
              url: integrationUrl,
            }, (res) => {
              const payload = JSON.parse(res.payload)

              payload.error.should.eq('Bad Request')
              done()
            })
          })
        })
      })

      describe('PUT /api/users/{userId}/bots/{botId}/integrations/{integrationId}', () => {
        describe('with a valid token', () => {
          it('should return an updated integration', (done) => {
            server.inject({
              method: 'PUT',
              url: integrationUrl,
              headers: {
                'x-access-token': jwt.sign({
                  id: userModel.get('id'),
                  integration: userModel.get('integration'),
                }, process.env.ENCRYPTION_KEY),
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
          it('should return with an Bad Request', (done) => {
            server.inject({
              method: 'PUT',
              url: integrationUrl,
            }, (res) => {
              const payload = JSON.parse(res.payload)

              payload.error.should.eq('Bad Request')
              done()
            })
          })
        })
      })

      describe('DELETE /api/users/{userId}/bots/{botId}/integrations/{integrationId}', () => {
        describe('with a valid token', () => {
          it('should delete the bot', (done) => {
            server.inject({
              method: 'DELETE',
              url: integrationUrl,
              headers: {
                'x-access-token': jwt.sign({
                  id: userModel.get('id'),
                  integration: userModel.get('integration'),
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
              url: integrationUrl,
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
