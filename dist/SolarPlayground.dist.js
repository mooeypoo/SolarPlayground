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
	 * @param {String} msg Log message
	 * @param {String} type Message type: LOG, ERROR
	 */
	solarPlayground.log = function ( msg, type ) {
		type = type || 'LOG';
		// TODO: Condition the console logging only on debug mode
		// otherwise output logs to a file
		window.console.log( type + ':\n' + msg );
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

	this.$canvas = $canvas;
	this.context = $canvas[0].getContext( '2d' );

	this.paused = false;
	this.objects = {};

	this.translateFactor = 0.000000004;
	this.centerPoint = {
		x: this.$canvas.width() / 2,
		y: this.$canvas.height() / 2
	};
	// Prepare general configuration
	this.config = scenario.config || {};

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
	var o, co;

	// Initialize celestial objects
	for ( o in scenarioObjects ) {
		this.objects[o] = new sp.Scenario.CelestialObject( scenarioObjects[o] );
	}

	// Connect selestial objects to orbit
	for ( co in this.objects ) {
		if ( scenarioObjects[co] && this.objects[scenarioObjects[co].orbiting] ) {
			// Connect the object to its center of orbit
			this.objects[co].setOrbit( this.objects[scenarioObjects[co].orbiting] );
		}
	}
};

/**
 * Draw all elements
 * @param {number} time Time
 */
sp.Scenario.prototype.draw = function SpScenarioUpdateObjects( time ) {
	var o, coords;

	for ( o in this.objects ) {
		coords = this.objects[o].updateCoordinates( time );
		// Translate coordinates to canvas
		coords = this.translateCoodinates( coords );
		// Draw

		this.context.save();
		this.context.beginPath();
		this.context.arc( coords.x, coords.y, 10, 0, 2 * Math.PI, false );
		this.context.fillStyle = 'green';
		this.context.fill();
		this.context.restore();
		sp.log( 'drawing "' + this.objects[o].getName() + '" at ' + coords.x + ':' + coords.y, 'notice' );
	}
};

sp.Scenario.prototype.run = function SpScenarioAnimate( time ) {
	if ( !this.paused ) {
		// Clear canvas
		this.context.clearRect( 0, 0, this.$canvas.width(), this.$canvas.height() );

		// Draw canvas
		this.draw( time );

		$.proxy( window.requestNextAnimationFrame, this, this.run, time++ );
	}
}

sp.Scenario.prototype.translateCoodinates = function SpScenarioAnimate( coords ) {
	coords = coords || { x: 0, y: 0 };

	coords.x = coords.x * this.translateFactor + this.centerPoint.x,
	coords.y = coords.y * this.translateFactor + this.centerPoint.y;
	return coords;
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
		directory_sep: '\\',
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
			sp.log( 'ERROR', 'Scenario ' + targetName + ' not found in directory "' + targetDir + '"' );
		} );
};

sp.System.prototype.loadScenario = function SpSystemLoadScenario( scenarioObject ) {
	scenarioObject = scenarioObject || {};

	this.scenario = new sp.Scenario( this.$canvas, scenarioObject );

	this.scenario.run();
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
 * Originally created by Matthew Watson Copyright (C) 2012
 * For SolarPlayground Educational Orbit Simulator
 *
 * Solver for the Keplerian orbit at time t with initial parameters.
 * @param {number} a Semi-major axis.
 * @param {number} e Eccentricity.
 * @param {number} p Period, not strictly needed, but saves carrying around
 *    masses or working them out.
 * @param {number} t Time.
 * @param {Object.<string,number>} [eangles] Euler angles in format {t: , p:,
 *    r: } for theta, phi and rho. In radians.
 * @param {Object.<string,number>} [destination] Optional object to the result
 *    in. Saves on gc if we're doing it a lot. Format {x: , y: , z: }.
 * @return {Object.<string,number>} destination The destination object passed
 *    in with modified coordinates, or a new object if none is provide.
 */
sp.Scenario.Calculator.solveKepler = function SpScenarioCalculatorSolveKepler( a, e, p, t, eangles, destination ) {
	// If destination isn't supplied, make one.
	if ( !destination ) {
		destination = {};
	}
	if ( a === 0 ) {
		destination.x = destination.y = destination.z = 0;
		return destination;
	}

	var ITERLIMIT = 1000,         // Limit on number of iterations.
		x = 0,
		y = 0,
		r = 0,                    // Temporary coords.
		M = t / p * Math.PI / 2,  // Mean anomaly.
		tanom = 0,                // True anomaly.
		E0 = 0,                   // Eccentric anomaly.
		E1 = 0;     // Ditto, two values for iterative soln.

	/**
	 * Improve our value for eccentric anomaly while the error is above
	 * truncation error, or until we have done ITERLIMIT cycles.
	 * NB: E1 - E0 is falsy when they are the same.
	 */
	do {
		E0 = E1;
		E1 = M + e * Math.sin( E0 );
	} while ( ITERLIMIT-- && E1 - E0 );

	E1 *= 0.5;  // We only want half E1 in later calcs.

	// Solve for true anomaly.
	tanom = 2 * Math.atan2( Math.sqrt( 1 + e ) * Math.sin( E1 ),
		Math.sqrt( 1 - e ) * Math.cos( E1 ) );

	// Solve for r, theta, x and y.
	r = a * ( 1 - e * e ) /
		( 1 + e * Math.cos( tanom ) );
	x = ( r ) * Math.cos( tanom );
	y = ( r ) * Math.sin( tanom );

	destination.x = x || 0;
	destination.y = y || 0;
	destination.z = 0 || 0;
	destination.r = r || 0;
	return destination;
};

/**
 * Celestial object
 * @param {Object} config Celestial object definition
 */
sp.Scenario.CelestialObject = function SpScenarioCelestialObject( config ) {
	config = config || {};

	// Mixin constructors
	OO.EventEmitter.call( this );

	// Attributes
	this.name = config.name || '';
	this.description = config.description || '';

	this.vars = config.vars;
	this.initial_position = config.initial_position || { 'x': 0, 'y': 0 };

	// Link to the object it is orbiting
	this.orbiting = null;
};

/* Inheritance */
OO.mixinClass( sp.Scenario.CelestialObject, OO.EventEmitter );

/**
 * Update coordinates for time.
 * @param {number} time Time unit
 */
sp.Scenario.CelestialObject.prototype.updateCoordinates = function SpScenarioCelestialObjectUpdateCoordinates( time ) {
	var dest, M, G;

	time = time || 0;

	// Calculate period (only once per session, if doesn't exist)
	if ( !this.vars.p && this.orbiting ) {
		// 1AU = 149 597 870 700 meters
		G =  6.67 * Math.pow( 10, -11 );
		// M = Mass of the object at the center of orbit
		// p^2 = (4*Math.PI * 149597870700) / G*M
		M = this.orbiting.getMass();
		if ( M ) {
			this.vars.p = Math.sqrt(
				( 4 * Math.PI * 149597870700 ) /
				( G * M )
			);
		}
	}

	this.coordinates = sp.Scenario.Calculator.solveKepler(
		this.vars.a,
		this.vars.e,
		this.vars.p || 0,
		time
	);

	return this.coordinates;
};

sp.Scenario.CelestialObject.prototype.getCoordinates = function SpScenarioCelestialObjectGetCoordinates() {
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
