/**
 * Solar Playground container manager
 *
 * @class sp.Container
 * @mixins OO.EventEmitter
 *
 * @param {Object} [config] Configuration object
 */
sp.container.Manager = function SpContainerManager( config ) {
	// Mixin constructors
	OO.EventEmitter.call( this );

	this.config = config || {};
	this.scenario = null;

	// Scenario loader
	this.loader = new sp.container.Loader( config );

	this.$container = $( config.container )
		.addClass( 'sp-container' )

	// Canvas and context
	this.screen = new sp.container.Screen( config );
	this.$container.append( this.screen.$canvas );

	// Gui
	guiLoader = new sp.ui.Loader( {
		'module': 'ooui', // Default module
		'container': this
	} );
	this.gui = guiLoader.initialize();

	// Events
	this.gui.connect( this, { 'play': 'onGuiPlay' } );
	this.gui.connect( this, { 'zoom': 'onGuiZoom' } );
	this.gui.connect( this, { 'pov': 'onGuiPOV' } );
};

/* Inheritance */
OO.mixinClass( sp.container.Manager, OO.EventEmitter );

/**
 * @event scenarioLoaded
 * @param {sp.Scenario} scenario Reference to the loaded scenario
 * Scenario fully loaded and ready to be run.
 */

/* Methods */

/**
 * Load scenario from file.
 * @param {string} scenarioName The scenario name
 * @returns {jQuery.Promise}
 */
sp.container.Manager.prototype.loadFromFile = function ( scenarioName ) {
	var targetName,
		deferred = $.Deferred(),
		filePrefix = this.config.scenario_prefix || '',
		targetDir = this.config.scenario_dir + this.config.directory_sep;

	deferred = $.Deferred();

	scenarioName = scenarioName || 'example';
	targetName = targetDir + filePrefix + scenarioName + '.json';

	this.loader.loadFromFile( scenarioName, targetName )
		.done( $.proxy( function ( scenarioObject ) {
			scenario = new sp.data.Scenario( this.screen, scenarioObject );
			this.setScenario( scenario );
			// Add pov objects to gui
			objList = this.scenario.getAllObjects();
			for ( o in objList ) {
				this.gui.addToPOVList(
					o,
					objList[o].getName()
				);
			}
			this.emit( 'scenarioLoaded' );
			deferred.resolve();
		}, this ) );

	return deferred;
};

/**
 * Propogate scenario event
 * @param {Boolean} isPaused Scenario paused
 * @fires pause
 */
sp.container.Manager.prototype.onScenarioPause = function ( isPaused ) {
	this.emit( 'pause', isPaused );
};

/**
 * Respond to play button press
 * @param {Boolean} isPlay Play or pause
 */
sp.container.Manager.prototype.onGuiPlay = function ( isPlay ) {
	this.scenario.togglePaused( !isPlay );
};

/**
 * Respond to zoom button press
 * @param {Boolean} zoom Zoom level
 */
sp.container.Manager.prototype.onGuiZoom = function ( zoom ) {
	this.scenario.setZoom( zoom );
};

/**
 * Respond to pov button press
 * @param {Boolean} newPov New POV object key
 */
sp.container.Manager.prototype.onGuiPOV = function ( newPov ) {
	this.scenario.setPOV( newPov );
};

/**
 * Add a toolbar to the container
 * @param {jQuery} $toolbar jQuery toolbar element
 * @param {string} [position] Position in the container; 'top' or 'bottom'
 */
sp.container.Manager.prototype.addToolbar = function ( $toolbar, position ) {
	position = position || 'top';

	if ( position === 'top' ) {
		this.$container.prepend( $toolbar );
	} else {
		this.$container.append( $toolbar );
	}
};

/**
 * Attach scenario object to this container
 * @param {sp.Scenario} s Scenario object
 */
sp.container.Manager.prototype.setScenario = function ( s ) {
	this.scenario = s;

	// Draw
	this.screen.clear();
	this.scenario.draw();

	// Propogate scenario events
	this.scenario.connect( this, { 'pause': 'onScenarioPause' } );
};

/**
 * Retrieve the scenario attached to this container
 * @returns {sp.Scenario} s Scenario object
 */
sp.container.Manager.prototype.getScenario = function () {
	return this.scenario;
};
/**
 * Toggle between pause and resume the scenario
 * @param {boolean} [isPaused] Optional. If supplied, pauses or resumes the scenario
 * @fires pause
 */
sp.container.Manager.prototype.togglePaused = function ( isPaused ) {
	if ( this.isPaused() !== isPaused ) {
		this.scenario.togglePaused( isPaused );
		this.emit( 'pause', isPaused );
	}
};

/**
 * Set scenario zoom
 * @param {number} zoom Zoom factor
 * @fires zoom
 */
sp.container.Manager.prototype.setZoom = function ( zoom ) {
	if ( this.scenario.getZoom() !== zoom ) {
		this.scenario.setZoom( zoom );
		this.emit( 'zoom', zoom );
	}
};

/**
 * Check whether the scenario is paused
 */
sp.container.Manager.prototype.isPaused = function () {
	return this.scenario.isPaused();
};

/**
 * Execute an action or command.
 *
 * @method
 * @param {string} action Symbolic name of action
 * @param {string} [method] Action method name
 * @param {Mixed} [args] Additional arguments for action
 * @returns {boolean} Action or command was executed
 */
sp.container.Manager.prototype.execute = function ( action, method ) {
	var trigger, obj, ret;

	if ( !this.enabled ) {
		return;
	}

	// Validate method
	if ( sp.ui.actionFactory.doesActionSupportMethod( action, method ) ) {
		// Create an action object and execute the method on it
		obj = sp.ui.actionFactory.create( action, this );
		ret = obj[method].apply( obj, Array.prototype.slice.call( arguments, 2 ) );
		return ret === undefined || !!ret;
	}
	return false;
};

/**
 * Add all commands from initialization options.
 *
 * Commands and triggers must be registered under the same name prior to adding them to the surface.
 *
 * @method
 * @param {string[]} names List of symbolic names of commands in the command registry
 * @throws {Error} If command has not been registered
 * @throws {Error} If trigger has not been registered
 * @throws {Error} If trigger is not complete
 * @fires addCommand
 */
sp.container.Manager.prototype.addCommands = function ( names ) {
	var i, j, len, key, command, triggers, trigger;

	for ( i = 0, len = names.length; i < len; i++ ) {
		command = sp.ui.commandRegistry.lookup( names[i] );
		if ( !command ) {
			throw new Error( 'No command registered by that name: ' + names[i] );
		}

/*		// Normalize trigger key
		triggers = ve.ui.triggerRegistry.lookup( names[i] );
		if ( !triggers ) {
			throw new Error( 'No triggers registered by that name: ' + names[i] );
		}
		for ( j = triggers.length - 1; j >= 0; j-- ) {
			trigger = triggers[j];
			key = trigger.toString();
			// Validate trigger
			if ( key.length === 0 ) {
				throw new Error( 'Incomplete trigger: ' + trigger );
			}
			this.commands[key] = command;
		}*/
/*		this.triggers[names[i]] = triggers;*/
		this.emit( 'addCommand', names[i], command, triggers );
	}
};
