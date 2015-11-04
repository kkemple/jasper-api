import wolframAlpha from '../../../wolfram-alpha'

export default {
  agent: (speech, params, body) => {
    return wolframAlpha(body.resolvedQuery)
  },
  appraisal: (speech, params, body) => {
    return wolframAlpha(body.resolvedQuery)
  },
  confirmation: (speech, params, body) => {
    return wolframAlpha(body.resolvedQuery)
  },
  dialog: (speech, params, body) => {
    return wolframAlpha(body.resolvedQuery)
  },
  emotions: (speech, params, body) => {
    return wolframAlpha(body.resolvedQuery)
  },
  greetings: (speech, params, body) => {
    return wolframAlpha(body.resolvedQuery)
  },
  person: (speech, params, body) => {
    return wolframAlpha(body.resolvedQuery)
  },
  topics: (speech, params, body) => {
    return wolframAlpha(body.resolvedQuery)
  },
  unknown: (speech, params, body) => {
    return wolframAlpha(body.resolvedQuery)
  },
  user: (speech, params, body) => {
    return wolframAlpha(body.resolvedQuery)
  },
}
