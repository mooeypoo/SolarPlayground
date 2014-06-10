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

	// TODO: Validate the scenario object to make sure all required
	// elements exist.

	// TODO: Create another canvas for trails so we can visualize the
	// orbits with trails that remain for a bit on the screen
	this.$canvas = $canvas;
	this.context = $canvas[0].getContext( '2d' );

	this.paused = false;
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

	this.pov_key = this.config.init_pov;
	this.pov_object = null;

	this.date = this.config.start_time || { day: 1, month: 1, year: 2000 };
	this.time = 0;
	this.speed = this.config.init_speed || 1;

	// Size steps for drawing. Bigger and smaller planets will accept
	// the value of these steps so they can be scaled to canvas size, but
	// still have a more-or-less representative size on the screen.
	// Size is in pixels and represents circle radius.
//	this.relative_radii = [ 2, 4, 6, 8, 10, 12, 14, 16, 18, 20 ];

	// Prepare the objects
	this.processObjects( scenario.objects || {} );
};

/* Inheritance */
OO.mixinClass( sp.Scenario, OO.EventEmitter );

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
 */
sp.Scenario.prototype.draw = function ( time ) {
	var o, coords, viewpointCoords, view, radius;

	for ( o in this.objects ) {
		coords = this.objects[o].getSpaceCoordinates( time );

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

			// Draw
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
 * Toggle between pause and resume the scenario
 * @param {boolean} [isPause] Optional. If supplied, pauses or resumes the scenario
 */
sp.Scenario.prototype.togglePaused = function ( isPause ) {
	isPause = !!isPause || !this.paused;
	this.paused = isPause;
	this.run();
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
	this.paused = true;
};

/**
 * Resume the scenario
 */
sp.Scenario.prototype.resume = function () {
	this.paused = false;
	this.run();
};
