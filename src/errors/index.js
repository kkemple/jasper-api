export class UnauthorizedError extends Error {
  constructor (message = 'Unauthorized!') {
    super(message)
    this.message = message
    this.name = 'UnauthorizedError'
  }
}

export class AuthenticationError extends Error {
  constructor (message = 'Authentication failed!') {
    super(message)
    this.message = message
    this.name = 'AuthenticationError'
  }
}

export class CommanderActionNotFoundError extends Error {
  constructor (message = 'Action not found!') {
    super(message)
    this.message = message
    this.name = 'CommanderActionNotFoundError'
  }
}
