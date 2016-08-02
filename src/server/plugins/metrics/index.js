import os from 'os'

function convertBytesToMegaBytes (bytes) {
  return Math.ceil(bytes / 1000000)
}

function convertUptimeToSeconds (uptime) {
  return Math.ceil(uptime)
}

function stringifySeconds (seconds) {
  return `${seconds}s`
}

function stringifyMilliseconds (ms) {
  return `${ms}ms`
}

function stringifyMegabytes (mb) {
  return `${mb}Mb`
}

function stringifyLoadAvg (avgs) {
  const cpuCount = os.cpus().length
  return avgs.map((avg) => `Load: ${avg}, CPUs: ${cpuCount}`)
}

module.exports.register = (server, options, next) => {
  server.route([
    {
      method: 'GET',
      path: '/healthcheck',
      config: {
        tags: ['api'],
        auth: false,
        handler (req, reply) {
          reply({ status: 'ok' })
        }
      }
    },

    {
      method: 'GET',
      path: '/metrics',
      config: {
        tags: ['api'],
        auth: { scope: ['metrics:read'] },
        handler (req, reply) {
          reply({
            upTime: stringifySeconds(convertUptimeToSeconds(process.uptime())),
            totalMem: stringifyMegabytes(convertBytesToMegaBytes(os.totalmem())),
            loadAvg: stringifyLoadAvg(os.loadavg()),
            serverLoad: {
              eventLoopDelay: stringifyMilliseconds(server.load.eventLoopDelay),
              heapUsed: stringifyMegabytes(convertBytesToMegaBytes(server.load.heapUsed)),
              memUsed: stringifyMegabytes(convertBytesToMegaBytes(server.load.rss))
            }
          })
        }
      }
    },

    {
      method: 'GET',
      path: '/metrics/uptime',
      config: {
        tags: ['api'],
        auth: { scope: ['metrics:read'] },
        handler (req, reply) {
          reply({ upTime: stringifySeconds(convertUptimeToSeconds(process.uptime())) })
        }
      }
    },

    {
      method: 'GET',
      path: '/metrics/totalmem',
      config: {
        tags: ['api'],
        auth: { scope: ['metrics:read'] },
        handler (req, reply) {
          reply({ totalMem: stringifyMegabytes(convertBytesToMegaBytes(os.totalmem())) })
        }
      }
    },

    {
      method: 'GET',
      path: '/metrics/loadavg',
      config: {
        tags: ['api'],
        auth: { scope: ['metrics:read'] },
        handler (req, reply) {
          reply({ loadAvg: stringifyLoadAvg(os.loadavg()) })
        }
      }
    },

    {
      method: 'GET',
      path: '/metrics/serverload',
      config: {
        tags: ['api'],
        auth: { scope: ['metrics:read'] },
        handler (req, reply) {
          reply({
            eventLoopDelay: stringifyMilliseconds(server.load.eventLoopDelay),
            heapUsed: stringifyMegabytes(convertBytesToMegaBytes(server.load.heapUsed)),
            memUsed: stringifyMegabytes(convertBytesToMegaBytes(server.load.rss))
          })
        }
      }
    },

    {
      method: 'GET',
      path: '/metrics/serverload/eventloopdelay',
      config: {
        tags: ['api'],
        auth: { scope: ['metrics:read'] },
        handler (req, reply) {
          reply({
            eventLoopDelay: stringifyMilliseconds(server.load.eventLoopDelay)
          })
        }
      }
    },

    {
      method: 'GET',
      path: '/metrics/serverload/heapused',
      config: {
        tags: ['api'],
        auth: { scope: ['metrics:read'] },
        handler (req, reply) {
          reply({
            heapUsed: stringifyMegabytes(convertBytesToMegaBytes(server.load.heapUsed))
          })
        }
      }
    },

    {
      method: 'GET',
      path: '/metrics/serverload/memused',
      config: {
        tags: ['api'],
        auth: { scope: ['metrics:read'] },
        handler (req, reply) {
          reply({
            memUsed: stringifyMegabytes(convertBytesToMegaBytes(server.load.rss))
          })
        }
      }
    }
  ])

  next()
}

module.exports.register.attributes = {
  name: 'metrics',
  version: '1.0.0'
}
