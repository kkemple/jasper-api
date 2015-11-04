import orm from '../db'

const config = {
  tableName: 'emails',

  initialize() {
    this.on('saving', this.validate)
  },

  validate() {},

  bot() {
    return this.belongsTo('Bot')
  },
}

const virtuals = {

}

export default orm.Model.extend(config, virtuals)
