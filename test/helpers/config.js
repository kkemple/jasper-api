import assign from 'lodash.assign'

export const integrationConfig = (props = {}) => {
  return assign({}, {
    bot_id: 1,
    type: 'test',
    access_token: 'access_token',
    expires_in: 1000,
    refresh_token: 'refresh_token'
  }, props)
}

export const emailConfig = (props = {}) => {
  return assign({}, {
    bot_id: 1,
    email: 'jasper@releasable.io'
  }, props)
}

export const phoneNumberConfig = (props = {}) => {
  return assign({}, {
    bot_id: 1,
    phone_number: '+15555555555'
  }, props)
}
