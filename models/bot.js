import orm from '../db'

const config = {
  tableName: 'bots',

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

}

const Bot = orm.Model.extend(config, virtuals)
orm.model('Bot', Bot)

export default Bot
