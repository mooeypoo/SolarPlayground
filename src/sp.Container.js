/**
 * Solar Playground container
 *
 * @class sp.Container
 * @mixins OO.EventEmitter
 *
 * @param {Object} [config] Configuration object
 */
sp.Container = function SpContainer( config ) {
	config = config || {};

	// Mixin constructors
	OO.EventEmitter.call( this );

	this.scenario = null;

	// Initialize
	this.$container = $( config.container )
		.addClass( 'sp-container' )

	this.$canvas = $( '<canvas>' )
		.addClass( 'sp-container-canvas' )
		.attr( 'width', config.width )
		.attr( 'height', config.height )
		.appendTo( this.$container );

	this.canvasMouseMoving = false;
	this.canvasMouseStartPosition = {};
	// Events
	this.$canvas.on( 'mousedown', $.proxy( this.onCanvasMouseDown, this ) );
	this.$canvas.on( 'mousemove', $.proxy( this.onCanvasMouseMove, this ) );
	this.$canvas.on( 'mouseup', $.proxy( this.onCanvasMouseUp, this ) );
	this.$canvas.on( 'mouseout', $.proxy( this.onCanvasMouseUp, this ) );
};

/* Inheritance */
OO.mixinClass( sp.Container, OO.EventEmitter );

/**
 * Propogate canvas mousedown event
 * @param {Event} e Event
 * @fires mousedown
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
};

/**
 * Propogate canvas mousemove event
 * @param {Event} e Event
 * @fires canvasdrag
 */
sp.Container.prototype.onCanvasMouseMove = function ( e ) {
	if ( this.canvasMouseMoving && !$.isEmptyObject( this.mouseStartingPoint ) ) {
		this.emit(
			'canvasdrag',
			e.pageX,
			e.pageY,
			this.mouseStartingPoint,
			this.scenarioCenterPoint
		);
	}
};

/**
 * Propogate canvas mouseup event
 * @param {Event} e Event
 */
sp.Container.prototype.onCanvasMouseUp = function ( e ) {
	this.canvasMouseMoving = false;
	this.mouseStartingPoint = {};
	this.scenarioCenterPoint = {};
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
sp.Container.prototype.attachScenario = function ( s ) {
	this.scenario = s;
};
