/**
 * jQueryUI label.
 *
 * @class
 * @constructor
 * @param {Object} [config] Configuration options
 */
sp.ui.ext.jqueryui.LabelTool = function SpUiExtJqueryUiLabelTool( config ) {
	config = config || {};

	this.$element = $( '<div>' )
		.addClass( 'sp-ui-jqueryui-labelTool' );

	this.value = config.value;

	this.$label = $( '<span>' )
		.addClass( 'sp-ui-jqueryui-labelTool-label' )
		.text( config.label + ':' )
		.appendTo( this.$element );
	this.$value = $( '<span>' )
		.addClass( 'sp-ui-jqueryui-labelTool-value' )
		.text( config.value )
		.appendTo( this.$element );
};

/**
 * Set value
 * @param {string} value New presented value
 */
sp.ui.ext.jqueryui.LabelTool.prototype.setValue = function ( value ) {
	this.value = value;
	this.$value.text( value );
};

/**
 * Get value
 */
sp.ui.ext.jqueryui.LabelTool.prototype.getValue = function () {
	return this.value;
};
