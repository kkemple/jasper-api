import jwt from 'jsonwebtoken'
import randomString from 'randomstring'

import { Token } from '../models'

export default (user) => new Promise((res, rej) => {
  const uuid = randomString.generate()

  Token.forge({ user_id: user.get('id'), uuid })
    .save()
    .then(() => {
      res(jwt.sign({
        id: user.get('id'),
        email: user.get('email'),
        uuid,
      }, process.env.ENCRYPTION_KEY))
    })
    .catch((err) => rej(err))
})
