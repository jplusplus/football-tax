'use strict';

var _ = require('lodash'),
 slug = require('slug'),
  Set = require("collections/set");
// Gets clubs list from the config file
var clubs = _.keys( require('../../config/clubs.json') );
// Create an empty set collection
var collection = new Set([],
  // Uniqueness is obtain by comparing slug
  function (a, b) {
    return a.slug === b.slug;
  },
  function (object) {
    return object.slug;
  }
);
// Add every clubs, one by one, to the collection
for(var name of clubs) {
  try {
    // Create a club object
    var club = require('../../data/clubs/' + name + '/desc.json')[0];
  } catch(e) {
    // Catch require error (the clubs is not yet downloaded)
    continue
  }
  // Add the slug to this object
  club.slug = name
  // The club must belong to somewhere
  if(club.country && club.city) {
    // Add a slug of the territory this club belong to
    club.territory = _.chain([club.country, club.city])
      // Simplify values with slugify
      .map(s=> slug(s).toLowerCase())
      // Join values
      .value().join("-")
  }
  // Add every money transfers to this club
  club.getTransfers = (function(club) {
    return function() {
      return require('../../data/clubs/' + club.slug + '/money_transfers.json');
    }
  // Call the closure function so the club is available
  })(club);
  // Finaly, add the club to the collection
  collection.add(club);
}
// Expose the collection
module.exports = collection;
