exports.up = function(knex) {
  return knex.schema.
    createTable('integrations', function (t) {
      t.increments('id').primary()
      t.integer('user_id').notNullable()
      t.text('type').notNullable()
      t.text('access_token').notNullable()
      t.integer('expires_in')
      t.text('refresh_token')
      t.boolean('active').defaultsTo(true)
      t.json('extra_data', true)
      t.timestamps()
    })
}

exports.down = function(knex) {
  return knex.schema.dropTable('integrations')
}
