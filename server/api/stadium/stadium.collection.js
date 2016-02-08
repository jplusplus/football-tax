'use strict';

var _ = require('lodash'),
 slug = require('slug'),
  Set = require("collections/set");
// Gets all stadiums
var stadiums = require('../../data/stadiums/all.json');
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

for(let stadium of stadiums) {
  // Find the club for this stadium
  let club = clubs.get({ slug: stadium.club || null });; 
  // Build a stadium slug using the club info too
  let stadiumSlug = nz([stadium.country, stadium.city, stadium.name].join('-'));
  // Closure to get the transfert for this stadium
  let getTransfers = ( (club, transfers)=> {
    return ()=> {
      // Returns a modified list of transfert
      return _.map(transfers, (transfert)=> {
        // Add the club to the transfert object
        transfert.club = club;
        // Return the transfert
        return transfert
      });
    };
  // Call the closure
})(club, stadium.money_transfers);
  // Remove the money_transfers field to avoid oversized collection
  delete stadium.money_transfers;
  // Then create a stadium
  collection.add(_.merge({
    slug: stadiumSlug,
    getTransfers: getTransfers
  }, stadium));
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
