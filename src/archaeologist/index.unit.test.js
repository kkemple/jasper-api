import test from 'tape'

import { excavate, find } from './index'
import { wolframAlphaData } from '../wolfram-alpha/fixtures'

test('Archeologist#find(path, json)', (assert) => {
  const expected = 'test'
  const actual = find('test', { test: 'test' })

  assert.equal(expected, actual, '')
  assert.end()
})

test('Archeologist#excavate(xml)', (t) => {
  t.test('should return a promise', (assert) => {
    const expected = true
    const actual = excavate() instanceof Promise

    assert.equal(expected, actual, 'return value of excavate() is a promise')
    assert.end()
  })

  t.test('should resolve with parsed json', (assert) => {
    const expected = true

    excavate(wolframAlphaData)
      .then((json) => {
        const actual = !!json['queryresult']
        assert.equal(expected, actual, 'xml properly converted to JSON')
        assert.end()
      })
      .catch((error) => {
        assert.fail(error)
        assert.end()
      })
  })
})
