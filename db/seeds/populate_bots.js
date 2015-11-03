
exports.seed = function(knex, Promise) {
  return Promise.join(
    // Deletes ALL existing entries
    knex('bots').del(),

    // Inserts seed entries
    knex('bots').insert({id: 1, colName: 'rowValue'}),
    knex('bots').insert({id: 2, colName: 'rowValue2'}),
    knex('bots').insert({id: 3, colName: 'rowValue3'}),
  );
};
