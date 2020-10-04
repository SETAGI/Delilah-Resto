const { sequelize } = require('../database/db');

async function getAllProducts(req, res) {
	const response = await sequelize.query('SELECT * FROM products', { type: sequelize.QueryTypes.SELECT });

	res.status(200).json({ ok: true, message: 'Successful request', data: response });
}

async function createProduct(req, res) {
	try {
		let { name, description, photo_url, price, available } = req.body;

		if (available == null) available = true;

		await sequelize.query('INSERT INTO products (name, description,  photo_url, price, available) values (?,?,?,?,?)', {
			replacements: [name, description, photo_url, price, available],
		});

		const response = await sequelize.query(
			'SELECT * FROM products WHERE product_id=(SELECT max(product_id) FROM products)',
			{
				type: sequelize.QueryTypes.SELECT,
			}
		);

		res.status(201).json({ ok: true, message: 'Product created successfully', data: response[0] });
	} catch (err) {
		/* modificar esto en todas las funciones */
		console.error(err);
	}
}

async function getProduct(req, res) {
	try {
		let product_id = await req.params.id;

		const response = await sequelize.query('SELECT * FROM products WHERE product_id = ?', {
			replacements: [product_id],
			type: sequelize.QueryTypes.SELECT,
		});

		res.status(200).json({ ok: true, message: 'Successful request', data: response[0] });
	} catch (err) {
		console.error(err);
	}
}

async function editProduct(req, res) {
	try {
		const product_id = await req.params.id;
		const { name, description, photo_url, price, available } = await req.body;

		const response = await sequelize.query('SELECT * FROM products WHERE product_id = ?', {
			replacements: [product_id],
			type: sequelize.QueryTypes.SELECT,
		});

		if (name || description || photo_url || price || available) {
			Object.assign(response[0], req.body);
			const { name, description, photo_url, price, available } = response[0];

			await sequelize.query(
				'UPDATE products SET name = ?, description = ?, photo_url = ?, price = ?, available = ? WHERE product_id = ?',
				{ replacements: [name, description, photo_url, price, available, product_id] }
			);
			res.status(200).json({ ok: true, message: 'Successful change', data: response[0] });
		} else res.status(400).json({ ok: false, message: 'Error, missing data' });
	} catch (err) {
		console.error(err);
	}
}

async function deleteProduct(req, res) {
	try {
		const product_id = await req.params.id;
		await sequelize.query('DELETE FROM products WHERE product_id = ?', { replacements: [product_id] });
		res.status(200).json({ ok: true, message: 'Product deleted' });
	} catch (err) {
		console.error(err);
	}
}

module.exports = { getAllProducts, createProduct, getProduct, editProduct, deleteProduct };
