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
	/**
	 * Definition of the namespace with its sub-namespaces
	 * @property {Object}
	 */
	var solarPlayground = {
		'container': {
			'elements': {}
		},
		'data': {
			'items': {}
		},
		'calc': {},
		'view': {},
		'ui': {
			'ext': {}
		}
	};

	/**
	 * General method to produce logs into the console
	 * or some files.
	 *
	 * @param {String} type Message type: LOG, ERROR
	 * @param {String} msg Log message
	 */
	solarPlayground.log = function SpLog( type, msg ) {
		type = type || 'LOG';
		// TODO: Condition the console logging only on debug mode
		// otherwise output logs to a file
		window.console.log( '[' + type + '] ' + msg );
	};

	// Add to the global namespace
	window.sp = solarPlayground;
} )();

/*
 * Animation requestNextAnimationFrame based on available
 * technology in the browser.
 *
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
 * Solar Playground system controller
 *
 * @class sp.System
 * @mixins OO.EventEmitter
 *
 * @param {Object} [config] Configuration object
 */
sp.System = function SpSystem( config ) {
	var defaultConfig;

	// Mixin constructors
	OO.EventEmitter.call( this );

	// Containers holder
	this.containers = {};

	config = config || {};

	defaultConfig = {
		scenario_dir: 'scenarios', // Default directory unless otherwise specified
		scenario_prefix: 'scenario.', // Default scenario file prefix
		directory_sep: '/',
		width: $( window ).width() - 100,
		height: $( window ).height() - 100
	};

	// Extend default global options
	this.config = $.extend( true, defaultConfig, config );
};

/* Inheritance */
OO.mixinClass( sp.System, OO.EventEmitter );

/* Methods */

/**
 * Add a container
 * @param {string} container_id The id of the DOM that this container
 * will be attached to
 * @param {Object} [config] Configuration object
 * @throws {Error} If container_id is undefined or empty
 * @return {sp.Container} The new container
 */
sp.System.prototype.setContainer = function ( container_id, config ) {
	if ( !container_id ) {
		throw Error( 'sp.System.setContainer must supply a valid container_id.' );
	}

	// Add a container
	this.containers[container_id] = new sp.container.Manager( {
		'container': '#' + container_id,
		'width': config.width || this.config.width,
		'height': config.height || this.config.height,
		scenario_dir: this.config.scenario_dir,
		directory_sep: this.config.directory_sep,
		scenario_prefix: config.scenario_prefix || this.config.scenario_prefix,
		// TODO: When 'build' mode is created, it should be either
		// enabled right on instantiation or allow to be added later
		buildMode: false
	} );

	return this.containers[container_id];
};

/**
 * Retrueve the container by its id
 * @param {string} container_id The id of the DOM that this container
 * is attached to
 * @throws {Error} If there are no containers defined
 * @returns {sp.Container|null} The container
 */
sp.System.prototype.getContainer = function ( container_id ) {
	if ( !this.containers ) {
		throw Error( 'Cannot get container, no containers are defined.' );
	}
	return this.containers[container_id];
};

/**
 * Get configuration option or full configuration object.
 * @param {string} [option] Configuration key
 * @returns {string|Object} Configuration object
 */
sp.System.prototype.getConfig = function ( option ) {
	if ( this.config && option ) {
		return this.config[option];
	}
	return this.config;
};

/**
 * Scenario calculator
 * @param {Object} [config] Configuration object
 */
sp.calc.Calculator = function SpScenarioCalculator( config ) {

};

/**
 * Astronomical constants. Mostly related to the solar
 * system but also to other calculations.
 * @property {Object}
 */
