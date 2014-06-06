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

	this.config.speed = this.config.speed || 1;
	this.config.orbit_scale = this.config.orbit_scale || 0.5 * Math.pow( 10, -5 );
	this.config.planet_scale = this.config.planet_scale || 1 * Math.pow( 10, -9 );
	this.config.zoom = this.config.init_zoom || 1;

	this.date = this.config.start_time || { day: 1, month: 1, year: 2000 };
	this.time = 0;
	this.speed = this.config.init_speed || 1;

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
	var o, co, radii = [], radii_diff, step_size, radius, circle_radius;

	// Initialize celestial objects
	for ( o in scenarioObjects ) {
		this.objects[o] = new sp.Scenario.CelestialObject( scenarioObjects[o] );

		// Calculate relative radii
		if ( scenarioObjects[o].vars.r ) {
			radii.push( scenarioObjects[o].vars.r );
		}
	}

	// Calculate effective drawing radius
	// TODO: Find a better way to represent planet radii, scaled to the canvas

	// Sort by size
	radii.sort();
	// Check biggest and smallest
	radii_diff = radii[ radii.length - 1 ] - radii[0];
	// Create radius 'steps' fitting the pixel size steps
	step_size = radii_diff / this.relative_radii.length;

	// Connect selestial objects to orbit
	// And fit each planet drawing size to its relative size
	for ( co in this.objects ) {
		if ( scenarioObjects[co] && this.objects[scenarioObjects[co].orbiting] ) {
			// Connect the object to its center of orbit
			this.objects[co].setOrbit( this.objects[scenarioObjects[co].orbiting] );
		}
		radius = this.objects[co].getRadius();
		if ( radius ) {
			circle_radius = this.relative_radii[ Math.floor( radius / step_size ) ];
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
		radius = view.radius || this.objects[o].getCircleRadius();

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
		scale = 100; //Math.sqrt( this.config.orbit_scale * this.config.zoom );

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
