import chai from 'chai'
import jwt from 'jsonwebtoken'

import verifyToken from '../../../server/verify-token'

chai.should()

describe('Hapi Server', () => {
  describe('Token Verifier', () => {
    describe('with a valid access header', () => {
      it('should return the decoded JWT', (done) => {
        const token = jwt.sign({ test: 'test' }, process.env.ENCRYPTION_KEY)

        verifyToken(token)
          .then((decoded) => {
            decoded.test.should.eq('test')
            done()
          })
          .catch(done)
      })
    })

    describe('with an invalid token', () => {
      it('should return an JsonWebTokenError', (done) => {
        const token = jwt.sign({ test: 'test' }, 'wrong key')

        verifyToken(token)
          .catch((err) => {
            err.name.should.eq('JsonWebTokenError')
            done()
          })
      })
    })
  })
})
