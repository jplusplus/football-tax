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

// Create a slug with an array of string
var slugify = parts => _.chain(parts)
  // Simplify values with slugify
  .map(s=> slug(s).toLowerCase())
  // Join values
  .value().join("-");

// Add every clubs, one by one, to the collection
for(var name of clubs) {
  try {
    // Create a club object
    var club = require('../../data/clubs/' + name + '/desc_club.json')[0];
  } catch(e) {
    // Catch require error (the clubs is not yet downloaded)
    continue
  }
  // Add the slug to this object
  club.slug = name
  // Add every money transfers to this club
  club.getTransfers = (club=>{
    let transfers = require('../../data/clubs/' + club.slug + '/money_transfers.json');
    // Remove transfers already included in another
    transfers = _.filter(transfers, t=> t.includedin === undefined)
    // The club must be in a country
    if(club.country) {
      // For each line, add a field 'territory'
      _.each(transfers, t=> t.territory = slugify([club.country, t.payer]) );
    }
    return function(territory) {
      // Simply returns the array of transfers that we prepared above
      return territory ? _.filter(transfers, { territory: territory }) : transfers;
    }
  // Call the closure function so the club is available
  })(club);
  // Add every money transfers to this club
  club.inTerritory = (club=>{
    return function(slug) {
      let transfers = club.getTransfers();
      return _.any(transfers, {territory: slug});
    };
  // Call the closure function so the club is available
  })(club);
  // Finaly, add the club to the collection
  collection.add(club);
}
// Expose the collection
module.exports = collection;
