/* Toolbar */
sp.ui.ext.ooui.Toolbar = function SpUiExtOouiToolbar( target, container, config ) {
	// Parent constructor
	OO.ui.Toolbar.call(
		this,
		sp.ui.ext.ooui.toolFactory,
		sp.ui.ext.ooui.toolGroupFactory,
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
 * @param {ve.ui.Command} command Command that's been registered
 * @param {ve.ui.Trigger} trigger Trigger to associate with command
 */
sp.ui.ext.ooui.Toolbar.prototype.onContainerAddCommand = function ( name ) {
	if ( this.tools[name] ) {
		this.tools[name].updateTitle();
	}
};
