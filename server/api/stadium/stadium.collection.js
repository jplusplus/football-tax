'use strict';

var _ = require('lodash'),
 slug = require('slug'),
  Set = require("collections/set");
// Gets clubs collections
var clubs =require('../club/club.collection.js');
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

// Look into the club list
for(let club of clubs.toArray() ) {
  // Each club has several transferts that may cocern a stadium
  let transfertByStadium = _.groupBy(club.getTransfers(), 'stadium');
  // Save every stadium
  for(let stadiumName in transfertByStadium) {
    // Avoid recording undefined stadium
    // (since groupBy saves transferts not related to any stadium)
    if(stadiumName !== 'undefined' && club.city && club.country) {
      // Build a stadium slug using the club info too
      let stadiumSlug = [club.country, club.city, stadiumName].join('-');
      // Closure to get the transfert for this stadium
      let getTransfers = (function(club, transferts) {
        return function() {
          // Returns a modified list of transfert
          return _.map(transferts, function(transfert) {
            // Add the club to the transfert
            transfert.club = club;
            // Return the transfert
            return transfert
          });
        };
      // Call the closure
      })(club, transfertByStadium[stadiumName]);
      // Then create a stadium
      collection.add({
        slug: slug(stadiumSlug).toLowerCase(),
        name: stadiumName,
        city: club.city,
        country: club.country,
        getTransfers: getTransfers
      });
    }
  }
}
// Expose the collection
module.exports = collection;
