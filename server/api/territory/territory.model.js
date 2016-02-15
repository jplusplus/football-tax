'use strict';

var  slug = require('slug'),
 mongoose = require('mongoose'),
   Schema = mongoose.Schema;


// Gets clubs collections to retreive money transfers
var clubs = require('../club/club.collection.js');
var _ = require('lodash')

var TerritorySchema = new Schema({
  name: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    allowNull: true,
    defaultValue: null,
    unique: true
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


TerritorySchema.pre("save", function(next) {
  // Build the slug automaticly if needed
  if( typeof(this.slug) === 'undefined' || this.slug === null) {
    this.slug = slug( this.country + '-' + this.name ).toLowerCase();
  }
  next();
})


// Mandatory to query geospacial data
TerritorySchema.path('the_geom').index({ type: '2dsphere'});
// Find money transfers related to the current territory
TerritorySchema.method('getClubs', function (){
  // Find clubs
  let territory_clubs = clubs.filter(c => c.inTerritory(this.slug) ).toArray();
  return _.chain(territory_clubs)
    // Create clone of each club to avoid modifing the original object
    .map(_.clone)
    // Add transfers list to each clubs
    .each( c=> c.transfers = c.getTransfers(this.slug) )
    .value();
});
// Create and export Territory model
var Territory = module.exports = mongoose.model('Territory', TerritorySchema);
