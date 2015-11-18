'use strict';

var express = require('express');
var controller = require('./territory.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/search', controller.search);
router.get('/reverse', controller.reverse);

module.exports = router;
