import Promise from 'bluebird'
import redis from 'redis'

Promise.promisifyAll(redis.RedisClient.prototype)

const cache = {}

const defaultHost = 'localhost'
const defaultPort = 6379

class Cache {
  constructor(cacheName, opts) {
    this.prefix = `${cacheName}:`
    this.client = redis.createClient(opts.host || defaultHost, opts.port || defaultPort)
    if (opts.password) this.client.auth(opts.password)
  }

  connect() {
    return new Promise((res, rej) => {
      this.client.on('connect', res)
      this.client.on('error', rej)
    })
  }

  get(key) {
    return new Promise((res, rej) => {
      this.client.getAsync(`${this.prefix}${key}`)
        .then((value) => (value) ? JSON.parse(value) : value)
        .catch((err) => rej(err))
    })
  }

  set(key, value) {
    const json = (value.toJSON) ? value.toJSON() : JSON.stringify(value)
    return this.client.setAsync(`${this.prefix}${key}`, json)
  }
}

export default (cacheName, opts = {}) => new Promise((res, rej) => {
  if (!cache[cacheName]) {
    let newCache
    cache[cacheName] = newCache = new Cache(cacheName, opts)
    newCache.connect()
      .then(() => res(newCache))
      .catch((err) => rej(err))
  } else {
    res(cache[cacheName])
  }
})
