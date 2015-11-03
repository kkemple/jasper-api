
exports.seed = function(knex, Promise) {
  return Promise.join(
    // Deletes ALL existing entries
    knex('emails').del(), 

    // Inserts seed entries
    knex('emails').insert({id: 1, colName: 'rowValue'}),
    knex('emails').insert({id: 2, colName: 'rowValue2'}),
    knex('emails').insert({id: 3, colName: 'rowValue3'}),
  );
};
