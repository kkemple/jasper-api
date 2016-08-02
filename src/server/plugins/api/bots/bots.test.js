import test from 'tape'
import Joi from 'joi'
import assign from 'lodash.assign'

import tokenize from '../../../../services/tokenize'
import {
  botGetSuccessSchema,
  botsGetSuccessSchema
} from '../../../validations'
import { User, Bot } from '../../../../models'
import { getServer, loadPlugins } from '../../../index'

const userConfig = (props = {}) => {
  return assign({}, {
    email: 'jasper@releasable.io',
    password: 'jasper'
  }, props)
}

const botConfig = (props = {}) => {
  return assign({}, {
    user_id: 1,
    name: 'test-bot'
  }, props)
}

test('GET /api/bots', (t) => {
  t.test('should return bots belonging to user', (assert) => {
    let userModel
    const server = getServer('0.0.0.0', 8080)

    loadPlugins(server)
      .then(() => {
        return User.forge(userConfig({ password: 'test' }))
          .save()
          .then((user) => {
            userModel = user

            return Bot.forge(botConfig({ user_id: user.get('id') }))
              .save()
              .then((bot) => tokenize(userModel))
          })
      })
      .then((token) => {
        server.inject({
          method: 'GET',
          url: '/api/bots',
          headers: {
            authorization: `Bearer ${token}`
          }
        }, (response) => {
          const payload = JSON.parse(response.payload)

          Joi.validate(payload, botsGetSuccessSchema, (error) => {
            if (error) assert.fail(error)
            else assert.pass('response has correct schema/data')
          })
        })
      })
      .catch((error) => assert.fail(error))
      .then(() => userModel.tokens().invokeThen('destroy'))
      .then(() => userModel.bots().invokeThen('destroy'))
      .then(() => userModel.destroy())
      .then(() => assert.end())
      .catch((error) => console.log(error))
  })

  t.test('with an invalid token', (assert) => {
    let userModel
    const server = getServer('0.0.0.0', 8080)

    loadPlugins(server)
      .then(() => {
        return User.forge(userConfig({ password: 'test' }))
          .save()
          .then((user) => {
            userModel = user
          })
      })
      .then(() => {
        server.inject({
          method: 'GET',
          url: '/api/bots'
        }, (response) => {
          const payload = JSON.parse(response.payload)

          const expected = 'Unauthorized'
          const actual = payload.error
          assert.equal(actual, expected, 'should not be able to access bots without auth token')
        })
      })
      .catch((error) => assert.fail(error))
      .then(() => userModel.bots().invokeThen('destroy'))
      .then(() => userModel.destroy())
      .then(() => assert.end())
      .catch((error) => console.log(error))
  })
})

