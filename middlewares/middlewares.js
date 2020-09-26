const { sequelize } = require('../database/db');
const { key } = require('../configs/config');
const jwt = require('jsonwebtoken');

async function dataValidation(req, res, next) {
	try {
		if (req.path == '/register') {
			const { username, full_name, email, phone, shipping_address, password } = await req.body;

			if (username && full_name && email && phone && shipping_address && password) {
				const response = await sequelize.query('SELECT users.email, users.username FROM users', {
					type: sequelize.QueryTypes.SELECT,
				});
				const userRepeated = response.find((user) => user.email == email || user.username == username);

				if (userRepeated !== undefined)
					return res.status(401).json({ ok: false, message: 'Error, Previously registered user' });
				else return next();
			} else return res.status(400).json({ ok: false, message: 'Error, missing data' });
		}

		if (req.path == '/products') {
			const { name, description, photo_url, price } = await req.body;

			if (name && description && photo_url && price) {
				const response = await sequelize.query('SELECT products.name, products.description FROM products', {
					type: sequelize.QueryTypes.SELECT,
				});
				const productRepeated = response.find((product) => product.name == name || product.description == description);

				if (productRepeated !== undefined)
					return res.status(401).json({ ok: false, message: 'Error, Previously registered product' });
				else return next();
			} else return res.status(400).json({ ok: false, message: 'Error, missing data' });
		}
	} catch (err) {
		console.error(err);
	}
}

async function userRegisterValidation(req, res, next) {
	try {
		const { username, password } = await req.body;
		const responseData = await sequelize.query('SELECT users.username, users.password FROM users', {
			type: sequelize.QueryTypes.SELECT,
		});
		const registered = responseData.find((user) => user.username == username && user.password == password);
		if (registered !== undefined) return next();
		else return res.status(400).json({ ok: false, message: 'Error, Incorrect credentials' });
	} catch (err) {
		console.error(err);
	}
}

async function jwtValidation(req, res, next) {
	try {
		if (req.path !== '/register' && req.path !== '/login') {
			const token = req.headers.authorization.split(' ')[1];
			const verifyToken = jwt.verify(token, key);

			if (verifyToken) {
				req.token = verifyToken;
				return next();
			}
		} else return next();
	} catch (err) {
		return res.status(401).json({ ok: false, message: 'Invalid Token' });
	}
}

async function adminValidation(req, res, next) {
	try {
		// This dataUser arrives from jwtValidation()
		const dataUser = req.token.username;

		const adminData = await sequelize.query('SELECT users.es_admin FROM users WHERE  username= ? ', {
			replacements: [dataUser],
			type: sequelize.QueryTypes.SELECT,
		});

		if (adminData[0].es_admin == 1) next();
		else return res.status(401).json({ ok: false, message: 'Error, only an admin user can do this' });
	} catch (err) {
		return res.status(401).json({ ok: false, message: 'Error, only an admin user can do this' });
	}
}

async function idValidation(req, res, next) {
	try {
		const product_id = await req.params.id;
		const response = await sequelize.query('SELECT product_id FROM products', {
			type: sequelize.QueryTypes.SELECT,
		});
		const exist = response.find((id) => id.product_id == product_id);
		if (exist) return next();
		else res.status(404).json({ ok: false, message: 'Error, not found' });
	} catch (err) {
		console.error(err);
	}
}

module.exports = { dataValidation, userRegisterValidation, jwtValidation, adminValidation, idValidation };
