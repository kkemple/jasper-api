
exports.up = function (knex) {
  return knex.schema
    .createTable('tokens', function tokensTable (table) {
      table.increments('id').primary()
      table.integer('user_id').notNullable().references('users.id')
      table.text('cuid')
      table.dateTime('last_updated').defaultTo(knex.fn.now())
      table.timestamps()
    })
    .table('bots', function dropColumn (table) {
      table.dropColumn('phone_number')
    })
}

exports.down = function (knex) {
  return knex.schema
    .dropTable('tokens')
    .table('bots', function restore (table) {
      table.text('phone_number')
    })
}
