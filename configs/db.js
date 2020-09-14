const Sequelize = require('sequelize');
const sequelize = new Sequelize('mysql://root:@localhost:3306/delilahDB');

module.exports = { sequelize };
