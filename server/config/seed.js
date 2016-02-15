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
    level: 0.1,
    the_geom: smartGeojson('./nice.json')
  },
  {
    name : 'Ville de Nîmes',
    country: 'FRA',
    level: 0.1,
    the_geom: smartGeojson('./nimes.json')
  },
  {
    name : 'Ville de Bordeaux',
    country: 'FRA',
    level: 0.1,
    the_geom: smartGeojson('./bordeaux.json')
  },
  {
    name : 'Ville de Strasbourg',
    country: 'FRA',
    level: 0.1,
    the_geom: smartGeojson('./strasbourg.json')
  },
  {
    name : 'Ville de Saint-Etienne',
    country: 'FRA',
    level: 0.1,
    the_geom: smartGeojson('./saintetienne.json')
  },
  {
    name : 'Coventry City Council',
    country: 'GBR',
    level: 0.1,
    the_geom: smartGeojson('./coventry.json')
  },
  {
    name : 'Bordeaux Métropole',
    country: 'FRA',
    level: 0.2,
    the_geom: smartGeojson('./metropole-bordeaux.json')
  },
  {
    name : 'Communauté d\'agglomération Nîmes Métropole',
    country: 'FRA',
    level: 0.2,
    the_geom: smartGeojson('./metropole-nimes.json')
  },
  {
    name : 'Communauté urbaine de Lyon',
    country: 'FRA',
    level: 0.2,
    the_geom: smartGeojson('./metropole-lyon.json')
  },
  {
    name : 'Communauté urbaine Nice Côte d\'Azur',
    country: 'FRA',
    level: 0.2,
    the_geom: smartGeojson('./metropole-nice.json')
  },
  {
    name : 'Communauté Urbaine de Strasbourg (CUS)',
    country: 'FRA',
    level: 0.2,
    the_geom: smartGeojson('./metropole-strasbourg.json')
  },
  {
    name : 'Montpellier Méditerannée Métropole',
    country: 'FRA',
    level: 0.2,
    the_geom: smartGeojson('./metropole-montpellier.json')
  },
  {
    name : 'Communauté urbaine Saint-Étienne Métropole',
    country: 'FRA',
    level: 0.2,
    the_geom: smartGeojson('./metropole-saintetienne.json')
  },
  {
    name : 'Conseil départemental du Gard',
    country: 'FRA',
    level: 0.3,
    the_geom: smartGeojson('./departement-30.json')
  },
  {
    name : 'Conseil Départemental de l\'Hérault',
    country: 'FRA',
    level: 0.3,
    the_geom: smartGeojson('./departement-34.json')
  },
  {
    name : 'Conseil départemental du Rhône',
    country: 'FRA',
    level: 0.3,
    the_geom: smartGeojson('./departement-69.json')
  },
  {
    name : 'Conseil départemental de la Gironde',
    country: 'FRA',
    level: 0.3,
    the_geom: smartGeojson('./departement-33.json')
  },
  {
    name : 'Conseil départemental des Alpes-Maritimes',
    country: 'FRA',
    level: 0.3,
    the_geom: smartGeojson('./departement-06.json')
  },
  {
    name : 'Conseil départemental du Bas-Rhin',
    country: 'FRA',
    level: 0.3,
    the_geom: smartGeojson('./departement-67.json')
  },
  {
    name : 'Conseil départemental de la Loire',
    country: 'FRA',
    level: 0.3,
    the_geom: smartGeojson('./departement-42.json')
  },
  {
    name : 'Conseil régional de Languedoc-Roussillon-Midi-Pyrénées',
    country: 'FRA',
    level: 0.4,
    the_geom: smartGeojson('./conseil-regional-languedoc-roussillon.json')
  },
  {
    name : 'Conseil régional d\'Alsace-Champagne-Ardenne-Lorraine',
    country: 'FRA',
    level: 0.4,
    the_geom: smartGeojson('./conseil-regional-alsace.json')
  },
  {
    name : 'Conseil Régional Rhône Alpes',
    country: 'FRA',
    level: 0.4,
    the_geom: smartGeojson('./conseil-regional-rhone-alpes.json')
  },
  {
    name : 'Conseil Régional d\'Aquitaine',
    country: 'FRA',
    level: 0.4,
    the_geom: smartGeojson('./conseil-regional-aquitaine.json')
  },
  {
    name : 'Conseil Régional PACA',
    country: 'FRA',
    level: 0.4,
    the_geom: smartGeojson('./conseil-regional-PACA.json')
  }
  ];

  // Look into the club list
  for(let club of clubs.toArray() ) {
    // Each club has several transfers that may cocern a payer
    let transfersByPayer = _.groupBy(club.getTransfers(), 'payer');
    // Save every payer as a territory
    for(let payerName in transfersByPayer) {
      // A territory is unique
      if( _.any(territories, c => c.country == club.country.toUpperCase() && slug(c.name) == slug(payerName) )) continue;
      // We will use a bulk function to insert all territories at once
      territories.push({
        name: payerName,
        country: club.country.toUpperCase()
      });
    }
  }

  for(let territory of territories) {
    Territory.create(territory, function(err, doc) {
      if(err) {
        console.log("Failed to insert \"%s\":", territory.name);
        if(err.code === 11000) {
          console.log("This territory already exist in the database.")
        }
      }
    });
  }

});
