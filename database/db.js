const Sequelize = require('sequelize');
// const sequelize = new Sequelize(`mysql://root:@localhost:3306/delilahdb`);

const sequelize = new Sequelize('delilahdb', 'root', '', {
	host: 'localhost',
	dialect: 'mysql',
});

module.exports = { sequelize };
