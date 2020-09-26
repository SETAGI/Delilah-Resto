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

module.exports = { getAllProducts, createProduct, getProduct };
