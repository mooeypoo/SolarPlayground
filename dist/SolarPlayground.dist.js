/**
 * SolarPlayground - The adaptive javascript-based solar
 * system simulator.
 *
 * @author Moriel Schottlender
 *
 * Define an easily accessed global namespace for the
 * Solar Playground system.
 */
( function () {
	var solarPlayground = {};

	/**
	 * General method to produce logs into the console
	 * or some files.
	 *
	 * @param {String} type Message type: LOG, ERROR
	 * @param {String} msg Log message
	 */
	solarPlayground.log = function ( type, msg ) {
		type = type || 'LOG';
		// TODO: Condition the console logging only on debug mode
		// otherwise output logs to a file
		window.console.log( '[' + type + '] ' + msg );
	};

	// Add to the global namespace
	window.sp = solarPlayground;
} )();

/*
 * Copyright (C) 2012 David Geary. This code is from the book
 * Core HTML5 Canvas, published by Prentice-Hall in 2012.
 *
 * License:
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation files
 * (the "Software"), to deal in the Software without restriction,
 * including without limitation the rights to use, copy, modify, merge,
 * publish, distribute, sublicense, and/or sell copies of the Software,
 * and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * The Software may not be used to create training material of any sort,
 * including courses, books, instructional videos, presentations, etc.
 * without the express written consent of David Geary.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
*/

window.requestNextAnimationFrame = ( function () {
	var originalWebkitRequestAnimationFrame = undefined,
		wrapper = undefined,
		callback = undefined,
		geckoVersion = 0,
		userAgent = navigator.userAgent,
		index = 0,
		self = this;

		// Workaround for Chrome 10 bug where Chrome
		// does not pass the time to the animation function

	if ( window.webkitRequestAnimationFrame ) {
		// Define the wrapper
		wrapper = function (time) {
			if (time === undefined) {
				time += new Date();
			}
			self.callback(time);
		};

		// Make the switch
		originalWebkitRequestAnimationFrame = window.webkitRequestAnimationFrame;

		window.webkitRequestAnimationFrame = function ( callback, element ) {
			self.callback = callback;

			// Browser calls the wrapper and wrapper calls the callback
			originalWebkitRequestAnimationFrame( wrapper, element );
		}
	}

	// Workaround for Gecko 2.0, which has a bug in
	// mozRequestAnimationFrame() that restricts animations
	// to 30-40 fps.

	if ( window.mozRequestAnimationFrame ) {
		// Check the Gecko version. Gecko is used by browsers
		// other than Firefox. Gecko 2.0 corresponds to
		// Firefox 4.0.
		index = userAgent.indexOf( 'rv:' );

		if ( userAgent.indexOf( 'Gecko' ) != -1) {
			geckoVersion = userAgent.substr( index + 3, 3 );

			if ( geckoVersion === '2.0' ) {
				// Forces the return statement to fall through
				// to the setTimeout() function.
				window.mozRequestAnimationFrame = undefined;
			}
		}
	}

	return window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		function ( callback, element ) {
			var start,
				finish;

			window.setTimeout( function () {
				start += new Date();
				callback( start );
				finish += new Date();

				self.timeout = 1000 / 60 - ( finish - start );
			}, self.timeout );
		};
} ) ();

/**
 * Solar playground scenario container
 *
 * @param {jQuery} $canvas Target canvas for the scenario
 * @param {Object} scenario Scenario configuration object
 */
