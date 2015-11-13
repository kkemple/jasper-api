import chai from 'chai'
import Hapi from 'hapi'
import Joi from 'joi'
import jwt from 'jsonwebtoken'

import { authSuccessSchema, userGetSuccessSchema } from '../../../validations'
import config from '../../../../server/config/server'
import models from '../../../../models'
import { userConfig } from '../../../helpers/config'

chai.should()

const { User } = models

const createUser = () => {
  return User.forge(userConfig({ password: 'test' }))
    .save()
}

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

    beforeEach((done) => {
      createUser()
        .then((user) => userModel = user)
        .then(() => done())
        .catch(done)
    })

    afterEach((done) => {
      userModel.destroy()
        .then(() => done())
        .catch(done)
    })

    describe('POST /api/authenticate', () => {
      describe('with valid email and password', () => {
        it('should return with a valid response', (done) => {
          server.inject({
            method: 'POST',
            url: '/api/authenticate',
            payload: {
              email: userModel.get('email'),
              password: 'test',
            },
          }, (res) => {
            const payload = JSON.parse(res.payload)

            Joi.validate(payload, authSuccessSchema, (err) => {
              if (err) return done(err)
              done()
            })
          })
        })
      })

      describe('with invalid email and password', () => {
        it('should return with an AuthenticationError', (done) => {
          server.inject({
            method: 'POST',
            url: '/api/authenticate',
            payload: {
              email: userModel.get('email'),
              password: 'incorrect',
            },
          }, (res) => {
            const payload = JSON.parse(res.payload)

            payload.error.should.eq('AuthenticationError')
            done()
          })
        })
      })
    })

    describe('User Endpoint', () => {
      describe('GET /api/users/{id}', () => {
        describe('with a valid token', () => {
          it('should return a valid response', (done) => {
            server.inject({
              method: 'GET',
              url: `/api/users/${userModel.get('id')}`,
              headers: {
                'x-access-token': jwt.sign({
                  id: userModel.get('id'),
                  email: userModel.get('email'),
                }, process.env.ENCRYPTION_KEY),
              },
            }, (res) => {
              const payload = JSON.parse(res.payload)

              Joi.validate(payload, userGetSuccessSchema, (err) => {
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
              url: `/api/users/${userModel.get('id')}`,
            }, (res) => {
              const payload = JSON.parse(res.payload)

              payload.error.should.eq('Bad Request')
              done()
            })
          })
        })
      })

      describe('PATCH /api/users/{id}', () => {
        describe('with a valid token', () => {
          it('should return an updated user', (done) => {
            server.inject({
              method: 'PATCH',
              url: `/api/users/${userModel.get('id')}`,
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
              payload.payload.user.email.should.eq('test@releasable.io')

              Joi.validate(payload, userGetSuccessSchema, (err) => {
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
              url: `/api/users/${userModel.get('id')}`,
            }, (res) => {
              const payload = JSON.parse(res.payload)

              payload.error.should.eq('Bad Request')
              done()
            })
          })
        })
      })

      describe('PUT /api/users/{id}', () => {
        describe('with a valid token', () => {
          it('should return an updated user', (done) => {
            server.inject({
              method: 'PUT',
              url: `/api/users/${userModel.get('id')}`,
              headers: {
                'x-access-token': jwt.sign({
                  id: userModel.get('id'),
                  email: userModel.get('email'),
                }, process.env.ENCRYPTION_KEY),
              },
              payload: {
                email: 'test@releasable.io',
                password: 'test',
              },
            }, (res) => {
              const payload = JSON.parse(res.payload)
              payload.payload.user.email.should.eq('test@releasable.io')

              Joi.validate(payload, userGetSuccessSchema, (err) => {
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
              url: `/api/users/${userModel.get('id')}`,
            }, (res) => {
              const payload = JSON.parse(res.payload)

              payload.error.should.eq('Bad Request')
              done()
            })
          })
        })
      })

      describe('DELETE /api/users/{id}', () => {
        describe('with a valid token', () => {
          it('should delete the user', (done) => {
            server.inject({
              method: 'DELETE',
              url: `/api/users/${userModel.get('id')}`,
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
              url: `/api/users/${userModel.get('id')}`,
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
