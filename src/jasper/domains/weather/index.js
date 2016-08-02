import wolframResponse from '../wolfram-response'

export default {
  search: (speech, params, resolvedQuery) => {
    return wolframResponse(speech, params, resolvedQuery)
  }
}
