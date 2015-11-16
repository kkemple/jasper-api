import chai from 'chai'

import { User } from '../../../models'

chai.should()

describe('Models', () => {
  describe('User', () => {
    describe('#authenticate', () => {
      describe('with a valid email and password', () => {
        let userModel

        before((done) => {
          User.forge({ email: 'skynet@releasable.io', password: 'test' })
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

        it('should return authenticated user', (done) => {
          User.authenticate('skynet@releasable.io', 'test')
            .then((user) => {
              user.get('email').should.eq('skynet@releasable.io')
              done()
            })
        })
      })

      describe('with an invalid email and password', () => {
        let userModel

        before((done) => {
          User.forge({ email: 'skynet@releasable.io', password: 'test' })
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

        it('should return an AuthenticationError', (done) => {
          User.authenticate('skynet@releasable.io', '')
            .catch((err) => {
              err.name.should.eq('AuthenticationError')
              done()
            })
        })
      })
    })
  })
})
