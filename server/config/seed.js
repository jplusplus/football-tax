/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var Territory = require('../api/territory/territory.model');


Territory.find({}).remove(function() {

  Territory.create({
    name : 'Nice',
    country: 'FRA',
    slug: 'fra-nice',
    level: 0.1,
    the_geom: require('../components/geojson/nice.json')
  }, {
    name : 'Métropole Nice',
    country: 'FRA',
    slug: 'fra-metropole-nice',
    level: 0.2,
    // FeatureCollection containing one feature
    the_geom: require('../components/geojson/metropole-nice.json').features[0].geometry
  });

});
