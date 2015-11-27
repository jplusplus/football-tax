'use strict';

var _ = require('lodash'),
 slug = require('slug'),
  Set = require("collections/set");
// Gets all stadiums
var all = require('../../data/stadiums/all.json');
// Gets clubs collections
var clubs = require('../club/club.collection.js');
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

// Two shortcuts for quicker comparaisons
var nz = (s)=> slug(s).toLowerCase()
var eq = (a,b)=> nz(a) === nz(b)

// Look into the club list
for(let club of clubs.toArray() ) {
  // Each club has several transfers that may cocern a stadium
  let transfersByStadium = _.groupBy(club.getTransfers(), 'stadium');
  // Save every stadium
  for(let stadiumName in transfersByStadium) {
    // Avoid recording undefined stadium
    // (since groupBy saves transfers not related to any stadium)
    if(stadiumName !== 'undefined' && club.city && club.country) {
      // Build a stadium slug using the club info too
      let stadiumSlug = nz([club.country, club.city, stadiumName].join('-'));
      // Closure to get the transfert for this stadium
      let getTransfers = ( (club, transfers)=> {
        return ()=> {
          // Returns a modified list of transfert
          return _.map(transfers, (transfert)=> {
            // Add the club to the transfert
            transfert.club = club;
            // Return the transfert
            return transfert
          });
        };
      // Call the closure
    })(club, transfersByStadium[stadiumName]);
      let meta = _.find(all, (d)=>{
        // Lookup using normalized comparaisons
        return eq(d.name,    stadiumName)
            && eq(d.city,    club.city)
            && eq(d.country, club.country);
      });
      // Then create a stadium
      collection.add(_.merge({
        slug: stadiumSlug,
        name: stadiumName,
        city: club.city,
        country: club.country,
        getTransfers: getTransfers
      }, meta));
    }
  }
}
// Get stadiums in the given radius according to a center
collection.inRadius = function(center, radius) {
  // Convert KM radius in degree
  let deg = radius * .01;
  return this.filter(function(stadium) {
    // Just using some Pythagorian intersection
    let a = center[0] - stadium.longitude,
        b = center[1] - stadium.latitude;
    return Math.pow(a, 2) + Math.pow(b, 2) <= Math.pow(deg, 2)
  });
};
// Expose the collection
module.exports = collection;
