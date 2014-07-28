/**
 * General Gui module
 *
 * @class sp.ui.ext.Play
 * @abstract
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
 * @abstract
 * @throws {Error} If the method is not implemented in the child class
 * @returns {sp.ui.ext.Play}
 */
sp.ui.ext.Play.prototype.initialize = function () {
	throw new Error( 'sp.Gui.Module.Initialize must be implemented in child class.' );
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
