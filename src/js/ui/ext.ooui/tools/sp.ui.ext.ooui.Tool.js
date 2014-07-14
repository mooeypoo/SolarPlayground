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

/* Methods */

/**
 * @inheritdoc
 */
sp.ui.ext.ooui.Tool.prototype.onUpdateState = function () {
	this.setDisabled( !this.toolbar.getContainer().getScenario() );
};

/**
 * @inheritdoc
 */
sp.ui.ext.ooui.Tool.prototype.onSelect = function () {
	if ( this.constructor.static.deactivateOnSelect ) {
		this.setActive( false );
	}
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

/**
 * UserInterface zoom in tool.
 *
 * @class
 * @extends sp.ui.ext.ooui.Tool
 * @constructor
 * @param {OO.ui.ToolGroup} toolGroup
 * @param {Object} [config] Configuration options
 */
sp.ui.ext.ooui.ZoomTool = function SpUiExtOouiZoomTool( toolGroup, config ) {
	sp.ui.ext.ooui.Tool.call( this, toolGroup, config );
};
OO.inheritClass( sp.ui.ext.ooui.ZoomTool, sp.ui.ext.ooui.Tool );
sp.ui.ext.ooui.ZoomTool.static.group = 'zoomTools';
sp.ui.ext.ooui.ZoomTool.static.deactivateOnSelect = true;
/**
 * @inheritdoc
 */
sp.ui.ext.ooui.ZoomTool.prototype.onUpdateState = function () {
	// Parent
	sp.ui.ext.ooui.Tool.prototype.onUpdateState.apply( this, arguments );
	this.setDisabled( !!!this.toolbar.getContainer().getScenario() );
};

/**
 * @inheritdoc
 */
sp.ui.ext.ooui.ZoomTool.prototype.onSelect = function ( zoom ) {
	this.toolbar.getContainer().getScenario().setZoom( zoom );
	// Parent
	sp.ui.ext.ooui.Tool.prototype.onSelect.call( this );
};

/**
 * UserInterface zoom in tool.
 *
 * @class
 * @extends sp.ui.ext.ooui.ZoomTool
 * @constructor
 * @param {OO.ui.ToolGroup} toolGroup
 * @param {Object} [config] Configuration options
 */
sp.ui.ext.ooui.ZoomInTool = function SpUiExtOouiZoomInTool( toolGroup, config ) {
	sp.ui.ext.ooui.ZoomTool.call( this, toolGroup, config );
};
OO.inheritClass( sp.ui.ext.ooui.ZoomInTool, sp.ui.ext.ooui.ZoomTool );
sp.ui.ext.ooui.ZoomInTool.static.name = 'zoomin';
sp.ui.ext.ooui.ZoomInTool.static.icon = 'zoomin';
sp.ui.ext.ooui.ZoomInTool.static.title = 'Zoom in';
sp.ui.ext.ooui.ZoomInTool.static.commandName = 'zoomin';

/**
 * @inheritdoc
 */
sp.ui.ext.ooui.ZoomInTool.prototype.onSelect = function () {
	// Parent
	sp.ui.ext.ooui.ZoomTool.prototype.onSelect.apply( this, [ 1000 ] );
};

sp.ui.toolFactory.register( sp.ui.ext.ooui.ZoomInTool );

/**
 * UserInterface zoom out tool.
 *
 * @class
 * @extends sp.ui.ext.ooui.ZoomTool
 * @constructor
 * @param {OO.ui.ToolGroup} toolGroup
 * @param {Object} [config] Configuration options
 */
sp.ui.ext.ooui.ZoomOutTool = function SpUiExtOouiZoomOutTool( toolGroup, config ) {
	sp.ui.ext.ooui.ZoomTool.call( this, toolGroup, config );
};
OO.inheritClass( sp.ui.ext.ooui.ZoomOutTool, sp.ui.ext.ooui.ZoomTool );
sp.ui.ext.ooui.ZoomOutTool.static.name = 'zoomout';
sp.ui.ext.ooui.ZoomOutTool.static.icon = 'zoomout';
sp.ui.ext.ooui.ZoomOutTool.static.title = 'Zoom out';
sp.ui.ext.ooui.ZoomOutTool.static.commandName = 'zoomout';

/**
 * @inheritdoc
 */
sp.ui.ext.ooui.ZoomOutTool.prototype.onSelect = function () {
	// Parent
	sp.ui.ext.ooui.ZoomTool.prototype.onSelect.apply( this, [ -1000 ] );
};

sp.ui.toolFactory.register( sp.ui.ext.ooui.ZoomOutTool );

/**
 * UserInterface grid tool.
 *
 * @class
 * @extends sp.ui.ext.ooui.Tool
 * @constructor
 * @param {OO.ui.ToolGroup} toolGroup
 * @param {Object} [config] Configuration options
 */
sp.ui.ext.ooui.GridTool = function SpUiExtOouiGridTool( toolGroup, config ) {
	sp.ui.ext.ooui.Tool.call( this, toolGroup, config );
};
OO.inheritClass( sp.ui.ext.ooui.GridTool, sp.ui.ext.ooui.Tool );
sp.ui.ext.ooui.GridTool.static.name = 'grid';
sp.ui.ext.ooui.GridTool.static.group = 'viewTools';
sp.ui.ext.ooui.GridTool.static.icon = 'grid';
sp.ui.ext.ooui.GridTool.static.title = 'grid';
sp.ui.ext.ooui.GridTool.static.commandName = 'grid';

/**
 * @inheritdoc
 */
sp.ui.ext.ooui.GridTool.prototype.onUpdateState = function () {
	var isPaused = false;
	// Parent
	sp.ui.ext.ooui.Tool.prototype.onUpdateState.apply( this, arguments );

	if ( this.toolbar.getContainer().getScenario() ) {
		this.setActive( this.toolbar.getContainer().getScenario().isShowGrid() );
	}
};

/**
 * @inheritdoc
 */
sp.ui.ext.ooui.GridTool.prototype.onSelect = function () {
	// toggle grid
	this.toolbar.getContainer().getScenario().toggleGrid();
};

sp.ui.toolFactory.register( sp.ui.ext.ooui.GridTool );

/**
 * UserInterface zoom in tool.
 *
 * @class
 * @extends sp.ui.ext.ooui.Tool
 * @constructor
 * @param {OO.ui.ToolGroup} toolGroup
 * @param {Object} [config] Configuration options
 */
sp.ui.ext.ooui.PitchTool = function SpUiExtOouiPitchTool( toolGroup, config ) {
	sp.ui.ext.ooui.Tool.call( this, toolGroup, config );
};
OO.inheritClass( sp.ui.ext.ooui.PitchTool, sp.ui.ext.ooui.Tool );
sp.ui.ext.ooui.PitchTool.static.group = 'viewTools';
sp.ui.ext.ooui.PitchTool.static.deactivateOnSelect = true;
/**
 * @inheritdoc
 */
sp.ui.ext.ooui.PitchTool.prototype.onUpdateState = function () {
	// Parent
	sp.ui.ext.ooui.Tool.prototype.onUpdateState.apply( this, arguments );
	this.setDisabled( !!!this.toolbar.getContainer().getScenario() );
};

/**
 * @inheritdoc
 */
sp.ui.ext.ooui.PitchTool.prototype.onSelect = function () {
	var toDeg = 180 / Math.PI,
		toRadians = Math.PI / 180,
		scenario = this.toolbar.getContainer().getScenario();

	// Change to degrees so we can increase/decrease
	pitch = Math.floor( scenario.getPitchAngle() * toDeg );
	pitch += this.constructor.static.changeAngle;

	// Change pitch (back to radians)
	this.toolbar.getContainer().getScenario().setPitchAngle( pitch * toRadians );
	// Parent
	sp.ui.ext.ooui.Tool.prototype.onSelect.call( this );
};

/**
 * UserInterface tilt up tool
 *
 * @class
 * @extends sp.ui.ext.ooui.PitchTool
 * @constructor
 * @param {OO.ui.ToolGroup} toolGroup
 * @param {Object} [config] Configuration options
 */
sp.ui.ext.ooui.TiltUpTool = function SpUiExtOouiZoomInTool( toolGroup, config ) {
	sp.ui.ext.ooui.PitchTool.call( this, toolGroup, config );
};
OO.inheritClass( sp.ui.ext.ooui.TiltUpTool, sp.ui.ext.ooui.PitchTool );
sp.ui.ext.ooui.TiltUpTool.static.name = 'tiltup';
sp.ui.ext.ooui.TiltUpTool.static.icon = 'tiltup';
sp.ui.ext.ooui.TiltUpTool.static.title = 'Tilt up';
sp.ui.ext.ooui.TiltUpTool.static.changeAngle = 10;
sp.ui.ext.ooui.TiltUpTool.static.commandName = 'tiltup';

sp.ui.toolFactory.register( sp.ui.ext.ooui.TiltUpTool );

/**
 * UserInterface tilt down tool
 *
 * @class
 * @extends sp.ui.ext.ooui.PitchTool
 * @constructor
 * @param {OO.ui.ToolGroup} toolGroup
 * @param {Object} [config] Configuration options
 */
sp.ui.ext.ooui.TiltDownTool = function SpUiExtOouiZoomInTool( toolGroup, config ) {
	sp.ui.ext.ooui.PitchTool.call( this, toolGroup, config );
};
OO.inheritClass( sp.ui.ext.ooui.TiltDownTool, sp.ui.ext.ooui.PitchTool );
sp.ui.ext.ooui.TiltDownTool.static.name = 'tiltdown';
sp.ui.ext.ooui.TiltDownTool.static.icon = 'tiltdown';
sp.ui.ext.ooui.TiltDownTool.static.title = 'Tilt down';
sp.ui.ext.ooui.TiltDownTool.static.changeAngle = -10;
sp.ui.ext.ooui.TiltDownTool.static.commandName = 'tiltdown';

sp.ui.toolFactory.register( sp.ui.ext.ooui.TiltDownTool );
