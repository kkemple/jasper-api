import assign from 'lodash.assign'
import Promise from 'bluebird'

import orm from '../db'

const destroyDependencies = (model) => {
  const emails = model.emails()
  const phoneNumbers = model.phoneNumbers()
  const integrations = model.integrations()

  return Promise.all([
    emails.fetch(),
    phoneNumbers.fetch(),
    integrations.fetch(),
  ])
  .then(() => Promise.all([
    emails.invokeThen('destroy'),
    phoneNumbers.invokeThen('destroy'),
    integrations.invokeThen('destroy'),
  ]))
}

const buildProfile = (bot, integrations, emails, phoneNumbers) => {
  return assign(
    {},
    bot.toJSON(),
    {
      integrations: integrations.pluck('type'),
      emails: emails.pluck('email'),
      phone_numbers: phoneNumbers.pluck('phone_number'),
    }
  )
}

const config = {
  tableName: 'bots',

  hasTimestamps: true,

  initialize() {
    this.on('destroying', destroyDependencies)
    this.on('saving', this.validate)
  },

  validate() {},

  user() {
    return this.belongsTo('User')
  },

  emails() {
    return this.hasMany('Email')
  },

  phoneNumbers() {
    return this.hasMany('PhoneNumber')
  },

  integrations() {
    return this.hasMany('Integration')
  },

  profile() {
    return new Promise((res, rej) => {
      const integrations = this.integrations()
      const emails = this.emails()
      const phoneNumbers = this.phoneNumbers()

      Promise.all([integrations.fetch(), emails.fetch(), phoneNumbers.fetch()])
        .then(() => buildProfile(this, integrations, emails, phoneNumbers))
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
}

const Bot = orm.Model.extend(config, virtuals)
orm.model('Bot', Bot)

export default Bot
