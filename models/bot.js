import assign from 'lodash.assign'
import Promise from 'bluebird'

import orm from '../db'

const buildProfile = (bot, integrations, emails) => {
  return assign(
    {},
    bot.toJSON(),
    {
      integrations: integrations.pluck('type'),
      emails: emails.pluck('email'),
    }
  )
}

const config = {
  tableName: 'bots',

  hasTimestamps: true,

  initialize() {
    this.on('saving', this.validate)
  },

  validate() {},

  user() {
    return this.belongsTo('User')
  },

  emails() {
    return this.hasMany('Email')
  },

  integrations() {
    return this.hasMany('Integration')
  },

  profile() {
    return new Promise((res, rej) => {
      const integrations = this.integrations()
      const emails = this.emails()

      Promise.all([integrations.fetch(), emails.fetch()])
        .then(() => buildProfile(this, integrations, emails))
        .then((bot) => res(bot))
        .catch((err) => rej(err))
    })
  },
}

const virtuals = {
  profile(id) {
    return new this({ id: id })
      .fetch({ require: true })
      .then((bot) => bot.profile())
  },

  getByPhoneNumber(number) {
    return new this({ phone_number: number }).fetch({ require: true })
  },
}

const Bot = orm.Model.extend(config, virtuals)
orm.model('Bot', Bot)

export default Bot
