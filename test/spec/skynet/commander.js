import chai from 'chai'


import Commander from '../../../jasper/commander'

chai.should()

describe('jasper', () => {
  describe('Commander', () => {
    describe('#constructor', () => {
      it('should process api.ai response', () => {
        const response = {
          action: 'smalltalk.greetings',
          speech: 'test',
          params: {},
          resolvedQuery: 'this is my command'
        }

        const commander = new Commander(response)
        commander.commandPath.should.eql(['smalltalk', 'greetings'])
        commander.speech.should.eq('test')
        commander.params.should.eql({})
        commander.resolvedQuery.should.eq('this is my command')
      })
    })

    describe('#execute', () => {
      describe('when an action is found in domains', () => {
        it('should return a Promise', (done) => {
          const response = {
            action: 'smalltalk.greetings',
            speech: 'test',
            params: {},
            resolvedQuery: 'this is my command'
          }

          const domains = {
            smalltalk: {
              greetings (speech, params, resolvedQuery) {
                return Promise.resolve({ speech, params, resolvedQuery })
              }
            }
          }

          const commander = new Commander(response)
          commander.execute(domains)
            .then((config) => {
              config.speech.should.eq(response.speech)
              config.params.should.eq(response.params)
              config.resolvedQuery.should.eq(response.resolvedQuery)
              done()
            })
        })
      })

      describe('when an action is not found in domains', () => {
        it('should return a CommanderActionNotFoundError', (done) => {
          const response = {
            action: 'unknown.action',
            speech: 'test',
            params: {},
            resolvedQuery: 'this is my command'
          }

          const domains = {
            smalltalk: {
              greetings (speech, params, resolvedQuery) {
                return Promise.resolve({ speech, params, resolvedQuery })
              }
            }
          }

          const commander = new Commander(response)
          commander.execute(domains)
            .catch((err) => {
              err.name.should.eq('CommanderActionNotFoundError')
              done()
            })
        })
      })
    })
  })
})
