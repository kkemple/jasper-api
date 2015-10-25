import Promise from 'bluebird'

export default {
  agent: (speech) => {
    return Promise.resolve({ speech })
  },
  appraisal: (speech) => {
    return Promise.resolve({ speech })
  },
  confirmation: (speech) => {
    return Promise.resolve({ speech })
  },
  dialog: (speech) => {
    return Promise.resolve({ speech })
  },
  emotions: (speech) => {
    return Promise.resolve({ speech })
  },
  greetings: (speech) => {
    return Promise.resolve({ speech })
  },
  person: (speech) => {
    return Promise.resolve({ speech })
  },
  topics: (speech) => {
    return Promise.resolve({ speech })
  },
  unknown: (speech) => {
    return Promise.resolve({ speech })
  },
  user: (speech) => {
    return Promise.resolve({ speech })
  },
}
