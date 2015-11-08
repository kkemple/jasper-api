import jwt from 'jsonwebtoken'
import Promise from 'bluebird'

export default (token) => new Promise((res, rej) => {
  jwt.verify(
    token,
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
