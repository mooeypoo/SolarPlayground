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
