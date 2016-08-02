
exports.up = function (knex) {
  return knex.schema
    .table('tokens', function dropColumn (table) {
      table.boolean('active').defaultTo(true)
    })
}

exports.down = function (knex) {
  return knex.schema
    .table('tokens', function dropColumn (table) {
      table.dropColumn('active')
    })
}
