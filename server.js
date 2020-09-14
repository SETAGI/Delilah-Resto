const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const { usersController, odersController, productsController } = require('./controllers');
const { usersMiddleware } = require('./middlewares');

const server = express();

server.use(cors());
server.use(bodyParser.json());

/*
 *Routs
 */
server.post('/register', usersMiddleware.dataValidation, usersController.createUser);
server.get('/products', productsController.getAllProducts);

server.listen(3000, () => console.log('delilah server is on port 3000...'));
