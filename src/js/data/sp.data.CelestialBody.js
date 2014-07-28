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
	var dest, M, G, period, centerOfOrbitCoords;

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
		// TODO: Allow for calculation based on period
		if ( this.vars.a && this.vars.e && this.vars.I && this.vars.L && this.vars.long_peri && this.vars.long_node ) {
			this.coordinates = sp.calc.Calculator.solveKepler(
				this.vars,
				time
			);
		} else if ( this.vars.p && this.vars.r ) {
			// Calculate based on Period
			this.coordinates = { x: 0, y: 0, z: 0 };
			return this.coordinates;
		} else {
			// Not enough details.
			this.coordinates = { x: 0, y: 0, z: 0 };
			return this.coordinates;
		}

		// TODO: Calculate the position relative to the orbit mass to allow for
		// sub systems like moons

		// Adjust the coordinates from center of orbit to world coordinates
		centerOfOrbitCoords = this.orbiting.getSpaceCoordinates( time );
		if ( centerOfOrbitCoords ) {
			this.coordinates = {
				'x': this.coordinates.x + centerOfOrbitCoords.x,
				'y': this.coordinates.y + centerOfOrbitCoords.y,
				'z': this.coordinates.z + centerOfOrbitCoords.z
			};
		}
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
