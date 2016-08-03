import test from 'ava'

import { excavate, find } from './index'

test('#find(path, json)', (t) => {
  const expected = 'test'
  const actual = find('test', { test: 'test' })

  t.is(expected, actual)
})

test('#excavate(xml) resolves with parsed json', (t) => {
  const expected = true

  const wolframAlphaData = '' +
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<queryresult success="true">\n' +
      '<pod title="Result">\n' +
        '<subpod>\n' +
          '<plaintext>Test</plaintext>\n' +
          '<img src="http://some.url/and/image/path.jpg" />\n' +
        '</subpod>\n' +
      '</pod>\n' +
    '</queryresult>'

  return excavate(wolframAlphaData)
    .then((json) => {
      const actual = !!json['queryresult']
      t.is(expected, actual)
    })
    .catch((error) => {
      t.fail(error)
    })
})