sp.Scenario = function SpScenario( $canvas, scenario ) {
	var objects;

	// Mixin constructors
	OO.EventEmitter.call( this );

	// TODO: Create another canvas for trails so we can draw planet
	// trails that remain for a bit on the screen
	this.$canvas = $canvas;
	this.context = $canvas[0].getContext( '2d' );

	// TODO: Validate the scenario object to make sure all required
	// elements exist.

	this.paused = false;
	this.objects = {};

	this.centerPoint = {
		x: this.$canvas.width() / 2,
		y: this.$canvas.height() / 2
	};

	// TODO: Create camera controller
	this.camera = {
		'yaw': 0,
		'pitch': 0
	};

	// Prepare general configuration
	this.config = scenario.config || {};

	this.pov_key = this.config.init_pov;
	this.pov_object = null;
	this.pov_coords = null;

	this.config.orbit_scale = this.config.orbit_scale || 0.5 * Math.pow( 10, -5 );

	this.date = this.config.start_time || { day: 1, month: 1, year: 2000 };
	this.time = 0;
	this.speed = this.config.init_speed || 1;
	this.zoom = this.config.init_zoom || 1;

	// Size steps for drawing. Bigger and smaller planets will accept
	// the value of these steps so they can be scaled to canvas size, but
	// still have a more-or-less representative size on the screen.
	// Size is in pixels and represents circle radius.
	this.relative_radii = [ 2, 4, 6, 8, 10, 12, 14, 16, 18, 20 ];

	// Prepare the objects
	this.processObjects( scenario.objects || {} );
};

/* Inheritance */
OO.mixinClass( sp.Scenario, OO.EventEmitter );

/**
 * Process the solar playground simulator objects
 * @param {Object} scenarioObjects Simulation objects definition
 */
sp.Scenario.prototype.processObjects = function SpScenarioProcessObjects( scenarioObjects ) {
	var o, co, radii = [], radii_diff, step_size, radius, circle_radius, smallest_radii;

	// Initialize celestial objects
	for ( o in scenarioObjects ) {
		this.objects[o] = new sp.Scenario.CelestialObject( scenarioObjects[o] );

		// Calculate relative radii
		if ( scenarioObjects[o].vars.r ) {
			radii.push( Number( scenarioObjects[o].vars.r ) );
		}
	}

	// Calculate effective drawing radius
	// TODO: Find a better way to represent planet radii, scaled to the canvas

	// Sort by size, ascending
	radii.sort( function ( a, b ) {
		return a - b;
	} );
	// First see if the biggest object (usually the star) is too big to count
	if ( Math.ceil( radii[ radii.length - 1] / radii[ radii.length - 2 ] ) >= 10 ) {
		// Big planet is too big to count.
		radii.shift();
	}
	// Check biggest and smallest
	radii_diff = radii[ radii.length - 1 ] - radii[0];
	smallest_radii = radii[0];
	// Create radius 'steps' fitting the pixel size steps
	step_size = radii_diff / ( this.relative_radii.length - 1 );

	// Connect selestial objects to orbit
	// And fit each planet drawing size to its relative size
	for ( co in this.objects ) {
		if ( scenarioObjects[co] && this.objects[scenarioObjects[co].orbiting] ) {
			// Connect the object to its center of orbit
			this.objects[co].setOrbit( this.objects[scenarioObjects[co].orbiting] );
		}
		radius = this.objects[co].getRadius();
		if ( radius ) {
			circle_radius = this.relative_radii[ Math.floor( ( radius - smallest_radii ) / step_size ) ];
			this.objects[co].setCircleRadius( circle_radius );
		}
	}

	// Set initial POV
	if ( this.pov_key && this.objects[this.pov_key] ) {
		this.pov_object = this.objects[this.pov_key];
	}
};

/**
 * Draw all elements
 * @param {number} time Time
 */
sp.Scenario.prototype.draw = function SpScenarioUpdateObjects( time ) {
	var o, coords, translatedCoords, view, radius;

	for ( o in this.objects ) {
		coords = this.objects[o].getSpaceCoordinates( time );

		// Update POV coordinates
		if ( o === this.pov_key ) {
			this.pov_coords = coords;
		}
		// Translate coordinates to canvas
		translatedCoords = this.translateScreenCoodinates( coords );

		// Get graphic details
		view = this.objects[o].getView();

		// TODO: Allow the user to choose between relative radii and preset radius value
		// in the view parameters, instead of having the view take precedence randomly
		radius = ( this.objects[o].getCircleRadius() * this.zoom );
		radius = radius >= 2 ? radius : 2;

		this.context.save();
		this.context.beginPath();
		this.context.arc( translatedCoords.x, translatedCoords.y, radius || 5, 0, 2 * Math.PI, false );
		this.context.fillStyle = view.color || 'white';
		this.context.fill();
		this.context.restore();
	}
};

