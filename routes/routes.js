const express = require('express');
const router = express.Router();

const { middlewares } = require('../middlewares');
const { usersController, odersController, productsController } = require('../controllers');

/* Any user */
router.post('/register', middlewares.dataValidation, usersController.createUser);
router.post('/login', middlewares.userRegisterValidation, usersController.jwtGeneration);
router.get('/products', middlewares.jwtValidation, productsController.getAllProducts);
router.get('/products/:id', middlewares.idValidation, productsController.getProduct);

/* Only Admin user */
router.post('/products', middlewares.dataValidation, middlewares.adminValidation, productsController.createProduct);
router.get('/users', middlewares.adminValidation, usersController.getAllUsers);
router.get('/users/:id', middlewares.adminValidation, usersController.getUser);
router.put('/users/:id', middlewares.adminValidation, usersController.editUser);

module.exports = router;
