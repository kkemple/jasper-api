import bcrypt from 'bcryptjs'
import Promise from 'bluebird'

export default (password) => new Promise((res, rej) => {
  bcrypt.genSalt(10, (saltGenErr, salt) => {
    if (saltGenErr) return rej(saltGenErr)

    bcrypt.hash(password, salt, (hashErr, hash) => {
      if (hashErr) return rej(hashErr)

      return res(hash)
    })
  })
})
