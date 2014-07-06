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
	sp.ui.ext.ooui.Tool.call( this, toolGroup, config );

	// Initialization
	this.$element.empty();
	this.$slider = this.$( '<input>' )
		.addClass( 'sp-ui-ooui-sliderHandle' )
		.attr( 'type', 'range' )
		.attr( 'min', '1' )
		.attr( 'max', '100' );

	this.$element
		.addClass( 'sp-ui-ooui-sliderTool' )
		.append( this.$slider );
};

/* Setup */

OO.inheritClass( sp.ui.ext.ooui.SliderTool, sp.ui.ext.ooui.Tool );

/* Methods */
sp.ui.ext.ooui.SliderTool.prototype.onUpdateState = function () {
	// Parent
	sp.ui.ext.ooui.Tool.prototype.onUpdateState.apply( this, arguments );
};

/**
 * UserInterface zoom tool.
 *
 * @class
 * @extends sp.ui.ext.ooui.SliderTool
 * @constructor
 * @param {OO.ui.ToolGroup} toolGroup
 * @param {Object} [config] Configuration options
 */
sp.ui.ext.ooui.SpeedSliderTool = function SpUiExtOouiZoomSliderTool( toolGroup, config ) {
	sp.ui.ext.ooui.SliderTool.call( this, toolGroup, config );
	this.$element.addClass( 'sp-ui-ooui-speedSlider' );
};
OO.inheritClass( sp.ui.ext.ooui.SpeedSliderTool, sp.ui.ext.ooui.Tool );
sp.ui.ext.ooui.SpeedSliderTool.static.name = 'speed';
sp.ui.ext.ooui.SpeedSliderTool.static.group = 'viewTools';
sp.ui.ext.ooui.SpeedSliderTool.static.icon = 'speed';
sp.ui.ext.ooui.SpeedSliderTool.static.title = 'speed';
sp.ui.ext.ooui.SpeedSliderTool.static.commandName = 'speed';

sp.ui.toolFactory.register( sp.ui.ext.ooui.SpeedSliderTool );
