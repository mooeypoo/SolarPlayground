/**
 * Solar playground scenario container
 *
 * @class sp.Scenario
 * @mixins OO.EventEmitter
 *
 * @param {JQuery} $canvas Target canvas for the scenario
 * @param {Object} scenario Scenario configuration object
 */
sp.Scenario = function SpScenario( $canvas, scenario ) {
	var objects;

	// Mixin constructors
	OO.EventEmitter.call( this );

	// TODO: Validate the scenario object to make sure all required
	// elements exist.

	// TODO: Create another canvas for trails so we can visualize the
	// orbits with trails that remain for a bit on the screen
	this.$canvas = $canvas;
	this.context = $canvas[0].getContext( '2d' );

	this.paused = true;
	this.objects = {};

	// Prepare general configuration
	this.config = scenario.config || {};

	// Viewpoint controller
	this.viewpoint = new sp.Viewpoint( {
		'zoom': this.config.init_zoom || 1,
		'centerPoint': {
			x: this.$canvas.width() / 2,
			y: this.$canvas.height() / 2
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
};

/* Inheritance */
OO.mixinClass( sp.Scenario, OO.EventEmitter );

/**
 * @event paused
 * @param {boolean} [isPaused] Paused or resumed
 * Change in pause/resume state
 */

/**
 * Process the solar playground simulator objects
 * @param {Object} scenarioObjects Simulation objects definition
 */
sp.Scenario.prototype.processObjects = function ( scenarioObjects ) {
	var o, co, radii_diff, step_size, radius, circle_radius, smallest_radii,
		radii = {
			'star': [],
			'planet': []
		};

	// Initialize celestial objects
	for ( o in scenarioObjects ) {
		this.objects[o] = new sp.Scenario.CelestialObject( scenarioObjects[o] );

		// Collect all radii
		if ( scenarioObjects[o].vars.r ) {
			if ( scenarioObjects[o].type === 'star' ) {
				radii['star'].push( Number( scenarioObjects[o].vars.r ) );
			} else {
				radii['planet'].push( Number( scenarioObjects[o].vars.r ) );
			}
		}
	}

	// Send the radii list to the viewpoint
	this.viewpoint.setRadiiList( radii );

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
		this.viewpoint.setPOV( this.objects[this.pov_key].getSpaceCoordinates( 0 ) );
	}
};

/**
 * Draw all elements
 * @param {number} time Time
 * @param {boolean} ignoreTrails Ignore trails despite settings
 */
sp.Scenario.prototype.draw = function ( time, ignoreTrails ) {
	var o, coords, viewpointCoords, view, radius, trails;

	time = time || this.time;

	for ( o in this.objects ) {
		coords = this.objects[o].getSpaceCoordinates( time );

		// TODO: Allow POV that isn't an object
		// Update POV coordinates
		if ( o === this.pov_key ) {
			this.viewpoint.setPOV( coords );
		}
		// Translate coordinates to canvas
		viewpointCoords = this.viewpoint.getCoordinates( coords );

		if ( viewpointCoords ) {
			// Get graphic details
			view = this.objects[o].getView();

			// TODO: Allow the user to choose between relative radii and preset radius value
			// in the view parameters, instead of having the view take precedence randomly
			radius = this.viewpoint.getRadius( this.objects[o].getRadius(), this.objects[o].getType() );

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
					this.drawCircle(
						this.context,
						trails[i],
						1,
						// TODO: Consider making trail colors a configuration option
						view.color || '#FF005D' // Bright pink
					);
				}
			}

			// Draw the object
			this.drawCircle( this.context,
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
 * Draw a circle on the canvas
 * @param {Object} context Canvas context object
 * @param {Object} coords Canvas coordinates
 * @param {number} [radius] Circle radius
 * @param {string} [color] Circle color
 * @param {boolean} [hasShadow] Add a shadow
 */
sp.Scenario.prototype.drawCircle = function ( context, coords, radius, color, hasShadow ) {
	context.save();
	context.beginPath();
	context.arc(
		coords.x,
		coords.y,
		radius || 5, 0, 2 * Math.PI,
		false
	);
	context.fillStyle = color || 'white';
	if ( hasShadow ) {
		context.shadowColor = color || 'white';
		context.shadowBlur = 20;
		context.shadowOffsetX = 0;
		context.shadowOffsetY = 0;
	}
	context.fill();
	context.restore();
};

/**
 * Clear an area on the canvas
 * @param {Object} context Canvas context object
 * @param {number} [square] Dimensions and coordinates of the square
 * to clear
 * @param {number} [square.top] Top coordinate of the square
 * @param {number} [square.left] Left coordinate of the square
 * @param {number} [square.width] Width of the square
 * @param {number} [square.height] Height of the square
 */
sp.Scenario.prototype.clearCanvas = function ( context, square ) {
	context = this.context;
	square = square || {};

	// Fix optional values:
	square.left = square.left || 0;
	square.top = square.top || 0;
	square.width = square.width || this.$canvas.width();
	square.height = square.height || this.$canvas.height();

	// Erase the square
	context.clearRect( square.left, square.top, square.width, square.height );
};

/**
 * Flush all trails from all objects
 */
sp.Scenario.prototype.flushAllTrails = function () {
	var o;
	for ( o in this.objects ) {
		this.objects[o].flushTrailPoints()
	}
};

/**
 * Run the scenario
 */
sp.Scenario.prototype.run = function () {
	if ( !this.paused ) {
		// Clear canvas
		this.clearCanvas( this.context );

		// Draw canvas
		this.draw( this.time );

		// Increase time
		this.time += 0.0000000001 * this.speed;

		window.requestNextAnimationFrame( $.proxy( this.run, this ) );
	}
};

/**
 * Retrieve all the celestial objects attached to this scenario
 * @returns {sp.Scenario.CelestialObject} All objects in the scenario
 */
sp.Scenario.prototype.getAllObjects = function () {
	return this.objects;
}

/**
 * Toggle between pause and resume the scenario
 * @param {boolean} [isPause] Optional. If supplied, pauses or resumes the scenario
 * @fires paused
 */
sp.Scenario.prototype.togglePaused = function ( isPause ) {
	if ( isPause === undefined ) {
		isPause = !this.paused;
	}
	isPause = !!isPause;

	this.paused = isPause;
	this.run();

	this.emit( 'paused', isPause );
};

/**
 * Check whether the scenario is paused
 */
sp.Scenario.prototype.isPaused = function () {
	return this.paused;
};

/**
 * Pause the scenario
 */
sp.Scenario.prototype.pause = function () {
	this.togglePaused( true );
};

/**
 * Resume the scenario
 */
sp.Scenario.prototype.resume = function () {
	this.togglePaused( false );
	this.run();
};

/**
 * Increase or decrease scenario zoom levels
 * @param {number} z Zoom level, negative for zoom out
 */
sp.Scenario.prototype.zoom = function ( z ) {
	this.viewpoint.setZoom( z );
	this.flushAllTrails();
	if ( this.isPaused() ) {
		this.clearCanvas();
		this.draw( this.time, true );
	}
};

/**
 * Set the viewpoint's center point
 * @param {number} x X coordinate of the center of the system
 * @param {number} y Y coordinate of the center of the system
 */
sp.Scenario.prototype.setCenterPoint = function ( x, y ) {
	this.viewpoint.setCenterPoint( x, y );
	this.flushAllTrails();
	if ( this.isPaused() ) {
		this.clearCanvas();
		this.draw( this.time, true );
	}
};

/**
 * Get the current center point of the view
 * @returns {Object} x/y coordinates of the current center point
 */
sp.Scenario.prototype.getCenterPoint = function () {
	return this.viewpoint.getCenterPoint();
};
