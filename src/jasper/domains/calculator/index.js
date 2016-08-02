import wolframAlpha from '../../../wolfram-alpha'

export default {
  currency: (speech) => {
    return Promise.resolve({ speech })
  },
  math: (speech, params, resolvedQuery) => {
    return wolframAlpha(resolvedQuery)
  },
  tips: (speech) => {
    return Promise.resolve({ speech })
  },
  units: (speech, params, resolvedQuery) => {
    return wolframAlpha(resolvedQuery)
  }
}
