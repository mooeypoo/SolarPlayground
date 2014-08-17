/**
 * Solar playground scenario
 *
 * @class sp.data.Scenario
 * @mixins OO.EventEmitter
 *
 * @param {sp.container.Screen} screen Target screen for the scenario
 * @param {Object} scenario Scenario configuration object
 * @param {Object} [config] Configuration options. Will override any
 * configuration in the scenario object
 */
sp.data.Scenario = function SpDataScenario( screen, scenario, config ) {
	var objects, canvasDimensions,
		toRadians = Math.PI / 180;

	// Mixin constructors
	OO.EventEmitter.call( this );

	config = config || {};

	// TODO: Validate the scenario object to make sure all required
	// elements exist.

	this.screen = screen;

	this.paused = true;
	this.objects = {};

	// Prepare general configuration
	this.config = $.extend( {}, scenario.config, config );

	// view controller
	canvasDimensions = this.screen.getDimensions();
	this.viewConverter = new sp.view.Converter( {
		'zoom': this.config.init_zoom || 1,
		'canvasDimensions': canvasDimensions,
		'yaw': this.config.init_yaw * toRadians || 0,
		'pitch': this.config.init_pitch * toRadians || 0,
		'scale': {
			'orbit': this.config.orbit_scale || 0.5 * Math.pow( 10, -5 ),
			'planets': this.config.planet_scale
		}
	} );

	this.grid = new sp.view.Grid( this.screen, this.viewConverter );

	this.showTrails = this.config.show_trails || false;
	this.showGrid = this.config.show_grid || false;
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
	this.viewConverter.connect( this, { 'pitch': 'onPitchChange' } );
};

/* Inheritance */
OO.mixinClass( sp.data.Scenario, OO.EventEmitter );

/* Events */

/**
 * @event paused
 * @param {boolean} [isPaused] Paused or resumed
 * Change in pause/resume state
 */

/**
 * @event pov
 * @param {string} pov_key The key of the new POV object
 * Change in point-of-view (POV) for the scenario
 */

/**
 * @event zoom
 * @param {number} zoom Current zoom factor
 * Change the zoom level for the scenario
 */

/**
 * @event pitch
 * @param {number} pitch Current pitch angle
 * Change the pitch angle for display
 */

/* Methods */

/**
 * Respond to screen drag
 * @param {string} action Action parameter for 'start', 'during', and 'end'
 * @param {Object} [coords] Coordinates
 */
sp.data.Scenario.prototype.onScreenDrag = function ( action, coords ) {
	if ( action === 'start' ) {
		this.screen.setCenterPoint( this.getCenterPoint() );
	} else if ( action === 'during' ) {
		this.setCenterPoint( { 'x': coords.x, 'y': coords.y } );
		this.flushAllTrails();
		this.screen.clear();
		this.draw();
	} else if ( action === 'end' ) {
		this.screen.setCenterPoint( this.getCenterPoint() );
	}
};

/**
 * Propogate the pitch event from the view controller
 * @param {number} pitch Current pitch angle
 * @fires pitch
 */
sp.data.Scenario.prototype.onPitchChange = function ( pitch ) {
	this.emit( 'pitch', pitch );
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
				radii.star.push( Number( scenarioObjects[o].vars.r ) );
			} else {
				radii.planet.push( Number( scenarioObjects[o].vars.r ) );
			}
		}
	}

	// Send the radii list to the view
	this.viewConverter.setRadiiList( radii );

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
		this.viewConverter.setPOV( this.objects[this.pov_key].getSpaceCoordinates( 0 ) );
	}
};

/**
 * Set the POV object
 * @param {string} povKey Object key for the pov
 * @fires pov
 */
