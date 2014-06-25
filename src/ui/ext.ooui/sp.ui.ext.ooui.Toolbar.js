/* Toolbar */
sp.ui.ext.ooui.Toolbar = function ( container, toolFactory, toolGroupFactory ) {
	// Parent constructor
	sp.ui.ext.ooui.Toolbar.super.call( this, toolFactory, toolGroupFactory );

	this.container = container;
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
