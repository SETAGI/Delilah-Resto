const express = require('express');
const server = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const { middle } = require('./middlewares');

/* Importing Routes */
const routes = require('./routes/routes');

/* Settings */

server.set('port', process.env.PORT || 3000);

/* Middlewares */
server.use(cors());
server.use(bodyParser.json());
server.use(middle.jwtValidate);

/* Routes */
server.use('/', routes);

/* General error */
server.use(middle.error);

/* Server */
server.listen(server.get('port'), () =>
	console.log(`delilah server is on port ${server.get('port')}...`)
);