test('GET /api/bots/{botId}', (t) => {
  t.test('with a valid token', (assert) => {
    let userModel
    let botId
    const server = getServer('0.0.0.0', 8080)

    loadPlugins(server)
      .then(() => {
        return User.forge(userConfig({ password: 'test' }))
          .save()
          .then((user) => {
            userModel = user

            return Bot.forge(botConfig({ user_id: user.get('id') }))
              .save()
              .then((bot) => {
                botId = bot.get('id')
                return tokenize(userModel)
              })
          })
      })
      .then((token) => {
        server.inject({
          method: 'GET',
          url: `/api/bots/${botId}`,
          headers: {
            authorization: `Bearer ${token}`
          }
        }, (response) => {
          const payload = JSON.parse(response.payload)

          Joi.validate(payload, botGetSuccessSchema, (error) => {
            if (error) assert.fail(error)
            else assert.pass('response has correct schema/data')
          })
        })
      })
      .catch((error) => assert.fail(error))
      .then(() => userModel.tokens().invokeThen('destroy'))
      .then(() => userModel.bots().invokeThen('destroy'))
      .then(() => userModel.destroy())
      .then(() => assert.end())
      .catch((error) => console.log(error))
  })

  t.test('with an invalid token', (assert) => {
    let userModel
    const server = getServer('0.0.0.0', 8080)

    loadPlugins(server)
      .then(() => {
        return User.forge(userConfig({ password: 'test' }))
          .save()
          .then((user) => {
            userModel = user

            return Bot.forge(botConfig({ user_id: user.get('id') }))
              .save()
          })
      })
      .then((bot) => {
        server.inject({
          method: 'GET',
          url: `/api/bots/${bot.get('id')}`
        }, (response) => {
          const payload = JSON.parse(response.payload)

          const expected = 'Unauthorized'
          const actual = payload.error
          assert.equal(actual, expected, 'should not be able to access bot without auth token')
        })
      })
      .catch((error) => assert.fail(error))
      .then(() => userModel.tokens().invokeThen('destroy'))
      .then(() => userModel.bots().invokeThen('destroy'))
      .then(() => userModel.destroy())
      .then(() => assert.end())
      .catch((error) => console.log(error))
  })
})
//
// describe('POST /api/bots', () => {
//   describe('with a valid token', () => {
//     it('should return newly created bot', (done) => {
//       server.inject({
//         method: 'POST',
//         url: botsUrl,
//         payload: {
//           name: 'test-bot'
//         },
//         headers: {
//           authorization: `Bearer ${token}`
//         }
//       }, (res) => {
//         const payload = JSON.parse(res.payload)
//
//         Joi.validate(payload, botGetSuccessSchema, (err) => {
//           if (err) return done(err)
//           done()
//         })
//       })
//     })
//   })
//
//   describe('with an invalid token', () => {
//     it('should return with Unauthorized Error', (done) => {
//       server.inject({
//         method: 'POST',
//         url: botsUrl,
//         payload: {
//           name: 'test-bot'
//         }
//       }, (res) => {
//         const payload = JSON.parse(res.payload)
//
//         payload.error.should.eq('Unauthorized')
//         done()
//       })
//     })
//   })
// })
//
// describe('PATCH /api/bots/{botId}', () => {
//   describe('with a valid token', () => {
//     it('should return an updated bot', (done) => {
//       server.inject({
//         method: 'PATCH',
//         url: botUrl,
//         headers: {
//           authorization: `Bearer ${token}`
//         },
//         payload: {
//           name: 'test-bot-3'
//         }
//       }, (res) => {
//         const payload = JSON.parse(res.payload)
//         payload.payload.bot.name.should.eq('test-bot-3')
//
//         Joi.validate(payload, botGetSuccessSchema, (err) => {
//           if (err) return done(err)
//           done()
//         })
//       })
//     })
//   })
//
//   describe('with an invalid token', () => {
//     it('should return with Unauthorized Error', (done) => {
//       server.inject({
//         method: 'PATCH',
//         url: botUrl
//       }, (res) => {
//         const payload = JSON.parse(res.payload)
//
//         payload.error.should.eq('Unauthorized')
//         done()
//       })
//     })
//   })
// })
//
// describe('PUT /api/bots/{botId}', () => {
//   describe('with a valid token', () => {
//     it('should return an updated bot', (done) => {
//       server.inject({
//         method: 'PUT',
//         url: botUrl,
//         headers: {
//           authorization: `Bearer ${token}`
//         },
//         payload: {
//           name: 'test-bot-3'
//         }
//       }, (res) => {
//         const payload = JSON.parse(res.payload)
//         payload.payload.bot.name.should.eq('test-bot-3')
//
//         Joi.validate(payload, botGetSuccessSchema, (err) => {
//           if (err) return done(err)
//           done()
//         })
//       })
//     })
//   })
//
//   describe('with an invalid token', () => {
//     it('should return with Unauthorized Error', (done) => {
//       server.inject({
//         method: 'PUT',
//         url: botUrl
//       }, (res) => {
//         const payload = JSON.parse(res.payload)
//
//         payload.error.should.eq('Unauthorized')
//         done()
//       })
//     })
//   })
// })
//
// describe('DELETE /api/bots/{botId}', () => {
//   describe('with a valid token', () => {
//     it('should delete the bot', (done) => {
//       server.inject({
//         method: 'DELETE',
//         url: botUrl,
//         headers: {
//           authorization: `Bearer ${token}`
//         }
//       }, (res) => {
//         const payload = JSON.parse(res.payload)
//         payload.success.should.eq(true)
//         done()
//       })
//     })
//   })
//
//   describe('with an invalid token', () => {
//     it('should return with Unauthorized Error', (done) => {
//       server.inject({
//         method: 'DELETE',
//         url: botUrl
//       }, (res) => {
//         const payload = JSON.parse(res.payload)
//
//         payload.error.should.eq('Unauthorized')
//         done()
//       })
//     })
//   })
// })
// })
//   })
