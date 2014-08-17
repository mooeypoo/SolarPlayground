/**
 * Solar Playground main system controller
 *
 * @class sp.System
 * @mixins OO.EventEmitter
 *
 * @param {Object} [config] Configuration object
 */
sp.System = function SpSystem( config ) {
	var defaultConfig;

	// Mixin constructors
	OO.EventEmitter.call( this );

	// Containers holder
	this.containers = {};

	config = config || {};

	defaultConfig = {
		scenario_dir: 'scenarios', // Default directory unless otherwise specified
		scenario_prefix: 'scenario.', // Default scenario file prefix
		directory_sep: '/',
		width: $( window ).width() - 100,
		height: $( window ).height() - 100
	};

	// Extend default global options
	this.config = $.extend( true, defaultConfig, config );
};

/* Inheritance */
OO.mixinClass( sp.System, OO.EventEmitter );

/* Methods */

/**
 * Add a container
 * @param {string} container_id The id of the DOM that this container
 * will be attached to
 * @param {Object} [config] Configuration object
 * @chainable
 * @throws {Error} If container_id is undefined or empty
 * @return {sp.Container} The new container
 */
sp.System.prototype.setContainer = function ( container_id, config ) {
	if ( !container_id ) {
		throw Error( 'sp.System.setContainer must supply a valid container_id.' );
	}

	// Add a container
	this.containers[container_id] = new sp.container.Manager( {
		'id': container_id,
		'container': '#' + container_id,
		'width': config.width || this.config.width,
		'height': config.height || this.config.height,
		'gui': config.gui || 'ooui',
		scenario_dir: this.config.scenario_dir,
		directory_sep: this.config.directory_sep,
		scenario_prefix: config.scenario_prefix || this.config.scenario_prefix,
		// TODO: When 'build' mode is created, it should be either
		// enabled right on instantiation or allow to be added later
		buildMode: false
	} );

	return this.containers[container_id];
};

/**
 * Retrueve the container by its id
 * @param {string} container_id The id of the DOM that this container
 * is attached to
 * @throws {Error} If there are no containers defined
 * @returns {sp.Container|null} The container
 */
sp.System.prototype.getContainer = function ( container_id ) {
	if ( !this.containers ) {
		throw Error( 'Cannot get container, no containers are defined.' );
	}
	return this.containers[container_id];
};

/**
 * Get configuration option or full configuration object.
 * @param {string} [option] Configuration key
 * @returns {string|Object} Configuration object
 */
sp.System.prototype.getConfig = function ( option ) {
	if ( this.config && option ) {
		return this.config[option];
	}
	return this.config;
};
