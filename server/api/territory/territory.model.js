'use strict';

var mongoose = require('mongoose'),
      Schema = mongoose.Schema;


// Gets clubs collections to retreive money transfers
var clubs = require('../club/club.collection.js');
var _ = require('lodash')

var TerritorySchema = new Schema({
  name: {
    type: String
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  country: {
    type: String
  },
  the_geom: {
    type: Object,
    select: false
  },
  level: {
    type: Number
  }
});

// Mandatory to query geospacial data
TerritorySchema.path('the_geom').index({ type: '2dsphere'});
// Find money transfers related to the current territory
TerritorySchema.method('getClubs', function (){
  // Find clubs
  let territory_clubs = clubs.filter(c => c.territory === this.slug).toArray();
  // Add transfers list to each clubs
  return _.chain(territory_clubs)
    .each(_.copy)
    .each( c=> c.transfers = c.getTransfers() )
    .value();
});
// Create and export Territory model
var Territory = module.exports = mongoose.model('Territory', TerritorySchema);
