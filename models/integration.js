import orm from '../db'

const config = {
  tableName: 'integrations',

  initialize() {
    this.on('saving', this.validateSave)
  },

  validateSave() {},

  bot() {
    return this.belongsTo('Bot')
  },
}

const virtuals = {

}

export default orm.Model.extend(config, virtuals)
