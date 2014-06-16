/**
 * General Gui module
 *
 * @class sp.Gui.Module.Base
 * @abstract
 *
 * @param {sp.Container} container The container to attach the GUI to
 * @param {Object} [config] Gui module definition
 */
sp.Gui.Module.Base = function SpGuiModuleOoui ( container, config ) {
	config = config || {};

	// Mixin constructors
	OO.EventEmitter.call( this );

	this.container = container;

	this.scenario = null;
};

/* Inheritance */
OO.mixinClass( sp.Gui.Module.Base, OO.EventEmitter );

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
 * Connect the GUI to the scenario it controls
 * @param {sp.Scenario} scenario The scenario object this GUI controls
 * @fires scenarioUpdate
 */
sp.Gui.Module.Base.prototype.setScenario = function ( scenario ) {
	this.scenario = scenario;

	this.emit( 'scenarioUpdate', this.scenario );
};

/**
 * Initialize the Gui
 * @abstract
 * @returns {OO.ui.Toolbar}
 */
sp.Gui.Module.Base.prototype.initialize = function () {
	throw new Error( 'sp.Gui.Module.Initialize must be implemented in child class.' );
};

/**
 * Add a tool to the POV list
 * @abstract
 * @param {string} name Tool name
 * @param {string} title Title or alternate text
 * @param {string} [icon] Tool icon
 */
sp.Gui.Module.Base.prototype.addToPOVList = function ( name, title, icon ) {
	throw new Error( 'sp.Gui.Module.addToPOVList must be implemented in child class.' );
};
