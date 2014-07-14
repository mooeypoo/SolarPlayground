/*global module:false*/
module.exports = function ( grunt ) {
	// Project configuration.
	grunt.initConfig({
		// Metadata.
		pkg: grunt.file.readJSON( 'package.json' ),
		// Task configuration.
		concat: {
			dist: {
				src: [
					'src/js/sp.js',
					'src/js/*.js',
					'src/js/calc/*.js',
					'src/js/container/*.js',
					'src/js/data/*.js',
					'src/js/view/*.js',
					'src/js/ui/*.js',
					'src/js/ui/ext.ooui/sp.ui.ext.ooui.Mod.Play.js',
					'src/js/ui/ext.ooui/sp.ui.ext.ooui.Toolbar.js',
					'src/js/ui/ext.ooui/tools/sp.ui.ext.ooui.Tool.js',
					'src/js/ui/ext.ooui/tools/sp.ui.ext.ooui.LabelTool.js',
					'src/js/ui/ext.ooui/tools/sp.ui.ext.ooui.POVTool.js',
					'src/js/ui/ext.ooui/tools/sp.ui.ext.ooui.SliderTool.js'
				],
				dest: 'dist/SolarPlayground.dist.js'
			}
		},
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("mm-dd-yyyy") %> */\n'
			},
			dist: {
				files: {
					'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
				}
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
//			dist: [ 'src/js/*.js', 'src/js/**/*.js' ],
			gruntfile: {
				src: 'Gruntfile.js'
			}
		},
		jscs: {
			dist: [ 'src/js/*.js', 'src/js/**/*.js' ],
			options: {
				config: '.jscs.json'
			}
		},
		sass: {
			dist: {
				options: {
//					style: 'expanded'
				},
				files: {
					'dist/SolarPlayground.dist.css': 'src/scss/SolarPlayground.scss'
				}
			}
		},
		cssmin: {
			dist: {
				files: {
					'dist/SolarPlayground.dist.css': 'dist/SolarPlayground.dist.min.css'
				}
			}
		},
		jsduck: {
			main: {
				src: [ '<%= concat.dist.dest %>' ],
/*					'src/js/sp.js',
					'src/js/*.js',
					'src/js/**\/*.js',
				],*/
				dest: 'docs'
			}
		}
		// TODO: QUnit tests
//		qunit: {
//			files: ['test/**/*.html']
//		},
	});

	// These plugins provide necessary tasks.
//	grunt.loadNpmTasks('grunt-contrib-qunit');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-jscs-checker');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-jsduck');

	// Default task.
	grunt.registerTask( 'default', [ 'jshint', 'jscs', 'concat', 'uglify', 'sass' ] );
	// Build
	grunt.registerTask( 'build', [ 'jshint', 'jscs', 'concat', 'uglify', 'sass' ] );
	grunt.registerTask( 'all', [ 'jshint', 'jscs', 'concat', 'uglify', 'jsduck' ] );
};
