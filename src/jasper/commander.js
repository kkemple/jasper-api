import reduce from 'lodash.reduce'

import { CommanderActionNotFoundError } from '../errors'

const reducer = (memo, val) => {
  if (!memo) return undefined
  return memo[val]
}

// processes api.ai responses
export default class Commander {
  constructor (config) {
    this.commandPath = (config.action) ? config.action.split('.') : []
    this.params = config.params || {}
    this.resolvedQuery = config.resolvedQuery || ''
    this.speech = config.speech || ''
  }

  execute (commands) {
    return new Promise((resolve, reject) => {
      const action = reduce(this.commandPath, reducer, commands)
      if (!action) {
        reject(new CommanderActionNotFoundError())
        return
      }

      resolve(action(this.speech, this.params, this.resolvedQuery))
    })
  }
}
