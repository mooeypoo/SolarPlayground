/**
 * OOUI Gui module
 *
 * @class sp.Gui.Module.ooui
 *
 * @param {jQuery} $container The container to attach the GUI to
 * @param {Object} [config] Gui module definition
 */
sp.Gui.Module.ooui = function SpGuiModuleOoui ( $container, config ) {
	config = config || {};

	this.$container = $container;
	this.scenario = null;
};

/**
 * Connect the GUI to the scenario it controls
 * @param {sp.Scenario} scenario The scenario object this GUI controls
 */
sp.Gui.Module.ooui.prototype.setScenario = function ( scenario ) {
	this.scenario = scenario;
};

sp.Gui.Module.ooui.prototype.initialize = function () {
	var i, tools,
		toolFactory = new OO.ui.ToolFactory(),
		toolGroupFactory = new OO.ui.ToolGroupFactory();

	// Create toolbar
	this.toolbar = new OO.ui.Toolbar( toolFactory, toolGroupFactory );
	this.toolbar.setup( [
		{
			'type': 'bar',
			'include': [ { 'group': 'playTools' } ]
		}
	] );
	this.toolbar.emit( 'updateState' );

	// Create buttons for the toolbar
	// TODO: Disable all buttons until the scenario is loaded
	tools = [
		// playTools
		[ 'playTool', 'playTools', 'check', 'Play scenario', null, $.proxy( this.onPlayButtonSelect, this ) ],
//		[ 'pauseTool', 'playTools', 'close', 'Pause scenario', function () { this.setDisabled( true ); }, this.onPauseButtonSelect ]
		[ 'pauseTool', 'playTools', 'close', 'Pause scenario', null, $.proxy( this.onPauseButtonSelect, this ) ]
	];

	for ( i = 0; i < tools.length; i++ ) {
		toolFactory.register( this.createTool.apply( this, tools[i] ) );
	}
	// Attach toolbar to container
	this.$container.prepend( this.toolbar.$element );
};

/**
 * Respond to play button click
 * @returns {[type]} [description]
 */
sp.Gui.Module.ooui.prototype.onPlayButtonSelect = function () {
	if ( this.scenario ) {
		this.scenario.resume();
	}
	// TODO: Activate the pause button and disable self
};

/**
 * Respond to pause button click
 * @returns {[type]} [description]
 */
sp.Gui.Module.ooui.prototype.onPauseButtonSelect = function () {
	if ( this.scenario ) {
		this.scenario.pause();
	}
	// TODO: Activate the play button and disable self
};
/**
 * Create a toolbar tool.
 * Taken from the OOUI tools demo.
 *
 * @param {string} name Tool name
 * @param {string} group Tool group
 * @param {string} icon Tool icon
 * @param {string} title Title or alternate text
 * @param {Function} init Initialization function
 * @param {Function} onSelect Activation function
 * @returns {OO.ui.Tool} Tool
 */
sp.Gui.Module.ooui.prototype.createTool = function ( name, group, icon, title, init, onSelect ) {
	var Tool = function () {
		Tool.super.apply( this, arguments );
		this.toggled = false;
		if ( init ) {
			init.call( this );
		}
	};

	OO.inheritClass( Tool, OO.ui.Tool );

	Tool.prototype.onSelect = function () {
		if ( onSelect ) {
			onSelect.call( this );
		} else {
			this.toggled = !this.toggled;
			this.setActive( this.toggled );
		}
		this.toolbar.emit( 'updateState' );
	};
	Tool.prototype.onUpdateState = function () {};

	Tool.static.name = name;
	Tool.static.group = group;
	Tool.static.icon = icon;
	Tool.static.title = title;
	return Tool;
};
