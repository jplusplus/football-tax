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
    name : 'Ville de Nîmes',
    country: 'FRA',
    slug: 'fra-ville-de-nimes',
    level: 0.1,
    the_geom: smartGeojson('./nimes.json')
  },
  {
    name : 'Ville de Bordeaux',
    country: 'FRA',
    slug: 'fra-ville-de-bordeaux',
    level: 0.1,
    the_geom: smartGeojson('./bordeaux.json')
  },
  {
    name : 'Ville de Strasbourg',
    country: 'FRA',
    slug: 'fra-ville-de-strasbourg',
    level: 0.1,
    the_geom: smartGeojson('./strasbourg.json')
  },
  {
    name : 'Ville de Saint-Etienne',
    country: 'FRA',
    slug: 'fra-ville-de-saintetienne',
    level: 0.1,
    the_geom: smartGeojson('./saintetienne.json')
  },
  {
    name : 'Conventry City Council',
    country: 'GBR',
    slug: 'gbr-coventry-city-council',
    level: 0.1,
    the_geom: smartGeojson('./coventry.json')
  },
  {
    name : 'Bordeaux Métropole',
    country: 'FRA',
    slug: 'fra-bordeaux-metropole',
    level: 0.2,
    the_geom: smartGeojson('./metropole-bordeaux.json')
  },
  {
    name : 'Communauté d\'agglomération Nîmes Métropole',
    country: 'FRA',
    slug: 'fra-nimes-metropole',
    level: 0.2,
    the_geom: smartGeojson('./metropole-nimes.json')
  },
  {
    name : 'Communauté urbaine de Lyon',
    country: 'FRA',
    slug: 'fra-lyon-metropole',
    level: 0.2,
    the_geom: smartGeojson('./metropole-lyon.json')
  },
  {
    name : 'Communauté urbaine Nice Côte d\'Azur',
    country: 'FRA',
    slug: 'fra-nice-metropole',
    level: 0.2,
    the_geom: smartGeojson('./metropole-nice.json')
  },
  {
    name : 'Communauté Urbaine de Strasbourg (CUS)',
    country: 'FRA',
    slug: 'fra-strasbourg-metropole',
    level: 0.2,
    the_geom: smartGeojson('./metropole-strasbourg.json')
  },
  {
    name : 'Montpellier Méditerannée Métropole',
    country: 'FRA',
    slug: 'fra-montpellier-metropole',
    level: 0.2,
    the_geom: smartGeojson('./metropole-montpellier.json')
  },
  {
    name : 'Communauté urbaine Saint-Étienne Métropole',
    country: 'FRA',
    slug: 'fra-saintetienne-metropole',
    level: 0.2,
    the_geom: smartGeojson('./metropole-saintetienne.json')
  },
  {
    name : 'Conseil départemental du Gard',
    country: 'FRA',
    slug: 'fra-conseil-general-30',
    level: 0.3,
    the_geom: smartGeojson('./departement-30.json')
  },
  {
    name : 'Conseil Départemental de l\'Hérault',
    country: 'FRA',
    slug: 'fra-conseil-general-34',
    level: 0.3,
    the_geom: smartGeojson('./departement-34.json')
  },
  {
    name : 'Conseil départemental du Rhône',
    country: 'FRA',
    slug: 'fra-conseil-general-69',
    level: 0.3,
    the_geom: smartGeojson('./departement-69.json')
  },
  {
    name : 'Conseil départemental de la Gironde',
    country: 'FRA',
    slug: 'fra-conseil-general-33',
    level: 0.3,
    the_geom: smartGeojson('./departement-33.json')
  },
  {
    name : 'Conseil départemental des Alpes-Maritimes',
    country: 'FRA',
    slug: 'fra-conseil-general-06',
    level: 0.3,
    the_geom: smartGeojson('./departement-06.json')
  },
  {
    name : 'Conseil départemental du Bas-Rhin',
    country: 'FRA',
    slug: 'fra-conseil-general-67',
    level: 0.3,
    the_geom: smartGeojson('./departement-67.json')
  },
  {
    name : 'Conseil départemental de la Loire',
    country: 'FRA',
    slug: 'fra-conseil-general-42',
    level: 0.3,
    the_geom: smartGeojson('./departement-42.json')
  },
  {
    name : 'Conseil régional de Languedoc-Roussillon-Midi-Pyrénées',
    country: 'FRA',
    slug: 'fra-conseil-regional-languedoc-roussillon',
    level: 0.4,
    the_geom: smartGeojson('./conseil-regional-languedoc-roussillon.json')
  },
  {
    name : 'Conseil régional d\'Alsace-Champagne-Ardenne-Lorraine',
    country: 'FRA',
    slug: 'fra-conseil-regional-alsace',
    level: 0.4,
    the_geom: smartGeojson('./conseil-regional-alsace.json')
  },
  {
    name : 'Conseil Régional Rhône Alpes',
    country: 'FRA',
    slug: 'fra-conseil-regional-rhone-alpes',
    level: 0.4,
    the_geom: smartGeojson('./conseil-regional-rhone-alpes.json')
  },
  {
    name : 'Conseil Régional d\'Aquitaine',
    country: 'FRA',
    slug: 'fra-conseil-regional-aquitaine',
    level: 0.4,
    the_geom: smartGeojson('./conseil-regional-aquitaine.json')
  },
  {
    name : 'Conseil Régional PACA',
    country: 'FRA',
    slug: 'fra-conseil-regional-paca',
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
