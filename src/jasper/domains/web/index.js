import wolframAlpha from '../../../wolfram-alpha'

export default (speech, params, resolvedQuery) => {
  return wolframAlpha(resolvedQuery)
}
