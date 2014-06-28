/**
 * Regular button tool.
 *
 * @class
 * @extends OO.ui.Tool
 * @constructor
 * @param {OO.ui.ToolGroup} toolGroup
 * @param {Object} [config] Configuration options
 */
sp.ui.ext.ooui.Tool = function SpUiExtOouiTool( toolGroup, config ) {
	// Parent constructor
	OO.ui.Tool.call( this, toolGroup, config );
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
sp.ui.ext.ooui.PlayTool = function SpUiExtOouiPlayTool( toolGroup, config ) {
	sp.ui.ext.ooui.Tool.call( this, toolGroup, config );
};
OO.inheritClass( sp.ui.ext.ooui.PlayTool, sp.ui.ext.ooui.Tool );
sp.ui.ext.ooui.PlayTool.static.name = 'play';
sp.ui.ext.ooui.PlayTool.static.group = 'playTools';
sp.ui.ext.ooui.PlayTool.static.icon = 'play';
sp.ui.ext.ooui.PlayTool.static.title = 'Play';
sp.ui.ext.ooui.PlayTool.static.commandName = 'play';

/**
 * @inheritdoc
 */
sp.ui.ext.ooui.PlayTool.prototype.onUpdateState = function () {
	var isPaused = false;
	// Parent
	sp.ui.ext.ooui.Tool.prototype.onUpdateState.apply( this, arguments );

	if ( this.toolbar.getContainer().getScenario() ) {
		this.setActive( !this.toolbar.getContainer().getScenario().isPaused() );
	}
};

/**
 * @inheritdoc
 */
sp.ui.ext.ooui.PlayTool.prototype.onSelect = function () {
	// Pause the scenario
	this.toolbar.getContainer().getScenario().togglePaused();
};

sp.ui.toolFactory.register( sp.ui.ext.ooui.PlayTool );

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
sp.ui.ext.ooui.PauseTool.static.name = 'pause';
sp.ui.ext.ooui.PauseTool.static.group = 'playTools';
sp.ui.ext.ooui.PauseTool.static.icon = 'pause';
sp.ui.ext.ooui.PauseTool.static.title = 'pause';
sp.ui.ext.ooui.PauseTool.static.commandName = 'pause';

/**
 * @inheritdoc
 */
sp.ui.ext.ooui.PauseTool.prototype.onUpdateState = function () {
	var isPaused = false;
	// Parent
	sp.ui.ext.ooui.Tool.prototype.onUpdateState.apply( this, arguments );

	if ( this.toolbar.getContainer().getScenario() ) {
		this.setActive( this.toolbar.getContainer().getScenario().isPaused() );
	}
};

/**
 * @inheritdoc
 */
sp.ui.ext.ooui.PauseTool.prototype.onSelect = function () {
	// Pause the scenario
	this.toolbar.getContainer().getScenario().togglePaused();
};

sp.ui.toolFactory.register( sp.ui.ext.ooui.PauseTool );
