import jwt from 'jsonwebtoken'
import Promise from 'bluebird'

import { UnauthorizedError } from '../errors'

export default (req) => new Promise((res, rej) => {
  if (!req.headers['x-access-token']) {
    rej(new UnauthorizedError('Must provide authentication token!'))
    return
  }

  jwt.verify(
    req.headers['x-access-token'],
    process.env.ENCRYPTION_KEY,
    (err, decoded) => {
      if (err) {
        rej(err)
        return
      }

      res(decoded)
    }
  )
})
