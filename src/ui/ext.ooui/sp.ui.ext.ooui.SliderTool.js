/**
 * A slider tool
 *
 * @class
 * @extends OO.ui.Tool
 *
 * @constructor
 * @param {OO.ui.Toolbar} toolbar
 * @param {Object} [config] Configuration options
 */
sp.ui.ext.ooui.SliderTool = function SpUiExtOouiSliderTool( toolbar, config ) {
	// Parent constructor
	sp.ui.ext.ooui.SliderTool.super.call( this, toolbar, config );

	// Initialization
	this.$slider = this.$( '<input>' )
		.addClass( 'sp-ui-ooui-sliderHandle' )
		.attr( 'type', 'range' )
		.attr( 'min', '1' )
		.attr( 'max', '10' );

	this.$element
		.addClass( 'sp-ui-ooui-sliderTool' )
		.prepend( this.$slider );
};

/* Setup */

OO.inheritClass( sp.ui.ext.ooui.SliderTool, OO.ui.Tool );

/* Static Properties */

sp.ui.ext.ooui.SliderTool.static.accelTooltips = true;
sp.ui.ext.ooui.SliderTool.static.name = 'slider';
sp.ui.ext.ooui.SliderTool.static.group = 'playTools';
sp.ui.ext.ooui.SliderTool.static.title = 'Change speed';

/* Methods */

sp.ui.ext.ooui.SliderTool.prototype.setDisabled = function ( isDisabled ) {
	// Having this temporarily because the tool seems to insist on it
	console.log( isDisabled );
};

sp.ui.ext.ooui.SliderTool.prototype.onUpdateState = function () {
};
