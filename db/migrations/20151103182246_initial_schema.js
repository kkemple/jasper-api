exports.up = function up (knex) {
  return knex.schema
    .createTable('users', function usersTable (table) {
      table.increments('id').primary()
      table.text('email').notNullable().unique()
      table.text('password').notNullable()
      table.boolean('active').defaultTo(true)
      table.text('stripe_id')
      table.jsonb('extra_data')
      table.timestamps()
    })
    .createTable('bots', function botsTable (table) {
      table.increments('id').primary()
      table.integer('user_id').notNullable().references('users.id')
      table.boolean('active').defaultTo(true)
      table.text('name')
      table.text('phone_number')
      table.jsonb('extra_data')
      table.timestamps()
    })
    .createTable('integrations', function integrationsTable (table) {
      table.increments('id').primary()
      table.integer('bot_id').notNullable().references('bots.id')
      table.text('type').notNullable()
      table.text('access_token').notNullable()
      table.integer('expires_in')
      table.text('refresh_token')
      table.boolean('active').defaultTo(true)
      table.jsonb('extra_data')
      table.timestamps()
    })
    .createTable('emails', function emailsTable (table) {
      table.increments('id').primary()
      table.integer('bot_id').notNullable().references('bots.id')
      table.boolean('active').defaultTo(true)
      table.text('email').notNullable()
      table.jsonb('extra_data')
      table.timestamps()
    })
    .createTable('phone_numbers', function phoneNumbersTable (table) {
      table.increments('id').primary()
      table.integer('bot_id').notNullable().references('bots.id')
      table.boolean('active').defaultTo(true)
      table.text('phone_number').notNullable()
      table.jsonb('extra_data')
      table.timestamps()
    })
}

exports.down = function down (knex) {
  return knex.schema
    .dropTable('phone_numbers')
    .dropTable('emails')
    .dropTable('integrations')
    .dropTable('bots')
    .dropTable('users')
}
