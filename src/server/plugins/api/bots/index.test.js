import test from 'ava'
import Joi from 'joi'
import assign from 'lodash.assign'

import tokenize from '../../../../services/tokenize'
import { User, Bot } from '../../../../models'
import { getServer, loadPlugins } from '../../../index'

const botGetSuccessSchema = {
  success: Joi.boolean().invalid(false).required(),
  timestamp: Joi.date().required(),
  payload: Joi.object().keys({
    bot: Joi.object().keys({
      id: Joi.number().required(),
      user_id: Joi.number().required(),
      active: Joi.boolean().required(),
      name: Joi.string().required(),
      extra_data: Joi.string().allow(null).allow(''),
      created_at: Joi.date().required(),
      updated_at: Joi.date().required(),
      integrations: Joi.array(),
      emails: Joi.array(),
      phone_numbers: Joi.array()
    })
  })
}

const botsGetSuccessSchema = {
  success: Joi.boolean().invalid(false).required(),
  timestamp: Joi.date().required(),
  payload: Joi.object().keys({
    bots: Joi.array().items(
      Joi.object().keys({
        id: Joi.number().required(),
        user_id: Joi.number().required(),
        active: Joi.boolean().required(),
        name: Joi.string().required(),
        extra_data: Joi.string().allow(null).allow(''),
        created_at: Joi.date().required(),
        updated_at: Joi.date().required(),
        integrations: Joi.array(),
        emails: Joi.array(),
        phone_numbers: Joi.array()
      })
    )
  })
}

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

test('[GET] /api/bots', (t) => {
  let userModel
  const server = getServer('0.0.0.0', 8080)

  return loadPlugins(server)
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
      return new Promise((resolve, reject) => {
        server.inject({
          method: 'GET',
          url: '/api/bots',
          headers: {
            authorization: `Bearer ${token}`
          }
        }, (response) => {
          const payload = JSON.parse(response.payload)

          Joi.validate(payload, botsGetSuccessSchema, (error) => {
            if (error) t.fail(error)
            else t.pass('response has correct schema/data')

            const promises = [
              userModel.tokens().invokeThen('destroy'),
              userModel.bots().invokeThen('destroy'),
              userModel.destroy()
            ]

            Promise.all(promises)
              .then(() => resolve())
              .catch((error) => reject(error))
          })
        })
      })
    })
})

test('[GET] /api/bots/{botId}', (t) => {
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
      return new Promise((resolve, reject) => {
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

            const promises = [
              userModel.tokens().invokeThen('destroy'),
              userModel.bots().invokeThen('destroy'),
              userModel.destroy()
            ]

            Promise.all(promises)
              .then(() => resolve())
              .catch((error) => reject(error))
          })
        })
      })
    })
    .catch((error) => t.fail(error))
})

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
