/**
 * Scenario calculator
 * @param {Object} [config] Configuration object
 */
sp.Scenario.Calculator = function SpScenarioCalculator( config ) {

};

/**
 * Originally created by Matthew Watson Copyright (C) 2012
 * For SolarPlayground Educational Orbit Simulator
 *
 * Solver for the Keplerian orbit at time t with initial parameters.
 * @param {number} a Semi-major axis.
 * @param {number} e Eccentricity.
 * @param {number} p Period, not strictly needed, but saves carrying around
 *    masses or working them out.
 * @param {number} t Time.
 * @param {Object.<string,number>} [eangles] Euler angles in format {t: , p:,
 *    r: } for theta, phi and rho. In radians.
 * @param {Object.<string,number>} [destination] Optional object to the result
 *    in. Saves on gc if we're doing it a lot. Format {x: , y: , z: }.
 * @return {Object.<string,number>} destination The destination object passed
 *    in with modified coordinates, or a new object if none is provide.
 */
sp.Scenario.Calculator.solveKepler = function SpScenarioCalculatorSolveKepler( a, e, p, t, eangles, destination ) {
	// If destination isn't supplied, make one.
	if ( !destination ) {
		destination = {};
	}
	if ( a === 0 ) {
		destination.x = destination.y = destination.z = 0;
		return destination;
	}

	var ITERLIMIT = 1000,         // Limit on number of iterations.
		x = 0,
		y = 0,
		r = 0,                    // Temporary coords.
		M = t / p * Math.PI / 2,  // Mean anomaly.
		tanom = 0,                // True anomaly.
		E0 = 0,                   // Eccentric anomaly.
		E1 = 0;     // Ditto, two values for iterative soln.

	/**
	 * Improve our value for eccentric anomaly while the error is above
	 * truncation error, or until we have done ITERLIMIT cycles.
	 * NB: E1 - E0 is falsy when they are the same.
	 */
	do {
		E0 = E1;
		E1 = M + e * Math.sin( E0 );
	} while ( ITERLIMIT-- && E1 - E0 );

	E1 *= 0.5;  // We only want half E1 in later calcs.

	// Solve for true anomaly.
	tanom = 2 * Math.atan2( Math.sqrt( 1 + e ) * Math.sin( E1 ),
		Math.sqrt( 1 - e ) * Math.cos( E1 ) );

	// Solve for r, theta, x and y.
	r = a * ( 1 - e * e ) /
		( 1 + e * Math.cos( tanom ) );
	x = ( r ) * Math.cos( tanom );
	y = ( r ) * Math.sin( tanom );

	destination.x = x || 0;
	destination.y = y || 0;
	destination.z = 0 || 0;
	destination.r = r || 0;
	return destination;
};
