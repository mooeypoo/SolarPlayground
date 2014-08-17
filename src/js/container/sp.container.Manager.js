/**
 * Solar Playground container manager
 *
 * @class sp.container.Manager
 * @mixins OO.EventEmitter
 *
 * @param {Object} [config] Configuration object
 */
sp.container.Manager = function SpContainerManager( config ) {
	// Mixin constructors
	OO.EventEmitter.call( this );

	this.config = config || {};
	this.scenario = null;

	this.container_id = this.config.id;
	// Scenario loader
	this.loader = new sp.container.Loader( config );

	this.$container = $( config.container )
		.addClass( 'sp-container' );

	// Adjust height
	// Remove 40px for top bar
	config.height -= 40;

	// Canvas and context
	this.screen = new sp.container.Screen( config );
	this.$container.append( this.screen.$canvas );

	// Gui
	guiLoader = new sp.ui.Loader( {
		'module': config.gui || 'ooui', // Default module
		'container': this
	} );
	this.gui = guiLoader.initialize();
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
 * @param {Object} [overrideConfig] Optional configuration parameters
 *  that will override whatever is in the scenario file.
 * @returns {jQuery.Promise}
 */
sp.container.Manager.prototype.loadFromName = function ( scenarioName, overrideConfig ) {
	var targetName, objList,
		deferred = $.Deferred(),
		filePrefix = this.config.scenario_prefix || '',
		targetDir = this.config.scenario_dir + this.config.directory_sep;

	deferred = $.Deferred();

	scenarioName = scenarioName || 'example';
	targetName = targetDir + filePrefix + scenarioName + '.json';

	this.loader.loadFromFile( scenarioName, targetName )
		.done( $.proxy( function ( scenarioObject ) {
			scenario = new sp.data.Scenario( this.screen, scenarioObject, overrideConfig );
			this.setScenario( scenario );
			// Add pov objects to gui
			objList = this.scenario.getAllObjects();
			for ( var o in objList ) {
				this.gui.addToPOVList(
					o,
					objList[o].getName()
				);
			}
			this.emit( 'scenarioLoaded' );
			deferred.resolve( this );
		}, this ) );

	return deferred;
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
};

/**
 * Redraw the scenario elements
 */
sp.container.Manager.prototype.redrawScenario = function () {
	// Draw
	this.screen.clear();
	this.scenario.draw();
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
	}
};

/**
 * Check whether the scenario is paused
 */
sp.container.Manager.prototype.isPaused = function () {
	return this.scenario.isPaused();
};

/**
 * Set scenario zoom
 * @param {number} zoom Zoom factor
 * @fires zoom
 */
sp.container.Manager.prototype.setZoom = function ( zoom ) {
	if ( this.scenario.getZoom() !== zoom ) {
		this.scenario.setZoom( zoom );
	}
};

sp.container.Manager.prototype.setPitchAngle = function ( pitch ) {
	if ( this.scenario ) {
		this.scenario.setPitchAngle( pitch );
	}
};

/**
 * Execute an action or command.
 *
 * @method
 * @param {string} action Symbolic name of action
 * @param {string} [method] Action method name
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
 * Get the container id
 * @return {string} Container id
 */
sp.container.Manager.prototype.getID = function () {
	return this.container_id;
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

/**
 * Get container screen
 * @return {sp.container.Screen} Screen
 */
sp.container.Manager.prototype.getScreen = function () {
	return this.screen;
};

/**
 * Get container screen
 * @return {sp.container.Screen} Screen
 */
sp.container.Manager.prototype.getCanvas = function () {
	return this.screen.getCanvas();
};