sp.calc.Calculator.constants = {
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
sp.calc.Calculator.translateTime = function ( year, month, day, time_of_day ) {
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
 * @param {number} year Requested year (yyyy)
 * @param {number} month Requested month
 * @param {number} day Requested day of the month
 * @param {number} [hours] Hour of the day in 24h format
 * @param {number} [minutes] Minutes after the hour
 * @param {number} [seconds] Seconds after the minute
 * @returns {number} JDN, number of days from epoch J2000.0
 */
sp.calc.Calculator.getJDNTime = function ( year, month, day, hours, minutes, seconds ) {
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
sp.calc.Calculator.solveKepler = function ( vars, jd ) {
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
		to_radians = function toRadians( angle ) {
			return angle * ( 180 / Math.PI );
		},
		/**
		 * Approximate the eccententric anomaly by iteration
		 * @param {number} e Eccentricity
		 * @param {number} M Mean anomaly
		 * @returns {number} Eccentric anomaly in radians
		 */
		approximate_E = function approxE( e, M ) {
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
 * Solar Playground container scenario loader
 *
 * @class sp.Container
 * @mixins OO.EventEmitter
 *
 * @param {Object} [config] Configuration object
 */
sp.container.Loader = function SpContainerLoader( config ) {
	// Mixin constructors
	OO.EventEmitter.call( this );

	this.config = config || {};
};

/* Inheritance */
OO.mixinClass( sp.container.Loader, OO.EventEmitter );

/**
 * Load a scenario
 * @param {String} scenarioName Scenario name. The system will search for
 *  an ajax response from source 'scenario.[name].json' in the scenario
 *  directory.
 */
sp.container.Loader.prototype.loadFromFile = function ( scenarioName, filename ) {
	var deferred = $.Deferred();

	$.getJSON( filename )
		.done( $.proxy( function ( response ) {
			deferred.resolve( response );
		}, this ) )
		.fail( function () {
			sp.log( 'Error', 'Scenario ' + targetName + ' not found in directory "' + targetDir + '"' );
			deferred.reject();
		} );

	return deferred;
};

/**
 * Load and run a scenario
 * @param {Object} scenarioObject Scenario configuration object
 * @fires scenarioLoaded
 */
sp.container.Loader.prototype.loadFromObject = function ( scenarioObject ) {
	var objList;

	// TODO: Validate the scenario object before loading

	scenarioObject = scenarioObject || {};

	scenario = new sp.data.Scenario( this, scenarioObject );
	this.setScenario( scenario );

	// Draw initial frame
//	this.scenario.draw( 0 );

	// Add pov objects to gui
	objList = this.scenario.getAllObjects();
	for ( o in objList ) {
		this.gui.addToPOVList(
			o,
			objList[o].getName()
		);
	}

	this.emit( 'scenarioLoaded', this.scenario );
};

/**
 * Solar Playground container manager
 *
 * @class sp.Container
 * @mixins OO.EventEmitter
 *
 * @param {Object} [config] Configuration object
 */
sp.container.Manager = function SpContainerManager( config ) {
	// Mixin constructors
	OO.EventEmitter.call( this );

	this.config = config || {};
	this.scenario = null;

	// Scenario loader
	this.loader = new sp.container.Loader( config );

	this.$container = $( config.container )
		.addClass( 'sp-container' )

	// Canvas and context
	this.screen = new sp.container.Screen( config );
	this.$container.append( this.screen.$canvas );

	// Gui
	guiLoader = new sp.ui.Loader( {
		'module': 'ooui', // Default module
		'container': this
	} );
	this.gui = guiLoader.initialize();

	// Events
	this.gui.connect( this, { 'play': 'onGuiPlay' } );
	this.gui.connect( this, { 'zoom': 'onGuiZoom' } );
	this.gui.connect( this, { 'pov': 'onGuiPOV' } );
};

/* Inheritance */
OO.mixinClass( sp.container.Manager, OO.EventEmitter );

/**
 * @event scenarioLoaded
 * @param {sp.Scenario} scenario Reference to the loaded scenario
 * Scenario fully loaded and ready to be run.
 */

/* Methods */

/**
 * Load scenario from file.
 * @param {string} scenarioName The scenario name
 * @returns {jQuery.Promise}
 */
sp.container.Manager.prototype.loadFromFile = function ( scenarioName ) {
	var targetName,
		deferred = $.Deferred(),
		filePrefix = this.config.scenario_prefix || '',
		targetDir = this.config.scenario_dir + this.config.directory_sep;

	deferred = $.Deferred();

	scenarioName = scenarioName || 'example';
	targetName = targetDir + filePrefix + scenarioName + '.json';

	this.loader.loadFromFile( scenarioName, targetName )
		.done( $.proxy( function ( scenarioObject ) {
			scenario = new sp.data.Scenario( this.screen, scenarioObject );
			this.setScenario( scenario );
			// Add pov objects to gui
			objList = this.scenario.getAllObjects();
			for ( o in objList ) {
				this.gui.addToPOVList(
					o,
					objList[o].getName()
				);
			}

			deferred.resolve();
		}, this ) );

	return deferred;
};

/**
 * Propogate scenario event
 * @param {Boolean} isPaused Scenario paused
 * @fires pause
 */
sp.container.Manager.prototype.onScenarioPause = function ( isPaused ) {
	this.emit( 'pause', isPaused );
};

/**
 * Respond to play button press
 * @param {Boolean} isPlay Play or pause
 */
sp.container.Manager.prototype.onGuiPlay = function ( isPlay ) {
	this.scenario.togglePaused( !isPlay );
};

/**
 * Respond to zoom button press
 * @param {Boolean} zoom Zoom level
 */
sp.container.Manager.prototype.onGuiZoom = function ( zoom ) {
	this.scenario.setZoom( zoom );
};

/**
 * Respond to pov button press
 * @param {Boolean} newPov New POV object key
 */
sp.container.Manager.prototype.onGuiPOV = function ( newPov ) {
	this.scenario.setPOV( newPov );
};

/**
 * Add a toolbar to the container
 * @param {jQuery} $toolbar jQuery toolbar element
 * @param {string} [position] Position in the container; 'top' or 'bottom'
 */
sp.container.Manager.prototype.addToolbar = function ( $toolbar, position ) {
	position = position || 'top';

	if ( position === 'top' ) {
		this.$container.prepend( $toolbar );
	} else {
		this.$container.append( $toolbar );
	}
};

/**
 * Attach scenario object to this container
 * @param {sp.Scenario} s Scenario object
 */
sp.container.Manager.prototype.setScenario = function ( s ) {
	this.scenario = s;

	// Draw
	this.screen.clear();
	this.scenario.draw();

	// Propogate scenario events
	this.scenario.connect( this, { 'pause': 'onScenarioPause' } );
};

/**
 * Retrieve the scenario attached to this container
 * @returns {sp.Scenario} s Scenario object
 */
sp.container.Manager.prototype.getScenario = function () {
	return this.scenario;
};
/**
 * Toggle between pause and resume the scenario
 * @param {boolean} [isPaused] Optional. If supplied, pauses or resumes the scenario
 * @fires pause
 */
sp.container.Manager.prototype.togglePaused = function ( isPaused ) {
	if ( this.isPaused() !== isPaused ) {
		this.scenario.togglePaused( isPaused );
		this.emit( 'pause', isPaused );
	}
};

/**
 * Set scenario zoom
 * @param {number} zoom Zoom factor
 * @fires zoom
 */
sp.container.Manager.prototype.setZoom = function ( zoom ) {
	if ( this.scenario.getZoom() !== zoom ) {
		this.scenario.setZoom( zoom );
		this.emit( 'zoom', zoom );
	}
};

/**
 * Check whether the scenario is paused
 */
sp.container.Manager.prototype.isPaused = function () {
	return this.scenario.isPaused();
};

/**
 * Container canvas and context controller
 *
 * @param {Object} [config] Configuration object
 */
sp.container.Screen = function SpContainerScreen( config ) {
	this.config = config || {};

	// Mixin constructors
	OO.EventEmitter.call( this );

	this.canvasCenterPoint = { x: 0, y: 0 };

	// Initialize
	this.$canvas = $( '<canvas>' )
		.addClass( 'sp-container-canvas' )
		.attr( 'width', this.config.width )
		.attr( 'height', this.config.height );

	this.context = this.$canvas[0].getContext( '2d' );

	// Events
	this.$canvas.on( 'mousedown', $.proxy( this.onCanvasMouseDown, this ) );
	this.$canvas.on( 'mousemove', $.proxy( this.onCanvasMouseMove, this ) );
	this.$canvas.on( 'mouseup', $.proxy( this.onCanvasMouseUp, this ) );
	this.$canvas.on( 'mouseout', $.proxy( this.onCanvasMouseUp, this ) );
};

/* Inheritance */
OO.mixinClass( sp.container.Screen, OO.EventEmitter );

/**
 * Propogate canvas mousedown event
 * @param {Event} e Event
 * @fires startDrag
 */
sp.container.Screen.prototype.onCanvasMouseDown = function ( e ) {
	this.canvasMouseMoving = true;
	this.mouseStartingPoint = {
		'x': e.pageX,
		'y': e.pageY
	};
	this.emit( 'drag', 'start', this.mouseStartingPoint );
};

/**
 * Respond to canvas mouse move
 * @param {Event} e Event
 * @fires drag
 */
sp.container.Screen.prototype.onCanvasMouseMove = function ( e ) {
	var coords;
	if ( this.canvasMouseMoving && !$.isEmptyObject( this.mouseStartingPoint ) ) {
		dx = e.pageX - this.mouseStartingPoint.x;
		dy = e.pageY - this.mouseStartingPoint.y;

		coords = {
			'x': dx + this.canvasCenterPoint.x,
			'y': dy + this.canvasCenterPoint.y
		};
		this.emit( 'drag', 'during', coords );
	}
};

/**
 * Propogate canvas mouseup event
 * @param {Event} e Event
 * @fires drag
 */
sp.container.Screen.prototype.onCanvasMouseUp = function ( e ) {
	this.canvasMouseMoving = false;
	this.mouseStartingPoint = {};
	this.canvasCenterPoint = {};
	this.emit( 'drag', 'end' );
};

/**
 * Draw a circle on the canvas
 * @param {Object} coords Canvas coordinates
 * @param {number} [radius] Circle radius
 * @param {string} [color] Circle color
 * @param {boolean} [hasShadow] Add a shadow
 */
sp.container.Screen.prototype.drawCircle = function ( coords, radius, color, hasShadow ) {
	this.context.save();
	this.context.beginPath();
	this.context.arc(
		coords.x,
		coords.y,
		radius || 5, 0, 2 * Math.PI,
		false
	);
	this.context.fillStyle = color || 'white';
	if ( hasShadow ) {
		this.context.shadowColor = color || 'white';
		this.context.shadowBlur = 20;
		this.context.shadowOffsetX = 0;
		this.context.shadowOffsetY = 0;
	}
	this.context.fill();
	this.context.restore();
};

/**
 * Clear an area on the canvas
 * @param {number} [square] Dimensions and coordinates of the square
 * to clear. If not set, the entire canvas will be cleared.
 * @param {number} [square.top] Top coordinate of the square
 * @param {number} [square.left] Left coordinate of the square
 * @param {number} [square.width] Width of the square
 * @param {number} [square.height] Height of the square
 */
sp.container.Screen.prototype.clear = function ( square ) {
	var canvasDimensions = this.getDimensions();
	square = square || {};

	// Fix optional values:
	square.left = square.left || 0;
	square.top = square.top || 0;
	square.width = square.width || canvasDimensions.width;
	square.height = square.height || canvasDimensions.height;

	// Erase the square
	this.context.clearRect( square.left, square.top, square.width, square.height );
};

/**
 * Set the center point of the center of the scenario.
 * @param {number} x X coordinate
 * @param {number} y Y coordinate
 */
sp.container.Screen.prototype.setCenterPoint = function ( x, y ) {
	this.canvasCenterPoint = {
		'x': x,
		'y': y
	};
};

/**
 * Get the canvas center point
 * @returns {Object} Center point
 */
sp.container.Screen.prototype.getCenterPoint = function () {
	return this.canvasCenterPoint;
};

/**
 * Get the canvas context
 * @returns {Object} Canvas context
 */
sp.container.Screen.prototype.getContext = function () {
	return this.$canvas[0].getContext( '2d' );
};

/**
 * Get the canvas dimensions
 * @returns {Object} Width and height of the canvas
 */
sp.container.Screen.prototype.getDimensions = function () {
	return {
		'width': this.$canvas.width(),
		'height': this.$canvas.height()
	}
};

/**
 * Celestial object, defines a moving object in space.
 *
 * @class sp.data.CelestialBody
 * @mixins OO.EventEmitter
 *
 * @param {Object} config Celestial object definition
 */
sp.data.CelestialBody = function SpDataScenarioCelestialObject( config ) {
	config = config || {};

	// Mixin constructors
	OO.EventEmitter.call( this );

	// Cache
	this.cache = {};

	// Cache trail points
	this.trails = [];
	this.frameCounter = 0;
	// TODO: Consider adding these to the global scenario config
	// Keep record of trail every X frames
	this.trailsFrameGap = 2;
	// How many trail points to store
	this.numTrailPoints = 80;

	// Attributes
	this.name = config.name || '';
	this.description = config.description || '';
	this.view = config.graphic || {};

	this.transform = { x: 0, y: 0, angle: 0, scale: 1 };

	this.vars = config.vars;

	this.initial_position = config.initial_position || { 'x': 0, 'y': 0 };

	// Link to the object it is orbiting
	this.orbiting = null;

	this.type = config.type || 'planet';

	// Initial radius
	this.radius = Number( config.vars.r ) || 10;
};

/* Inheritance */
OO.mixinClass( sp.data.CelestialBody, OO.EventEmitter );

/**
 * Get space coordinates per time.
 * @param {number} time Time unit
 */
sp.data.CelestialBody.prototype.getSpaceCoordinates = function ( time ) {
	var dest, M, G, period;

	time = time || 0;

	if ( this.orbiting ) {
		// Find period if it doesn't exist
		if ( !this.vars.p ) {
			// Calculate period
			a = this.vars.a[0];// * sp.Scenario.Calculator.constants.AU;
			G = sp.calc.Calculator.constants.G;
			M = this.orbiting.getMass();
			this.vars.p = 2 * Math.PI * Math.sqrt( Math.pow( a, 3) / ( G * M ) );
		}

		// TODO: Cache coordinates

		this.coordinates = sp.calc.Calculator.solveKepler(
			this.vars,
			time
		);
	} else {
		this.coordinates = { x: 0, y: 0, z: 0 };
	}
	return this.coordinates;
};

/**
 * Store the coordinate in the trail queue. Stores the space coordinates.
 * Dequeue the first when trail number cap is reached.
 * @param {Object} coordinates Coordinates of the trails
 */
sp.data.CelestialBody.prototype.storeTrailPoint = function ( coordinates ) {
	// Store coordinates for trails
	this.trails.push( coordinates );
	if ( this.trails.length > this.numTrailPoints ) {
		// Dequeue the first
		this.trails.shift();
	}
};

/**
 * Get the trail points.
 * @returns {Object[]} Space coordinates for the trails
 */
sp.data.CelestialBody.prototype.getTrailPoints = function () {
	return this.trails;
};

/**
 * Flush the trails queue completely.
 */
sp.data.CelestialBody.prototype.flushTrailPoints = function () {
	this.trails = [];
	this.frameCounter = 0;
};

/**
 * Get object type
 * @returns {string} Celestial object type, 'star' or 'planet'
 */
sp.data.CelestialBody.prototype.getType = function () {
	return this.type;
};

/**
 * Get object name
 * @returns {string} Celestial object name
 */
sp.data.CelestialBody.prototype.getName = function () {
	return this.name;
};

/**
 * Get object description
 * @returns {string} Celestial object description
 */
sp.data.CelestialBody.prototype.getDescription = function () {
	return this.description;
};

/**
 * Set the object this object is orbiting
 * @param {sp.data.CelestialBody} obj Object that is the center of the orbit
 */
sp.data.CelestialBody.prototype.setOrbit = function ( obj ) {
	this.orbiting = obj;
};

/**
 * Retrieve the object that is the center of orbit
 * @returns {sp.data.CelestialBody} obj Object that is the center of the orbit
 */
sp.data.CelestialBody.prototype.getOrbit = function () {
	return this.orbiting;
};

/**
 * Set object name
 * @param {string} name New object name
 */
sp.data.CelestialBody.prototype.setName = function ( name ) {
	this.name = name;
};

/**
 * Set object description
 * @param {string} desc New object description
 */
sp.data.CelestialBody.prototype.setDescription = function ( desc ) {
	this.description = desc;
};

sp.data.CelestialBody.prototype.getMass = function () {
	return this.vars.m;
};

sp.data.CelestialBody.prototype.getView = function () {
	return this.view;
}

/**
 * Get the planet radius if it exists.
 * @returns {number|null} Planet radius in km
 */
sp.data.CelestialBody.prototype.getRadius = function () {
	return this.vars.r;
};

/**
 * Solar playground scenario
 *
 * @class sp.data.Scenario
 * @mixins OO.EventEmitter
 *
 * @param {sp.container.Screen} screen Target screen for the scenario
 * @param {Object} scenario Scenario configuration object
 */
sp.data.Scenario = function SpDataScenario( screen, scenario ) {
	var objects, centerPt;

	// Mixin constructors
	OO.EventEmitter.call( this );

	// TODO: Validate the scenario object to make sure all required
	// elements exist.

	this.screen = screen;

	this.paused = true;
	this.objects = {};

	// Prepare general configuration
	this.config = scenario.config || {};

	// view controller
	centerPt = this.screen.getDimensions();
	this.view = new sp.view.Converter( {
		'zoom': this.config.init_zoom || 1,
		'centerPoint': {
			x: centerPt.width / 2,
			y: centerPt.height / 2
		},
		'yaw': 0,
		'pitch': 0,
		'scale': {
			'orbit': this.config.orbit_scale || 0.5 * Math.pow( 10, -5 ),
			'planets': this.config.planet_scale
		}
	} );

	this.showTrails = this.config.show_trails || false;
	this.frameCounter = 0;
	this.trailsFrameGap = 5;

	this.pov_key = this.config.init_pov;
	this.pov_object = null;

	this.date = this.config.start_time || { day: 1, month: 1, year: 2000 };
	this.time = 0;
	this.speed = this.config.init_speed || 1;

	// Prepare the objects
	this.processObjects( scenario.objects || {} );

	// Events
	this.screen.connect( this, { 'drag': 'onScreenDrag' } );
};

/* Inheritance */
OO.mixinClass( sp.data.Scenario, OO.EventEmitter );

/**
 * @event paused
 * @param {boolean} [isPaused] Paused or resumed
 * Change in pause/resume state
 */

/**
 * Respond to screen drag
 * @param {string} action Action parameter for 'start', 'during', and 'end'
 * @param {Object} [coords] Coordinates
 */
sp.data.Scenario.prototype.onScreenDrag = function ( action, coords ) {
	if ( action === 'start' ) {
		this.screen.setCenterPoint( this.getCenterPoint() );
	} else if ( action === 'during' ) {
		this.setCenterPoint( coords.x, coords.y );
		this.flushAllTrails();
		this.screen.clear();
		this.draw();
	} else if ( action === 'end' ) {
		this.screen.setCenterPoint( this.getCenterPoint() );
	}
};

/**
 * Process the solar playground simulator objects
 * @param {Object} scenarioObjects Simulation objects definition
 */
sp.data.Scenario.prototype.processObjects = function ( scenarioObjects ) {
	var o, co, radii_diff, step_size, radius, circle_radius, smallest_radii,
		radii = {
			'star': [],
			'planet': []
		};

	// Initialize celestial objects
	for ( o in scenarioObjects ) {
		this.objects[o] = new sp.data.CelestialBody( scenarioObjects[o] );

		// Collect all radii
		if ( scenarioObjects[o].vars.r ) {
			if ( scenarioObjects[o].type === 'star' ) {
				radii['star'].push( Number( scenarioObjects[o].vars.r ) );
			} else {
				radii['planet'].push( Number( scenarioObjects[o].vars.r ) );
			}
		}
	}

	// Send the radii list to the view
	this.view.setRadiiList( radii );

	// Figure out which objects orbit what
	for ( co in this.objects ) {
		if ( scenarioObjects[co] && this.objects[scenarioObjects[co].orbiting] ) {
			// Connect the object to its center of orbit
			this.objects[co].setOrbit( this.objects[scenarioObjects[co].orbiting] );
		}
	}

	// Set initial POV
	if ( this.pov_key && this.objects[this.pov_key] ) {
		this.pov_object = this.objects[this.pov_key];
		this.view.setPOV( this.objects[this.pov_key].getSpaceCoordinates( 0 ) );
	}
};

/**
 * Set the POV object
 * @param {string} povKey Object key for the pov
 * @fires povChange
 */
sp.data.Scenario.prototype.setPOV = function ( povKey ) {
	if ( povKey && this.objects[povKey] && this.pov_key !== povKey ) {
		this.pov_key = povKey;

		this.pov_object = this.objects[this.pov_key];
		this.view.setPOV( this.objects[this.pov_key].getSpaceCoordinates( 0 ) );
		this.screen.clear();
		this.flushAllTrails();
		this.draw();

		this.emit( 'povChange', this.pov_key );
	}
};

/**
 * Get the POV key currently set
 * @returns {string} POV key
 */
sp.data.Scenario.prototype.getPOV = function () {
	return this.pov_key;
};

/**
 * Draw all elements
 * @param {number} time Time
 * @param {boolean} ignoreTrails Ignore trails despite settings
 */
sp.data.Scenario.prototype.draw = function ( time, ignoreTrails ) {
	var o, coords, viewpointCoords, view, radius, trails;

	time = time || this.time;

	for ( o in this.objects ) {
		coords = this.objects[o].getSpaceCoordinates( time );

		// TODO: Allow POV that isn't an object
		// Update POV coordinates
		if ( o === this.pov_key ) {
			this.view.setPOV( coords );
		}
		// Translate coordinates to canvas
		viewpointCoords = this.view.getCoordinates( coords );

		if ( viewpointCoords ) {
			// Get graphic details
			view = this.objects[o].getView();

			// TODO: Allow the user to choose between relative radii and preset radius value
			// in the view parameters, instead of having the view take precedence randomly
			radius = this.view.getRadius( this.objects[o].getRadius(), this.objects[o].getType() );

			// Draw planet trails
			if ( !ignoreTrails && this.showTrails && o !== this.pov_key ) {
				// Store trails
				this.frameCounter++;
				if ( this.frameCounter >= this.trailsFrameGap ) {
					this.objects[o].storeTrailPoint( viewpointCoords );
					this.frameCounter = 0;
				}

				// Get the trail points
				trails = this.objects[o].getTrailPoints();
				for ( i = 0; i < trails.length; i++ ) {
					// Draw all trails as dots
					this.screen.drawCircle(
						trails[i],
						1,
						// TODO: Consider making trail colors a configuration option
						view.color || '#FF005D' // Bright pink
					);
				}
			}

			// Draw the object
			this.screen.drawCircle(
				viewpointCoords,
				radius,
				view.color,
				// Add a shadow to stars
				this.objects[o].getType() === 'star'
			);
		}
	}
};

/**
 * Flush all trails from all objects
 */
sp.data.Scenario.prototype.flushAllTrails = function () {
	var o;
	for ( o in this.objects ) {
		this.objects[o].flushTrailPoints()
	}
};

/**
 * Run the scenario
 */
sp.data.Scenario.prototype.run = function () {
	if ( !this.paused ) {
		// Clear canvas
		this.screen.clear();

		// Draw canvas
		this.draw( this.time );

		// Increase time
		this.time += 0.0000000001 * this.speed;

		window.requestNextAnimationFrame( $.proxy( this.run, this ) );
	}
};

/**
 * Retrieve all the celestial objects attached to this scenario
 * @returns {sp.data.Scenario.CelestialObject} All objects in the scenario
 */
sp.data.Scenario.prototype.getAllObjects = function () {
	return this.objects;
}

/**
 * Toggle between pause and resume the scenario
 * @param {boolean} [isPause] Optional. If supplied, pauses or resumes the scenario
 * @fires paused
 */
sp.data.Scenario.prototype.togglePaused = function ( isPause ) {
	if ( isPause === undefined ) {
		isPause = !this.paused;
	}
	isPause = !!isPause;

	this.paused = isPause;
	this.run();

	this.emit( 'pause', this.paused );
};

/**
 * Check whether the scenario is paused
 */
sp.data.Scenario.prototype.isPaused = function () {
	return this.paused;
};

/**
 * Pause the scenario
 */
sp.data.Scenario.prototype.pause = function () {
	this.togglePaused( true );
};

/**
 * Resume the scenario
 */
sp.data.Scenario.prototype.resume = function () {
	this.togglePaused( false );
	this.run();
};

/**
 * Increase or decrease scenario zoom levels
 * @param {number} z Zoom level, negative for zoom out
 */
sp.data.Scenario.prototype.setZoom = function ( z ) {
	this.view.setZoom( z );
	this.flushAllTrails();
	if ( this.isPaused() ) {
		this.screen.clear();
		this.draw( this.time, true );
	}
};

/**
 * Retrieve the zoom level
 * @returns {numver} Current zoom level
 */
sp.data.Scenario.prototype.getZoom = function () {
	return this.view.getZoom();
};

/**
 * Set the viewpoint's center point
 * @param {number} x X coordinate of the center of the system
 * @param {number} y Y coordinate of the center of the system
 */
sp.data.Scenario.prototype.setCenterPoint = function ( x, y ) {
	this.view.setCenterPoint( x, y );
	this.flushAllTrails();
	if ( this.isPaused() ) {
		this.screen.clear();
		this.draw( this.time, true );
	}
};

/**
 * Get the current center point of the view
 * @returns {Object} x/y coordinates of the current center point
 */
sp.data.Scenario.prototype.getCenterPoint = function () {
	return this.view.getCenterPoint();
};

/**
 * Add to the center point
 * @param {number} [x] Amount to add to X coordinate
 * @param {number} [y] Amount to add to Y coordinate
 */
sp.data.Scenario.prototype.addToCenterPoint = function ( x, y ) {
	this.view.addToCenterPoint( x, y );
}

/**
 * Gui Loader. Creates the gui to be attached to
 * the SolarPlayground container.
 *
 * @class sp.ui.Loader
 * @mixins OO.EventEmitter
 *
 * @param {Object} config Gui definition
 * @config {string} module The GUI module. Defaults to 'ooui'
 * @config {jQuery} jQuery object for the container on top of which
 *  the GUI should be built.
 */
sp.ui.Loader = function SpGuiInitializer( config ) {
	config = config || {};

	// Mixin constructors
	OO.EventEmitter.call( this );

	this.moduleName = config.module || 'ooui';
	this.module = null;

	this.scenario = config.scenario;
	this.settings = config.settings || {};
	this.container = config.container;

	this.$spinner = $( '<div>' )
		.addClass( 'sp-system-spinner' )
		.appendTo( this.container.$container );
};

/* Inheritance */
OO.mixinClass( sp.ui.Loader, OO.EventEmitter );

/**
 * Create the GUI according to the ui module
 */
sp.ui.Loader.prototype.initialize = function () {
	var module;
	/// TODO: Use a factory instead of this quick and somewhat
	/// lame 'switch' statement, so we can allow for proper
	/// modules for the GUI, like jQueryUI or whatever else.
	switch ( this.module ) {
		case 'ooui':
		default:
			this.module = new sp.ui.ext.ooui.Mod.Play( this.container, this.settings );
			break;
	}

	module = this.module.initialize( this.settings );
	this.$spinner.hide();
	return module;
};

/**
 * General Gui module
 *
 * @class sp.ui.ext.Play
 * @abstract
 *
 * @param {sp.Container} container The container to attach the GUI to
 * @param {Object} [config] Gui module definition
 */
sp.ui.ext.Play = function SpUiExtPlay ( container, config ) {
	config = config || {};

	// Mixin constructors
	OO.EventEmitter.call( this );

	this.container = container;
};

/* Inheritance */
OO.mixinClass( sp.ui.ext.Play, OO.EventEmitter );

/* Events */

/**
 * Play or pause scenario
 * @event play
 * @param {boolean} isPlay Play scenario or pause
 */

/**
 * Zoom in or out
 * @event zoom
 * @param {number} zoomLevel How much to zoom. Negative to zoom out.
 */

/**
 * Change point of view object
 * @event pov
 * @param {string} povObjName New POV object name or key
 */

/* Methods */

/**
 * Initialize the Gui
 * @abstract
 * @returns {OO.ui.Toolbar}
 */
sp.ui.ext.Play.prototype.initialize = function () {
	throw new Error( 'sp.Gui.Module.Initialize must be implemented in child class.' );
};

/**
 * Add a tool to the POV list
 * @abstract
 * @param {string} name Tool name
 * @param {string} title Title or alternate text
 * @param {string} [icon] Tool icon
 */
sp.ui.ext.Play.prototype.addToPOVList = function ( name, title, icon ) {
	throw new Error( 'sp.Gui.Module.addToPOVList must be implemented in child class.' );
};

/**
 * UI OOUI Module namespace
 * @property {Object}
 */
sp.ui.ext.ooui = {
	'Mod': {}
};

/**
 * OOUI Gui module
 *
 * @class sp.ui.ext.ooui.Mod.Play
 *
 * @param {sp.Container} container The container to attach the GUI to
 * @param {Object} [config] Gui module definition
 */
sp.ui.ext.ooui.Mod.Play = function SpUiExtOouiModPlay( container, config ) {
	config = config || {};

	// Parent constructor
	sp.ui.ext.ooui.Mod.Play.super.call( this, container, config );

	this.tools = {};

	return this;
};

/* Inheritance */
OO.inheritClass( sp.ui.ext.ooui.Mod.Play, sp.ui.ext.Play );

/* Events */

/**
 * Play or pause scenario
 * @event play
 * @param {boolean} isPlay Play scenario or pause
 */

/**
 * Zoom in or out
 * @event zoom
 * @param {number} zoomLevel How much to zoom. Negative to zoom out.
 */

/**
 * Change point of view object
 * @event pov
 * @param {string} povObjName New POV object name or key
 */

/* Methods */

/**
 * Initialize the Gui
 * @returns {OO.ui.Toolbar}
 */
sp.ui.ext.ooui.Mod.Play.prototype.initialize = function () {
	var i, tools, tname;

	this.toolFactory = new OO.ui.ToolFactory(),
	this.toolGroupFactory = new OO.ui.ToolGroupFactory();

	// Create toolbar
	this.toolbar = new sp.ui.ext.ooui.Toolbar( this.container, this.toolFactory, this.toolGroupFactory );
	this.toolbar.setup( [
		{
			'type': 'bar',
			'include': [ { 'group': 'playTools' } ]
		},
		{
			'type': 'bar',
			'include': [ { 'group': 'viewTools' } ]
		},
		{
			'type': 'menu',
			'indicator': 'down',
			'label': 'POV',
			'icon': 'picture',
			'include': [ { 'group': 'povTools' } ]
		}
	] );
	this.toolbar.emit( 'updateState' );

	// Create buttons for the toolbar
	// TODO: Disable all buttons until the scenario is loaded
	tools = {
		// playTools
		'play': [ 'playTool', 'playTools', 'play', 'Play scenario', null, this.onPlayButtonSelect, function ( isPaused ) {
			this.setActive( !isPaused );
		}, 'pause' ],
		// viewTools
		'zoomin': [ 'zoominTool', 'viewTools', 'zoomin', 'Zoom in', null, this.onZoomInButtonSelect ],
		'zoomout': [ 'zoomoutTool', 'viewTools', 'zoomout', 'Zoom out', null, this.onZoomOutButtonSelect ]
	}

	this.tools = {};
	for ( tname in tools ) {
		this.tools[tname] = this.createTool.apply( this, tools[tname] );
		this.toolFactory.register( this.tools[tname] );
	}

	// Attach toolbar to container
	this.container.addToolbar( this.toolbar.$element );

	// Events
	this.toolbar.connect( this, { 'play': [ 'onToolbarEvent', 'play' ] } );
	this.toolbar.connect( this, { 'zoom': [ 'onToolbarEvent', 'zoom' ] } );
	this.toolbar.connect( this, { 'pov': [ 'onToolbarEvent', 'pov' ] } );

	return this;
};

/**
 * Add a tool to the POV list
 * @param {string} name Tool name
 * @param {string} title Title or alternate text
 * @param {string} [icon] Tool icon
 */
sp.ui.ext.ooui.Mod.Play.prototype.addToPOVList = function ( name, title, icon ) {
	var toolDefinition, onSelectFunc, tool, toolGroup,
		eventObject = {},
		toolName = name + 'Tool';

	toolDefinition = [
		// name
		name,
		// icon
		icon,
		// title/label
		title
	];

	this.tools[toolName] = this.createPOVTool.apply( this, toolDefinition );
	this.toolFactory.register( this.tools[toolName] );
};

/**
 * Propogate the event from the toolbar to the module.
 * We want the system to listen to the module and not specific
 * elements in it.
 * @param {string} ev Type of event to emit
 * @param {Object} [params] Parameters to attach to the event
 */
sp.ui.ext.ooui.Mod.Play.prototype.onToolbarEvent = function ( ev, params ) {
	this.emit( ev, params );
};

/**
 * Respond to zoom in button click
 * @fires zoom
 */
sp.ui.ext.ooui.Mod.Play.prototype.onZoomInButtonSelect = function () {
	this.setActive( false );
	this.toolbar.emit( 'zoom', 2000 );
};

/**
 * Respond to zoom in button click
 * @fires zoom
 */
sp.ui.ext.ooui.Mod.Play.prototype.onZoomOutButtonSelect = function () {
	this.setActive( false );
	this.toolbar.emit( 'zoom', -2000 );
};

/**
 * Respond to play button click
 * @fires play
 */
sp.ui.ext.ooui.Mod.Play.prototype.onPlayButtonSelect = function () {
	if ( this.toggled !== this.toolbar.getContainer().isPaused() ) {
		this.toggled = !this.toggled;
		this.setActive( this.toggled );

		this.toolbar.emit( 'play', this.toggled );
	}
};

/**
 * Get the Gui toolbar
 * @returns {OO.ui.Toolbar} The toolbar connected to the gui
 */
sp.ui.ext.ooui.Mod.Play.prototype.getToolbar = function () {
	return this.toolbar;
};

/**
 * Create a toolbar tool.
 * NOTE: Taken from the OOUI tools demo. This method should be adjusted
 * to better suit this projects' needs, it is only used as-is at
 * the moment for basic testing.
 *
 * @param {string} name Tool name
 * @param {string} group Tool group
 * @param {string} icon Tool icon
 * @param {string} title Title or alternate text
 * @param {Function} init Initialization function
 * @param {Function} onSelect Activation function
 * @param {Function} updateFunc Function on update state
 * @param {string} eventName Name of event to connect to in scenario object
 * @returns {OO.ui.Tool} Tool
 */
sp.ui.ext.ooui.Mod.Play.prototype.createTool = function ( name, group, icon, title, init, onSelect, updateFunc, eventName ) {
	// TODO: The entire createTool method should be rewritten to
	// better suit the needs of this particular toolbar
	var Tool = function SpGuiTool() {
		var eventDef = {}, scenario;
		Tool.super.apply( this, arguments );
		this.toggled = false;
		scenario = scenario = this.toolbar.getContainer().getScenario();
		if ( init ) {
			init.call( this );
		}
		if ( eventName ) {
			eventDef[eventName] = 'onToolbarUpdate';
			this.toolbar.getContainer().connect( this, eventDef );
		}
	};

	OO.inheritClass( Tool, OO.ui.Tool );

	Tool.prototype.onSelect = function () {
		if ( onSelect ) {
			onSelect.call( this );
		} else {
			this.toggled = !this.toggled;
			this.setActive( this.toggled );
		}
		this.toolbar.emit( 'updateState' );
	};
	Tool.prototype.onUpdateState = function () {};
	Tool.prototype.onToolbarUpdate = function ( params ) {
		if ( updateFunc ) {
			updateFunc.call( this, params );
		}
	};

	Tool.static.name = name;
	Tool.static.group = group;
	Tool.static.icon = icon;
	Tool.static.title = title;
	return Tool;
};

/**
 * Create a POV tool
 * @param {string} name Tool name
 * @param {string} icon Tool icon
 * @param {string} title Title or alternate text
 * @returns {OO.ui.Tool} Tool
 */
sp.ui.ext.ooui.Mod.Play.prototype.createPOVTool = function ( name, icon, title ) {
	// TODO: The entire createTool method should be rewritten to
	// better suit the needs of this particular toolbar
	var Tool = function SpGuiPOVTool() {
		Tool.super.apply( this, arguments );
		this.toggled = this.toolbar.getContainer().getScenario().getPOV() === name;
		this.setActive( this.toggled );
		this.objectName = name;
		this.toolbar.getContainer().getScenario().connect( this, { 'povChange': 'onUpdateState' } );
	};

	OO.inheritClass( Tool, OO.ui.Tool );

	Tool.prototype.onSelect = function () {
		if ( this.toolbar.getContainer().getScenario().getPOV() !== this.getObjectName() ) {
			this.toolbar.emit( 'pov', this.getObjectName() );
		}
	};
	Tool.prototype.getObjectName = function () {
		return this.objectName;
	}
	Tool.prototype.onUpdateState = function ( pov ) {
		if ( pov ) {
			this.setActive( pov === this.getObjectName() );
		}
	};

	Tool.static.name = name;
	Tool.static.group = 'povTools';
	Tool.static.icon = icon;
	Tool.static.title = title;
	return Tool;
};

/* Toolbar */
sp.ui.ext.ooui.Toolbar = function ( container, toolFactory, toolGroupFactory ) {
	// Parent constructor
	sp.ui.ext.ooui.Toolbar.super.call( this, toolFactory, toolGroupFactory );

	this.container = container;
};

/* Inheritance */
OO.inheritClass( sp.ui.ext.ooui.Toolbar, OO.ui.Toolbar );

/**
 * Get the container attached to this toolbar
 * @returns {sp.Container} Container
 */
sp.ui.ext.ooui.Toolbar.prototype.getContainer = function () {
	return this.container;
};

/**
 * Solar Playground viewpoint controller.
 * Controls the presentation of the objects on the canvas.
 *
 * @class sp.Viewpoint
 * @mixins OO.EventEmitter
 *
 * @param {Object} [config] Configuration object
 */
sp.view.Converter = function SpViewConverter( config ) {
	// Mixin constructors
	OO.EventEmitter.call( this );

	// Configuration
	this.config = config || {};

	this.zoom = this.config.zoom || 1;
	this.orbit_scale = this.config.orbit_scale || 1;
	this.centerPoint = this.config.centerPoint;
	this.yaw = this.config.yaw;
	this.pitch = this.config.pitch;

	this.pov = { 'x': 0, 'y': 0, 'z': 0 };
	this.radii_list = null;

	// Set up visible canvas-scaled radius steps in pixels
	this.radii = {
		'star': [ 25, 30, 32, 35 ],
		'planet': [ 4, 8, 10, 12, 14, 16 ]
	};
	// Define the step between each value
	this.radius_step = {
		'star': 0,
		'planet': 0
	};
};

/* Inheritance */
OO.mixinClass( sp.view.Converter, OO.EventEmitter );

/* Events */

/**
 * Change of the POV coordinates in space
 * @event changePOV
 * @param {Object} New space coordinates of the POV
 */

/* Methods */

/**
 * Set the coordinates of the current POV object
 * @param {Object} pov_coords The 3d coordinates of the current POV
 * @fires changePOV
 */
sp.view.Converter.prototype.setPOV = function ( pov_coords ) {
	if ( !pov_coords ) {
		return;
	}
	if ( pov_coords.x !== this.pov.x || pov_coords.y !== this.pov.y ) {
		this.pov = pov_coords;
		this.emit( 'changePOV', pov_coords );
	}
};

/**
 * Translate between space coordinates and viewpoint coordinates
 * on the canvas.
 * @param {Object} spaceCoords Original 3D space coordinates
 * @returns {Object} Canvas 2d coordinates
 */
sp.view.Converter.prototype.getCoordinates = function ( spaceCoords ) {
	var ca = Math.cos( this.yaw ),
		sa = Math.sin( this.yaw ),
		cb = Math.cos( this.pitch ),
		sb = Math.sin( this.pitch ),
		dx = this.centerPoint.x,
		dy = this.centerPoint.y,
		scale = Math.sqrt( this.orbit_scale * this.zoom );

	// TODO: Work out proper scale
	x = ( spaceCoords.x - this.pov.x ) * scale;
	y = ( spaceCoords.y - this.pov.y ) * scale;
	z = ( spaceCoords.z - this.pov.z ) * scale;

	destination = {
		'x': x * ca - y * sa + dx,
		'y': x * sa + y * ca
	};
	destination.z = destination.y * sb;
	destination.y = destination.y * cb + dy;

	// TODO: Check if destination is inside the canvas. Return null otherwise.
	return destination;
};

/**
 * Calculate radius size steps from a new radii list
 * @param {Object} rList Actual size radii of all celestial objects
 * divided into 'stars' and 'planets' to distinguish relative sizes better
 */
sp.view.Converter.prototype.setRadiiList = function ( rList ) {
	var type, diff;

	this.radii_list = rList;

	for ( type in this.radii_list ) {
		// Sort by size, ascending
		this.radii_list[type].sort( function ( a, b ) {
			return a - b;
		} );

		// Figure out steps for each of the types
		diff = this.radii_list[type][this.radii_list[type].length - 1] -
			this.radii_list[type][0];

		this.radius_step[type] = diff / this.radii[type].length
	}
};

/**
 * Translate between the original radius and the canvas radius in pixels
 * @param {number} orig_radius Object's original radius
 * @returns {number} Actual radius in pixels
 */
sp.view.Converter.prototype.getRadius = function ( orig_radius, type ) {
	var radius, index,
		step = this.radius_step[type] || 1;

	type = type || 'planet';
	index = Math.floor( orig_radius / step );

	if ( index > this.radii[type].length - 1 ) {
		index = this.radii[type].length - 1;
	}

	radius = Math.sqrt( this.radii[type][ index ] * this.zoom ) / 100;

	return ( radius >= 2 ) ? radius : 2;
};

/**
 * Increase or decrease scenario zoom levels
 * @param {number} z Zoom level, negative for zoom out
 */
sp.view.Converter.prototype.setZoom = function ( z ) {
	this.zoom += z;
};

/**
 * Get the current zoom factor
 * @returns {number} zoom Zoom factor
 */
sp.view.Converter.prototype.getZoom = function () {
	return this.zoom;
};

/**
 * Set the canvas center point
 * @param {number} x X coordinate of the center of the system
 * @param {number} y Y coordinate of the center of the system
 */
sp.view.Converter.prototype.setCenterPoint = function ( x, y ) {
	x = x || this.centerPoint.x;
	y = y || this.centerPoint.y;

	this.centerPoint = {
		'x': x,
		'y': y
	};
};

/**
 * Get the current center point of the view
 * @returns {Object} x/y coordinates of the current center point
 */
sp.view.Converter.prototype.getCenterPoint = function () {
	return this.centerPoint;
};

/**
 * Add to the center point
 * @param {number} [x] Amount to add to X coordinate
 * @param {number} [y] Amount to add to Y coordinate
 */
sp.view.Converter.prototype.addToCenterPoint = function ( x, y ) {
	x = x || 0;
	y = y || 0;

	this.centerPoint.x += x;
	this.centerPoint.y += y;
};
