const express = require('express');
const router = express.Router();

const { middle } = require('../middlewares');
const { usersController, productsController, ordersController } = require('../controllers');

/* Any user */
router.post('/register', middle.dataValidate, usersController.createUser); /* Checked */
router.post('/login', middle.userRegisterValidate, usersController.jwtGeneration); /* Checked */
router.get('/products', productsController.getAllProducts); /* Checked */
router.get('/products/:id', middle.idProductValidate, productsController.getProduct); /* Checked */
router.post('/orders', middle.dataOrderValidate, ordersController.createOrder); /* new rout */

/* Only Admin user */
router.post('/products', middle.dataValidate, middle.adminValidate, productsController.createProduct);
router.put('/products/:id', middle.idProductValidate, middle.adminValidate, productsController.editProduct);
router.delete('/products/:id', middle.idProductValidate, middle.adminValidate, productsController.deleteProduct);
router.get('/users', middle.adminValidate, usersController.getAllUsers); /* Checked */
router.get('/users/:id', middle.idUserValidate, middle.adminValidate, usersController.getUser);
router.put('/users/:id', middle.idUserValidate, middle.adminValidate, usersController.editUser);
router.delete('/users/:id', middle.idUserValidate, middle.adminValidate, usersController.deleteUser);
/* All Checked */

router.get('/orders', middle.adminValidate, ordersController.getAllOrders); /* New rout */
router.get('/orders/:id', ordersController.getOrder); /* New rout */
router.put('/orders/:id', middle.adminValidate, middle.orderStatusValidate, ordersController.editOrder); /* New rout */
router.delete('/orders/:id', middle.adminValidate, ordersController.deleteOrder); /* New rout */

module.exports = router;
