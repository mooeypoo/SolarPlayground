/**
 * Command registry.
 *
 * @class
 * @extends OO.Registry
 * @constructor
 */
sp.ui.CommandRegistry = function SpUiCommandRegistry() {
	// Parent constructor
	OO.Registry.call( this );
};

/* Inheritance */

OO.inheritClass( sp.ui.CommandRegistry, OO.Registry );

/* Methods */

/**
 * Register a constructor with the factory.
 *
 * @method
 * @param {sp.ui.Command} command Command object
 * @throws {Error} If command is not an instance of sp.ui.Command
 */
sp.ui.CommandRegistry.prototype.register = function ( command ) {
	// Validate arguments
	if ( !( command instanceof sp.ui.Command ) ) {
		throw new Error(
			'command must be an instance of sp.ui.Command, cannot be a ' + typeof command
		);
	}

	OO.Registry.prototype.register.call( this, command.getName(), command );
};

/* Initialization */

sp.ui.commandRegistry = new sp.ui.CommandRegistry();

/* Registrations */

sp.ui.commandRegistry.register(
	new sp.ui.Command( 'play', 'playTools', 'play' )
);
/*sp.ui.commandRegistry.register(
	new sp.ui.Command( 'speed', 'playTools', 'speed' )
);
sp.ui.commandRegistry.register(
	new sp.ui.Command( 'zoomin', 'viewTools', 'zoom', -1000 )
);
sp.ui.commandRegistry.register(
	new sp.ui.Command( 'zoomout', 'viewTools', 'zoom', 1000 )
);
*/
