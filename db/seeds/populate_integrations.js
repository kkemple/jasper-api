
exports.seed = function(knex, Promise) {
  return Promise.join(
    // Deletes ALL existing entries
    knex('integrations').del(), 

    // Inserts seed entries
    knex('integrations').insert({id: 1, colName: 'rowValue'}),
    knex('integrations').insert({id: 2, colName: 'rowValue2'}),
    knex('integrations').insert({id: 3, colName: 'rowValue3'}),
  );
};
