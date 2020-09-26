const express = require('express');
const server = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const { middlewares } = require('./middlewares');

/* Importing Routes */
const routes = require('./routes/routes');

/* Settings */
server.set('port', process.env.PORT || 3000);

/* Middlewares */
server.use(cors());
server.use(bodyParser.json());
server.use(middlewares.jwtValidation);

/* Routes */
server.use('/', routes);

/* PONER AQUI EL ERROR GENERAL (500) */

server.listen(server.get('port'), () => console.log('delilah server is on port 3000...'));
