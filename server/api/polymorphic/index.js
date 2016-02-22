'use strict';

var express = require('express');
var controller = require('./polymorphic.controller');

var router = express.Router();

router.get('/search', controller.search);

module.exports = router;
