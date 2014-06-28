/**
 * UserInterface regular ui tool.
 *
 * @class
 * @extends OO.ui.Tool
 * @constructor
 * @param {OO.ui.ToolGroup} toolGroup
 * @param {Object} [config] Configuration options
 */
sp.ui.ext.ooui.Tool = function SpUiTool( toolGroup, config ) {
	// Parent constructor
	OO.ui.Tool.call( this, toolGroup, config );

	// TODO: Connect to proper event in the container
};

/* Inheritance */

OO.inheritClass( sp.ui.ext.ooui.Tool, OO.ui.Tool );

/* Static Properties */

/**
 * Surface model method to check state with.
 *
 * @abstract
 * @static
 * @property {string}
 * @inheritable
 */
sp.ui.ext.ooui.Tool.static.check = '';

/* Methods */

/**
 * @inheritdoc
 */
sp.ui.ext.ooui.Tool.prototype.onUpdateState = function () {
	// Parent method
	OO.ui.Tool.prototype.onUpdateState.apply( this, arguments );

//	this.setDisabled( !this.toolbar.getSurface().getModel()[this.constructor.static.check]() );
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
sp.ui.ext.ooui.PlayTool = function SpUiExtOouiPlayTool( toolGroup, config ) {
	sp.ui.ext.ooui.Tool.call( this, toolGroup, config );
};
OO.inheritClass( sp.ui.ext.ooui.PlayTool, sp.ui.ext.ooui.Tool );
sp.ui.ext.ooui.PlayTool.static.name = 'play';
ve.ui.UndoHistoryTool.static.group = 'playTools';
ve.ui.UndoHistoryTool.static.icon = 'play';
ve.ui.UndoHistoryTool.static.title = 'Play';
ve.ui.UndoHistoryTool.static.commandName = 'play';
ve.ui.toolFactory.register( sp.ui.ext.ooui.PlayTool );

/**
 * UserInterface pause tool.
 *
 * @class
 * @extends sp.ui.ext.ooui.Tool
 * @constructor
 * @param {OO.ui.ToolGroup} toolGroup
 * @param {Object} [config] Configuration options
 */
sp.ui.ext.ooui.PauseTool = function SpUiExtOouiPauseTool( toolGroup, config ) {
	sp.ui.ext.ooui.Tool.call( this, toolGroup, config );
};
OO.inheritClass( sp.ui.ext.ooui.PauseTool, sp.ui.ext.ooui.Tool );
sp.ui.ext.ooui.PlayTool.static.name = 'pause';
ve.ui.UndoHistoryTool.static.group = 'playTools';
ve.ui.UndoHistoryTool.static.icon = 'pause';
ve.ui.UndoHistoryTool.static.title = 'pause';
ve.ui.UndoHistoryTool.static.commandName = 'pause';
ve.ui.toolFactory.register( sp.ui.ext.ooui.PlayTool );
