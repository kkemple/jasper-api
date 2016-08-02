var timestamp = new Date()

exports.seed = function (knex, Promise) {
  return knex('integrations').del()
    .then(() => knex('phone_numbers').del())
    .then(() => knex('emails').del())
    .then(() => knex('bots').del())
    .then(() => knex('users').del())
    .then(() =>
      knex('users').insert({
        id: 1,
        email: 'bot@jasperdoes.xyz',
        password: '$2a$10$aSPMLUo7s/fzJzpcoGQ4ce4Twqp/7ljgkM.cAe5N/tXoE55m8qgzS',
        created_at: timestamp,
        updated_at: timestamp
      })
    )
    .then(() =>
      knex('bots').insert({
        id: 1,
        user_id: 1,
        name: 'test-bot',
        created_at: timestamp,
        updated_at: timestamp
      })
    )
    .then(() =>
      knex('emails').insert({
        id: 1,
        bot_id: 1,
        email: 'bot@jasperdoes.xyz',
        created_at: timestamp,
        updated_at: timestamp
      })
    )
    .then(() =>
      knex('phone_numbers').insert({
        id: 1,
        bot_id: 1,
        phone_number: '+15555555556',
        created_at: timestamp,
        updated_at: timestamp
      })
    )
    .then(() =>
      knex('integrations').insert({
        id: 1,
        bot_id: 1,
        type: 'test',
        access_token: 'access_token',
        expires_in: 1000,
        refresh_token: 'refresh_token',
        created_at: timestamp,
        updated_at: timestamp
      })
    )
}
