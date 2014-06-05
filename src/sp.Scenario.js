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
	this.config.speed = this.config.speed || 1;

	this.init_pov = this.config.init_pov;
	this.pov_object = null;
	this.pov = null;

	this.config.speed = this.config.speed || 1;
	this.config.orbit_scale = this.config.orbit_scale || 0.5 * Math.pow( 10, -5 );
	this.config.planet_scale = this.config.planet_scale || 1 * Math.pow( 10, -9 );
	this.config.zoom = this.config.init_zoom || 1;

	this.date = this.config.start_time || { day: 1, month: 1, year: 2000 };
	this.time = 0; /*sp.Scenario.Calculator.getJDNTime(
		this.date.year || 2000,
		this.date.month || 1,
		this.date.day || 1,
		this.date.hours || 0,
		this.date.minutes || 0,
		this.date.seconds || 0
	);*/
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

	// Set initial POV
	if ( this.init_pov && this.objects[this.init_pov] ) {
		this.pov_object = this.objects[this.init_pov];
	}
};

/**
 * Draw all elements
 * @param {number} time Time
 */
sp.Scenario.prototype.draw = function SpScenarioUpdateObjects( time ) {
	var o, coords, translatedCoords, view;

	for ( o in this.objects ) {
		coords = this.objects[o].getSpaceCoordinates( time );

		// Update POV coordinates
		if ( o === this.pov_object ) {
			this.pov = coords;
		}
		// Translate coordinates to canvas
		translatedCoords = this.translateScreenCoodinates( coords );

		// Draw
		view = this.objects[o].getView();

		this.context.save();
		this.context.beginPath();
		this.context.arc( translatedCoords.x, translatedCoords.y, view.radius || 10, 0, 2 * Math.PI, false );
		this.context.fillStyle = view.color || 'white';
		this.context.fill();
		this.context.restore();
		sp.log( 'Notice', 'drawing "' + this.objects[o].getName() + '" at ' + coords.x + ':' + coords.y );
	}
};

sp.Scenario.prototype.run = function SpScenarioRun() {
	if ( !this.paused ) {
		// Clear canvas
		this.context.clearRect( 0, 0, this.$canvas.width(), this.$canvas.height() );

		// Draw canvas
		this.draw( this.time );

		// Increase time
		this.time += 0.0000000001;

		window.requestNextAnimationFrame( $.proxy( this.run, this ) );
	}
}

sp.Scenario.prototype.translateScreenCoodinates = function SpScenarioAnimate( coords ) {
	var pov = this.pov || { x: 0, y: 0 },
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
