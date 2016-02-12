'use strict';

var  _ = require('lodash'),
    fs = require("fs"),
  path = require("path"),
   Set = require("collections/set"),
    fm = require('front-matter'),
marked = require('marked');

// Create an empty set collection
var collection = new Set([],
  // Uniqueness is obtain by comparing slug
  function (a, b) {
    return a.slug === b.slug;
  },
  function (object) {
    return object.slug;
  }
);

// Different page types and there directory
let types = {
  "default":  "./server/pages/default/",
  "clubs":    "./server/pages/clubs/",
  "stadiums": "./server/pages/stadiums/"
}

for(let type in types) {
  // Iterate over pages files/dirs
  for(let name of fs.readdirSync( types[type] ) ) {
    // Build dir path
    let dirpath = path.join(types[type], name);
    // The path is a directory
    if( fs.lstatSync(dirpath).isDirectory() ) {
      // Create a page objet to add to the colleciton
      let page = {
        slug: name,
        contents: { },
        type: type
      };
      // Iterates over dir's files to parse markdown pages
      for(let lang of fs.readdirSync(dirpath) ) {
        // It must be a markdown file
        if( lang.slice(-3) == '.md' ) {
          // Read file content
          let markdown = fs.readFileSync(  path.join(dirpath, lang), "utf8");
          // Extract YAML front matter from the markdown page
          let yaml = fm(markdown);
          // Save YAML attribute
          let content = yaml.attributes;
          // Then parse the markdown
          content.body = marked(yaml.body);
          // Save the content for this lang
          page.contents[ lang.slice(0, -3) ] = content;
        }
      }
      // Add the page to the collection
      collection.add(page);
    }
  }
}

// Expose the collection
module.exports = collection;
