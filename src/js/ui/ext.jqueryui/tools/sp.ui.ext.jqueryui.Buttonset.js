/**
 * jQueryUI toolset.
 *
 * @class
 * @constructor
 * @param {Object} [config] Configuration options
 */
sp.ui.ext.jqueryui.Buttonset = function SpUiExtJqueryUiButtonset( config ) {
	var tool;

	config = config || {};

	this.$element = $( '<div>' )
		.addClass( 'sp-ui-jqueryui-toolset' );

	if ( config.name ) {
		this.$element.addClass( 'sp-ui-jqueryui-toolset-' + config.name );
	}

	this.tools = config.tools || [];

	this.$element.buttonset();
};

/**
 * Add tool to toolset
 * @param {[type]} tool [description]
 */
sp.ui.ext.jqueryui.Buttonset.prototype.addButton = function ( tool ) {
	this.tools.push( tool );
	this.$element.append( tool.$element );
};
