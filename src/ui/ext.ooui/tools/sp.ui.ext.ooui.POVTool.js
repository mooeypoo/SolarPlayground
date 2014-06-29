/**
 * Regular POV list tool.
 *
 * @class
 * @extends OO.ui.Tool
 * @constructor
 * @param {OO.ui.ToolGroup} toolGroup
 * @param {Object} [config] Configuration options
 */
sp.ui.ext.ooui.POVTool = function SpUiExtOouiPOVTool( toolGroup, config ) {
	// Parent constructor
	OO.ui.Tool.call( this, toolGroup, config );
};

/* Inheritance */

OO.inheritClass( sp.ui.ext.ooui.POVTool, OO.ui.Tool );

/* Static */

sp.ui.ext.ooui.POVTool.static.group = 'povTools';

/* Methods */

/**
 * @inheritdoc
 */
sp.ui.ext.ooui.POVTool.prototype.onUpdateState = function () {
	var currPov;
	this.setDisabled( !this.toolbar.getContainer().getScenario() );

	if ( this.toolbar.getContainer().getScenario() ) {
		currPov = this.toolbar.getContainer().getScenario().getPOV();
		this.setActive( currPov === this.constructor.static.name );
	}
};

/**
 * @inheritdoc
 */
sp.ui.ext.ooui.POVTool.prototype.onSelect = function () {
	if ( this.toolbar.getContainer().getScenario() ) {
		this.toolbar.getContainer().getScenario().setPOV(
			this.constructor.static.name
		);
	}
};
