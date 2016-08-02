import orm from '../db'

const config = {
  tableName: 'emails',

  hasTimestamps: true,

  initialize () {
    this.on('saving', this.validate)
  },

  validate () {},

  bot () {
    return this.belongsTo('Bot')
  },

  archive () {
    return this.save({ active: false }, { patch: true })
  }
}

const virtuals = {

}

const Email = orm.Model.extend(config, virtuals)
orm.model('Email', Email)

export default Email
