const Sequelize = require('sequelize');
const config = require('config');

const database = config.postgres.database;
const username = config.postgres.username;
const password = config.postgres.password;

const sequelize = new Sequelize(database, username, password, {
  host: config.postgres.host,
  dialect: config.postgres.dialect,
  pool: config.postgres.pool
});

module.exports = sequelize;
