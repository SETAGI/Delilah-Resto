const express = require('express');
const server = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const { middle } = require('./middlewares');

/* Importing Routes */
const routes = require('./routes/routes');

/* Settings */
server.set('port', process.env.PORT || 3000);

/* PILAS MEJORAR EL SWAGGER */

/* PONER LOS TIPOS DE PAGO ACEPTADOS POR  LA APLICACIÓN Y TODOS LOS DATOS EN EL 
MANUAL README - PONER EN EL SWAGGER QUE  ESTO SOLO LO HACE UN ADMINISTRADOR O LO 
PUEDE HACER UN USUAARIO NORMAL Y UN ADMIN */

/* Middlewares */
server.use(cors());
server.use(bodyParser.json());
server.use(middle.jwtValidate);

/* Routes */
server.use('/', routes);

/* General error */
server.use(middle.error);

/* Server */
server.listen(server.get('port'), () => console.log('delilah server is on port 3000...'));
