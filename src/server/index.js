const express = require('express');
const path = require('path');
const morgan = require('morgan');

const server = express();

const config = require('../../config/server');
const routes = require('./routes');

const mongooseConnection = require('./db/mongodb');

(async () => {
	server.use(morgan('tiny'));

	await mongooseConnection();

	server.use('/assets', express.static(path.resolve('./dist/assets')));

	server.use(express.urlencoded({extended: false}));
	server.use(express.json());

	server.set('view engine', 'pug');

	server.use('/', routes);

	server.get('*', (req, res) => {
		res.sendFile(path.resolve('./dist/index.html'));
	});

	server.listen(config.port, () => {
		console.log(`Server started on ${config.port}`);
	});
})();
