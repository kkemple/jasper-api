import chai from 'chai'
import nock from 'nock'

import jasper from '../../../jasper'

chai.should()

const wolframSuccessResponse = '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<queryresult success="false"></queryresult>'

describe('jasper', () => {
  after(() => {
    nock.cleanAll()
  })

  it('should be a function', () => {
    jasper.should.be.a('function')
  })

  it('should return a Promise', () => {
    nock('https://api.api.ai')
      .post('/v1/query')
      .reply(200, {
        result: {
          speech: 'test',
          action: 'smalltalk.greetings',
          parameters: {}
        }
      })

    nock('http://api.wolframalpha.com')
      .get('/v2/query')
      .query(true)
      .reply(200, wolframSuccessResponse)

    jasper('test').should.be.instanceOf(Promise)
  })

  describe('when called with an understood command', () => {
    it('should return a response object', (done) => {
      nock('https://api.api.ai')
        .post('/v1/query')
        .reply(200, {
          result: {
            speech: 'test',
            action: 'smalltalk.greetings',
            parameters: {}
          }
        })

      nock('http://api.wolframalpha.com')
        .get('/v2/query')
        .query(true)
        .reply(200, wolframSuccessResponse)

      jasper('hey there')
        .then((config) => {
          config.should.be.an('object')
          config.speech.should.be.a('string')
          done()
        })
        .catch(done)
    })
  })

  describe('when called with an unknown command', () => {
    it('should return a CommanderActionNotFoundError', (done) => {
      nock('https://api.api.ai')
        .post('/v1/query')
        .reply(200, {
          result: {
            speech: 'test',
            action: 'unknown.command',
            parameters: {},
            resolvedQuery: 'this is my command'
          }
        })

      nock('http://api.wolframalpha.com')
        .get('/v2/query')
        .query(true)
        .reply(200, wolframSuccessResponse)

      jasper('hey there')
        .catch((err) => {
          err.name.should.eq('CommanderActionNotFoundError')
          done()
        })
    })
  })
})
