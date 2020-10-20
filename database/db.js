const Sequelize = require('sequelize');
// const sequelize = new Sequelize(`mysql://root:@localhost:3306/delilahdb`);

const sequelize = new Sequelize('heroku_a063db398612875', 'b7e1f18868983b', '6f0588fb', {
	host: 'us-cdbr-east-02.cleardb.com',
	dialect: 'mysql',
});

//b7e1f18868983b:6f0588fb@us-cdbr-east-02.cleardb.com/heroku_a063db398612875?reconnect=true'

mysql: module.exports = { sequelize };
