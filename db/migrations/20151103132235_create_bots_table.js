exports.up = function(knex) {
  return knex.schema.
    createTable('bots', function (t) {
      t.increments('id').primary()
      t.integer('user_id').notNullable()
      t.boolean('active').defaultTo(false)
      t.text('phone_number')
      t.json('extra_data', true)
      t.timestamps()
    })
}

exports.down = function(knex) {
  return knex.schema.dropTable('bots')
}
