/**
 * Solar Playground container
 *
 * @class sp.Container
 * @mixins OO.EventEmitter
 *
 * @param {Object} [config] Configuration object
 */
sp.Container = function SpContainer( config ) {
	// Mixin constructors
	OO.EventEmitter.call( this );

	this.config = config || {};
	this.scenario = null;

	// Initialize
	this.$container = $( config.container )
		.addClass( 'sp-container' )

	this.$canvas = $( '<canvas>' )
		.addClass( 'sp-container-canvas' )
		.attr( 'width', config.width )
		.attr( 'height', config.height )
		.appendTo( this.$container );

	// Gui
	guiLoader = new sp.Gui.Loader( {
		'module': 'ooui',
		'container': this
	} );
	this.gui = guiLoader.initialize();

	this.canvasMouseMoving = false;
	this.canvasMouseStartPosition = {};

	// Events
	this.gui.connect( this, { 'play': 'onGuiPlay' } );
	this.gui.connect( this, { 'zoom': 'onGuiZoom' } );
	this.gui.connect( this, { 'pov': 'onGuiPOV' } );

	this.$canvas.on( 'mousedown', $.proxy( this.onCanvasMouseDown, this ) );
	this.$canvas.on( 'mousemove', $.proxy( this.onCanvasMouseMove, this ) );
	this.$canvas.on( 'mouseup', $.proxy( this.onCanvasMouseUp, this ) );
	this.$canvas.on( 'mouseout', $.proxy( this.onCanvasMouseUp, this ) );
};

/* Inheritance */
OO.mixinClass( sp.Container, OO.EventEmitter );

/**
 * @event scenarioLoaded
 * @param {sp.Scenario} scenario Reference to the loaded scenario
 * Scenario fully loaded and ready to be run.
 */

/* Methods */

/**
 * Load a scenario
 * @param {String} scenarioName Scenario name. The system will search for
 *  an ajax response from source 'scenario.[name].json' in the scenario
 *  directory.
 * @chainable
 */
sp.Container.prototype.loadFromFile = function ( scenarioName ) {
	var targetName,
		targetDir = this.config.scenario_dir + this.config.directory_sep;

	scenarioName = scenarioName || 'example';
	targetName = 'scenario.' + scenarioName + '.json';

	$.getJSON( targetDir + targetName )
		.done( $.proxy( function ( response ) {
			// Load the scenario
			this.loadFromObject( response );
		}, this ) )
		.fail( function () {
			sp.log( 'Error', 'Scenario ' + targetName + ' not found in directory "' + targetDir + '"' );
		} );
};

/**
 * Load and run a scenario
 * @param {Object} scenarioObject Scenario configuration object
 * @chainable
 * @fires scenarioLoaded
 */
sp.Container.prototype.loadFromObject = function ( scenarioObject ) {
	var objList;

	scenarioObject = scenarioObject || {};

	scenario = new sp.Scenario( this, scenarioObject );
	this.setScenario( scenario );

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

	this.emit( 'scenarioLoaded', this.scenario );

	return this;
};

/**
 * Propogate scenario event
 * @param {Boolean} isPaused Scenario paused
 * @fires pause
 */
sp.Container.prototype.onScenarioPause = function ( isPaused ) {
	this.emit( 'pause', isPaused );
};

/**
 * Respond to play button press
 * @param {Boolean} isPlay Play or pause
 */
sp.Container.prototype.onGuiPlay = function ( isPlay ) {
	this.scenario.togglePaused( !isPlay );
};

/**
 * Respond to zoom button press
 * @param {Boolean} zoom Zoom level
 */
sp.Container.prototype.onGuiZoom = function ( zoom ) {
	this.scenario.setZoom( zoom );
};

/**
 * Respond to pov button press
 * @param {Boolean} newPov New POV object key
 */
sp.Container.prototype.onGuiPOV = function ( newPov ) {
	this.scenario.setPOV( newPov );
};

/**
 * Propogate canvas mousedown event
 * @param {Event} e Event
 * @fires canvasMouseDown
 */
sp.Container.prototype.onCanvasMouseDown = function ( e ) {
	this.canvasMouseMoving = true;
	this.mouseStartingPoint = {
		'x': e.pageX,
		'y': e.pageY
	};
	if ( this.scenario ) {
		this.scenarioCenterPoint = this.scenario.getCenterPoint();
	}
	this.emit( 'canvasMouseDown' );
};

/**
 * Respond to canvas mouse move
 * @param {Event} e Event
 * @fires canvasdrag
 */
sp.Container.prototype.onCanvasMouseMove = function ( e ) {
	if ( this.canvasMouseMoving && !$.isEmptyObject( this.mouseStartingPoint ) ) {
		dx = e.pageX - this.mouseStartingPoint.x;
		dy = e.pageY - this.mouseStartingPoint.y;

		this.scenario.setCenterPoint(
			dx + this.scenarioCenterPoint.x,
			dy + this.scenarioCenterPoint.y
		);

		this.scenario.flushAllTrails();
		this.scenario.clearCanvas();
		this.scenario.draw();
	}
};

/**
 * Propogate canvas mouseup event
 * @param {Event} e Event
 * @fires canvasMouseUp
 */
sp.Container.prototype.onCanvasMouseUp = function ( e ) {
	this.canvasMouseMoving = false;
	this.mouseStartingPoint = {};
	this.scenarioCenterPoint = {};
	this.emit( 'canvasMouseUp' );
};

/**
 * Add a toolbar to the container
 * @param {jQuery} $toolbar jQuery toolbar element
 * @param {string} [position] Position in the container; 'top' or 'bottom'
 */
sp.Container.prototype.addToolbar = function ( $toolbar, position ) {
	position = position || 'top';

	if ( position === 'top' ) {
		this.$container.prepend( $toolbar );
	} else {
		this.$container.append( $toolbar );
	}
};

/**
 * Get the canvas context
 * @returns {Object} Canvas context
 */
sp.Container.prototype.getContext = function () {
	return this.$canvas[0].getContext( '2d' );
};

/**
 * Get the canvas dimensions
 * @returns {Object} Width and height of the canvas
 */
sp.Container.prototype.getCanvasDimensions = function () {
	return {
		'width': this.$canvas.width(),
		'height': this.$canvas.height()
	}
};

/**
 * Attach scenario object to this container
 * @param {sp.Scenario} s Scenario object
 */
sp.Container.prototype.setScenario = function ( s ) {
	this.scenario = s;

	// Propogate scenario events
	this.scenario.connect( this, { 'pause': 'onScenarioPause' } );
};

/**
 * Retrieve the scenario attached to this container
 * @returns {sp.Scenario} s Scenario object
 */
sp.Container.prototype.getScenario = function () {
	return this.scenario;
};
/**
 * Toggle between pause and resume the scenario
 * @param {boolean} [isPaused] Optional. If supplied, pauses or resumes the scenario
 * @fires pause
 */
sp.Container.prototype.togglePaused = function ( isPaused ) {
	if ( this.isPaused() !== isPaused ) {
		this.scenario.togglePaused( isPaused );
		this.emit( 'pause', isPaused );
	}
};

/**
 * Set scenario zoom
 * @param {number} zoom Zoom factor
 * @fires zoom
 */
sp.Container.prototype.setZoom = function ( zoom ) {
	if ( this.scenario.getZoom() !== zoom ) {
		this.scenario.setZoom( zoom );
		this.emit( 'zoom', zoom );
	}
};

/**
 * Check whether the scenario is paused
 */
sp.Container.prototype.isPaused = function () {
	return this.scenario.isPaused();
};
