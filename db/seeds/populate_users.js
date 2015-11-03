
exports.seed = function(knex, Promise) {
  return Promise.join(
    // Deletes ALL existing entries
    knex('users').del(), 

    // Inserts seed entries
    knex('users').insert({id: 1, colName: 'rowValue'}),
    knex('users').insert({id: 2, colName: 'rowValue2'}),
    knex('users').insert({id: 3, colName: 'rowValue3'}),
  );
};
