'use strict';

var _ = require('lodash'),
fuzzy = require('fuzzy');

var response = require("../response"),
   paginator = require("../paginator");

var clubs = require('./club.collection');


// Get list of clubs
exports.index = function(req, res) {
  // Build paginator parameters
  var params = paginator.offset(req);
  // Return a slice of the collections
  res.json(200, clubs.toArray().slice(params.offset, params.offset + params.limit) );
};

// Get a club by its slug
exports.show = function(req, res) {
  var club = clubs.get({ slug: req.params.slug });
  // We found the club
  if(club) {
    // Creates a copy to work on
    club = _.clone(club);
    // Gets club's transfert
    club.transfert = club.getTransfers();
    // Return a slice of the collections
    res.json(200, club);
  // We didn't...
  } else {
    res.send(404);
  }
};

// Search clubs
exports.search = function(req, res) {
  // Build paginator parameters
  var params = paginator.offset(req);
  // Must specified a query parameter
  if(!req.query.q || req.query.q.length < 1) {
    return response.validationError(res)({ error: "'q' parameter must not be empty."});
  }
  // Look for a club by its name
  var filtered = clubs.filter(function(item) {
    // Slugify club's name with slug
    return fuzzy.test(req.query.q, item.nameclub || '');
  });
  // Return a slice of the collections
  res.json(200, filtered.toArray().slice(params.offset, params.offset + params.limit) );
};
