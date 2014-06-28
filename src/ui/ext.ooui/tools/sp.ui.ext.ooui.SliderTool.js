/**
 * A slider tool
 *
 * @class
 * @extends OO.ui.Tool
 *
 * @constructor
 * @param {OO.ui.ToolGroup} toolGroup
 * @param {Object} [config] Configuration options
 */
sp.ui.ext.ooui.SliderTool = function SpUiExtOouiSliderTool( toolGroup, config ) {
	// Parent constructor
	OO.ui.Tool.call( this, toolGroup, config );

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

/* Methods */

sp.ui.ext.ooui.SliderTool.prototype.setDisabled = function ( isDisabled ) {
	// Having this temporarily because the tool seems to insist on it
	console.log( isDisabled );
};

sp.ui.ext.ooui.SliderTool.prototype.onUpdateState = function () {
};

/* Speed *
sp.ui.ext.ooui.SpeedSliderTool = function SpUiExtOouiSpeedSliderTool( config ) {
	sp.ui.ext.ooui.SliderTool.call( this, config );
};
OO.inheritClass( sp.ui.ext.ooui.SpeedSliderTool, sp.ui.ext.ooui.SliderTool );
sp.ui.ext.ooui.SpeedSliderTool.static.name = 'slider';
sp.ui.ext.ooui.SpeedSliderTool.static.group = 'playTools';
sp.ui.ext.ooui.SpeedSliderTool.static.title = 'Change speed';
sp.ui.ext.ooui.toolFactory.register( sp.ui.ext.ooui.SpeedSliderTool );
*/