sp.Scenario.prototype.run = function SpScenarioRun() {
	if ( !this.paused ) {
		// Clear canvas
		this.context.clearRect( 0, 0, this.$canvas.width(), this.$canvas.height() );

		// Draw canvas
		this.draw( this.time );

		// Increase time
		this.time += 0.0000000001 * this.speed;

		window.requestNextAnimationFrame( $.proxy( this.run, this ) );
	}
}

sp.Scenario.prototype.translateScreenCoodinates = function SpScenarioAnimate( coords ) {
	var pov = this.pov_coords || { x: 0, y: 0, z: 0 },
		ca = Math.cos( this.camera.yaw ),
		sa = Math.sin( this.camera.yaw ),
		cb = Math.cos( this.camera.pitch ),
		sb = Math.sin( this.camera.pitch ),
		dx = this.centerPoint.x,
		dy = this.centerPoint.y,
		scale = Math.sqrt( this.config.orbit_scale * this.zoom );

	// TODO: Work out scale
	x = ( coords.x - pov.x ) * scale;
	y = ( coords.y - pov.y ) * scale;
	z = ( coords.z - pov.z ) * scale;

	destination = {
		'x': x * ca - y * sa + dx,
		'y': x * sa + y * ca
	};
	destination.z = destination.y * sb;
	destination.y = destination.y * cb + dy
	return destination;
};

/**
 * Toggle between pause and resume the scenario
 * @param {boolean} [isPause] Optional. If supplied, pauses or resumes the scenario
 */
sp.Scenario.prototype.togglePaused = function SpScenarioTogglePaused( isPause ) {
	isPause = !!isPause || !this.paused;
	this.paused = isPause;
	this.run();
};

/**
 * Check whether the scenario is paused
 */
sp.Scenario.prototype.isPaused = function SpScenarioTogglePaused() {
	return this.paused;
};

/**
 * Pause the scenario
 */
sp.Scenario.prototype.pause = function SpScenarioPause() {
	this.paused = true;
};

/**
 * Resume the scenario
 */
sp.Scenario.prototype.resume = function SpScenarioResume() {
	this.paused = false;
	this.run();
};

/**
 * Solar Playground system
 *
 * @param {Object} [config] Configuration object
 */
sp.System = function SpSystemInitialize( config ) {
	var defaultConfig;

	config = config || {};

	defaultConfig = {
		container: '#solarSystem',
		scenario_dir: 'scenarios', // Current directory unless otherwise specified
		directory_sep: '/',
		width: $( window ).width() - 100,
		height: $( window ).height() - 100
	};

	// Extend default global options
	this.config = $.extend( true, config, defaultConfig );

	// Mixin constructors
	OO.EventEmitter.call( this );

	this.scenario = null;

	// Initialize
	this.$container = $( this.config.container )
		.addClass( 'sp-system-container' )

	this.$spinner = $( '<div>' )
		.addClass( 'sp-system-spinner' )
		.appendTo( this.$container );

	this.$canvas = $( '<canvas>' )
		.addClass( 'sp-system-canvas' )
		.attr( 'width', this.config.width )
		.attr( 'height', this.config.height )
		.appendTo( this.$container );

	this.$spinner.hide().detach();
};

/* Inheritance */
OO.mixinClass( sp.System, OO.EventEmitter );

/* Methods */

/**
 * Load a scenario
 * @param {String} scenarioName Scenario name. The system will search for
 *  an ajax response from source 'scenario.[name].json' in the scenario
 *  directory.
 */
sp.System.prototype.load = function SpSystemLoad( scenarioName ) {
	var targetName,
		targetDir = this.config.scenario_dir + this.config.directory_sep;

	scenarioName = scenarioName || 'example';
	targetName = 'scenario.' + scenarioName + '.json';

	$.getJSON( targetDir + targetName )
		.done( $.proxy( function ( response ) {
			// Load the scenario
			this.loadScenario( response );
		}, this ) )
		.fail( function () {
			sp.log( 'Error', 'Scenario ' + targetName + ' not found in directory "' + targetDir + '"' );
		} );
};

