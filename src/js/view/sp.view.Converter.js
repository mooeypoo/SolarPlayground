/**
 * Solar Playground view converter.
 * Converts between space coordinates and screen coordinates and controls the visual presentation.
 *
 * @class sp.view.Converter
 * @mixins OO.EventEmitter
 *
 * @param {Object} [config] Configuration object
 */
sp.view.Converter = function SpViewConverter( config ) {
	// Mixin constructors
	OO.EventEmitter.call( this );

	// Configuration
	this.config = config || {};

	this.zoom = this.config.zoom || 1;
	this.orbit_scale = this.config.orbit_scale || 1;
	this.yaw = this.config.yaw;
	this.pitch = this.config.pitch;

	this.canvasDimensions = this.config.canvasDimensions || { 'width': 0, 'height': 0 };
	this.scenarioCenterPoint = {
		'x': this.canvasDimensions.width / 2,
		'y': this.canvasDimensions.height / 2
	};

	this.pov = { 'x': 0, 'y': 0, 'z': 0 };
	this.radii_list = null;

	// Set up visible canvas-scaled radius steps in pixels
	this.radii = {
		'star': [ 25, 30, 32, 35 ],
		'planet': [ 10, 12, 14, 16 ],
		'moon': [ 4, 8, 10, 12 ]
	};
	// Define the step between each value
	this.radius_step = {
		'star': 0,
		'planet': 0
	};
};

/* Inheritance */
OO.mixinClass( sp.view.Converter, OO.EventEmitter );

/* Events */

/**
 * Change of the POV coordinates in space
 * @event changePOV
 * @param {Object} New space coordinates of the POV
 */

/* Methods */

/**
 * Set the coordinates of the current POV object
 * @param {Object} pov_coords The 3d coordinates of the current POV
 * @fires changePOV
 */
sp.view.Converter.prototype.setPOV = function ( pov_coords ) {
	if ( !pov_coords ) {
		return;
	}
	if ( pov_coords.x !== this.pov.x || pov_coords.y !== this.pov.y ) {
		this.pov = pov_coords;
		this.emit( 'changePOV', pov_coords );
	}
};

/**
 * Translate between space coordinates and viewpoint coordinates
 * on the canvas.
 * @param {Object} spaceCoords Original 3D space coordinates
 * @returns {Object} Canvas 2d coordinates
 */
sp.view.Converter.prototype.getCoordinates = function ( spaceCoords ) {
	var ca = Math.cos( this.yaw ),
		sa = Math.sin( this.yaw ),
		cb = Math.cos( this.pitch ),
		sb = Math.sin( this.pitch ),
		dx = this.scenarioCenterPoint.x,
		dy = this.scenarioCenterPoint.y,
		scale = Math.sqrt( this.orbit_scale * this.zoom );

	// TODO: Work out proper scale
	x = ( spaceCoords.x - this.pov.x ) * scale;
	y = ( spaceCoords.y - this.pov.y ) * scale;
	z = ( spaceCoords.z - this.pov.z ) * scale;

	destination = {
		'x': x * ca - y * sa + dx,
		'y': x * sa + y * ca
	};
	destination.z = destination.y * sb;
	destination.y = destination.y * cb + dy;

	// Check if destination is inside the canvas. Return null otherwise.
	if (
		destination.x > 0 &&
		destination.x <= this.canvasDimensions.width &&
		destination.y > 0 &&
		destination.y <= this.canvasDimensions.height
	) {
		return destination;
	}
};

/**
 * Calculate radius size steps from a new radii list
 * @param {Object} rList Actual size radii of all celestial objects
 * divided into 'stars' and 'planets' to distinguish relative sizes better
 */
sp.view.Converter.prototype.setRadiiList = function ( rList ) {
	var type, diff;

	this.radii_list = rList;

	for ( type in this.radii_list ) {
		// Sort by size, ascending
		this.radii_list[type].sort( function ( a, b ) {
			return a - b;
		} );

		// Figure out steps for each of the types
		diff = this.radii_list[type][this.radii_list[type].length - 1] -
			this.radii_list[type][0];

		this.radius_step[type] = diff / this.radii[type].length
	}
};

/**
 * Translate between the original radius and the canvas radius in pixels
 * @param {number} orig_radius Object's original radius
 * @returns {number} Actual radius in pixels
 */
sp.view.Converter.prototype.getRadius = function ( orig_radius, type ) {
	var radius, index,
		step = this.radius_step[type] || 1;

	type = type || 'planet';
	index = Math.floor( orig_radius / step );

	if ( index > this.radii[type].length - 1 ) {
		index = this.radii[type].length - 1;
	}

	radius = Math.sqrt( this.radii[type][ index ] * this.zoom ) / 100;

	return ( radius >= 2 ) ? radius : 2;
};

/**
 * Increase or decrease scenario zoom levels
 * @param {number} z Zoom level, negative for zoom out
 */
sp.view.Converter.prototype.setZoom = function ( z ) {
	this.zoom += z;
};

/**
 * Get the current zoom factor
 * @returns {number} zoom Zoom factor
 */
sp.view.Converter.prototype.getZoom = function () {
	return this.zoom;
};

/**
 * Set the scenario center point
 * @param {Object} coords x/y coordinates of the center of the system
 */
sp.view.Converter.prototype.setCenterPoint = function ( coords ) {
	coords = coords || {};

	x = coords.x || 0;
	y = coords.y || 0;

	this.scenarioCenterPoint = {
		'x': x,
		'y': y
	};
};

/**
 * Get the current center point of the view
 * @returns {Object} x/y coordinates of the current center point
 */
sp.view.Converter.prototype.getCenterPoint = function () {
	return this.scenarioCenterPoint;
};

/**
 * Add to the center point
 * @param {number} [x] Amount to add to X coordinate
 * @param {number} [y] Amount to add to Y coordinate
 */
sp.view.Converter.prototype.addToCenterPoint = function ( x, y ) {
	x = x || 0;
	y = y || 0;

	this.scenarioCenterPoint.x += x;
	this.scenarioCenterPoint.y += y;
};

/**
 * Set the pitch angle for the view
 */
sp.view.Converter.prototype.setPitchAngle = function ( pitch ) {
	if ( this.pitch !== pitch ) {
		this.pitch = pitch;
		this.emit( 'pitch', this.pitch );
	}
};

sp.view.Converter.prototype.getPitchAngle = function () {
	return this.pitch;
};

/**
 * Set new canvas dimensions
 * @param {[type]} dimensions [description]
 */
sp.view.Converter.prototype.setCanvasDimensions = function ( dimensions ) {
	this.canvasDimensions = dimensions;
};
