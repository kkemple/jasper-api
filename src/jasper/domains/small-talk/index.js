import wolframAlpha from '../../../wolfram-alpha'

export default {
  agent: (speech, params, resolvedQuery) => {
    return wolframAlpha(resolvedQuery)
  },

  appraisal: (speech, params, resolvedQuery) => {
    return wolframAlpha(resolvedQuery)
  },

  confirmation: (speech, params, resolvedQuery) => {
    return wolframAlpha(resolvedQuery)
  },

  dialog: (speech, params, resolvedQuery) => {
    return wolframAlpha(resolvedQuery)
  },

  emotions: (speech, params, resolvedQuery) => {
    return wolframAlpha(resolvedQuery)
  },

  greetings: (speech, params, resolvedQuery) => {
    return wolframAlpha(resolvedQuery)
  },

  person: (speech, params, resolvedQuery) => {
    return wolframAlpha(resolvedQuery)
  },

  topics: (speech, params, resolvedQuery) => {
    return wolframAlpha(resolvedQuery)
  },

  unknown: (speech, params, resolvedQuery) => {
    return wolframAlpha(resolvedQuery)
  },

  user: (speech, params, resolvedQuery) => {
    return wolframAlpha(resolvedQuery)
  }
}