/**
 * Load and run a scenario
 * @param {Object} scenarioObject Scenario configuration object
 */
sp.System.prototype.loadScenario = function SpSystemLoadScenario( scenarioObject ) {
	scenarioObject = scenarioObject || {};

	this.scenario = new sp.Scenario( this.$canvas, scenarioObject );

	this.scenario.run();
};

/**
 * Toggle between pause and resume the scenario
 * @param {boolean} [isPause] Optional. If supplied, pauses or resumes the scenario
 */
sp.System.prototype.togglePaused = function SpSystemTogglePaused( isPause ) {
	this.scenario.togglePaused( isPause );
};

/**
 * Check whether the scenario is paused
 */
sp.System.prototype.isPaused = function SpSystemIsPaused() {
	return this.scenario.isPaused();
};

/**
 * Get configuration option or full configuration object.
 * @param {string} [option] Configuration key
 * @returns {string|Object} Configuration object
 */
sp.System.prototype.getConfig = function SpSystemGetConfig( option ) {
	if ( this.config[option] ) {
		return this.config[option];
	}
	return this.config;
};

/**
 * Scenario calculator
 * @param {Object} [config] Configuration object
 */
sp.Scenario.Calculator = function SpScenarioCalculator( config ) {

};

/**
 * Astronomical constants. Mostly related to the solar
 * system but also to other calculations.
 * @property {Object}
 */
sp.Scenario.Calculator.constants = {
	// Astronomical units (AU) in km
	'AU': 149597871, // km
	// Gravitational constant in N*(m/kg)^2
	'G': 6.67 * Math.pow( 10, -11 )
};

/**
 * Calculate the absolute time needed for proper calculations.
 * In our case, it is the number of days from 1999 Dec 31, 0:00 UT
 * @param {number} year Requested year (YYYY)
 * @param {number} month Requested month
 * @param {number} day Requested day of the month
 * @param {number} time_of_day Time of day in decimals 0-24
 * @returns {number} The decimal number of days from 1999 Dec 31, 0:00 UT
 */
sp.Scenario.Calculator.translateTime = function SpScenarioCalculatorGetAbsTime( year, month, day, time_of_day ) {
	var totalDays;
	year = year || 2014;
	month = month || 6;
	day = day || 10;
	time_of_day = time_of_day || 0;

	// The day calculation must be integer calculation, so 'Math.floor' must
	// be used for all divisions
	totalDays = 367 * year - 7 *
		Math.floor( ( year + Math.floor( ( month + 9 ) / 12 ) ) / 4 ) +
		275 * Math.floor( month / 9 ) + D - 730530;

	// Add time (floating point division)
	totalDays += time_of_day / 24;

	return totalDays;
};

/**
 * Return a JDN (Julian Day Number) from J2000.0, converted from a Gregorian date and time
 * @param {[type]} year Requested year (yyyy)
 * @param {number} month Requested month
 * @param {number} day Requested day of the month
 * @param {number} [hours] Hour of the day in 24h format
 * @param {number} [minutes] Minutes after the hour
 * @param {number} [seconds] Seconds after the minute
 * @returns {number} JDN, number of days from epoch J2000.0
 */
sp.Scenario.Calculator.getJDNTime = function SpScenarioCalculatorGetEpochTime( year, month, day, hours, minutes, seconds ) {
	var JDN,
		a = Math.floor( ( 14 - month ) / 12 ),
		y = year + 4800 - a,
		m = month + 12 * a - 3;

	hours = hours || 12; // Given hours or midday
	minutes = minutes || 0;
	seconds = seconds || 0;

	// Translate from Gregorian to JDN
	// Calculation take from
	// https://en.wikipedia.org/wiki/Julian_day#Converting_Julian_or_Gregorian_calendar_date_to_Julian_Day_Number
	JDN = day + Math.floor( ( 153 * m + 2) / 5 ) + 365 * y +
		Math.floor( y / 4 ) - Math.floor( y / 100 ) + Math.floor( y / 400 ) +
		32045

	// Include time of day
	JD = JDN + ( ( hours - 12 ) / 24 ) + ( minutes / 1440 ) + ( seconds / 86400 );

	// Return JD from J2000.0 (Epoch)
	return JD - 2451545.0;
};

