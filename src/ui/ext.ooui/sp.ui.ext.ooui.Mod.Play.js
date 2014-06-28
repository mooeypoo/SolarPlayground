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
	}
/*	// View tools
	{
		'type': 'bar',
		'include': [ { 'group': 'viewTools' }, 'speed' ]
	},
	// POV Tools
	{
		'type': 'menu',
		'indicator': 'down',
		'label': 'POV',
		'icon': 'picture',
		'include': [ { 'group': 'povTools' } ]
	}*/
];

sp.ui.ext.ooui.Mod.Play.static.commands = [
	'play',
	'speed'
//	'zoomin',
//	'zoomout'
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

	// Update the toolbar
	this.toolbar.emit( 'updateState' );
};

/**
 * Respond to change in scenario state
 * @fires updateState
 */
sp.ui.ext.ooui.Mod.Play.prototype.onScenarioChanged = function ( event ) {
	this.toolbar.emit( 'updateState' );
};

/**
 * Add a tool to the POV list
 * @param {string} name Tool name
 * @param {string} title Title or alternate text
 * @param {string} [icon] Tool icon
 */
sp.ui.ext.ooui.Mod.Play.prototype.addToPOVList = function ( name, title, icon ) {
/*	var toolDefinition, onSelectFunc, tool,
		eventObject = {},
		toolName = name + 'Tool';

	toolDefinition = [
		// name
		name,
		// icon
		icon,
		// title/label
		title
	];

	this.tools[toolName] = this.createPOVTool.apply( this, toolDefinition );
	sp.ui.ext.ooui.toolFactory.register( this.tools[toolName] );*/
	return true;
};

/**
 * Propogate the event from the toolbar to the module.
 * We want the system to listen to the module and not specific
 * elements in it.
 * @param {string} ev Type of event to emit
 * @param {Object} [params] Parameters to attach to the event
 */
sp.ui.ext.ooui.Mod.Play.prototype.onToolbarEvent = function ( ev, params ) {
/*	this.emit( ev, params );*/
};

/**
 * Respond to zoom in button click
 * @fires zoom
 */
sp.ui.ext.ooui.Mod.Play.prototype.onZoomInButtonSelect = function () {
/*	this.setActive( false );
	this.toolbar.emit( 'zoom', 2000 );*/
};

/**
 * Respond to zoom in button click
 * @fires zoom
 */
sp.ui.ext.ooui.Mod.Play.prototype.onZoomOutButtonSelect = function () {
/*	this.setActive( false );
	this.toolbar.emit( 'zoom', -2000 );*/
};

/**
 * Respond to play button click
 * @fires play
 */
sp.ui.ext.ooui.Mod.Play.prototype.onPlayButtonSelect = function () {
/*	if ( this.toggled !== this.toolbar.getContainer().isPaused() ) {
		this.toggled = !this.toggled;
		this.setActive( this.toggled );

		this.toolbar.emit( 'play', this.toggled );
	}*/
};

/**
 * Get the Gui toolbar
 * @returns {OO.ui.Toolbar} The toolbar connected to the gui
 */
sp.ui.ext.ooui.Mod.Play.prototype.getToolbar = function () {
	return this.toolbar;
};

/**
 * Create a toolbar tool.
 * NOTE: Taken from the OOUI tools demo. This method should be adjusted
 * to better suit this projects' needs, it is only used as-is at
 * the moment for basic testing.
 *
 * @param {string} name Tool name
 * @param {string} group Tool group
 * @param {string} icon Tool icon
 * @param {string} title Title or alternate text
 * @param {Function} init Initialization function
 * @param {Function} onSelect Activation function
 * @param {Function} updateFunc Function on update state
 * @param {string} eventName Name of event to connect to in scenario object
 * @returns {OO.ui.Tool} Tool
 */
sp.ui.ext.ooui.Mod.Play.prototype.createTool = function ( name, group, icon, title, init, onSelect, updateFunc, eventName ) {
	// TODO: The entire createTool method should be rewritten to
	// better suit the needs of this particular toolbar
	var Tool = function SpGuiTool() {
		var eventDef = {}, scenario;
		Tool.super.apply( this, arguments );
		this.toggled = false;
		scenario = scenario = this.toolbar.getContainer().getScenario();
		if ( init ) {
			init.call( this );
		}
		if ( eventName ) {
			eventDef[eventName] = 'onToolbarUpdate';
			this.toolbar.getContainer().connect( this, eventDef );
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
	Tool.prototype.onToolbarUpdate = function ( params ) {
		if ( updateFunc ) {
			updateFunc.call( this, params );
		}
	};

	Tool.static.name = name;
	Tool.static.group = group;
	Tool.static.icon = icon;
	Tool.static.title = title;
	return Tool;
};

/**
 * Create a POV tool
 * @param {string} name Tool name
 * @param {string} icon Tool icon
 * @param {string} title Title or alternate text
 * @returns {OO.ui.Tool} Tool
 */
sp.ui.ext.ooui.Mod.Play.prototype.createPOVTool = function ( name, icon, title ) {
	// TODO: The entire createTool method should be rewritten to
	// better suit the needs of this particular toolbar
	var Tool = function SpGuiPOVTool() {
		Tool.super.apply( this, arguments );
		this.toggled = this.toolbar.getContainer().getScenario().getPOV() === name;
		this.setActive( this.toggled );
		this.objectName = name;
		this.toolbar.getContainer().getScenario().connect( this, { 'povChange': 'onUpdateState' } );
	};

	OO.inheritClass( Tool, OO.ui.Tool );

	Tool.prototype.onSelect = function () {
		if ( this.toolbar.getContainer().getScenario().getPOV() !== this.getObjectName() ) {
			this.toolbar.emit( 'pov', this.getObjectName() );
		}
	};
	Tool.prototype.getObjectName = function () {
		return this.objectName;
	}
	Tool.prototype.onUpdateState = function ( pov ) {
		if ( pov ) {
			this.setActive( pov === this.getObjectName() );
		}
	};

	Tool.static.name = name;
	Tool.static.group = 'povTools';
	Tool.static.icon = icon;
	Tool.static.title = title;
	return Tool;
};
