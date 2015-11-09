import Promise from 'bluebird'

import { UnauthorizedError } from '../errors'

export default (requestId, token) => {
  const id = parseInt(requestId, 10)
  if (id !== token.id) return Promise.reject(new UnauthorizedError())
  return Promise.resolve(token)
}
