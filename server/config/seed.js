/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var Territory = require('../api/territory/territory.model');
var clubs = require('../api/club/club.collection');

var slug = require('slug'),
       _ = require('lodash');
// Load a geojson make it smarter
var smartGeojson = require('../components/geojson').smartGeojson;

Territory.find({}).remove(function() {

  let territories = [{
    name : 'Ville de Nice',
    country: 'FRA',
    slug: 'fra-ville-de-nice',
    level: 0.1,
    the_geom: smartGeojson('./nice.json')
  },
  {
    name : 'Conseil Général 06',
    country: 'FRA',
    slug: 'fra-conseil-general-06',
    level: 0.3,
    the_geom: smartGeojson('./departement-06.json')
  },
  {
    name : 'Nice Métropole',
    country: 'FRA',
    slug: 'fra-nice-metropole',
    level: 0.2,
    the_geom: smartGeojson('./metropole-nice.json')
  },
   {
    name : 'Conseil Régional PACA',
    country: 'FRA',
    slug: 'fra-conseil-regional-paca',
    level: 0.4,
    the_geom: smartGeojson('./conseil-regional-PACA.json')
  },
  {
    name : 'Ville de Nîmes',
    country: 'FRA',
    slug: 'fra-ville-de-nimes',
    level: 0.1,
    the_geom: smartGeojson('./nimes.json')
  },
  {
    name : 'Conseil général 30',
    country: 'FRA',
    slug: 'fra-conseil-general-30',
    level: 0.3,
    the_geom: smartGeojson('./departement-30.json')
  },
  {
    name : 'Conseil Régional Languedoc Roussillon',
    country: 'FRA',
    slug: 'fra-conseil-regional-languedoc-roussillon',
    level: 0.4,
    the_geom: smartGeojson('./conseil-regional-languedoc-roussillon.json')
  },
   {
    name : 'Conseil général 69',
    country: 'FRA',
    slug: 'fra-conseil-general-69',
    level: 0.3,
    the_geom: smartGeojson('./departement-69.json')
  },
  {
    name : 'Bordeaux Métropole',
    country: 'FRA',
    slug: 'fra-bordeaux-metropole',
    level: 0.2,
    the_geom: smartGeojson('./metropole-bordeaux.json')
  },
  {
    name : 'Nimes Métropole',
    country: 'FRA',
    slug: 'fra-nimes-metropole',
    level: 0.2,
    the_geom: smartGeojson('./metropole-nimes.json')
  },
  {
    name : 'Lyon Métropole',
    country: 'FRA',
    slug: 'fra-lyon-metropole',
    level: 0.2,
    the_geom: smartGeojson('./metropole-lyon.json')
  }
  ];

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
