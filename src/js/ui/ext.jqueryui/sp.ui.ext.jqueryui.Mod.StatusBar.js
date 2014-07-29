/**
 * jQueryUI Gui module
 *
 * @class sp.ui.ext.jqueryui.Mod.Play
 *
 * @param {sp.Container} container The container to attach the GUI to
 * @param {Object} [config] Gui module definition
 */
sp.ui.ext.jqueryui.Mod.StatusBar = function SpUiExtJqueryUiModStatusBar( container, config ) {
	var $separator = $( '<div>' )
			.addClass( 'sp-ui-jqueryui-sep' );

	config = config || {};

	// Parent constructor
	sp.ui.ext.jqueryui.Mod.StatusBar.super.call( this, container, config );

	this.$element = $( '<div>' )
		.addClass( 'sp-ui-jqueryui-statusbar' );

	// Events
//	this.container.connect( this, { 'scenarioLoaded': 'onScenarioLoaded' } );
};

/* Inheritance */
OO.inheritClass( sp.ui.ext.jqueryui.Mod.StatusBar, sp.ui.ext.StatusBar );
