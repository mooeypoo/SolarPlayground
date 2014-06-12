/**
 * Gui Loader. Creates the gui to be attached to
 * the SolarPlayground container.
 *
 * @class sp.Gui.Loader
 * @mixins OO.EventEmitter
 *
 * @param {Object} config Gui definition
 * @config {string} module The GUI module. Defaults to 'ooui'
 * @config {jQuery} jQuery object for the container on top of which
 *  the GUI should be built.
 */
sp.Gui.Loader = function SpGuiInitializer( config ) {
	config = config || {};

	// Mixin constructors
	OO.EventEmitter.call( this );

	this.moduleName = config.module || 'ooui';
	this.module = null;
	this.scenario = config.scenario;

	this.settings = config.settings || {};

	this.$container = config.$container;
	this.$spinner = $( '<div>' )
		.addClass( 'sp-system-spinner' )
		.appendTo( this.$container );
};

/* Inheritance */
OO.mixinClass( sp.Gui.Loader, OO.EventEmitter );

/**
 * Create the GUI according to the ui module
 */
sp.Gui.Loader.prototype.initialize = function () {
	/// TODO: Use a factory instead of this quick and somewhat
	/// lame 'switch' statement, so we can allow for proper
	/// modules for the GUI, like jQueryUI or whatever else.
	switch ( this.module ) {
		case 'ooui':
		default:
			this.module = new sp.Gui.Module.ooui( this.$container, this.settings );
			break;
	}

	this.module.initialize( this.settings );
	this.$spinner.hide();
};

/**
 * Connect the GUI module to the scenario it controls
 * @param {sp.Scenario} scenario The scenario object
 */
sp.Gui.Loader.prototype.setScenario = function ( scenario ) {
	this.module.setScenario( scenario );
};
