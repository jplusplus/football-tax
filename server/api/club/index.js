'use strict';

var express = require('express');
var controller = require('./club.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/search', controller.search);
router.get('/:slug', controller.show);

module.exports = router;
