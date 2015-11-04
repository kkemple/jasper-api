import ExtendableError from 'es6-error'

export class UnauthorizedError extends ExtendableError {
  constructor(message = 'Unauthorized!') {
    super(message)
  }
}

export class AuthenticationError extends ExtendableError {
  constructor(message = 'Authentication failed!') {
    super(message)
  }
}

export default ExtendableError