/**
 * Solve the Kepler equation for the given parameters to get the object's
 * position in space. This position is raw heliocentric space coordiates
 *
 * Calculation taken from NASA JPL Formula:
 * http://ssd.jpl.nasa.gov/?planet_pos
 * And
 * https://gist.github.com/bartolsthoorn/7913357
 *
 * @param {Object} vars Variables necessary for calculation.
 * @param {number[]} vars.a Semi-major axis (au and au/seconds)
 * @param {number[]} vars.e Eccentricity ( no units and no units/seconds)
 * @param {number[]} vars.I Inclination (degrees and degrees/seconds)
 * @param {number[]} vars.L Mean longitude (degrees and degrees/seconds)
 * @param {number[]} vars.long_peri Longitude of perihelion (degree and degrees/seconds)
 * @param {number[]} vars.long_node Longitude of the ascending node (degrees and degrees/seconds)
 * @param {number} [jd] Julian Days from J2000.0. If not given, calculated for J2000.0
 * @returns {Object} Three-dimensional position in space, values in km
 */
sp.Scenario.Calculator.solveKepler = function SpScenarioCalculatorSolveKepler( vars, jd ) {
	var T, a, e, I, L, om, bigOm, omega, M, b, c, f, s,
		dimensions = {},
		x_tag, y_tag, z_tag,
		ITERLIMIT = 1000,
		ERRORLIMIT = Math.pow( 10, -4 ),
		/**
		 * Convert angles to radians
		 * @param {number} angle Angle
		 * @returns {number} Radians
		 */
		to_radians = function ( angle ) {
			return angle * ( 180 / Math.PI );
		},
		/**
		 * Approximate the eccententric anomaly by iteration
		 * @param {number} e Eccentricity
		 * @param {number} M Mean anomaly
		 * @returns {number} Eccentric anomaly in radians
		 */
		approximate_E = function ( e, M ) {
			var e_star = ( Math.PI / 180 ) * e,
			E_n = M + e_star + Math.sin( to_radians( M ) ),
			dE = 1,
			i = 0;

			while ( ITERLIMIT-- && Math.abs( dE ) > ERRORLIMIT ) {
				dM = M - ( E_n - e_star * Math.sin( to_radians( E_n ) ) );
				dE = dM / ( 1 - e * Math.cos( to_radians( E_n ) ) );
				E_n = E_n + dE;
			}
			return to_radians( E_n );
		};

	if ( !vars ) {
		return null;
	}

	// Optional variables
	T = jd || 0;
	b = vars.b || 0;
	c = vars.c || 0;
	f = vars.f || 0;
	s = vars.s || 0;

	// Calculate the elements
	a = vars.a[0] + vars.a[1] * T;
	e = vars.e[0] + vars.e[1] * T;
	I = vars.I[0] + vars.I[1] * T;
	L = vars.L[0] + vars.L[1] * T;
	om = vars.long_peri[0] + vars.long_peri[1] * T;
	bigOm = vars.long_node[0] + vars.long_node[1] * T;

	// Argument of perihelion
	omega = om - bigOm;

	// Mean anomaly
	M = L - om + b *
		Math.pow( T, 2 ) + c * Math.cos( f * T ) + s * Math.sin( f * T );
	M = to_radians( M ) % 180;

	// Eccentric anomaly
	E = approximate_E( e, M );

	// Heliocentric coordinates
	x = a * ( Math.cos( E ) - e );
	y = a * Math.sqrt( 1 - Math.pow( e, 2 ) ) * Math.sin( E );
	z = 0;

	// TODO: Figure out how to adjust to a system
	// where two or more stars are the 'heliocentric'
	// coordinate center, like binary systems

	dimensions = {
		'x': x,
		'y': y,
		'z': y
	}
	return dimensions;
};

/**
 * Celestial object
 * @param {Object} config Celestial object definition
 */
