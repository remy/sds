const express = require('express');
const router = express.Router();
module.exports = router;

router.use('/:id([0-9]+)', require('./user'));
