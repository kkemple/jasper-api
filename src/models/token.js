import orm from '../db'

const config = {
  tableName: 'tokens',

  hasTimestamps: true,

  initialize () {
    this.on('saving', this.validate)
  },

  validate () {},

  isExpired () {
    const today = new Date()
    const thirtyDays = new Date().setDate(today.getDate() - 30)

    return this.get('last_updated') < thirtyDays
  },

  user () {
    return this.belongsTo('User').query({ where: { active: true } })
  },

  archive () {
    return this.save({ active: false }, { patch: true })
  }
}

const virtuals = {

}

const Token = orm.Model.extend(config, virtuals)
orm.model('Token', Token)

export default Token
