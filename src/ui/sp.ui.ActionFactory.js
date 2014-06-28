/**
 * Action factory.
 *
 * @class
 * @extends OO.Factory
 * @constructor
 */
sp.ui.ActionFactory = function SpUiActionFactory() {
	// Parent constructor
	OO.Factory.call( this );
};

/* Inheritance */

OO.inheritClass( sp.ui.ActionFactory, OO.Factory );

/* Methods */

/**
 * Check if an action supports a method.
 *
 * @method
 * @param {string} action Name of action
 * @param {string} method Name of method
 * @returns {boolean} The action supports the method
 */
sp.ui.ActionFactory.prototype.doesActionSupportMethod = function ( action, method ) {
	if ( action in this.registry ) {
		return this.registry[action].static.methods.indexOf( method ) !== -1;
	}
	throw new Error( 'Unknown action: ' + action );
};

/* Initialization */

sp.ui.actionFactory = new sp.ui.ActionFactory();
