'use strict';

var _ = require('lodash'),
 slug = require('slug'),
fuzzy = require('fuzzy');

var response = require("../response"),
   paginator = require("../paginator");

var stadiums = require('./stadium.collection'),
       clubs = require('../club/club.collection');


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
    // Gets stadium's transfers
    stadium.transfers = stadium.getTransfers();
    // Gets full stadium's club
    stadium.club = clubs.get({ slug: stadium.club });
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
  var q = slug(req.query.q || "");
  // Must specified a query parameter
  if(!q || q.length < 1) {
    return response.validationError(res)({ error: "'q' parameter must not be empty."});
  }
  // Look for a stadium by its name
  var filtered = stadiums.filter(function(item) {
    // Fuzzy search on stadium name + city
    return fuzzy.test(q, slug(item.name + ' ' + item.city));
  });
  // Return a slice of the collections
  res.json(200, filtered.toArray().slice(params.offset, params.offset + params.limit) );
};
