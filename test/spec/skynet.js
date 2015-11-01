import chai from 'chai'

import skynet from '../../skynet'

chai.should()

describe('Skynet', () => {
  it('should be a function', () => {
    skynet.should.be.a('function')
  })
})
