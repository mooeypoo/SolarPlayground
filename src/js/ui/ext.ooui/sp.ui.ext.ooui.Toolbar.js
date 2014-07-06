/**
 * OOUI Module Toolbar.
 *
 * @class
 * @constructor
 * @extends OO.ui.Toolbar
 *
 * @param {sp.ui.ext.Play} target The UI controller
 * @param {sp.Container} container The container this toolbar is attached to
 * @param {Object} [config] Optional configuration options.
 */
sp.ui.ext.ooui.Toolbar = function SpUiExtOouiToolbar( target, container, config ) {
	// Parent constructor
	OO.ui.Toolbar.call(
		this,
		sp.ui.toolFactory,
		sp.ui.toolGroupFactory,
		config
	);

	this.target = target;
	this.container = container;
	this.container.connect( this, { 'addCommand': 'onContainerAddCommand' } );
};

/* Inheritance */
OO.inheritClass( sp.ui.ext.ooui.Toolbar, OO.ui.Toolbar );

/**
 * Get the container attached to this toolbar
 * @returns {sp.Container} Container
 */
sp.ui.ext.ooui.Toolbar.prototype.getContainer = function () {
	return this.container;
};

/**
 * Handle command being added to surface.
 *
 * If a matching tool is present, it's label will be updated.
 *
 * @param {string} name Symbolic name of command and trigger
 */
sp.ui.ext.ooui.Toolbar.prototype.onContainerAddCommand = function ( name ) {
	if ( this.tools[name] ) {
		this.tools[name].updateTitle();
	}
};

sp.ui.ext.ooui.Toolbar.prototype.onMouseDown = function ( e ) {
};
