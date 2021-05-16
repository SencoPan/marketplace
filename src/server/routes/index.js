const express = require('express');

const user = require('./user');
const market = require('./market');

const router = express.Router();

router.use('/user', user);
router.use('/merchant', market);

module.exports = router;
