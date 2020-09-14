const { sequelize } = require('../configs/db');

async function createUser(req, res) {
	const { userName, fullName, email, phone, shippingAdress, password, es_admin } = await req.body;

	const response = await sequelize.query(
		'INSERT INTO users (userName, fullname, email, phone, shippingAdress, password, es_admin ) values (?,?,?,?,?,?,?)',
		{
			replacements: [userName, fullName, email, phone, shippingAdress, password, es_admin],
		}
	);
	res.status(201).json({ ok: true, data: req.body, message: 'User created successfully', DB_response: response });
}

module.exports = { createUser };
