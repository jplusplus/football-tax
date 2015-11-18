'use strict';

var       _ = require('lodash');

var response = require("../response"),
   paginator = require("../paginator");

var Territory = require('./territory.model');


// Get list of territories
exports.index = function(req, res) {
  // Build paginator parameters
  var params = paginator.offset(req);

  Territory
    .find()
    .limit(params.limit)
    .skip(params.offset)
    .sort('level')
    .exec(function (err, territories) {
      if(err) { return response.handleError(res)(err); }
      return res.json(200, territories);
    });
};

// Search territories
exports.search = function(req, res) {
  // Build paginator parameters
  var params = paginator.offset(req);

  if(!req.query.q || req.query.q.length < 1) {
    return response.validationError(res)({ error: "'q' parameter must not be empty."});
  }

  Territory
    .find({ "name": { "$regex": req.query.q, "$options": "i" }})
    .limit(params.limit)
    .skip(params.offset)
    .sort('level')
    .exec(function (err, territories) {
      if(err) { return response.handleError(res)(err); }
      return res.json(200, territories);
    });
};

// Reverse search by latitude and longitude
// Examples:
// * http://localhost:9000/api/territories/reverse?latlng=43.7502971,7.1043772
// * http://localhost:9000/api/territories/reverse?latlng=43.7229328524,7.3234234772
exports.reverse = function(req, res) {
  // Build paginator parameters
  var  params = paginator.offset(req),
  // Coordinates used for the lookup
  coordinates = null;

  if(!req.query.latlng) {
    return response.validationError(res)({ error: "'latlng' parameter must not be empty."});
  } else if( req.query.latlng.split(',').length !== 2 ) {
    return response.validationError(res)({ error: "'latlng' parameter is malformed."});
  }

  // Extract coordinates from query
  coordinates = _( req.query.latlng.split(',') )
    // Remove whitespaces
    .map(_.trim)
    // Cast to fload
    .map(Number)
    // Since coordinates are usually formulated as latitude and longitude pair,
    // we have to turn the coordinates array upside down
    .reverse()
    // Return values
    .value()

  Territory
    .find({
      the_geom: {
        $geoIntersects: {
          $geometry: {
            type: "Point",
            coordinates: coordinates
          }
        }
      }
    })
    .limit(params.limit)
    .skip(params.offset)
    .sort('-level')
    .exec(function (err, territories) {
      if(err) { return response.handleError(res)(err); }
      return res.json(200, territories);
    });
};
