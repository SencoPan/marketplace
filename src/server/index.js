const express = require('express');
const path = require('path');
const config = require('../../config/server');
const server = express();
const routes = require('./routes');
const mongooseConnection = require('./db/mongodb');
const {authCheck} = require('@/server/middlewares/auth');

(async () => {
	await mongooseConnection();

	server.use('/', express.static(path.resolve('./dist')));

	server.use(express.urlencoded({extended: false}));
	server.use(express.json());

	server.set('view engine', 'pug');

	server.use('/', routes);

	server.get('*', authCheck, (req, res) => {
		if (req.authed) return res.sendFile(path.resolve('./dist/index.html'));
		return res.sendFile(path.resolve('./dist/auth.html'));
	});

	server.listen(config.port, () => {
		console.log(`Server started on ${config.port}`);
	});
})();
