/**
 * Command that executes an action.
 *
 * @class
 *
 * @constructor
 * @param {string} name Symbolic name for the command
 * @param {string} action Action to execute when command is triggered
 * @param {string} method Method to call on action when executing
 */
sp.ui.Command = function SpUiCommand( name, action, method ) {
	this.name = name;
	this.action = action;
	this.method = method;
	this.data = Array.prototype.slice.call( arguments, 3 );
};

/* Methods */

/**
 * Execute command on a surface.
 *
 * @param {ve.ui.Surface} surface Surface to execute command on
 * @returns {Mixed} Result of command execution.
 */
sp.ui.Command.prototype.execute = function ( surface ) {
	return surface.execute.apply( surface, [ this.action, this.method ].concat( this.data ) );
};

/**
 * Get command action.
 *
 * @returns {string} action Action to execute when command is triggered
 */
sp.ui.Command.prototype.getAction = function () {
	return this.action;
};

/**
 * Get command method.
 *
 * @returns {string} method Method to call on action when executing
 */
sp.ui.Command.prototype.getMethod = function () {
	return this.method;
};

/**
 * Get command name.
 *
 * @returns {string} name The symbolic name of the command.
 */
sp.ui.Command.prototype.getName = function () {
	return this.name;
};

/**
 * Get command data.
 *
 * @returns {Array} data Additional data to pass to the action when executing
 */
sp.ui.Command.prototype.getData = function () {
	return this.data;
};
