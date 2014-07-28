/**
 * jQueryUI click tool.
 *
 * @class
 * @constructor
 * @param {Object} [config] Configuration options
 */
sp.ui.ext.jqueryui.ClickButtonTool = function SpUiExtJqueryUiClickButtonTool( config ) {
	config = config || {};

	// Mixin constructors
	OO.EventEmitter.call( this );

	this.name = config.name || 'general';
	this.action = config.action;

	this.$element = $( '<button>' )
		.prop( 'id', 'sp-ui-jqueryui-tool-' + this.name )
		.addClass( 'sp-ui-jqueryui-clickButtonTool' );

	if ( config.icon ) {
		this.$element.addClass( 'sp-ui-jqueryui-tool-icon sp-ui-jqueryui-icon-' + config.icon );
	}

	if ( config.label ) {
		this.$element.text( config.label );
	}

	// Events
	this.$element.on( 'click', $.proxy( this.onClick , this ) );

	this.$element.button();
};

/* Inheritance */

OO.inheritClass( sp.ui.ext.jqueryui.ClickButtonTool, OO.EventEmitter );

/* Events */

/**
 * Button click
 * @event click
 */

/* Methods */

/**
 * Respond to a click event
 * @param {jQuery.event} event Click event
 * @fires click
 */
sp.ui.ext.jqueryui.ClickButtonTool.prototype.onClick = function ( event ) {
	this.emit( 'click', this.action );
	event.preventDefault();
};
