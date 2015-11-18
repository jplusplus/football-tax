'use strict';

var mongoose = require('mongoose'),
      Schema = mongoose.Schema;

var TerritorySchema = new Schema({
  name: {
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
// Create and export Territory model
var Territory = module.exports = mongoose.model('Territory', TerritorySchema);
