/**
 * Solar Playground calculator. Contains methods for calculations across the scenarios.
 *
 * @class sp.calc.Calculator
 *
 * @param {Object} [config] Configuration object
 */
sp.calc.Calculator = function SpScenarioCalculator( config ) {};

/**
 * Astronomical constants. Mostly related to the solar
 * system but also to other calculations.
 * @property {Object}
 */
sp.calc.Calculator.constants = {
	// Astronomical units (AU) in km
	'AU': 149597871, // km
	// Gravitational constant in N*(m/kg)^2
	'G': 6.67 * Math.pow( 10, -11 )
};

/**
 * Calculate the absolute time needed for proper calculations.
 * In our case, it is the number of days from 1999 Dec 31, 0:00 UT
 * @param {number} year Requested year (YYYY)
 * @param {number} month Requested month
 * @param {number} day Requested day of the month
 * @param {number} time_of_day Time of day in decimals 0-24
 * @returns {number} The decimal number of days from 1999 Dec 31, 0:00 UT
 */
sp.calc.Calculator.translateTime = function ( year, month, day, time_of_day ) {
	var totalDays;
	year = year || 2014;
	month = month || 6;
	day = day || 10;
	time_of_day = time_of_day || 0;

	// The day calculation must be integer calculation, so 'Math.floor' must
	// be used for all divisions
	totalDays = 367 * year - 7 *
		Math.floor( ( year + Math.floor( ( month + 9 ) / 12 ) ) / 4 ) +
		275 * Math.floor( month / 9 ) + D - 730530;

	// Add time (floating point division)
	totalDays += time_of_day / 24;

	return totalDays;
};

/**
 * Translate date to th enumber of centuries from J2000.0
 * @param {number} year Requested year (yyyy)
 * @param {number} [month] Requested month
 * @param {number} [day] Requested day of the month
 * @param {number} [hours] Hour of the day in 24h format
 * @param {number} [minutes] Minutes after the hour
 * @param {number} [seconds] Seconds after the minute
 * @returns {number} Number of centuries from epoch J2000.0
 */
sp.calc.Calculator.getCenturies = function ( year, month, day, hours, minutes, seconds ) {
	var D,
		h = hour + minutes / 60 + second / 3600;

	day = day || 1;
	month = month || 1;

	D = 367 * year - 7 * Math.floor( ( year + Math.floor( ( month + 9 ) / 12 ) ) / 4 ) + day - 730531.5 + h / 24;

	return D / 36525;
};

/**
 * Return a JDN (Julian Day Number) from J2000.0, converted from a Gregorian date and time
 * @param {number} year Requested year (yyyy)
 * @param {number} month Requested month
 * @param {number} day Requested day of the month
 * @param {number} [hours] Hour of the day in 24h format
 * @param {number} [minutes] Minutes after the hour
 * @param {number} [seconds] Seconds after the minute
 * @returns {number} JDN, number of days from epoch J2000.0
 */
sp.calc.Calculator.getJDNTime = function ( year, month, day, hours, minutes, seconds ) {
	var JDN,
		a = Math.floor( ( 14 - month ) / 12 ),
		y = year + 4800 - a,
		m = month + 12 * a - 3;

	hours = hours || 12; // Given hours or midday
	minutes = minutes || 0;
	seconds = seconds || 0;

	// Translate from Gregorian to JDN
	// Calculation take from
	// https://en.wikipedia.org/wiki/Julian_day#Converting_Julian_or_Gregorian_calendar_date_to_Julian_Day_Number
	JDN = day + Math.floor( ( 153 * m + 2) / 5 ) + 365 * y +
		Math.floor( y / 4 ) - Math.floor( y / 100 ) + Math.floor( y / 400 ) +
		32045

	// Include time of day
	JD = JDN + ( ( hours - 12 ) / 24 ) + ( minutes / 1440 ) + ( seconds / 86400 );

	// Return JD from J2000.0 (Epoch)
	return JD - 2451545.0;
};

/**
 * Solve the Kepler equation for the given parameters to get the object's
 * position in space. This position is raw heliocentric space coordiates
 *
 * Calculation taken from NASA JPL Formula:
 * http://ssd.jpl.nasa.gov/?planet_pos
 * And
 * https://gist.github.com/bartolsthoorn/7913357
 *
 * @param {Object} vars Variables necessary for calculation.
 * @param {number[]} vars.a Semi-major axis (au and au/cy)
 * @param {number[]} vars.e Eccentricity ( no units and no units/cy)
 * @param {number[]} vars.I Inclination (degrees and degrees/cy)
 * @param {number[]} vars.L Mean longitude (degrees and degrees/cy)
 * @param {number[]} vars.long_peri Longitude of perihelion (degree and degrees/cy)
 * @param {number[]} vars.long_node Longitude of the ascending node (degrees and degrees/cy)
 * @param {number} [jd] Julian Days from J2000.0. If not given, calculated for J2000.0
 * @returns {Object} Three-dimensional position in space, values in km
 */
sp.calc.Calculator.solveKepler = function ( vars, jd ) {
	var T, a, e, I, L, om, bigOm, omega, M, b, c, f, s,
		dimensions = {},
		x_tag, y_tag, z_tag,
		ITERLIMIT = 1000,
		ERRORLIMIT = Math.pow( 10, -4 ),
		/**
		 * Convert angles to radians
		 * @param {number} angle Angle
		 * @returns {number} Radians
		 */
		to_radians = function toRadians( angle ) {
			return angle * ( 180 / Math.PI );
		},
		/**
		 * Approximate the eccententric anomaly by iteration
		 * @param {number} e Eccentricity
		 * @param {number} M Mean anomaly
		 * @returns {number} Eccentric anomaly in radians
		 */
		approximate_E = function approxE( e, M ) {
			var e_star = ( Math.PI / 180 ) * e,
			E_n = M + e_star + Math.sin( to_radians( M ) ),
			dE = 1,
			i = 0;

			while ( ITERLIMIT-- && Math.abs( dE ) > ERRORLIMIT ) {
				dM = M - ( E_n - e_star * Math.sin( to_radians( E_n ) ) );
				dE = dM / ( 1 - e * Math.cos( to_radians( E_n ) ) );
				E_n = E_n + dE;
			}
			return to_radians( E_n );
		};

	if ( !vars ) {
		return null;
	}

	// Optional variables
	T = jd || 0;
	b = vars.b || 0;
	c = vars.c || 0;
	f = vars.f || 0;
	s = vars.s || 0;

	// Calculate the elements
	a = vars.a[0] + vars.a[1] * T;
	e = vars.e[0] + vars.e[1] * T;
	I = vars.I[0] + vars.I[1] * T;
	L = vars.L[0] + vars.L[1] * T;
	om = vars.long_peri[0] + vars.long_peri[1] * T;
	bigOm = vars.long_node[0] + vars.long_node[1] * T;

	// Argument of perihelion
	omega = om - bigOm;

	// Mean anomaly
	M = L - om + b *
		Math.pow( T, 2 ) + c * Math.cos( f * T ) + s * Math.sin( f * T );
	M = to_radians( M ) % 180;

	// Eccentric anomaly
	E = approximate_E( e, M );

	// Heliocentric coordinates
	x = a * ( Math.cos( E ) - e );
	y = a * Math.sqrt( 1 - Math.pow( e, 2 ) ) * Math.sin( E );
	z = 0;

	// TODO: Figure out how to adjust to a system
	// where two or more stars are the 'heliocentric'
	// coordinate center, like binary systems

	dimensions = {
		'x': x,
		'y': y,
		'z': y
	}
	return dimensions;
};
