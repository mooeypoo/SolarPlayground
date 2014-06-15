/**
 * OOUI Gui module
 *
 * @class sp.Gui.Module.ooui
 *
 * @param {sp.Container} container The container to attach the GUI to
 * @param {Object} [config] Gui module definition
 */
sp.Gui.Module.ooui = function SpGuiModuleOoui ( container, config ) {
	config = config || {};

	// Parent constructor
	sp.Gui.Module.ooui.super.call( this, container, config );

	this.tools = {};
};

/* Inheritance */
OO.inheritClass( sp.Gui.Module.ooui, sp.Gui.Module.Base );

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
sp.Gui.Module.ooui.prototype.initialize = function () {
	var i, tools, tname;

	this.toolFactory = new OO.ui.ToolFactory(),
	this.toolGroupFactory = new OO.ui.ToolGroupFactory();

	// Create toolbar
	this.toolbar = new OO.ui.Toolbar( this.toolFactory, this.toolGroupFactory );
	this.toolbar.setup( [
		{
			'type': 'bar',
			'include': [ { 'group': 'playTools' } ]
		},
		{
			'type': 'bar',
			'include': [ { 'group': 'viewTools' } ]
		},
		{
			'type': 'menu',
			'indicator': 'down',
			'label': 'POV',
			'icon': 'picture',
			'include': [ { 'group': 'povTools' } ]
		}
	] );
	this.toolbar.emit( 'updateState' );

	// Create buttons for the toolbar
	// TODO: Disable all buttons until the scenario is loaded
	tools = {
		// playTools
		'play': [ 'playTool', 'playTools', 'play', 'Play scenario', null, this.onPlayButtonSelect ],
		// viewTools
		'zoomin': [ 'zoominTool', 'viewTools', 'zoomin', 'Zoom in', null, this.onZoomInButtonSelect ],
		'zoomout': [ 'zoomoutTool', 'viewTools', 'zoomout', 'Zoom out', null, this.onZoomOutButtonSelect ]
	}

	this.tools = {};
	for ( tname in tools ) {
		this.tools[tname] = this.createTool.apply( this, tools[tname] );
		this.toolFactory.register( this.tools[tname] );
	}

	// Attach toolbar to container
	this.container.addToolbar( this.toolbar.$element );

	// Events
	this.toolbar.connect( this, { 'updateState': [ 'onToolbarEvent', 'updateToolbarState' ] } );
	this.toolbar.connect( this, { 'play': [ 'onToolbarEvent', 'play' ] } );
	this.toolbar.connect( this, { 'zoom': [ 'onToolbarEvent', 'zoom' ] } );
	this.toolbar.connect( this, { 'pov': [ 'onToolbarEvent', 'pov' ] } );

	return this;
};

/**
 * Add a tool to the POV list
 * @param {string} name Tool name
 * @param {string} title Title or alternate text
 * @param {string} [icon] Tool icon
 */
sp.Gui.Module.ooui.prototype.addToPOVList = function ( name, title, icon ) {
	var toolDefinition, onSelectFunc,
		eventObject = {},
		toolName = name + 'Tool';

	onSelectFunc = function () {
		this.toolbar.emit( 'pov',
			this.constructor.static.object_name,
			this.constructor.static.toolName
		);
	};

	eventObject[toolName] = [ 'onToolbarEvent', toolName ];

	toolDefinition = [
		// name
		toolName,
		// group
		'povTools',
		// icon
		icon,
		// title/label
		title,
		// init function
		null,
		// onSelect function
		onSelectFunc
	];

	this.tools[toolName] = this.createTool.apply( this, toolDefinition );
	this.tools[toolName].static.object_name = name;
	this.tools[toolName].static.tool_name = toolName;

	this.toolFactory.register( this.tools[toolName] );
	this.toolbar.connect( this, eventObject );
};

/**
 * Propogate the event from the toolbar to the module.
 * We want the system to listen to the module and not specific
 * elements in it.
 * @param {string} ev Type of event to emit
 * @param {Object} [params] Parameters to attach to the event
 */
sp.Gui.Module.ooui.prototype.onToolbarEvent = function ( ev, params ) {
	this.emit( ev, params );
};

/**
 * Respond to zoom in button click
 * @fires zoom
 */
sp.Gui.Module.ooui.prototype.onZoomInButtonSelect = function () {
	this.setActive( false );
	this.toolbar.emit( 'zoom', 1000 );
};

/**
 * Respond to zoom in button click
 * @fires zoom
 */
sp.Gui.Module.ooui.prototype.onZoomOutButtonSelect = function () {
	this.setActive( false );
	this.toolbar.emit( 'zoom', -1000 );
};

/**
 * Respond to play button click
 * @fires play
 */
sp.Gui.Module.ooui.prototype.onPlayButtonSelect = function () {
	// TODO: Activate the pause button and disable self
	this.toggled = !this.toggled;
	this.setActive( this.toggled );

	this.toolbar.emit( 'play', this.toggled );
};

/**
 * Get the Gui toolbar
 * @returns {OO.ui.Toolbar} The toolbar connected to the gui
 */
sp.Gui.Module.ooui.prototype.getToolbar = function () {
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
 * @returns {OO.ui.Tool} Tool
 */
sp.Gui.Module.ooui.prototype.createTool = function ( name, group, icon, title, init, onSelect ) {
	// TODO: The entire createTool method should be rewritten to
	// better suit the needs of this particular toolbar
	var Tool = function SpGuiTool() {
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
