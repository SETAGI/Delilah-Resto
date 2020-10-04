const { sequelize } = require('../database/db');
const { key } = require('../configs/config');
const jwt = require('jsonwebtoken');

async function createUser(req, res) {
	try {
		let { username, full_name, email, phone, shipping_address, password, es_admin } = await req.body;

		if (!es_admin) es_admin = false;

		await sequelize.query(
			'INSERT INTO users (username, full_name, email, phone, shipping_address, password, es_admin ) values (?,?,?,?,?,?,?)',
			{
				replacements: [username, full_name, email, phone, shipping_address, password, es_admin],
			}
		);

		const response = await sequelize.query('SELECT * FROM users WHERE user_id=(SELECT max(user_id) FROM users)', {
			type: sequelize.QueryTypes.SELECT,
		});

		res.status(201).json({ ok: true, message: 'User created successfully', data: response[0] });
	} catch (err) {
		console.error(err);
	}
}

async function jwtGeneration(req, res) {
	/* eliminar los try catch de donde no se necesitan  */
	try {
		const userData = req.body;
		const token = jwt.sign(userData, key);

		return res.status(200).json({ ok: true, token: token, message: 'Logged successfully' });
	} catch (err) {
		console.log(err);
	}
}

async function getAllUsers(req, res) {
	const response = await sequelize.query('SELECT * FROM users', { type: sequelize.QueryTypes.SELECT });

	res.status(200).json({ ok: true, message: 'Successful request', data: response });
}

async function getUser(req, res) {
	try {
		let user_id = await req.params.id;

		const response = await sequelize.query('SELECT * FROM users WHERE user_id = ?', {
			replacements: [user_id],
			type: sequelize.QueryTypes.SELECT,
		});

		res.status(200).json({ ok: true, message: 'Successful request', data: response[0] });
	} catch (err) {
		console.error(err);
	}
}

async function editUser(req, res) {
	try {
		let user_id = await req.params.id;
		const { username, full_name, email, phone, shipping_address, password, es_admin } = await req.body;

		const response = await sequelize.query('SELECT * FROM users WHERE user_id = ?', {
			replacements: [user_id],
			type: sequelize.QueryTypes.SELECT,
		});

		if (username || full_name || email || phone || shipping_address || password || es_admin) {
			Object.assign(response[0], req.body);
			const { username, full_name, email, phone, shipping_address, password, es_admin } = response[0];

			await sequelize.query(
				'UPDATE users SET username = ?, full_name = ?, email = ?, phone = ?, shipping_address = ?, password = ?, es_admin = ? WHERE user_id = ?',
				{ replacements: [username, full_name, email, phone, shipping_address, password, es_admin, user_id] }
			);
			res.status(200).json({ ok: true, message: 'Successful request', data: response[0] });
		} else res.status(400).json({ ok: false, message: 'Error, missing data' });
	} catch (err) {
		console.error(err);
	}
}

async function deleteUser(req, res) {
	try {
		const user_id = await req.params.id;
		await sequelize.query('DELETE FROM users WHERE user_id = ?', { replacements: [user_id] });
		res.status(200).json({ ok: true, message: 'User deleted' });
	} catch (err) {
		console.error(err);
	}
}

module.exports = { createUser, jwtGeneration, getAllUsers, getUser, editUser, deleteUser };
