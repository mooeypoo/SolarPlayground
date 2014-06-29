/**
 * UI OOUI Module namespace
 * @property {Object}
 */
sp.ui.ext.ooui = {
	'Mod': {}
};

sp.ui.toolFactory = new OO.ui.ToolFactory();
sp.ui.toolGroupFactory = new OO.ui.ToolGroupFactory();

/**
 * OOUI Gui module
 *
 * @class sp.ui.ext.ooui.Mod.Play
 *
 * @param {sp.Container} container The container to attach the GUI to
 * @param {Object} [config] Gui module definition
 */
sp.ui.ext.ooui.Mod.Play = function SpUiExtOouiModPlay( container, config ) {
	config = config || {};

	// Parent constructor
	sp.ui.ext.ooui.Mod.Play.super.call( this, container, config );

	this.tools = {};
	this.container = container;
	return this;
};

/* Inheritance */
OO.inheritClass( sp.ui.ext.ooui.Mod.Play, sp.ui.ext.Play );

/* Static */

/**
 * Define toolbar groups for OOUI
 * @property {Array}
 */
sp.ui.ext.ooui.Mod.Play.static.toolbarGroups = [
	// Play tools
	{
		'type': 'bar',
		'include': [ { 'group': 'playTools' } ]
	},
	// POV menu
	{
		'type': 'menu',
		'indicator': 'down',
		'label': 'POV',
		'icon': 'picture',
		'include': [ { 'group': 'povTools' } ]
	},
	// View tools
	{
		'type': 'bar',
		'include': [ { 'group': 'zoomTools' } ]
	},
	{
		'type': 'bar',
		'include': [ { 'group': 'viewTools' } ]
	}
];

sp.ui.ext.ooui.Mod.Play.static.commands = [
	'play',
	'speed'
	'zoomin',
	'zoomout'
];

/* Events */

/**
 * Play or pause scenario
 * @event play
 * @param {boolean} isPlay Play scenario or pause
 */

/**
 * Zoom in or out
 * @event zoom
 * @param {number} zoomLevel How much to zoom. Negative to zoom out.
 */

/**
 * Change point of view object
 * @event pov
 * @param {string} povObjName New POV object name or key
 */

/* Methods */

/**
 * Initialize the Gui
 * @returns {OO.ui.Toolbar}
 */
sp.ui.ext.ooui.Mod.Play.prototype.initialize = function () {
	var i, tools, tname;

	this.toolbar = new sp.ui.ext.ooui.Toolbar( this, this.container );
	this.toolbar.setup( this.constructor.static.toolbarGroups );
	// TODO: Add commands to container (future!)
//	this.container.addCommands( this.constructor.static.commands );
	this.container.addToolbar( this.toolbar.$element );

	this.toolbar.emit( 'updateState' );

	// Events
	this.container.connect( this, { 'scenarioLoaded': 'onScenarioLoaded' } );

	return this;
};

/**
 * Respond to new scenario loaded
 * @fires updateState
 */
sp.ui.ext.ooui.Mod.Play.prototype.onScenarioLoaded = function () {
	if ( this.container.getScenario() ) {
		this.container.getScenario().disconnect( this );
	}
	// Events
	this.container.getScenario().connect( this, { 'pause': [ 'onScenarioChanged', 'play' ] } );
	this.container.getScenario().connect( this, { 'pov': [ 'onScenarioChanged', 'pov' ] } );

	// Update the toolbar
	this.toolbar.emit( 'updateState' );
};

/**
 * Respond to change in scenario state
 * @fires updateState
 */
sp.ui.ext.ooui.Mod.Play.prototype.onScenarioChanged = function () {
	this.toolbar.emit( 'updateState', arguments );
};

/**
 * Add a tool to the POV list
 * @param {string} name Tool name
 * @param {string} title Title or alternate text
 * @param {string} [icon] Tool icon
 */
sp.ui.ext.ooui.Mod.Play.prototype.addToPOVList = function ( name, title, icon ) {
	var tool, toolDefinition;

	icon = icon || 'picture';
	toolDefinition = [
		// name
		name,
		// icon
		icon,
		// title/label
		title
	];

	tool = this.createPOVTool.apply( this, toolDefinition );
	sp.ui.toolFactory.register( tool );
};

/**
 * Get the Gui toolbar
 * @returns {OO.ui.Toolbar} The toolbar connected to the gui
 */
sp.ui.ext.ooui.Mod.Play.prototype.getToolbar = function () {
	return this.toolbar;
};

/**
 * Create a POV tool
 * @param {string} name Tool name
 * @param {string} icon Tool icon
 * @param {string} title Title or alternate text
 * @returns {sp.ui.ext.ooui.POVTool} Tool
 */
sp.ui.ext.ooui.Mod.Play.prototype.createPOVTool = function ( name, icon, title ) {
	var Tool = function SpGuiPOVTool() {
		Tool.super.apply( this, arguments );
	};
	OO.inheritClass( Tool, sp.ui.ext.ooui.POVTool );

	Tool.static.name = name;
	Tool.static.icon = icon;
	Tool.static.title = title;
	return Tool;
};
