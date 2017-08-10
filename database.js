// Sequelize
const Sequelize = require('sequelize');
const sequelize = new Sequelize('sqlite://database.db');

sequelize.sync()
  .then(() => {console.log("Database ready");});

module.exports = sequelize;