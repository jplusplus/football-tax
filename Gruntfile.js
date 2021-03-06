// Generated on 2015-11-18 using generator-angular-fullstack 2.1.1
'use strict';

var _ = require("lodash"),
   fs = require("fs"),
 path = require("path");

module.exports = function (grunt) {
  var localConfig;
  try {
    localConfig = require('./server/config/local.env');
  } catch(e) {
    localConfig = {};
  }

  // Local grunt must use this config at runtine too
  for(var key in localConfig) {
    // Skip missing values
    if(!localConfig[key]) continue;
    // Simply change the env VAR
    process.env[key] = localConfig[key];
  }

  // Load grunt tasks automatically, when needed
  require('jit-grunt')(grunt, {
    express: 'grunt-express-server',
    useminPrepare: 'grunt-usemin',
    ngtemplates: 'grunt-angular-templates',
    cdnify: 'grunt-google-cdn',
    protractor: 'grunt-protractor-runner',
    buildcontrol: 'grunt-build-control',
  });

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Clubs list to extract
  var clubs = _.reduce( require('./server/config/clubs.json'), function(result, id, k) {
    // Create two files
    for(var sheet of ['money_transfers', 'desc_club', 'desc_stadium']) {
      // Money transfert sheet
      result[k + '-' + sheet] = {
        options: {
          useCellTextValues: true,
          spreadsheetId: id,
          worksheetName: sheet
        },
        dest: 'server/data/clubs/' + k + '/' + sheet + '.json'
      };
    }
    return result;
  }, {});


  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    pkg: grunt.file.readJSON('package.json'),
    yeoman: {
      // configurable paths
      client: require('./bower.json').appPath || 'client',
      dist: 'dist'
    },
    express: {
      options: {
        port: process.env.PORT || 9000
      },
      dev: {
        options: {
          script: 'server/app.js',
          debug: true
        }
      },
      prod: {
        options: {
          script: 'dist/server/app.js'
        }
      }
    },
    open: {
      server: {
        url: 'http://localhost:<%= express.options.port %>'
      }
    },
    watch: {
      injectJS: {
        files: [
          '<%= yeoman.client %>/{app,components}/**/*.js',
          '!<%= yeoman.client %>/{app,components}/**/*.spec.js',
          '!<%= yeoman.client %>/{app,components}/**/*.mock.js',
          '!<%= yeoman.client %>/app/app.js'],
        tasks: ['injector:scripts']
      },
      injectCss: {
        files: [
          '<%= yeoman.client %>/{app,components}/**/*.css',
          '!<%= yeoman.client %>/components/bootstrap/**/*.css'
        ],
        tasks: ['injector:css']
      },
      mochaTest: {
        files: ['server/**/*.spec.js'],
        tasks: ['env:test', 'mochaTest']
      },
      jsTest: {
        files: [
          '<%= yeoman.client %>/{app,components}/**/*.spec.js',
          '<%= yeoman.client %>/{app,components}/**/*.mock.js'
        ],
        tasks: ['newer:jshint:all', 'karma']
      },
      injectLess: {
        files: [
          '<%= yeoman.client %>/{app,components}/**/*.less'],
        tasks: ['injector:less']
      },
      less: {
        files: [
          '<%= yeoman.client %>/{app,components}/**/*.less'],
        tasks: ['less', 'autoprefixer']
      },
      jade: {
        files: [
          '<%= yeoman.client %>/{app,components}/*',
          '<%= yeoman.client %>/{app,components}/**/*.jade'],
        tasks: ['jade']
      },
      babel: {
        files: [
          '<%= yeoman.client %>/{app,components}/**/*.js',
          '!<%= yeoman.client %>/{app,components}/**/*.spec.js'
        ],
        tasks: ['babel']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        files: [
          '{.tmp,<%= yeoman.client %>}/{app,components}/**/*.css',
          '{.tmp,<%= yeoman.client %>}/{app,components}/**/*.html',
          '.tmp/{app,components}/**/*.js',

          '!{.tmp,<%= yeoman.client %>}{app,components}/**/*.spec.js',
          '!{.tmp,<%= yeoman.client %>}/{app,components}/**/*.mock.js',
          '<%= yeoman.client %>/assets/images/{,*//*}*.{png,jpg,jpeg,gif,webp,svg}',
          '<%= yeoman.client %>/assets/locales/*.json',
        ],
        options: {
          livereload: true
        }
      },
      express: {
        files: [
          'server/**/*.{js,json,.md}'
        ],
        tasks: ['express:dev', 'wait'],
        options: {
          livereload: true,
          nospawn: true //Without this option specified express won't be reloaded
        }
      }
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '<%= yeoman.client %>/.jshintrc',
        reporter: require('jshint-stylish')
      },
      server: {
        options: {
          jshintrc: 'server/.jshintrc'
        },
        src: [
          'server/**/*.js',
          '!server/**/*.spec.js'
        ]
      },
      serverTest: {
        options: {
          jshintrc: 'server/.jshintrc-spec'
        },
        src: ['server/**/*.spec.js']
      },
      all: [
        '<%= yeoman.client %>/{app,components}/**/*.js',
        '!<%= yeoman.client %>/{app,components}/**/*.spec.js',
        '!<%= yeoman.client %>/{app,components}/**/*.mock.js'
      ],
      test: {
        src: [
          '<%= yeoman.client %>/{app,components}/**/*.spec.js',
          '<%= yeoman.client %>/{app,components}/**/*.mock.js'
        ]
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= yeoman.dist %>/*',
            '!<%= yeoman.dist %>/.git*',
            '!<%= yeoman.dist %>/.openshift',
            '!<%= yeoman.dist %>/Procfile'
          ]
        }]
      },
      server: '.tmp'
    },

    // Add vendor prefixed styles
    autoprefixer: {
      options: {
        browsers: ['last 1 version']
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/',
          src: '{,*/}*.css',
          dest: '.tmp/'
        }]
      }
    },

    // Debugging with node inspector
    'node-inspector': {
      custom: {
        options: {
          'web-host': 'localhost'
        }
      }
    },

    // Use nodemon to run server in debug mode with an initial breakpoint
    nodemon: {
      debug: {
        script: 'server/app.js',
        options: {
          nodeArgs: ['--debug-brk'],
          env: {
            PORT: process.env.PORT || 9000
          },
          callback: function (nodemon) {
            nodemon.on('log', function (event) {
              console.log(event.colour);
            });

            // opens browser on initial server start
            nodemon.on('config:update', function () {
              setTimeout(function () {
                require('open')('http://localhost:8080/debug?port=5858');
              }, 500);
            });
          }
        }
      }
    },

    // Automatically inject Bower components into the app
    wiredep: {
      target: {
        src: '<%= yeoman.client %>/index.html',
        ignorePath: '<%= yeoman.client %>/',
        exclude: [/bootstrap-sass-official/, /bootstrap.js/, '/json3/', '/es5-shim/', /bootstrap.css/, /font-awesome.css/ ]
      }
    },

    // Renames files for browser caching purposes
    rev: {
      dist: {
        files: {
          src: [
            '<%= yeoman.dist %>/public/{,*/}*.js',
            '<%= yeoman.dist %>/public/{,*/}*.css'
          ]
        }
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      html: ['<%= yeoman.client %>/index.html'],
      options: {
        dest: '<%= yeoman.dist %>/public'
      }
    },

    // Performs rewrites based on rev and the useminPrepare configuration
    usemin: {
      html: ['<%= yeoman.dist %>/public/{,*/}*.html'],
      css: ['<%= yeoman.dist %>/public/{,*/}*.css'],
      js: ['<%= yeoman.dist %>/public/{,*/}*.js'],
      options: {
        assetsDirs: [
          '<%= yeoman.dist %>/public',
          '<%= yeoman.dist %>/public/assets/images'
        ],
        // This is so we update image references in our ng-templates
        patterns: {
          js: [
            [/(assets\/images\/.*?\.(?:gif|jpeg|jpg|png|webp|svg))/gm, 'Update the JS to reference our revved images']
          ]
        }
      }
    },

    // The following *-min tasks produce minified files in the dist folder
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.client %>/assets/images',
          src: '{,*/}*.{png,jpg,jpeg,gif}',
          dest: '<%= yeoman.dist %>/public/assets/images'
        }]
      }
    },

    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.client %>/assets/images',
          src: '{,*/}*.svg',
          dest: '<%= yeoman.dist %>/public/assets/images'
        }]
      }
    },

    // Allow the use of non-minsafe AngularJS files. Automatically makes it
    // minsafe compatible so Uglify does not destroy the ng references
    ngAnnotate: {
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/concat',
          src: '**/*.js',
          dest: '.tmp/concat'
        }]
      }
    },

    // Package all the html partials into a single javascript payload
    ngtemplates: {
      options: {
        // This should be the name of your apps angular module
        module: 'footballTaxApp',
        htmlmin: {
          collapseBooleanAttributes: true,
          collapseWhitespace: true,
          removeAttributeQuotes: true,
          removeEmptyAttributes: true,
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true
        },
        usemin: 'app/app.js'
      },
      main: {
        cwd: '<%= yeoman.client %>',
        src: ['{app,components}/**/*.html'],
        dest: '.tmp/templates.js'
      },
      tmp: {
        cwd: '.tmp',
        src: ['{app,components}/**/*.html'],
        dest: '.tmp/tmp-templates.js'
      }
    },

    // Replace Google CDN references
    cdnify: {
      dist: {
        html: ['<%= yeoman.dist %>/public/*.html']
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= yeoman.client %>',
          dest: '<%= yeoman.dist %>/public',
          src: [
            '*.{ico,png,txt}',
            '.htaccess',
            'bower_components/**/*',
            'assets/images/{,*/}*.{webp}',
            'assets/fonts/**/*',
            'assets/locales/*.json',
            'index.html'
          ]
        }, {
          expand: true,
          cwd: '.tmp/images',
          dest: '<%= yeoman.dist %>/public/assets/images',
          src: ['generated/*']
        }, {
          expand: true,
          dest: '<%= yeoman.dist %>',
          src: [
            'package.json',
            'server/**/*'
          ]
        }]
      },
      styles: {
        expand: true,
        cwd: '<%= yeoman.client %>',
        dest: '.tmp/',
        src: ['{app,components}/**/*.css']
      }
    },

    buildcontrol: {
      options: {
        dir: 'dist',
        commit: true,
        push: true,
        connectCommits: false,
        message: 'Built %sourceName% from commit %sourceCommit% on branch %sourceBranch%'
      },
      heroku: {
        options: {
          remote: 'heroku',
          branch: 'master'
        }
      },
      openshift: {
        options: {
          remote: 'openshift',
          branch: 'master'
        }
      }
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      server: [
        'babel',
        'jade',
        'less',
      ],
      test: [
        'babel',
        'jade',
        'less',
      ],
      debug: {
        tasks: [
          'nodemon',
          'node-inspector'
        ],
        options: {
          logConcurrentOutput: true
        }
      },
      dist: [
        'babel',
        'jade',
        'less',
        'imagemin',
        'svgmin'
      ]
    },

    // Test settings
    karma: {
      unit: {
        configFile: 'karma.conf.js',
        singleRun: true
      }
    },

    mochaTest: {
      options: {
        reporter: 'spec'
      },
      src: ['server/**/*.spec.js']
    },

    protractor: {
      options: {
        configFile: 'protractor.conf.js'
      },
      chrome: {
        options: {
          args: {
            browser: 'chrome'
          }
        }
      }
    },

    env: {
      test: {
        NODE_ENV: 'test'
      },
      prod: {
        NODE_ENV: 'production'
      },
      all: localConfig
    },

    // Compiles Jade to html
    jade: {
      compile: {
        options: {
          data: {
            debug: false
          }
        },
        files: [{
          expand: true,
          cwd: '<%= yeoman.client %>',
          src: [
            '{app,components}/**/*.jade'
          ],
          dest: '.tmp',
          ext: '.html'
        }]
      }
    },

    // Compiles ES6 to JavaScript using Babel
    babel: {
      options: {
        sourceMap: true
      },
      server: {
        files: [{
          expand: true,
          cwd: 'client',
          src: [
            '{app,components}/**/*.js',
            '!{app,components}/**/*.spec.js'
          ],
          dest: '.tmp'
        }]
      }
    },

    // Compiles Less to CSS
    less: {
      options: {
        paths: [
          '<%= yeoman.client %>/bower_components',
          '<%= yeoman.client %>/app',
          '<%= yeoman.client %>/components'
        ]
      },
      server: {
        files: {
          '.tmp/app/app.css' : '<%= yeoman.client %>/app/app.less'
        }
      },
    },

    injector: {
      options: {

      },
      // Inject application script files into index.html (doesn't include bower)
      scripts: {
        options: {
          transform: function(filePath) {
            filePath = filePath.replace('/client/', '');
            filePath = filePath.replace('/.tmp/', '');
            return '<script src="' + filePath + '"></script>';
          },
          starttag: '<!-- injector:js -->',
          endtag: '<!-- endinjector -->'
        },
        files: {
          '<%= yeoman.client %>/index.html': [
               [
                 '.tmp/{app,components}/**/*.js',
                 '!{.tmp,<%= yeoman.client %>}/app/app.js',
                 '!{.tmp,<%= yeoman.client %>}/{app,components}/**/*.spec.js',
                 '!{.tmp,<%= yeoman.client %>}/{app,components}/**/*.mock.js'
               ]
            ]
        }
      },

      // Inject component less into app.less
      less: {
        options: {
          transform: function(filePath) {
            filePath = filePath.replace('/client/app/', '');
            filePath = filePath.replace('/client/components/', '');
            return '@import \'' + filePath + '\';';
          },
          starttag: '// injector',
          endtag: '// endinjector'
        },
        files: {
          '<%= yeoman.client %>/app/app.less': [
            '<%= yeoman.client %>/{app,components}/**/*.less',
            '!<%= yeoman.client %>/app/app.less'
          ]
        }
      },

      // Inject component css into index.html
      css: {
        options: {
          transform: function(filePath) {
            filePath = filePath.replace('/client/', '');
            filePath = filePath.replace('/.tmp/', '');
            return '<link rel="stylesheet" href="' + filePath + '">';
          },
          starttag: '<!-- injector:css -->',
          endtag: '<!-- endinjector -->'
        },
        files: {
          '<%= yeoman.client %>/index.html': [
            '<%= yeoman.client %>/{app,components}/**/*.css'
          ]
        }
      }
    },

    // Extract dataset from googlespeadsheet
    gss_to_json: _.merge({
      options: {
        // edit-google-spreadsheet options go here
        debug: true,
        prettify: true,
        includeInfo: false,
        headerIsFirstRow: true,
        worksheetName: 'money_transfers',
        // Google Spreadsheet configuration
        oauth2: require("./server/config/environment").gss.oauth2,
        // Substitue col name to col number
        transformRow: function(row, header) {
          var rowdata = {};
          Object.keys(row).forEach(function(col) {
            var key = header[col] ? header[col].toLowerCase().replace(/[^a-z]/g, "") : col;
            rowdata[key] = row[col];
            // Boolean value might be expressed with words
            rowdata[key] = rowdata[key] === 'yes' ? true  : rowdata[key];
            rowdata[key] = rowdata[key] === 'no'  ? false : rowdata[key];
            // Exclude some keys
            if( ['amountinusd', 'amountformula'].indexOf(key) > -1 ) {
              delete rowdata[key];
            }
          });
          return rowdata;
        }
      }
    }, clubs)
  });

  // Used for delaying livereload until after server has restarted
  grunt.registerTask('wait', function () {
    grunt.log.ok('Waiting for server reload...');

    var done = this.async();

    setTimeout(function () {
      grunt.log.writeln('Done waiting!');
      done();
    }, 1500);
  });

  grunt.registerTask('express-keepalive', 'Keep grunt running', function() {
    this.async();
  });


  grunt.registerTask('gss_to_md', function () {
    const BASE = 'en';
    const LOCALES_DIR = 'client/assets/locales';
    const PAGE_DIR = 'server/pages/clubs';
    // Force task into async mode and grab a handle to the "done" function.
    let done = this.async();

    // True is the given path exists
    let exists =  function(path) {
      try {
        return !! fs.statSync(path);
      } catch (e) {
        return false;
      }
    };

    grunt.file.glob(path.join(LOCALES_DIR, '*.json'), function(err, languages) {
      const LANGUAGES = _.map(languages, l=> l.match(/\/locales\/(\w+)\.json$/)[1] );
      const CLUBS = _.keys( require('./server/config/clubs.json') )

      for(let club of CLUBS) {
        for(let lang of LANGUAGES) {
          let dir = path.join(__dirname, PAGE_DIR, club);
          let md  = path.join(dir, lang) + '.md';
          // Create dir for this club (skip existing)
          if(! exists(dir) ) {
            // One dir by club
            fs.mkdirSync(dir);
          }
          // Create new file
          if(! exists(md) ){
            // All file starts empty
            fs.writeFileSync(md, '');
          }
        }
      }

      done();
    });
  });

  grunt.registerTask('gss', 'env:all', 'gss_to_json', 'gss_to_md', 'transferstypes', 'stadiums')

  grunt.registerTask('serve', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'env:all', 'env:prod', 'express:prod', 'wait', 'open', 'express-keepalive']);
    }

    if (target === 'debug') {
      return grunt.task.run([
        'clean:server',
        'env:all',
        'injector:less',
        'concurrent:server',
        'injector',
        'wiredep',
        'autoprefixer',
        'concurrent:debug'
      ]);
    }

    grunt.task.run([
      'clean:server',
      'env:all',
      'injector:less',
      'concurrent:server',
      'injector',
      'wiredep',
      'autoprefixer',
      'express:dev',
      'wait',
      //'open',
      'watch'
    ]);
  });

  // Creates and complete every existing locales
  grunt.registerTask('locales', function () {
    const BASE = 'en';
    const LOCALES_DIR = 'client/assets/locales';
    // Force task into async mode and grab a handle to the "done" function.
    let done = this.async();

    grunt.file.glob(path.join(LOCALES_DIR, '*.json'), function(err, languages) {
      const LANGUAGES = _.map(languages, l=> l.match(/\/locales\/(\w+)\.json$/)[1] );
       // Get locale file for the given lang key
      var getLocalePath = (l)=> './' + path.join(LOCALES_DIR, l.toLowerCase() + '.json');
      // Function to gets translations for a given language code
      var getLocaleMessages = (lang)=> {
        // Since the file might not exist yet...
        try {
          // Read the language file
          return require(getLocalePath(lang));
        // We catch the error to return an empty set of translation
        } catch(e) {
          return {};
        }
      };
      // Gets base messages
      var baseMessages = getLocaleMessages(BASE);
      // Treats every languages
      for( var lang of LANGUAGES ) {
        // Gets messages for the current lang
        var messages = getLocaleMessages(lang);
        // Read every existing key from the base file
        for( var key in baseMessages ) {
          // Does the target lang have the key?
          if( ! messages[key] ) {
            // Add the key
            messages[key] = baseMessages[key];
          }
        }
        var file = JSON.stringify(messages, null, 2)
        // And override the existinng JSON file
        fs.writeFileSync(getLocalePath(lang), file);
      }
      done();
    });

  });

  grunt.registerTask('transferstypes', function () {
    const BASE = 'en';
    const LOCALES_DIR = 'client/assets/locales'
    const BASE_PATH = path.join(__dirname, LOCALES_DIR, BASE + '.json');
    // Force task into async mode and grab a handle to the "done" function.
    let done = this.async();
    // Open the base locales file
    let base = require(BASE_PATH);
    // Get all file names
    grunt.file.glob("server/data/clubs/*/money_transfers.json", function(er, files) {
      // Collected types
      let types = [];
      // For each files
      for( var filepath of files) {
        // Open the JSON containing all transfers
        let transfers = require( path.join(__dirname, filepath) );
        // Collects types in this file
        types = types.concat( _.pluck(transfers, 'type') );
      }
      // Remove dupliccated types
      types = _.uniq(types);
      // Complete the base file with non-existing types
      for(let t of types) {
        // The type is new
        base[t] = base[t] || t;
      }
      // And override the existinng JSON file
      fs.writeFileSync(BASE_PATH, JSON.stringify(base, null, 2) );
      done();
    });
  });

  grunt.registerTask('stadiums', function() {
    const BASE_PATH = path.join(__dirname, 'server/data/stadiums/all.json');
    // Force task into async mode and grab a handle to the "done" function.
    let done = this.async();
    // Get all file names
    grunt.file.glob("server/data/clubs/*/desc_stadium.json", function(er, files) {
      // Collected stadiums
      let stadiums = [];
      // For each files
      for( var filepath of files) {
        // Open club desc to complete stadium
        let club_file = filepath.replace('desc_stadium.json', 'desc_club.json');
        let club_desc = require(path.join(__dirname, club_file))[0];
        let club_slug = path.dirname(filepath).replace('server/data/clubs/', '')
        // Open money transfers to complete stadium
        let tansfers_file = filepath.replace('desc_stadium.json', 'money_transfers.json');
        let money_transfers = require(path.join(__dirname, tansfers_file));
        // Open the JSON containing description
        let stadium_desc = require( path.join(__dirname, filepath) );
        // Collects stadiums in this file (it should have only one
        // but we are open to the possibility of several stadiums)
        for(let stadium of stadium_desc) {
          stadium.city    = _.trim(club_desc.city || stadium.city);
          stadium.country = _.trim(club_desc.country || stadium.country);
          stadium.name    = _.trim(stadium.name)
          stadium.club    = club_slug;
          // Collect money transfers for this stadiums
          stadium.money_transfers = _.filter(money_transfers, { stadium: stadium.name });
        }
        // We don't insert stadium without a name
        stadiums = stadiums.concat( _.filter(stadium_desc, s=> s.name) );
      }
      // And override the existinng JSON file
      fs.writeFileSync(BASE_PATH, JSON.stringify(stadiums, null, 2) );
      done();
    });
  })

  grunt.registerTask('server', function () {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run(['serve']);
  });

  grunt.registerTask('test', function(target) {
    if (target === 'server') {
      return grunt.task.run([
        'env:all',
        'env:test',
        'mochaTest'
      ]);
    }

    else if (target === 'client') {
      return grunt.task.run([
        'clean:server',
        'env:all',
        'injector:less',
        'concurrent:test',
        'injector',
        'autoprefixer',
        'karma'
      ]);
    }

    else if (target === 'e2e') {
      return grunt.task.run([
        'clean:server',
        'env:all',
        'env:test',
        'injector:less',
        'concurrent:test',
        'injector',
        'wiredep',
        'autoprefixer',
        'express:dev',
        'protractor'
      ]);
    }

    else grunt.task.run([
      'test:server',
      'test:client'
    ]);
  });

  grunt.registerTask('build', [
    'clean:dist',
    'injector:less',
    'concurrent:dist',
    'injector',
    'wiredep',
    'useminPrepare',
    'autoprefixer',
    'ngtemplates',
    'concat',
    'ngAnnotate',
    'copy:dist',
    'cdnify',
    'cssmin',
    'uglify',
    'rev',
    'usemin'
  ]);

  grunt.registerTask('default', [
    'newer:jshint',
    'test',
    'build'
  ]);
};
