import assign from 'lodash.assign'

import orm from '../db'

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
}

const virtuals = {
  profile(id) {
    return new this({ id: id })
      .fetch({ required: true, withRelated: ['integrations', 'emails'] })
      .then((bot) => assign(
        {},
        bot.toJSON(),
        {
          integrations: bot.related('integrations').pluck('type'),
          emails: bot.related('emails').pluck('email'),
        }
      ))
  },
}

const Bot = orm.Model.extend(config, virtuals)
orm.model('Bot', Bot)

export default Bot
