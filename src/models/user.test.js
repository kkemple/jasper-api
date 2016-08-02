import test from 'tape'

import UserModel from './user'

test('User', (t) => {
  t.test('authenticate(email, password)', (assert) => {
    assert.test('with a valid email and password', () => {
      UserModel.forge({ email: 'jasper@jasperdoes.xyz', password: 'test' })
        .save()
        .then((user) => {
          const expected = user
          UserModel.authenticate('jasper@jasperdoes.xyz', 'test')
            .then((authedUser) => {
              const actual = authedUser
              assert.equal(expected, actual, 'returns authenticated user')
            })
            .then(() => user.destroy())
            .then(() => assert.end())
        })
        .catch((error) => {
          assert.fail(error)
          assert.end()
        })
    })
  })

  t.test('with an invalid email', (assert) => {
    UserModel.forge({ email: 'jasper@jasper.xyz', password: 'test' })
      .save()
      .then((user) => {
        UserModel.authenticate('jasper@jasperdoes.xyz', 'test')
          .then(() => {
            assert.fail('user should not be authenticated with incorrect email')
            assert.end()
          })
          .catch((error) => {
            if (error.message === 'User not found!') {
              assert.pass('fails with "User not found" error')
              assert.end()
            }
          })
      })
      .catch((error) => {
        assert.fail(error)
        assert.end()
      })
  })
})
