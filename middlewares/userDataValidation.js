const { sequelize } = require('../configs/db');

async function dataValidation(req, res, next) {
	const { userName, fullName, email, phone, shippingAdress, password, es_admin } = await req.body;

	const response = await sequelize.query('SELECT users.email, users.userName FROM users', {
		type: sequelize.QueryTypes.SELECT,
	});

	const userRepeated = response.find((user) => user.email == req.body.email || user.userName == req.body.userName);

	if (userRepeated !== undefined)
		return res.status(401).json({ ok: false, message: 'Error, Previously registered user' });
	else if (userName && fullName && email && phone && shippingAdress && password && es_admin) return next();
	else return res.status(400).json({ ok: false, message: 'Error, missing data' });
}

module.exports = { dataValidation };
