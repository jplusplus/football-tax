'use strict';

var _ = require('lodash'),
 slug = require('slug'),
fuzzy = require('fuzzy');

var response = require("../response"),
   paginator = require("../paginator");


var clubs = require('./club.collection'),
    pages = require('../page/page.collection'),
 stadiums = require('../stadium/stadium.collection'),
Territory = require('../territory/territory.model');

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
    // Gets stadiums for this club
    club.stadiums = stadiums.filter( s => s.club === club.slug );
    // Gets club's transfers
    club.transfers = club.getTransfers();
    // Gets all payers for this club
    club.payers = _.chain(club.transfers)
                   .pluck('payer')
                   .uniq()
                   .map(t => slug(club.country + '-' + t).toLowerCase() )
                   .value()
    // Find those payers in the database
    Territory
      .find({ slug: { $in: club.payers } })
      .sort('level')
      .exec(function(err, territories) {
        club.payers = territories;
        // Gets club's page (if any)
        club.page = pages.get({ slug: req.params.slug, type: 'clubs' });
        // Return a slice of the collections
        res.json(200, club);
      });
  // We didn't...
  } else {
    res.send(404);
  }
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

  // Look for a club by its name
  var filtered = clubs.filter(function(item) {
    // Slugify club's name with slug
    return fuzzy.test(q, slug(item.nameclub || ''));
  });
  // Return a slice of the collections
  res.json(200, filtered.toArray().slice(params.offset, params.offset + params.limit) );
};
