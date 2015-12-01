/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var Territory = require('../api/territory/territory.model');
var clubs = require('../api/club/club.collection');

var slug = require('slug'),
       _ = require('lodash');

Territory.find({}).remove(function() {

  let territories = [{
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
  }];

  // Look into the club list
  for(let club of clubs.toArray() ) {
    // Each club has several transfers that may cocern a payer
    let transfersByPayer = _.groupBy(club.getTransfers(), 'payer');
    // Save every payer as a territory
    for(let payerName in transfersByPayer) {
      // Build territory slug using club's country
      let territorySlug =  slug([club.country, payerName].join("-")).toLowerCase();
      // A territory slug is uniq
      if( _.any(territories, { slug: territorySlug })) continue;
      // We will use a bulk function to insert all territories at once
      territories.push({
        name: payerName,
        country: club.country.toUpperCase(),
        slug: territorySlug
      });
    }
  }

  Territory.collection.insert(territories);

});
