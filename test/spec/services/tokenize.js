import chai from 'chai'
import jwt from 'jsonwebtoken'

import tokenize from '../../../services/tokenize'
import { User, Token } from '../../../models'
import { userConfig } from '../../helpers/config'

chai.should()

describe('Services', () => {
  describe('tokenize', () => {
    let user

    beforeEach((done) => {
      User.forge(userConfig())
        .save()
        .then((model) => user = model)
        .then(() => done())
        .catch(done)
    })

    afterEach((done) => {
      user.destroy()
        .then(() => done())
        .catch(done)
    })

    it('creates a JWT for a user', (done) => {
      tokenize(user)
        .then((token) => {
          jwt.verify(token, process.env.ENCRYPTION_KEY, (err, decoded) => {
            decoded.id.should.eq(user.get('id'))
            decoded.email.should.eq(user.get('email'))
            done()
          })
        })
        .catch(done)
    })

    it('persists the token for future validations', (done) => {
      tokenize(user)
        .then((token) => {
          jwt.verify(token, process.env.ENCRYPTION_KEY, (err, decoded) => {
            new Token({ uuid: decoded.uuid })
              .fetch({ require: true })
              .then(() => done())
              .catch(done)
          })
        })
        .catch(done)
    })
  })
})
