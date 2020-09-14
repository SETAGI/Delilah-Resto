const { sequelize } = require('../configs/db');

async function getAllProducts(req, res) {
	const response = await sequelize.query('SELECT * FROM products', { type: sequelize.QueryTypes.SELECT });

	res.status(200).json({ ok: true, message: 'Successful request', data: response });
}

module.exports = { getAllProducts };
