import Promise from 'bluebird'

import wolframAlpha from '../../../wolfram-alpha'

export default {
  currency: (speech) => {
    return Promise.resolve({ speech })
  },
  math: (speech) => {
    return Promise.resolve({ speech })
  },
  tips: (speech) => {
    return Promise.resolve({ speech })
  },
  units: (speech, params, body) => {
    return wolframAlpha(body.resolvedQuery)
  },
}
