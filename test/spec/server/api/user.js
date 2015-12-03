import chai from 'chai'
import Joi from 'joi'
import nock from 'nock'

import tokenize from '../../../../services/tokenize'
import { authSuccessSchema, userGetSuccessSchema } from '../../../validations'
import { User } from '../../../../models'
import { userConfig } from '../../../helpers/config'

import { getServer, loadPlugins } from '../../../../server'

chai.should()

const createUser = () => {
  return User.forge(userConfig({ password: 'test' }))
    .save()
}

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
    let token

    beforeEach((done) => {
      createUser()
        .then((user) => userModel = user)
        .then((user) => tokenize(user))
        .then((userToken) => token = userToken)
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

    describe('POST /api/pwreset', () => {
      describe('with valid email and url', () => {
        it('should return with a valid response', (done) => {
          nock('https://api.mailgun.net/v2')
            .post('/mg.releasable.io/messages')
            .reply(200, {})

          server.inject({
            method: 'POST',
            url: '/api/pwreset',
            payload: {
              email: userModel.get('email'),
              url: 'http://testdomain.com/reset-password',
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

      describe('with invalid email and url', () => {
        it('should return with an Error', (done) => {
          server.inject({
            method: 'POST',
            url: '/api/pwreset',
            payload: {
              email: userModel.get('email'),
              url: 'incorrect',
            },
          }, (res) => {
            const payload = JSON.parse(res.payload)

            payload.error.should.eq('Error')
            done()
          })
        })
      })
    })

    describe('User Endpoint', () => {
      describe('GET /api/users/current', () => {
        describe('with a valid token', () => {
          it('should return a valid response', (done) => {
            server.inject({
              method: 'GET',
              url: '/api/users/current',
              headers: {
                authorization: `Bearer ${token}`,
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
          it('should return with Not Found Error', (done) => {
            server.inject({
              method: 'GET',
              url: '/api/users/current',
            }, (res) => {
              const payload = JSON.parse(res.payload)

              payload.error.should.eq('Unauthorized')
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
                authorization: `Bearer ${token}`,
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
          it('should return with Unauthorized Error', (done) => {
            server.inject({
              method: 'PATCH',
              url: `/api/users/${userModel.get('id')}`,
            }, (res) => {
              const payload = JSON.parse(res.payload)

              payload.error.should.eq('Unauthorized')
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
                authorization: `Bearer ${token}`,
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
          it('should return with Unauthorized Error', (done) => {
            server.inject({
              method: 'PUT',
              url: `/api/users/${userModel.get('id')}`,
            }, (res) => {
              const payload = JSON.parse(res.payload)

              payload.error.should.eq('Unauthorized')
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
              url: `/api/users/${userModel.get('id')}`,
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
