const { sequelize } = require('../configs/db');
const { key } = require('../configs/config');
const jwt = require('jsonwebtoken');

async function dataValidation(req, res, next) {
	try {
		const { userName, fullName, email, phone, shippingAdress, password } = await req.body;

		if (userName && fullName && email && phone && shippingAdress && password) {
			const response = await sequelize.query('SELECT users.email, users.userName FROM users', {
				type: sequelize.QueryTypes.SELECT,
			});
			const userRepeated = response.find((user) => user.email == email || user.userName == userName);

			if (userRepeated !== undefined)
				return res.status(401).json({ ok: false, message: 'Error, Previously registered user' });
			else return next();
		} else return res.status(400).json({ ok: false, message: 'Error, missing data' });
	} catch (err) {
		console.error(err);
	}
}

async function userRegisterValidation(req, res, next) {
	try {
		const { userName, password } = await req.body;
		const responseData = await sequelize.query('SELECT users.userName, users.password FROM users', {
			type: sequelize.QueryTypes.SELECT,
		});
		const registered = responseData.find((user) => user.userName == userName && user.password == password);
		if (registered !== undefined) return next();
		else return res.status(400).json({ ok: false, message: 'Error, Incorrect credentials' });
	} catch (err) {
		console.error(err);
	}
}

async function jwtValidation(req, res, next) {
	try {
		if (!req.body.userName) {
			const token = req.headers.authorization.split(' ')[1];
			const verifyToken = jwt.verify(token, key);

			if (verifyToken) {
				req.token = verifyToken;
				return next();
			}
		} else return next();
	} catch (err) {
		console.error(err);
		return res.status(401).json({ ok: false, message: 'Token inválido' });
	}
}

async function adminValidation(req, res, next) {
	// This dataUser arrives from jwtValidation()
	try {
		const dataUser = req.token.userName;

		const adminData = await sequelize.query('SELECT users.es_admin FROM users WHERE  userName= ? ', {
			replacements: [dataUser],
			type: sequelize.QueryTypes.SELECT,
		});

		if (adminData[0].es_admin == 1) next();
		else return res.status(401).json({ ok: false, message: 'Error, only an admin user can add products' });
	} catch (err) {
		return res.status(401).json({ ok: false, message: 'Error, only an admin user can add products' });
	}
}

module.exports = { dataValidation, userRegisterValidation, jwtValidation, adminValidation };
