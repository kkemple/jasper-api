import orm from '../db'

const config = {
  tableName: 'phone_numbers',

  hasTimestamps: true,

  initialize() {
    this.on('saving', this.validate)
  },

  validate() {},

  bot() {
    return this.belongsTo('Bot')
  },

  archive() {
    return this.save({ active: false }, { patch: true })
  },
}

const virtuals = {

}

const PhoneNumber = orm.Model.extend(config, virtuals)
orm.model('PhoneNumber', PhoneNumber)

export default PhoneNumber
