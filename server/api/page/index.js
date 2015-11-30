'use strict';

var express = require('express');
var controller = require('./page.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/:slug', controller.show);

module.exports = router;
