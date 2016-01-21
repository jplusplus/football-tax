var _ = require('lodash'),
  tv4 = require('tv4');

var schemas = require('./schemas');

var smartGeojson = module.exports.smartGeojson = function(pathOrObject) {
  var geojson = typeof(pathOrObject) === 'string' ? require(pathOrObject) : pathOrObject;  
  // The given object is a Feature (it may contain schemas allowed by MongoDB)
  if( tv4.validate(geojson, schemas.FEATURE) ) {
    // We inspect the content of this file's geometry attribute
    return smartGeojson(geojson.geometry);
  // The given object is a FeatureCollection
  } else if( tv4.validate(geojson, schemas.FEATURE_COLLECTION) ) {
    // We convert the FeatureCollection to a GeometryCollection
    var obj = {
      type: "GeometryCollection",
      // A geometry collection contains several GeoJSON objects
      geometries: _.map(geojson.features, smartGeojson)
    };
    return obj
  // The given object is something allowed by MongoDB
  } else if( tv4.validate(geojson, schemas.MONGODB_TYPES) ) {
    return geojson;
  // The given object is something else
  } else {
    return null;
  }

};
