/**
 * Solar Playground container scenario loader
 *
 * @class sp.Container
 * @mixins OO.EventEmitter
 *
 * @param {Object} [config] Configuration object
 */
sp.container.Loader = function SpContainerLoader( config ) {
	// Mixin constructors
	OO.EventEmitter.call( this );

	this.config = config || {};
};

/* Inheritance */
OO.mixinClass( sp.container.Loader, OO.EventEmitter );

/**
 * Load a scenario
 * @param {String} scenarioName Scenario name. The system will search for
 *  an ajax response from source 'scenario.[name].json' in the scenario
 *  directory.
 */
sp.container.Loader.prototype.loadFromFile = function ( scenarioName, filename ) {
	var deferred = $.Deferred();

	$.getJSON( filename )
		.done( $.proxy( function ( response ) {
			deferred.resolve( response );
		}, this ) )
		.fail( function () {
			sp.log( 'Error', 'Scenario ' + targetName + ' not found in directory "' + targetDir + '"' );
			deferred.reject();
		} );

	return deferred;
};

/**
 * Load and run a scenario
 * @param {Object} scenarioObject Scenario configuration object
 * @fires scenarioLoaded
 */
sp.container.Loader.prototype.loadFromObject = function ( scenarioObject ) {
	var objList;

	// TODO: Validate the scenario object before loading

	scenarioObject = scenarioObject || {};

	scenario = new sp.data.Scenario( this, scenarioObject );
	this.setScenario( scenario );

	// Draw initial frame
//	this.scenario.draw( 0 );

	// Add pov objects to gui
	objList = this.scenario.getAllObjects();
	for ( o in objList ) {
		this.gui.addToPOVList(
			o,
			objList[o].getName()
		);
	}

	this.emit( 'scenarioLoaded', this.scenario );
};
