import test from 'ava'

import './token'
import './bot'
import UserModel from './user'

test('authentication with valid creds', (t) => {
  return new Promise((resolve, reject) => {
    UserModel
      .forge({ email: 'test@jasperdoes.xyz', password: 'test' })
      .save()
      .then((user) => {
        const expected = user.get('id')

        UserModel
          .authenticate('test@jasperdoes.xyz', 'test')
          .then((authedUser) => {
            const actual = authedUser.get('id')
            t.is(expected, actual)
          })
          .then(() => user.tokens().invokeThen('destroy'))
          .then(() => user.destroy())
          .then(() => resolve())
          .catch((error) => reject(error))
      })
      .catch((error) => reject(error))
  })
})

test('authentication with invalid creds', (t) => {
  let userModel
  return new Promise((resolve, reject) => {
    UserModel
      .forge({ email: 'test@jasper.xyz', password: 'test' })
      .save()
      .then((user) => {
        userModel = user

        UserModel
          .authenticate('test@jasperdoes.xyz', 'wrong')
          .then(() => {
            t.fail('user should not be authenticated with incorrect email')
            resolve()
          })
          .catch((error) => {
            if (error.message === 'User not found!') {
              t.pass('fails with "User not found" error')
            }

            const promises = [
              userModel.tokens().invokeThen('destroy'),
              userModel.destroy()
            ]

            Promise.all(promises)
              .then(() => resolve())
              .catch((error) => reject(error))
          })
      })
  })
})
