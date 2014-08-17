/**
 * UI jQueryUI Module namespace
 * @property {Object}
 */
sp.ui.ext.jqueryui = {
	'Mod': {}
};

/**
 * jQueryUI Gui module
 *
 * @class sp.ui.ext.jqueryui.Mod.Play
 *
 * @param {sp.Container} container The container to attach the GUI to
 * @param {Object} [config] Gui module definition
 */
sp.ui.ext.jqueryui.Mod.Play = function SpUiExtJqueryUiModPlay( container, config ) {
	config = config || {};

	// Parent constructor
	sp.ui.ext.jqueryui.Mod.Play.super.call( this, container, config );

	this.buttonSets = {};
	this.buttons = {};

	this.statusBar = new sp.ui.ext.jqueryui.Mod.StatusBar( container, config );

	// Events
	this.container.connect( this, { 'scenarioLoaded': 'onScenarioLoaded' } );
};

/* Inheritance */
OO.inheritClass( sp.ui.ext.jqueryui.Mod.Play, sp.ui.ext.Play );

/* Static */

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
 * @returns {sp.ui.ext.jqueryui.Mod.Play}
 */
sp.ui.ext.jqueryui.Mod.Play.prototype.initialize = function () {
	var tool,
		$separator = $( '<div>' )
			.addClass( 'sp-ui-jqueryui-sep' );

	// Call parent
	sp.ui.ext.Play.prototype.initialize.call( this );

	this.$toolbar = $( '<div>' )
		.addClass( 'sp-ui-jqueryui-toolbar' );

	this.buttonSets = {};
	this.buttons = {};
	this.labels = {};

	// Add buttons
	this.buttons.play = new sp.ui.ext.jqueryui.CheckButtonTool( {
		'name': 'play',
		'icon': 'play'
	} );

	this.buttons.povList = new sp.ui.ext.jqueryui.SelectTool( {
		'name': 'pov'
	} );

	this.buttons.zoomin = new sp.ui.ext.jqueryui.ClickButtonTool( {
		'name': 'zoomin',
		'icon': 'zoomin',
		'action': 1000
	} );

	this.buttons.zoomout = new sp.ui.ext.jqueryui.ClickButtonTool( {
		'name': 'zoomout',
		'icon': 'zoomout',
		'action': -1000
	} );

	this.buttons.grid = new sp.ui.ext.jqueryui.CheckButtonTool( {
		'name': 'grid',
		'icon': 'grid'
	} );

	this.$toolbar.append( [
		this.buttons.play.$element,
		$separator.clone(),
		this.buttons.povList.$element,
		$separator.clone(),
		this.buttons.zoomin.$element,
		this.buttons.zoomout.$element,
		$separator.clone(),
		this.buttons.grid.$element
	] );

	this.container.addToolbar( this.$toolbar );

	// Status bar
	this.labels.zoom = new sp.ui.ext.jqueryui.LabelTool( {
		'label': 'Zoom level'
	} );
	this.statusBar.$element.append( [
		this.labels.zoom.$element
	] );

	this.container.addToolbar( this.statusBar.$element, 'bottom' );

	this.buttons.play.connect( this, { 'change': 'onPlayChange' } );
	this.buttons.povList.connect( this, { 'change': 'onPovChange' } );
	this.buttons.zoomin.connect( this, { 'click': 'onZoomClick' } );
	this.buttons.zoomout.connect( this, { 'click': 'onZoomClick' } );
	this.buttons.grid.connect( this, { 'change': 'onGridChange' } );

	return this;
};

/**
 * Respond to new scenario loaded
 * @fires updateState
 */
sp.ui.ext.jqueryui.Mod.Play.prototype.onScenarioLoaded = function () {
	if ( this.container.getScenario() ) {
		this.container.getScenario().disconnect( this );
	}
	// Events
	this.container.getScenario().connect( this, { 'pause': [ 'onScenarioChanged', 'pause' ] } );
	this.container.getScenario().connect( this, { 'pov': [ 'onScenarioChanged', 'pov' ] } );
	this.container.getScenario().connect( this, { 'grid': [ 'onScenarioChanged', 'grid' ] } );
	this.container.getScenario().connect( this, { 'zoom': [ 'onScenarioChanged', 'zoom' ] } );

	// Update POV
	this.buttons.play.setValue( !this.container.getScenario().isPaused() );
	this.buttons.povList.setValue( this.container.getScenario().getPOV() );
	this.buttons.grid.setValue( this.container.getScenario().isShowGrid() );
	this.labels.zoom.setValue( this.container.getScenario().getZoom() );
};

/**
 * Respond to change in scenario state
 * @fires updateState
 */
sp.ui.ext.jqueryui.Mod.Play.prototype.onScenarioChanged = function ( action, status ) {
	switch ( action ) {
		case 'pause':
			this.buttons.play.setValue( !status );
			break;
		case 'pov':
			this.buttons.povList.setValue( status );
			break;
		case 'grid':
			this.buttons.grid.setValue( status );
			break;
		case 'zoom':
			this.labels.zoom.setValue( this.container.getScenario().getZoom() );
			break;
	}
};

/**
 * Respond to play button change
 * @param {Boolean} isPlay Play scenario
 */
sp.ui.ext.jqueryui.Mod.Play.prototype.onPlayChange = function ( isPlay ) {
	this.container.getScenario().togglePaused( !isPlay );
};

/**
 * Respond to zoom buttons change
 * @param {number} zoomFactor Zoom factor
 */
sp.ui.ext.jqueryui.Mod.Play.prototype.onZoomClick = function ( zoomFactor ) {
	this.container.getScenario().setZoom( zoomFactor );
};

/**
 * Respond to pov change
 * @param {string} pov New POV item
 */
sp.ui.ext.jqueryui.Mod.Play.prototype.onPovChange = function ( pov ) {
	this.container.getScenario().setPOV( pov );
};

/**
 * Respond to grid button change
 * @param {Boolean} isGrid Show grid
 */
sp.ui.ext.jqueryui.Mod.Play.prototype.onGridChange = function ( isGrid ) {
	this.container.getScenario().toggleGrid( isGrid );
};
/**
 * Add a tool to the POV list
 * @param {string} name Tool name
 * @param {string} title Title or alternate text
 * @param {string} [icon] Tool icon
 */
sp.ui.ext.jqueryui.Mod.Play.prototype.addToPOVList = function ( name, title, icon ) {
	this.buttons.povList.addOption( name, title );
};
