/**
 * jQueryUI check tool.
 *
 * @class
 * @constructor
 * @param {Object} [config] Configuration options
 */
sp.ui.ext.jqueryui.CheckButtonTool = function SpUiExtJqueryUiCheckButtonTool( config ) {
	config = config || {};
	// Mixin constructors
	OO.EventEmitter.call( this );

	this.value = false;
	this.name = config.name || 'general';

	this.$checkbox = $( '<input>' )
		.prop( 'type', 'checkbox' )
		.prop( 'id', 'sp-ui-jqueryui-tool-' + this.name )
		.prop( 'checked', false );
	this.$label = $( '<label>' )
		.attr( 'for', 'sp-ui-jqueryui-tool-' + this.name );

	if ( config.icon ) {
		this.$label
			.addClass( 'sp-ui-jqueryui-tool-icon sp-ui-jqueryui-icon-' + config.icon );
	}
	if ( config.label ) {
		this.$label.text( config.label );
	}

	this.$element = $( '<div>' )
		.addClass( 'sp-ui-jqueryui-tool sp-ui-jqueryui-tool-checkButtonTool' )
		.append( [ this.$checkbox, this.$label ] );

	// Events
	this.$checkbox.on( 'change', $.proxy( this.onChange , this ) );

	this.$checkbox.button();
};

/* Inheritance */

OO.inheritClass( sp.ui.ext.jqueryui.CheckButtonTool, OO.EventEmitter );

/* Events */

/**
 * State change from selected to released
 * @event change
 */

/* Methods */

/**
 * Respond to a change event
 * @param {jQuery.event} event Click event
 * @fires change
 */
sp.ui.ext.jqueryui.CheckButtonTool.prototype.onChange = function ( event ) {
	var oldValue = this.value;

	this.value = this.$checkbox.prop( 'checked' );
	if ( this.value !== oldValue ) {
		this.emit( 'change', this.value );
	}
	event.preventDefault();
};

/**
 * Return the current value of the button
 * @return {boolean} Checked or unchecked
 */
sp.ui.ext.jqueryui.CheckButtonTool.prototype.getValue = function () {
	return this.value;
};

/**
 * Set the value of the button
 * @param {[type]} checked [description]
 */
sp.ui.ext.jqueryui.CheckButtonTool.prototype.setValue = function ( checked ) {
	this.value = !!checked;
	this.$checkbox.prop( 'checked', this.value );
	this.$checkbox.button( 'refresh' );
};
