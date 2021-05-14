const express = require('express');

const user = require('./user');
const market = require('./market');

const router = express.Router();

router.use('/', user);
router.use('/', market);

return router;
