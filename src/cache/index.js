import redis from 'redis'

const cache = {}

const defaultHost = 'localhost'
const defaultPort = 6379

class Cache {
  constructor (cacheName, opts) {
    this.prefix = `${cacheName}:`
    this.client = redis.createClient(opts.host || defaultHost, opts.port || defaultPort)
    if (opts.password) this.client.auth(opts.password)
  }

  connect () {
    return new Promise((resolve, reject) => {
      this.client.on('connect', resolve)
      this.client.on('error', reject)
    })
  }

  get (key) {
    return new Promise((resolve, reject) => {
      this.client.get(`${this.prefix}${key}`, (error, value) => {
        if (error) {
          reject(error)
          return
        }

        return (value) ? JSON.parse(value) : value
      })
    })
  }

  set (key, value) {
    return new Promise((resolve, reject) => {
      const json = (value.toJSON) ? value.toJSON() : JSON.stringify(value)

      this.client.set(`${this.prefix}${key}`, json, (error) => {
        if (error) {
          reject(error)
          return
        }

        resolve()
      })
    })
  }
}

export default (cacheName, opts = {}) => new Promise((resolve, reject) => {
  if (!cache[cacheName]) {
    let newCache

    cache[cacheName] = newCache = new Cache(cacheName, opts)

    newCache.connect()
      .then(() => resolve(newCache))
      .catch((error) => reject(error))
  } else {
    resolve(cache[cacheName])
  }
})