sp.data.Scenario.prototype.setPOV = function ( povKey ) {
	if ( povKey && this.objects[povKey] && this.pov_key !== povKey ) {
		this.pov_key = povKey;

		this.pov_object = this.objects[this.pov_key];
		this.viewConverter.setPOV( this.objects[this.pov_key].getSpaceCoordinates( 0 ) );
		this.screen.clear();
		this.flushAllTrails();
		this.draw();

		this.emit( 'pov', this.pov_key );
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
	var o, coords, canvasCoords, graphic, radius, trails;

	time = time || this.time;

	if ( this.showGrid ) {
		this.grid.draw();
	}

	for ( o in this.objects ) {
		coords = this.objects[o].getSpaceCoordinates( time );

		// TODO: Allow POV that isn't an object
		// Update POV coordinates
		if ( o === this.pov_key ) {
			this.viewConverter.setPOV( coords );
		}
		// Get graphic details
		graphic = this.objects[o].getView();

		// Translate coordinates to canvas
		canvasCoords = this.viewConverter.getCoordinates( coords );
		if ( canvasCoords ) {
			// TODO: Allow the user to choose between relative radii and preset radius value
			// in the view parameters, instead of having the view take precedence randomly
			radius = this.viewConverter.getRadius( this.objects[o].getRadius(), this.objects[o].getType() );

			// Draw the object
			this.screen.drawCircle(
				canvasCoords,
				radius,
				graphic.color,
				// Add a shadow to stars
				this.objects[o].getType() === 'star'
			);
		}

		// Draw trails
		if ( !ignoreTrails && this.showTrails && o !== this.pov_key ) {
			// Store trails
			// If 'canvasCoords' is null, still store to continue
			// with the movement
			this.frameCounter++;
			if ( this.frameCounter >= this.trailsFrameGap ) {
				this.objects[o].storeTrailPoint( canvasCoords );
				this.frameCounter = 0;
			}

			// Get the trail points
			trails = this.objects[o].getTrailPoints();
			for ( i = 0; i < trails.length; i++ ) {
				// But only draw if we have the trails
				if ( trails[i] ) {
					// Draw all trails as dots
					this.screen.drawCircle(
						trails[i],
						1,
						// TODO: Consider making trail colors a configuration option
						graphic.color || '#FF005D' // Bright pink
					);
				}
			}
		}
	}
};

/**
 * Flush all trails from all objects
 */
sp.data.Scenario.prototype.flushAllTrails = function () {
	var o;
	for ( o in this.objects ) {
		this.objects[o].flushTrailPoints();
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
};

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
 * Toggle the grid display
 * @param {Boolean} isShowGrid Show grid
 * @fires grid
 */
sp.data.Scenario.prototype.toggleGrid = function ( isShowGrid ) {
	if ( isShowGrid === undefined ) {
		isShowGrid = !this.showGrid;
	}
	isShowGrid = !!isShowGrid;

	this.showGrid = isShowGrid;
	// Clear canvas
	this.screen.clear();

	// Draw canvas
	this.draw( this.time );

	this.emit( 'grid', this.showGrid );
};

/**
 * Check whether the scenario is paused
 */
sp.data.Scenario.prototype.isShowGrid = function () {
	return this.showGrid;
};

/**
 * Increase or decrease scenario zoom levels
 * @param {number} z Zoom level, negative for zoom out
 */
sp.data.Scenario.prototype.setZoom = function ( z ) {
	this.viewConverter.setZoom( z );
	this.flushAllTrails();
	if ( this.isPaused() ) {
		this.screen.clear();
		this.draw( this.time, true );
	}
	this.emit( 'zoom', z );
};

/**
 * Retrieve the zoom level
 * @returns {numver} Current zoom level
 */
sp.data.Scenario.prototype.getZoom = function () {
	return this.viewConverter.getZoom();
};

/**
 * Set the viewpoint's center point
 * @param {Object} coords x/y coordinates of the center of the system
 */
sp.data.Scenario.prototype.setCenterPoint = function ( coords ) {
	this.viewConverter.setCenterPoint( coords );
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
	return this.viewConverter.getCenterPoint();
};

/**
 * Add to the center point
 * @param {number} [x] Amount to add to X coordinate
 * @param {number} [y] Amount to add to Y coordinate
 */
sp.data.Scenario.prototype.addToCenterPoint = function ( x, y ) {
	this.viewConverter.addToCenterPoint( x, y );
};

/**
 * Set the pitch angle for the scenario
 * @param {[type]} pitch [description]
 */
sp.data.Scenario.prototype.setPitchAngle = function ( pitch ) {
	this.viewConverter.setPitchAngle( pitch );
	this.flushAllTrails();
	if ( this.isPaused() ) {
		this.screen.clear();
		this.draw( this.time, true );
	}
};

/**
 * Get the current pitch angle
 * @returns {number} Pitch angle
 */
sp.data.Scenario.prototype.getPitchAngle = function () {
	return this.viewConverter.getPitchAngle();
};

/**
 * Get the scenario's view converter object
 * @return {sp.view.Converter} View converter
 */
sp.data.Scenario.prototype.getViewConverter = function () {
	return this.viewConverter;
};
