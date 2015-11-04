import assign from 'lodash.assign'

export const userConfig = (props = {}) => {
  return assign({}, {
    email: 'skynet@releasable.io',
    password: 'skynet',
  }, props)
}

export const botConfig = (props = {}) => {
  return assign({}, {
    user_id: 1,
    name: 'test-bot',
    phone_number: '+15555555555',
  }, props)
}

export const integrationConfig = (props = {}) => {
  return assign({}, {
    bot_id: 1,
    type: 'test',
    access_token: 'access_token',
    expires_in: 1000,
    refresh_token: 'refresh_token',
  }, props)
}

export const emailConfig = (props = {}) => {
  return assign({}, {
    bot_id: 1,
    email: 'skynet@releasable.io',
  }, props)
}
