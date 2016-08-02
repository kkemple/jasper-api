import test from 'tape'

import metricsPlugin from './index'

test('[Unit] server/plugins/api/metrics/index.js', (t) => {
  t.equal(metricsPlugin.register instanceof Function, true, 'should return a function')
  t.deepEqual(metricsPlugin.register.attributes, {
    name: 'api.metrics',
    version: '1.0.0'
  }, 'should expose attributes')
  t.end()
})
