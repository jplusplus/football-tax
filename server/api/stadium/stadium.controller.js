'use strict';

var _ = require('lodash');

var response = require("../response"),
   paginator = require("../paginator");

var Stadium = require('./stadium.collection');


// Get list of territories
exports.index = function(req, res) {
  // Build paginator parameters
  var params = paginator.offset(req);
};

// Search territories
exports.search = function(req, res) {
  // Build paginator parameters
  var params = paginator.offset(req);

  if(!req.query.q || req.query.q.length < 1) {
    return response.validationError(res)({ error: "'q' parameter must not be empty."});
  }
};
