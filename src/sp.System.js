/**
 * Solar Playground system
 *
 * @param {Object} [config] Configuration object
 */
sp.System = function SpSystemInitialize( config ) {
	var defaultConfig;

	config = config || {};

	defaultConfig = {
		container: '#solarSystem',
		scenario_dir: 'scenarios', // Current directory unless otherwise specified
		directory_sep: '/',
		width: $( window ).width() - 100,
		height: $( window ).height() - 100
	};

	// Extend default global options
	this.config = $.extend( true, config, defaultConfig );

	// Mixin constructors
	OO.EventEmitter.call( this );

	this.scenario = null;

	// Initialize
	this.$container = $( this.config.container )
		.addClass( 'sp-system-container' )

	this.$spinner = $( '<div>' )
		.addClass( 'sp-system-spinner' )
		.appendTo( this.$container );

	this.$canvas = $( '<canvas>' )
		.addClass( 'sp-system-canvas' )
		.attr( 'width', this.config.width )
		.attr( 'height', this.config.height )
		.appendTo( this.$container );

	this.$spinner.hide().detach();
};

/* Inheritance */
OO.mixinClass( sp.System, OO.EventEmitter );

/* Methods */

/**
 * Load a scenario
 * @param {String} scenarioName Scenario name. The system will search for
 *  an ajax response from source 'scenario.[name].json' in the scenario
 *  directory.
 */
sp.System.prototype.load = function SpSystemLoad( scenarioName ) {
	var targetName,
		targetDir = this.config.scenario_dir + this.config.directory_sep;

	scenarioName = scenarioName || 'example';
	targetName = 'scenario.' + scenarioName + '.json';

	$.getJSON( targetDir + targetName )
		.done( $.proxy( function ( response ) {
			// Load the scenario
			this.loadScenario( response );
		}, this ) )
		.fail( function () {
			sp.log( 'ERROR', 'Scenario ' + targetName + ' not found in directory "' + targetDir + '"' );
		} );
};

/**
 * Load and run a scenario
 * @param {Object} scenarioObject Scenario configuration object
 */
sp.System.prototype.loadScenario = function SpSystemLoadScenario( scenarioObject ) {
	scenarioObject = scenarioObject || {};

	this.scenario = new sp.Scenario( this.$canvas, scenarioObject );

	this.scenario.run();
};

/**
 * Toggle between pause and resume the scenario
 * @param {boolean} [isPause] Optional. If supplied, pauses or resumes the scenario
 */
sp.System.prototype.togglePaused = function SpSystemTogglePaused( isPause ) {
	this.scenario.togglePaused( isPause );
};

/**
 * Check whether the scenario is paused
 */
sp.System.prototype.isPaused = function SpSystemIsPaused() {
	return this.scenario.isPaused();
};

/**
 * Get configuration option or full configuration object.
 * @param {string} [option] Configuration key
 * @returns {string|Object} Configuration object
 */
sp.System.prototype.getConfig = function SpSystemGetConfig( option ) {
	if ( this.config[option] ) {
		return this.config[option];
	}
	return this.config;
};
