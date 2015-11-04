import chai from 'chai'
import jwt from 'jsonwebtoken'

import models from '../../../models'

chai.should()

const { User } = models

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

        it('should return a valid JWT', (done) => {
          User.authenticate('skynet@releasable.io', 'test')
            .then((token) => {
              token.should.be.a('string')

              jwt.verify(
                token,
                process.env.ENCRYPTION_KEY,
                (err, decoded) => {
                  if (err) {
                    done(err)
                    return
                  }

                  decoded.email.should.eq('skynet@releasable.io')
                  decoded.id.should.eq(userModel.get('id'))
                  done()
                }
              )
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
