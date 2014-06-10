/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    // Task configuration.
    concat: {
      dist: {
        src: [
          'src/sp.js',
          'src/*.js',
          'src/**/*.js'
        ],
        dest: 'dist/SolarPlayground.dist.js'
      }
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        unused: true,
        boss: true,
        eqnull: true,
        browser: true,
        globals: {}
      },
      gruntfile: {
        src: 'Gruntfile.js'
      }
    },
    jscs: {
        CelestialPlayground: [ 'src/*.js', 'src/**/*.js' ],
        options: {
            config: ".jscs.json"
        }
    },
    jsduck: {
      main: {
        src: [
          'src/sp.js',
          'src/*.js',
          'src/**/*.js'
        ],
        dest: 'docs'
      }
    }
    // TODO: QUnit tests
//    qunit: {
//      files: ['test/**/*.html']
//    },
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-concat');
//  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-jscs-checker');
  grunt.loadNpmTasks('grunt-jsduck');

  // Default task.
  grunt.registerTask('default', ['jshint', 'jscs', 'concat' ]);
//  grunt.registerTask('default', ['jshint', 'jcsc', 'qunit', 'concat']);

};
