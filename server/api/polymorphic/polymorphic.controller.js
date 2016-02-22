'use strict';

var _ = require('lodash'),
 slug = require('slug'),
fuzzy = require('fuzzy');

var response = require("../response"),
   paginator = require("../paginator");

var clubs = require('../club/club.collection'),
 stadiums = require('../stadium/stadium.collection');


var wrap = exports.wrap = function(domain, nameattr, collections, q, iterator) {
  return _.map(collections.filter(function(properties) {
    return fuzzy.test(q, iterator(properties));
  }).toArray(), function(properties) {
    return {
      domain: domain,
      properties: properties,
      name: properties[nameattr]
    }
  });
};

// Search clubs
exports.search = function(req, res) {
  // Build paginator parameters
  var params = paginator.offset(req);
  var q = slug(req.query.q || "");
  // Must specified a query parameter
  if(!q || q.length < 1) {
    return response.validationError(res)({ error: "'q' parameter must not be empty."});
  }
  // Look for clubs by name
  var filteredClubs = wrap('club', 'nameclub', clubs, q, function(properties) {
    // Slugify club's name with slug
    return slug(properties.nameclub || '')
  });
  // Look for stadiums by name
  var filteredStadiums = wrap('stadium', 'name', stadiums, q, function(properties) {
    // Slugify club's name with slug
    return slug(properties.name + ' ' + properties.city)
  });
  // Merge results
  var filtered = _.sortBy( _.merge(filteredClubs, filteredStadiums), 'match');
  // Return a slice of the collections
  res.json(200, filtered.slice(params.offset, params.offset + params.limit) );
};
