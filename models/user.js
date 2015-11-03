import db from '../db'

const config = {
  tableName: 'users',

  initialize() {
    this.on('saving', this.validateSave)
  },

  validateSave() {},

  bots() {
    return this.hasMany('Bot')
  },

  integrations() {
    return this.hasMany('Integration')
  },

  emails() {
    return this.hasMany('Email')
  },
}

const virtuals = {

}

export default db.Model.extend(config, virtuals)
