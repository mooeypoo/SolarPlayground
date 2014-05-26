/**
 * Celestial object
 * @param {Object} config Celestial object definition
 */
sp.Scenario.CelestialObject = function SpScenarioCelestialObject( config ) {
	config = config || {};

	// Mixin constructors
	OO.EventEmitter.call( this );

	// Attributes
	this.name = config.name || '';
	this.description = config.description || '';

	this.vars = config.vars;
	this.initial_position = config.initial_position || { 'x': 0, 'y': 0 };

	// Link to the object it is orbiting
	this.orbiting = null;
};

/* Inheritance */
OO.mixinClass( sp.Scenario.CelestialObject, OO.EventEmitter );

/**
 * Update coordinates for time.
 * @param {number} time Time unit
 */
sp.Scenario.CelestialObject.prototype.updateCoordinates = function SpScenarioCelestialObjectUpdateCoordinates( time ) {
	var dest, M, G;

	time = time || 0;

	// Calculate period (only once per session, if doesn't exist)
	if ( !this.vars.p && this.orbiting ) {
		// 1AU = 149 597 870 700 meters
		G =  6.67 * Math.pow( 10, -11 );
		// M = Mass of the object at the center of orbit
		// p^2 = (4*Math.PI * 149597870700) / G*M
		M = this.orbiting.getMass();
		if ( M ) {
			this.vars.p = Math.sqrt(
				( 4 * Math.PI * 149597870700 ) /
				( G * M )
			);
		}
	}

	this.coordinates = sp.Scenario.Calculator.solveKepler(
		this.vars.a,
		this.vars.e,
		this.vars.p || 0,
		time
	);

	return this.coordinates;
};

sp.Scenario.CelestialObject.prototype.getCoordinates = function SpScenarioCelestialObjectGetCoordinates() {
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
