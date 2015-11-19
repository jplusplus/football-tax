'use strict';

var express = require('express');
var controller = require('./stadium.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/search', controller.search);

module.exports = router;
