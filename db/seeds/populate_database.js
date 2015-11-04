exports.seed = function(knex, Promise) {
  return knex('integrations').del()
    .then(function() { return knex('emails').del(); })
    .then(function() { return knex('bots').del(); })
    .then(function() { return knex('users').del(); })
    .then(function() {
      return knex('users').insert({
        id: 1,
        email: 'skynet@releasable.io',
        password: '$2a$10$aSPMLUo7s/fzJzpcoGQ4ce4Twqp/7ljgkM.cAe5N/tXoE55m8qgzS',
      })
    })
    .then(function() {
      return knex('bots').insert({
        id: 1,
        user_id: 1,
        phone_number: '+15555555555',
      })
    })
    .then(function() {
      return knex('emails').insert({
        id: 1,
        bot_id: 1,
        email: 'skynet@releasable.io',
      })
    })
    .then(function() {
      return knex('integrations').insert({
        id: 1,
        bot_id: 1,
        type: 'test',
        access_token: 'access_token',
        expires_in: 1000,
        refresh_token: 'refresh_token',
      })
    })
}
