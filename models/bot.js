import db from '../db'

const config = {
  tableName: 'bots',

  initialize() {
    this.on('saving', this.validateSave)
  },

  validateSave() {},

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

export default db.Model.extend(config, virtuals)
