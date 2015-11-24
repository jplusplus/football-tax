'use strict';

var _ = require('lodash'),
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
for(var slug of clubs) {
  try {
    // Create a club object
    var club = require('../../data/clubs/' + slug + '/desc.json')[0];
  } catch(e) {
    // Catch require error (the clubs is not yet downloaded)
    continue
  }
  // Add the slug to this object
  club.slug = slug
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
