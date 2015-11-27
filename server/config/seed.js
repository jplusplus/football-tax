/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var Territory = require('../api/territory/territory.model');


Territory.find({}).remove(function() {

  Territory.create({
    name : 'Ville de Nice',
    country: 'FRA',
    slug: 'fra-ville-de-nice',
    level: 0.1,
    the_geom: require('../components/geojson/nice.json')
  }, {
    name : 'Nice Métropole',
    country: 'FRA',
    slug: 'fra-nice-metropole',
    level: 0.2,
    // FeatureCollection containing one feature
    the_geom: require('../components/geojson/metropole-nice.json').features[0].geometry
  });

});
