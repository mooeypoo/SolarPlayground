/**
 * Solar Playground system
 *
 * @class sp.System
 * @mixins OO.EventEmitter
 *
 * @param {Object} [config] Configuration object
 */
sp.System = function SpSystemInitialize( config ) {
	var defaultConfig, guiLoader;

	// Mixin constructors
	OO.EventEmitter.call( this );

	// Scenario holder
	// TODO: Allow for multiple scenarios
	this.scenario = null;

	config = config || {};

	defaultConfig = {
		container: '#solarSystem',
		scenario_dir: 'scenarios', // Default directory unless otherwise specified
		directory_sep: '/',
		width: $( window ).width() - 100,
		height: $( window ).height() - 100
	};

	// Extend default global options
	this.config = $.extend( true, defaultConfig, config );

	// Initialize
	this.$container = $( this.config.container )
		.addClass( 'sp-system-container' )

	this.$canvas = $( '<canvas>' )
		.addClass( 'sp-system-canvas' )
		.attr( 'width', this.config.width )
		.attr( 'height', this.config.height )
		.appendTo( this.$container );

	// Gui
	guiLoader = new sp.Gui.Loader( {
		'module': 'ooui',
		'$container': this.$container
	} );
	this.gui = guiLoader.initialize();

	this.canvasMoving = false;

	// Events
	this.$canvas.on( 'mousedown', $.proxy( this.onCanvasMouseDown, this ) );
	this.$canvas.on( 'mousemove', $.proxy( this.onCanvasMouseMove, this ) );
	this.$canvas.on( 'mouseup', $.proxy( this.onCanvasMouseUp, this ) );
	this.$canvas.on( 'mouseout', $.proxy( this.onCanvasMouseUp, this ) );

	this.gui.connect( this, { 'play': 'onGuiPlay' } );
	this.gui.connect( this, { 'zoom': 'onGuiZoom' } );
};

/* Inheritance */
OO.mixinClass( sp.System, OO.EventEmitter );

/* Events */

/**
 * @event scenarioLoaded
 * @param {sp.Scenario} scenario Reference to the loaded scenario
 * Scenario fully loaded and ready to be run.
 */

/* Methods */

/**
 * Respond to play button press
 * @param {Boolean} isPlay Play or pause
 */
sp.System.prototype.onGuiPlay = function ( isPlay ) {
	this.scenario.togglePaused( !isPlay );
};

/**
 * Respond to zoom button press
 * @param {Boolean} zoom Zoom level
 */
sp.System.prototype.onGuiZoom = function ( zoom ) {
	this.scenario.zoom( zoom );
	if ( this.isPaused() ) {
		this.scenario.clearCanvas()
		this.scenario.draw();
	}
};

/**
 * Respond to mouse down event
 * @param {Event} e Event
 * @return {boolean} False
 */
sp.System.prototype.onCanvasMouseDown = function ( e ) {
	this.canvasMoving = true;
	this.canvasCenter = this.scenario.getCenterPoint();
	this.mouseStartingPoint = {
		'x': e.pageX,
		'y': e.pageY
	};
	return false;
};

/**
 * Respond to mouse move event
 * @param {Event} e Event
 * @return {boolean} False
 */
sp.System.prototype.onCanvasMouseMove = function ( e ) {
	var dx, dy;
	if ( this.canvasMoving ) {
		dx = e.pageX - this.mouseStartingPoint.x;
		dy = e.pageY - this.mouseStartingPoint.y;
		this.scenario.setCenterPoint(
			this.canvasCenter.x + dx,
			this.canvasCenter.y + dy
		);
	}
	return false;
};

/**
 * Respond to mouse up event
 * @param {Event} e Event
 * @return {boolean} False
 */
sp.System.prototype.onCanvasMouseUp = function ( e ) {
	this.canvasMoving = false;
	this.canvasCenter = {};
	this.mouseStartingPoint = {};
	return false;
};

/**
 * Load a scenario
 * @param {String} scenarioName Scenario name. The system will search for
 *  an ajax response from source 'scenario.[name].json' in the scenario
 *  directory.
 */
sp.System.prototype.load = function ( scenarioName ) {
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
			sp.log( 'Error', 'Scenario ' + targetName + ' not found in directory "' + targetDir + '"' );
		} );
};

/**
 * Load and run a scenario
 * @param {Object} scenarioObject Scenario configuration object
 * @fires scenarioLoaded
 */
sp.System.prototype.loadScenario = function ( scenarioObject ) {
	var objList;

	scenarioObject = scenarioObject || {};

	this.scenario = new sp.Scenario( this.$canvas, scenarioObject );
	// Link scenario to GUI
	this.gui.setScenario( this.scenario );

	// Draw initial frame
	this.scenario.draw( 0 );

	// Add pov objects to gui
	objList = this.scenario.getAllObjects();
	for ( o in objList ) {
		this.gui.addToPOVList(
			o,
			objList[o].getName()
		);
	}
/*	this.gui.addToToolbar(
		'pov',
		'earth',
		'povTools',
		'play',
		'Earth'
	);*/

	this.emit( 'scenarioLoaded', this.scenario );
};

/**
 * Toggle between pause and resume the scenario
 * @param {boolean} [isPause] Optional. If supplied, pauses or resumes the scenario
 */
sp.System.prototype.togglePaused = function ( isPause ) {
	this.scenario.togglePaused( isPause );
};

/**
 * Check whether the scenario is paused
 */
sp.System.prototype.isPaused = function () {
	return this.scenario.isPaused();
};

/**
 * Get configuration option or full configuration object.
 * @param {string} [option] Configuration key
 * @returns {string|Object} Configuration object
 */
sp.System.prototype.getConfig = function ( option ) {
	if ( this.config[option] ) {
		return this.config[option];
	}
	return this.config;
};
