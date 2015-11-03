exports.up = function(knex) {
  return knex.schema.
    createTable('users', function (t) {
      t.increments('id').primary()
      t.text('email').notNullable().unique()
      t.boolean('active').defaultTo(false)
      t.text('api_token')
      t.text('stripe_id')
      t.json('extra_data', true)
      t.timestamps()
    })
}

exports.down = function(knex) {
  return knex.schema.dropTable('users')
}