sp.Scenario.CelestialObject = function SpScenarioCelestialObject( config ) {
	config = config || {};

	// Mixin constructors
	OO.EventEmitter.call( this );

	// Cache
	this.cache = {};

	// Attributes
	this.name = config.name || '';
	this.description = config.description || '';
	this.view = config.graphic || {};

	this.transform = { x: 0, y: 0, angle: 0, scale: 1 };

	this.vars = config.vars;

	this.initial_position = config.initial_position || { 'x': 0, 'y': 0 };

	// Link to the object it is orbiting
	this.orbiting = null;

	// Initial radius
	this.circleRadius = Number( config.vars.r ) || 10;
};

/* Inheritance */
OO.mixinClass( sp.Scenario.CelestialObject, OO.EventEmitter );

/**
 * Get space coordinates per time.
 * @param {number} time Time unit
 */
sp.Scenario.CelestialObject.prototype.getSpaceCoordinates = function SpScenarioCelestialObjectUpdateCoordinates( time ) {
	var dest, M, G, period;

	time = time || 0;

	if ( this.orbiting ) {
		// Find period if it doesn't exist
		if ( !this.vars.p ) {
			// Calculate period
			a = this.vars.a[0];// * sp.Scenario.Calculator.constants.AU;
			G = sp.Scenario.Calculator.constants.G;
			M = this.orbiting.getMass();
			this.vars.p = 2 * Math.PI * Math.sqrt( Math.pow( a, 3) / ( G * M ) );
		}

		// TODO: Cache coordinates

		this.coordinates = sp.Scenario.Calculator.solveKepler(
			this.vars,
			time
		);
	} else {
		this.coordinates = { x: 0, y: 0, z: 0 };
	}

	return this.coordinates;
};

/**
 * Get object name
 * @returns {string} Celestial object name
 */
sp.Scenario.CelestialObject.prototype.getName = function SpScenarioCelestialObjectGetName() {
	return this.name;
};

/**
 * Get object description
 * @returns {string} Celestial object description
 */
sp.Scenario.CelestialObject.prototype.getDescription = function SpScenarioCelestialObjectGetDescription() {
	return this.description;
};

/**
 * Set the object this object is orbiting
 * @param {sp.Scenario.CelestialObject} obj Object that is the center of the orbit
 */
sp.Scenario.CelestialObject.prototype.setOrbit = function SpScenarioCelestialObjectSetOrbit( obj ) {
	this.orbiting = obj;
};

/**
 * Retrieve the object that is the center of orbit
 * @returns {sp.Scenario.CelestialObject} obj Object that is the center of the orbit
 */
sp.Scenario.CelestialObject.prototype.getOrbit = function SpScenarioCelestialObjectGetOrbit() {
	return this.orbiting;
};

/**
 * Set object name
 * @param {string} name New object name
 */
sp.Scenario.CelestialObject.prototype.setName = function SpScenarioCelestialObjectSetName( name ) {
	this.name = name;
};

/**
 * Set object description
 * @param {string} desc New object description
 */
sp.Scenario.CelestialObject.prototype.setDescription = function SpScenarioCelestialObjectSetDescription( desc ) {
	this.description = desc;
};

sp.Scenario.CelestialObject.prototype.getMass = function SpScenarioCelestialObjectGetMass() {
	return this.vars.m;
};

sp.Scenario.CelestialObject.prototype.getView = function SpScenarioCelestialObjectGetView() {
	return this.view;
}

/**
 * Get the planet radius if it exists.
 * @returns {number|null} Planet radius in km
 */
sp.Scenario.CelestialObject.prototype.getRadius = function SpScenarioCelestialObjectGetRadius() {
	return this.vars.r;
};

/**
 * Set the radius for the circle representing this celestial object
 * @param {number} radius Size in pixels
 */
sp.Scenario.CelestialObject.prototype.setCircleRadius = function SpScenarioCelestialObjectSetDrawingRadius( radius ) {
	this.circleRadius = radius;
};

/**
 * Get the radius for the circle representing this celestial object
 * @returns {number} Radius in pixels
 */
sp.Scenario.CelestialObject.prototype.getCircleRadius = function SpScenarioCelestialObjectGetDrawingRadius() {
	return this.circleRadius;
};
