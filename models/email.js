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

const Email = orm.Model.extend(config, virtuals)
orm.model('Email', Email)

export default Email
