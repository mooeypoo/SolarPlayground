/**
 * Celestial object, defines a moving object in space.
 *
 * @class sp.Scenario.CelestialObject
 * @mixins OO.EventEmitter
 *
 * @param {Object} config Celestial object definition
 */
sp.Scenario.CelestialObject = function SpScenarioCelestialObject( config ) {
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
OO.mixinClass( sp.Scenario.CelestialObject, OO.EventEmitter );

/**
 * Get space coordinates per time.
 * @param {number} time Time unit
 */
sp.Scenario.CelestialObject.prototype.getSpaceCoordinates = function ( time ) {
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
 * Store the coordinate in the trail queue. Stores the space coordinates.
 * Dequeue the first when trail number cap is reached.
 * @param {Object} coordinates Coordinates of the trails
 */
sp.Scenario.CelestialObject.prototype.storeTrailPoint = function ( coordinates ) {
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
sp.Scenario.CelestialObject.prototype.getTrailPoints = function () {
	return this.trails;
};

/**
 * Flush the trails queue completely.
 */
sp.Scenario.CelestialObject.prototype.flushTrailPoints = function () {
	this.trails = [];
	this.frameCounter = 0;
};

/**
 * Get object type
 * @returns {string} Celestial object type, 'star' or 'planet'
 */
sp.Scenario.CelestialObject.prototype.getType = function () {
	return this.type;
};

/**
 * Get object name
 * @returns {string} Celestial object name
 */
sp.Scenario.CelestialObject.prototype.getName = function () {
	return this.name;
};

/**
 * Get object description
 * @returns {string} Celestial object description
 */
sp.Scenario.CelestialObject.prototype.getDescription = function () {
	return this.description;
};

/**
 * Set the object this object is orbiting
 * @param {sp.Scenario.CelestialObject} obj Object that is the center of the orbit
 */
sp.Scenario.CelestialObject.prototype.setOrbit = function ( obj ) {
	this.orbiting = obj;
};

/**
 * Retrieve the object that is the center of orbit
 * @returns {sp.Scenario.CelestialObject} obj Object that is the center of the orbit
 */
sp.Scenario.CelestialObject.prototype.getOrbit = function () {
	return this.orbiting;
};

/**
 * Set object name
 * @param {string} name New object name
 */
sp.Scenario.CelestialObject.prototype.setName = function ( name ) {
	this.name = name;
};

/**
 * Set object description
 * @param {string} desc New object description
 */
sp.Scenario.CelestialObject.prototype.setDescription = function ( desc ) {
	this.description = desc;
};

sp.Scenario.CelestialObject.prototype.getMass = function () {
	return this.vars.m;
};

sp.Scenario.CelestialObject.prototype.getView = function () {
	return this.view;
}

/**
 * Get the planet radius if it exists.
 * @returns {number|null} Planet radius in km
 */
sp.Scenario.CelestialObject.prototype.getRadius = function () {
	return this.vars.r;
};
