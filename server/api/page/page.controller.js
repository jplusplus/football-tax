'use strict';

var response = require("../response"),
   paginator = require("../paginator");

var pages = require('./page.collection');

// Get list of pages
exports.index = function(req, res) {
  // Build paginator parameters
  var params = paginator.offset(req);
  // Return a slice of the collections
  res.json(200, pages.toArray().slice(params.offset, params.offset + params.limit) );
};

// Get a page by its slug
exports.show = function(req, res) {
  var page = pages.get({ slug: req.params.slug, type: (req.params.type || 'default') });
  // We found the page
  if(page) {
    // Return a slice of the collections
    res.json(200, page);
  // We didn't...
  } else {
    res.send(404);
  }
};
