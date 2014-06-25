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
		this.setCenterPoint( { 'x': coords.x, 'y': coords.y );
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
sp.data.Scenario.prototype.setCenterPoint = function ( coords ) {
	this.view.setCenterPoint( coords );
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
