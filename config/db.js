const { db } = require('./index');
const knex = require('knex');
const mysql = knex({
  client: 'mysql',
  connection: {
    ...db,
  },
  pool: { min: 0, max: 10 },
});

const sqlite = knex({
  client: 'sqlite',
  connection: {
    filename: './ecommerce/chat.sqlite'
  },
  useNullAsDefault: false
});

module.exports ={ mysql, sqlite};
