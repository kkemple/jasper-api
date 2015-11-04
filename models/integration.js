import orm from '../db'

const config = {
  tableName: 'integrations',

  hasTimestamps: true,

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

const Integration = orm.Model.extend(config, virtuals)
orm.model('Integration', Integration)

export default Integration
