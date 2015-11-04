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

export class CommanderActionNotFoundError extends ExtendableError {
  constructor(message = 'Action not found!') {
    super(message)
  }
}

export default ExtendableError
