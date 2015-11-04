import wolframAlpha from '../../wolfram-alpha'

export default (speech, params, resolvedQuery) => {
  if (speech === '') return wolframAlpha(resolvedQuery)
  return Promise.resolve({ speech })
}
