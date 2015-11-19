'use strict';

var path = require('path');
var _ = require('lodash');

function requiredProcessEnv(name) {
  if(!process.env[name]) {
    throw new Error('You must set the ' + name + ' environment variable');
  }
  return process.env[name];
}

// All configurations will extend these options
// ============================================
var all = {
  env: process.env.NODE_ENV || 'development',

  // Root path of server
  root: path.normalize(__dirname + '/../../..'),

  // Server port
  port: process.env.PORT || 9000,

  // Server IP
  ip: process.env.IP || '0.0.0.0',

  // Should we populate the DB with sample data?
  seedDB: false,

  // Secret for session, you will want to change this and make it an environment variable
  secrets: {
    session: 'football-tax-secret'
  },

  // List of user roles
  userRoles: ['guest', 'user', 'admin'],

  // MongoDB connection options
  mongo: {
    options: {
      db: {
        safe: true
      }
    }
  },

  // Google Spreadsheet access token
  gss: {
    oauth2: {
      client_id: process.env.GSS_CLIENT_ID || '',
      client_secret: process.env.GSS_CLIENT_SECRET || '',
      refresh_token: process.env.GSS_REFRESH_TOKEN || '',
    }
  },

};

// Export the config object based on the NODE_ENV
// ==============================================
module.exports = _.merge(all, require('./' + all.env + '.js') || {});
