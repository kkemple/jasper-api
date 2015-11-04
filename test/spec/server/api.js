import chai from 'chai'
import Hapi from 'hapi'
import Joi from 'joi'
import jwt from 'jsonwebtoken'

import {
  authSuccessSchema,
  authFailureSchema,
  userGetSuccessSchema,
  userGetFailureSchema,
} from '../../validations'
import config from '../../../server/config/server'
import models from '../../../models'
import { userConfig } from '../../helpers/config'

chai.should()

const { User } = models

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
    describe('POST /api/authenticate', () => {
      let userModel

      before((done) => {
        User.forge(userConfig({ password: 'test' }))
          .save()
          .then((user) => {
            userModel = user
            done()
          })
          .catch(done)
      })

      after((done) => {
        userModel.destroy()
          .then(() => done())
          .catch(done)
      })

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
        it('should return with a valid error response', (done) => {
          server.inject({
            method: 'POST',
            url: '/api/authenticate',
            payload: {
              email: userModel.get('email'),
              password: 'incorrect',
            },
          }, (res) => {
            const payload = JSON.parse(res.payload)

            Joi.validate(payload, authFailureSchema, (err) => {
              if (err) return done(err)
              done()
            })
          })
        })

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

    describe('GET /users/{id}', () => {
      let userModel

      before((done) => {
        User.forge(userConfig({ password: 'test' }))
          .save()
          .then((user) => {
            userModel = user
            done()
          })
          .catch(done)
      })

      after((done) => {
        userModel.destroy()
          .then(() => done())
          .catch(done)
      })

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
        it('should return with a valid error response', (done) => {
          server.inject({
            method: 'GET',
            url: '/api/users/1',
          }, (res) => {
            const payload = JSON.parse(res.payload)

            Joi.validate(payload, userGetFailureSchema, (err) => {
              if (err) return done(err)
              done()
            })
          })
        })

        it('should return with an UnauthorizedError', (done) => {
          server.inject({
            method: 'GET',
            url: '/api/users/1',
          }, (res) => {
            const payload = JSON.parse(res.payload)

            payload.error.should.eq('UnauthorizedError')
            done()
          })
        })
      })
    })
  })
})
