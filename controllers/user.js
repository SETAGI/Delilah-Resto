const { sequelize } = require('../configs/db');
const { key } = require('../configs/config');
const jwt = require('jsonwebtoken');

async function createUser(req, res) {
	try {
		let { userName, fullName, email, phone, shippingAdress, password, es_admin } = await req.body;

		if (!es_admin) es_admin = false;

		await sequelize.query(
			'INSERT INTO users (userName, fullname, email, phone, shippingAdress, password, es_admin ) values (?,?,?,?,?,?,?)',
			{
				replacements: [userName, fullName, email, phone, shippingAdress, password, es_admin],
			}
		);

		const response = await sequelize.query('SELECT * FROM users WHERE id_user=(SELECT max(id_user) FROM users)', {
			type: sequelize.QueryTypes.SELECT,
		});

		res.status(201).json({ ok: true, message: 'User created successfully', data: response });
	} catch (err) {
		console.error(err);
	}
}

async function jwtGeneration(req, res) {
	try {
		const userData = req.body;
		const token = jwt.sign(userData, key);

		return res.status(200).json({ ok: true, token: `Bearer ${token}`, message: 'Logged successfully' });
	} catch (err) {
		console.log(err);
	}
}

module.exports = { createUser, jwtGeneration };
