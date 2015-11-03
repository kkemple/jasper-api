import db from '../db'

const config = {
  tableName: 'emails',

  initialize() {
    this.on('saving', this.validateSave)
  },

  validateSave() {},

  user() {
    return this.belongsTo('User')
  },

  bot() {
    return this.belongsTo('Bot')
  },
}

const virtuals = {

}

export default db.Model.extend(config, virtuals)
