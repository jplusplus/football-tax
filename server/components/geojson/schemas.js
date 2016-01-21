module.exports = {
  FEATURE: {
    "title": "Feature",
    "description": "A Geo JSON feature object",
    "required": [ "geometry", "properties", "type" ],
    "properties": {
        "type": { "enum": [ "Feature" ] },
        "geometry": {
            "oneOf": [
                { "type": "null" },
                { "$ref": "http://json-schema.org/geojson/geometry.json#" }
            ]
        }
    }
  },
  FEATURE_COLLECTION: {
    "title": "FeatureCollection",
    "description": "A Geo JSON feature collection",
    "required": [ "features", "type" ],
    "properties": {
        "type": { "enum": [ "FeatureCollection" ] },
        "features": {
            "type": "array",
            "items": { "$ref": "#/definitions/feature" }
        }
    }
  },
  MONGODB_TYPES: {
    "title": "MixedTypes",
    "required": [ "type" ],
    "properties": {
      "type": {
        "type": "string",
        "enum": [
          "Point",
          "LineString",
          "Polygon",
          "MultiPoint",
          "MultiLineString",
          "MultiPolygon",
          "GeometryCollection"
        ]
      }
    }
  }

};
