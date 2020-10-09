const express = require('express');
const router = express.Router();

const { middle } = require('../middlewares');
const { usersController, productsController, ordersController } = require('../controllers');

/* Any user */
router.post('/register', middle.dataValidate, usersController.createUser);
router.post('/login', middle.userRegisterValidate, usersController.jwtGeneration);
router.get('/products', productsController.getAllProducts);
router.get('/products/:id', middle.idProductValidate, productsController.getProduct);
router.post('/orders', middle.dataOrderValidate, ordersController.createOrder);

/* Only Admin user */
router.post('/products', middle.dataValidate, middle.adminValidate, productsController.createProduct);
router.put('/products/:id', middle.idProductValidate, middle.adminValidate, productsController.editProduct);
router.delete('/products/:id', middle.idProductValidate, middle.adminValidate, productsController.deleteProduct);
router.get('/users', middle.adminValidate, usersController.getAllUsers);
router.get('/users/:id', middle.idUserValidate, middle.adminValidate, usersController.getUser);
router.put('/users/:id', middle.userDataValid, middle.idUserValidate, middle.adminValidate, usersController.editUser);
router.delete('/users/:id', middle.idUserValidate, middle.adminValidate, usersController.deleteUser);
router.get('/orders', middle.adminValidate, ordersController.getAllOrders);
router.get('/orders/:id', ordersController.getOrder);
router.put('/orders/:id', middle.adminValidate, middle.orderStatusValidate, ordersController.editOrder);
router.delete('/orders/:id', middle.adminValidate, ordersController.deleteOrder);

module.exports = router;
