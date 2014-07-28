/**
 * jQueryUI select tool.
 *
 * @class
 * @constructor
 * @param {Object} [config] Configuration options
 */
sp.ui.ext.jqueryui.SelectTool = function SpUiExtJqueryUiSelectTool( config ) {
	config = config || {};

	// Mixin constructors
	OO.EventEmitter.call( this );

	this.name = config.name || 'general';
	this.action = config.action;

	this.$element = $( '<select>' )
		.prop( 'id', 'sp-ui-jqueryui-tool-' + this.name )
		.addClass( 'sp-ui-jqueryui-selectTool' );

	this.options = {};
	this.value = '';

	// Events
	this.$element.on( 'change', $.proxy( this.onChange , this ) );
};

/* Inheritance */

OO.inheritClass( sp.ui.ext.jqueryui.SelectTool, OO.EventEmitter );

/**
 * Respond to change event
 * @param {jQuery.event} event Change event
 */
sp.ui.ext.jqueryui.SelectTool.prototype.onChange = function ( event, val ) {
	var oldValue = this.value;

	this.value = this.$element.val();
	if ( this.value !== oldValue ) {
		this.emit( 'change', this.value );
	}
};

/**
 * Select a specific value from the options
 * @param {string} value The value to select
 */
sp.ui.ext.jqueryui.SelectTool.prototype.setValue = function ( value ) {
	if ( this.value !== value ) {
		this.value = value;
		this.$element.val( value );
	}
};

/**
 * Add an option to the select list
 * @param {string} value The value of the new option
 * @param {string} label The label of the new option
 */
sp.ui.ext.jqueryui.SelectTool.prototype.addOption = function ( value, label ) {
	var option = $( '<option>' )
		.attr( 'value', value )
		.text( label );

	this.options[name] = value;
	this.$element.append( option );
};

/**
 * Remove an option from the select list
 * @param {string} value Value of the option to remove
 */
sp.ui.ext.jqueryui.SelectTool.prototype.removeOption = function ( value ) {
	if ( this.options[value] ) {
		delete this.options[value];
		this.$element.find( 'option[value=' + value + ']' ).remove();
	}
};

/**
 * Remove all options in the select list
 */
sp.ui.ext.jqueryui.SelectTool.prototype.empty = function () {
	this.$element.empty();
};
