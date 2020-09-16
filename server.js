const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const { usersController, odersController, productsController } = require('./controllers');
const { middlewares } = require('./middlewares');

const server = express();

server.use(cors());
server.use(bodyParser.json());
server.use(middlewares.jwtValidation);

/*
 *Routs
 */

// Any user
server.post('/register', middlewares.dataValidation, usersController.createUser);
server.post('/login', middlewares.userRegisterValidation, usersController.jwtGeneration);
server.get('/products', productsController.getAllProducts);

// Only Admin user :

/* TODO: Validar  data completa del body para creacion de productos, crear middleware 
general para la validacion de data de usuario y producto en una misma funcion 
validando el tipo de path req.path  */

server.post('/products', middlewares.adminValidation, productsController.createProduct);

server.listen(3000, () => console.log('delilah server is on port 3000...'));
