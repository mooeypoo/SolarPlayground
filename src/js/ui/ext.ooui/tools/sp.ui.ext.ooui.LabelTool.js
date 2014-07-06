/**
 * Label tool.
 *
 * @class
 * @extends OO.ui.Tool
 * @constructor
 * @param {OO.ui.ToolGroup} toolGroup
 * @param {Object} [config] Configuration options
 */
sp.ui.ext.ooui.LabelTool = function SpUiExtOouiLabelTool( toolGroup, config ) {
	// Parent constructor
	OO.ui.Tool.call( this, toolGroup, config );
	// Mixin constructor
	OO.ui.LabeledElement.call( this, $( '<div>' ), config );

	this.$element.empty();
	this.$element.append( this.$label.show() );
};

/* Inheritance */

OO.inheritClass( sp.ui.ext.ooui.LabelTool, OO.ui.Tool );
OO.mixinClass( sp.ui.ext.ooui.LabelTool, OO.ui.LabeledElement );

/* Methods */

/**
 * @inheritdoc
 */
sp.ui.ext.ooui.LabelTool.prototype.onUpdateState = function () {
	this.setDisabled( !this.toolbar.getContainer().getScenario() );
};

/**
 * UserInterface play tool.
 *
 * @class
 * @extends sp.ui.ext.ooui.Tool
 * @constructor
 * @param {OO.ui.ToolGroup} toolGroup
 * @param {Object} [config] Configuration options
 */
sp.ui.ext.ooui.ZoomLabelTool = function SpUiExtOouiZoomLabelTool( toolGroup, config ) {
	sp.ui.ext.ooui.LabelTool.call( this, toolGroup, config );
};
OO.inheritClass( sp.ui.ext.ooui.ZoomLabelTool, sp.ui.ext.ooui.LabelTool );
sp.ui.ext.ooui.ZoomLabelTool.static.name = 'zoomLabel';
sp.ui.ext.ooui.ZoomLabelTool.static.group = 'zoomTools';
sp.ui.ext.ooui.ZoomLabelTool.static.title = 'Zoom';

/**
 * @inheritdoc
 */
sp.ui.ext.ooui.ZoomLabelTool.prototype.onUpdateState = function () {
	// Parent
	sp.ui.ext.ooui.LabelTool.prototype.onUpdateState.apply( this, arguments );

	if ( this.toolbar.getContainer().getScenario() ) {
		this.setLabel( this.toolbar.getContainer().getScenario().getZoom() );
	}
};

/**
 * @inheritdoc
 */
sp.ui.ext.ooui.ZoomLabelTool.prototype.onSelect = function () {
	return false;
};

sp.ui.toolFactory.register( sp.ui.ext.ooui.ZoomLabelTool );
