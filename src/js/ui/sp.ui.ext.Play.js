/**
 * General Gui module. All 'Play' GUI modules should extend this.
 *
 * @class sp.ui.ext.Play
 *
 * @param {sp.Container} container The container to attach the GUI to
 * @param {Object} [config] Gui module definition
 */
sp.ui.ext.Play = function SpUiExtPlay ( container, config ) {
	config = config || {};

	// Mixin constructors
	OO.EventEmitter.call( this );

	this.container = container;
};

/* Inheritance */
OO.mixinClass( sp.ui.ext.Play, OO.EventEmitter );

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
 * @returns {sp.ui.ext.Play}
 */
sp.ui.ext.Play.prototype.initialize = function () {
	var container,
		containerID = this.container.getID();

	// Preserve the original canvas dimensions
	this.originalDimensions = this.container.getScreen().getDimensions();

	if ( containerID ) {
		// Only attach a full screen button if the browser supports it
		container = document.getElementById( containerID );
		if (
			container &&
			(
				container.requestFullscreen ||
				container.msRequestFullscreen ||
				container.mozRequestFullScreen ||
				container.webkitRequestFullscreen
			)
		) {
			// Full screen button
			this.$fullscreen = $( '<div>' )
				.addClass( 'sp-ui-fullscreen-button' )
				.append(
					$( '<span>' )
						.text( 'Fullscreen' )
				);

			this.$fullscreen.on( 'click', $.proxy( this.onFullScreenClick, this ) );
			this.container.$container.on( 'webkitfullscreenchange mozfullscreenchange fullscreenchange', $.proxy( this.onContainerFullscreen, this ) );

			this.container.$container.append( this.$fullscreen );
		}
	}
	return this;
};

/**
 * Add a tool to the POV list
 * @abstract
 * @param {string} name Tool name
 * @param {string} title Title or alternate text
 * @param {string} [icon] Tool icon
 * @throws {Error} If the method is not implemented in the child class
 */
sp.ui.ext.Play.prototype.addToPOVList = function ( name, title, icon ) {
	throw new Error( 'sp.Gui.Module.addToPOVList must be implemented in child class.' );
};

/**
 * Request having the container in full screen
 */
sp.ui.ext.Play.prototype.onFullScreenClick = function () {
	var container,
		containerID = this.container.getID();

	if ( containerID ) {
		container = document.getElementById( containerID );
		if ( container.requestFullscreen ) {
			container.requestFullscreen();
		} else if ( container.msRequestFullscreen ) {
			container.msRequestFullscreen();
		} else if ( container.mozRequestFullScreen ) {
			container.mozRequestFullScreen();
		} else if ( container.webkitRequestFullscreen ) {
			container.webkitRequestFullscreen();
		} else {
			sp.log( 'notice', 'Browser does not support full screen.' );
		}
	}
};

/**
 * Respond to container being in full screen mode
 * @return {[type]} [description]
 */
sp.ui.ext.Play.prototype.onContainerFullscreen = function () {
	var dimensions,
		isInFullScreen = document.fullscreen || document.mozFullScreen || document.webkitIsFullScreen,
		$canvas = this.container.getCanvas();
	if ( isInFullScreen && $canvas ) {
		// Going into fullscreen
		this.$fullscreen.hide();
		dimensions = {
			'container': {
				'width': window.outerWidth,
				'height': window.outerHeight
			},
			'canvas': {
				'width': window.outerWidth,
				'height': window.outerHeight - 40
			}
		};
	} else {
		// Out of full screen
		this.$fullscreen.show();
		dimensions = {
			'container': {
				'width': this.originalDimensions.width,
				'height': this.originalDimensions.height + 40
			},
			'canvas': {
				'width': this.originalDimensions.width,
				'height': this.originalDimensions.height
			}
		};
	}

	// Resize the container and canvas elements
	if ( this.container.getScenario() ) {
		this.container.$container.attr( dimensions.container );
		$canvas.attr( dimensions.canvas );
		this.container.getScenario().getViewConverter().setCanvasDimensions(
			dimensions.canvas
		);
		this.container.redrawScenario();
	}
};
