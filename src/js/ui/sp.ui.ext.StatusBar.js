/**
 * Status bar module
 *
 * @class sp.ui.ext.Play
 * @abstract
 *
 * @param {sp.Container} container The container to attach the GUI to
 * @param {Object} [config] Gui module definition
 */
sp.ui.ext.StatusBar = function SpUiExtStatusBar ( container, config ) {
	config = config || {};

	// Mixin constructors
	OO.EventEmitter.call( this );

	this.container = container;
};

/* Inheritance */
OO.mixinClass( sp.ui.ext.StatusBar, OO.EventEmitter );

/**
 * Initialize the Gui
 * @abstract
 * @throws {Error} If the method is not implemented in the child class
 * @returns {sp.ui.ext.Play}
 */
sp.ui.ext.StatusBar.prototype.initialize = function () {
	throw new Error( 'sp.Gui.Module.Initialize must be implemented in child class.' );
};
