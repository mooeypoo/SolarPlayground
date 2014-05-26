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
