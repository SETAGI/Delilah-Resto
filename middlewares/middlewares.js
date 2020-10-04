const { sequelize } = require('../database/db');
const { key } = require('../configs/config');
const jwt = require('jsonwebtoken');

async function dataValidate(req, res, next) {
	try {
		if (req.path == '/register') {
			console.log(req.body);
			const { username, full_name, email, phone, shipping_address, password } = await req.body;

			if (username && full_name && email && phone && shipping_address && password) {
				const response = await sequelize.query('SELECT users.email, users.username FROM users', {
					type: sequelize.QueryTypes.SELECT,
				});
				const userRepeated = response.find((user) => user.email == email || user.username == username);

				if (userRepeated !== undefined) throw new Error('Error, Previously registered user');
				else return next();
			} else throw new Error('Error, missing data');
		}

		if (req.path == '/products') {
			const { name, description, photo_url, price } = await req.body;

			if (name && description && photo_url && price) {
				const response = await sequelize.query('SELECT products.name, products.description FROM products', {
					type: sequelize.QueryTypes.SELECT,
				});
				const productRepeated = response.find((product) => product.name == name || product.description == description);

				if (productRepeated !== undefined) throw new Error('Error, Previously registered product');
				else return next();
			} else throw new Error('Error, missing data');
		}
	} catch (e) {
		if (e.message === 'Error, missing data') return res.status(400).json({ ok: false, message: e.message });
		else return res.status(401).json({ ok: false, message: e.message });
	}
}

async function userRegisterValidate(req, res, next) {
	try {
		const { username, password } = await req.body;
		const responseData = await sequelize.query('SELECT users.username, users.password FROM users', {
			type: sequelize.QueryTypes.SELECT,
		});
		const registered = responseData.find((user) => user.username == username && user.password == password);
		if (registered !== undefined) return next();
		else throw new Error('Error, Incorrect credentials');
	} catch (e) {
		return res.status(401).json({ ok: false, message: e.message });
	}
}

async function jwtValidate(req, res, next) {
	try {
		if (req.path !== '/register' && req.path !== '/login') {
			const token = req.headers.authorization.split(' ')[1];
			const verifyToken = jwt.verify(token, key);

			if (verifyToken) {
				req.token = verifyToken;
				return next();
			}
		} else return next();
	} catch (e) {
		return res.status(401).json({ ok: false, message: 'Error, Invalid Token' });
	}
}

async function adminValidate(req, res, next) {
	try {
		/* This dataUser arrives from jwtValidation() */
		const dataUser = req.token.username;

		const adminData = await sequelize.query('SELECT users.es_admin FROM users WHERE  username= ? ', {
			replacements: [dataUser],
			type: sequelize.QueryTypes.SELECT,
		});
		if (adminData[0].es_admin == 1) next();
		else throw new Error('Error, only an admin user can do this');
	} catch (e) {
		return res.status(403).json({ ok: false, message: e.message });
	}
}

async function idProductValidate(req, res, next) {
	try {
		const product_id = await req.params.id;
		const response = await sequelize.query('SELECT product_id FROM products', {
			type: sequelize.QueryTypes.SELECT,
		});
		const exist = response.find((id) => id.product_id == product_id);
		if (exist) return next();
		else throw new Error('Error, not found');
	} catch (e) {
		return res.status(404).json({ ok: false, message: e.message });
	}
}

async function idUserValidate(req, res, next) {
	try {
		const user_id = await req.params.id;
		const response = await sequelize.query('SELECT user_id FROM users', {
			type: sequelize.QueryTypes.SELECT,
		});
		const exist = response.find((id) => id.user_id == user_id);
		if (exist) return next();
		else throw new Error('Error, not found');
	} catch (e) {
		return res.status(404).json({ ok: false, message: e.message });
	}
}

/* Hacer todo con este modelo de error */
async function dataOrderValidate(req, res, next) {
	try {
		const { payment_method, info_order } = req.body;

		if (payment_method && info_order) {
			if (payment_method == 'cash' || payment_method == 'card') {
				info_order.forEach((order) => {
					if (!order.product_id || !order.quantity) throw new Error('missing_data');
				});
				return next();
			} else throw new Error('invalid');
		} else throw new Error('missing_data');
	} catch (e) {
		if (e.message === 'missing_data') return res.status(400).json({ ok: false, message: 'Error, missing data' });
		else return res.status(403).json({ ok: false, message: 'Error, invalid payment method' });
	}
}

async function orderStatusValidate(req, res, next) {
	try {
		const { status } = req.body;

		if (status) {
			if (
				status == 'confirmed' ||
				status == 'preparing' ||
				status == 'preparing' ||
				status == 'sending' ||
				status == 'cancelled' ||
				status == 'delivered' ||
				status == 'new'
			)
				next();
			else throw new Error('Input invalid');
		} else throw new Error('Input invalid');
	} catch (e) {
		res.status(404).json({ ok: false, message: e.message });
	}
}

/* PILAS PONER EL ERROR GENERAL CON UN MENSAJE GENERAL */

module.exports = {
	dataValidate,
	userRegisterValidate,
	jwtValidate,
	adminValidate,
	idProductValidate,
	idUserValidate,
	dataOrderValidate,
	orderStatusValidate,
};
