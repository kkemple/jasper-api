import wolframAlpha from '../wolfram-alpha'

export default (speech, params, body) => {
  if (speech === '') return wolframAlpha(body.resolvedQuery)
  return Promise.resolve({ speech })
}
