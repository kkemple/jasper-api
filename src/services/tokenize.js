import jwt from 'jsonwebtoken'
import cuid from 'cuid'

import { Token } from '../models'

export default (user) => new Promise((resolve, reject) => {
  const str = cuid()

  Token.forge({ cuid: str, user_id: user.get('id') })
    .save()
    .then(() => {
      resolve(jwt.sign({
        cuid: str,
        id: user.get('id'),
        email: user.get('email')
      }, process.env.SECRET))
    })
    .catch((error) => reject(error))
})
