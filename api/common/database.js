const { Sequelize } = require('sequelize');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: '/api/storage/data.db'
});
module.exports = sequelize;