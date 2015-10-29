import wolframAlpha from '../../wolfram-alpha'

export default (speech, params, body) => {
  return wolframAlpha(body.resolvedQuery)
}
