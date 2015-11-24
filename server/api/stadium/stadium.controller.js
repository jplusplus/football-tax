'use strict';

var _ = require('lodash'),
fuzzy = require('fuzzy');

var response = require("../response"),
   paginator = require("../paginator");

var stadiums = require('./stadium.collection');


// Get list of stadiums
exports.index = function(req, res) {
  // Build paginator parameters
  var params = paginator.offset(req);
  // Return a slice of the collections
  res.json(200, stadiums.toArray().slice(params.offset, params.offset + params.limit) )
};


// Get a stadium by its slug
exports.show = function(req, res) {
  var stadium = stadiums.get({ slug: req.params.slug });
  // We found the stadium
  if(stadium) {
    // Creates a copy to work on
    stadium = _.clone(stadium);
    // Gets stadium's transfert
    stadium.transfert = stadium.getTransfers();
    // Return a slice of the collections
    res.json(200, stadium);
  // We didn't...
  } else {
    res.send(404);
  }
};


// Search territories
exports.search = function(req, res) {
  // Build paginator parameters
  var params = paginator.offset(req);
  // Must specified a query parameter
  if(!req.query.q || req.query.q.length < 1) {
    return response.validationError(res)({ error: "'q' parameter must not be empty."});
  }
  // Look for a stadium by its name
  var filtered = stadiums.filter(function(item) {
    // Fuzzy search on stadium name + city
    return fuzzy.test(req.query.q, item.name + ' ' + item.city);
  });
  // Return a slice of the collections
  res.json(200, filtered.toArray().slice(params.offset, params.offset + params.limit) );
};
