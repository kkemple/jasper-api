
exports.up = function(knex, Promise) {
  return knex.schema.
    createTable('users', function (t) {
      t.increments('id').primary()
      t.text('email').notNullable().unique()
      t.text('password').notNullable()
      t.boolean('active').defaultTo(true)
      t.text('stripe_id')
      t.json('extra_data', true)
      t.timestamps()
    })
    .createTable('bots', function (t) {
      t.increments('id').primary()
      t.integer('user_id').notNullable().references('users.id')
      t.boolean('active').defaultTo(true)
      t.text('name')
      t.text('phone_number')
      t.json('extra_data', true)
      t.timestamps()
    })
    .createTable('integrations', function (t) {
      t.increments('id').primary()
      t.integer('bot_id').notNullable().references('bots.id')
      t.text('type').notNullable()
      t.text('access_token').notNullable()
      t.integer('expires_in')
      t.text('refresh_token')
      t.boolean('active').defaultsTo(true)
      t.json('extra_data', true)
      t.timestamps()
    })
    .createTable('emails', function (t) {
      t.increments('id').primary()
      t.integer('bot_id').notNullable().references('bots.id')
      t.boolean('active').defaultTo(true)
      t.text('email').notNullable()
      t.json('extra_data', true)
      t.timestamps()
    })
};

exports.down = function(knex, Promise) {
  return knex.schema
    .dropTable('emails')
    .dropTable('integrations')
    .dropTable('bots')
    .dropTable('users')
};
