Ext.data.JsonP.sp_calc_Calculator({"tagname":"class","name":"sp.calc.Calculator","autodetected":{},"files":[{"filename":"sp.calc.Calculator.js","href":"sp.calc.Calculator.html#sp-calc-Calculator"}],"params":[{"tagname":"params","type":"Object","name":"config","optional":true,"doc":"<p>Configuration object</p>\n","html_type":"Object"}],"members":[{"name":"constants","tagname":"property","owner":"sp.calc.Calculator","id":"property-constants","meta":{}},{"name":"","tagname":"method","owner":"sp.calc.Calculator","id":"method-","meta":{}},{"name":"getCenturies","tagname":"method","owner":"sp.calc.Calculator","id":"method-getCenturies","meta":{}},{"name":"getJDNTime","tagname":"method","owner":"sp.calc.Calculator","id":"method-getJDNTime","meta":{}},{"name":"solveKepler","tagname":"method","owner":"sp.calc.Calculator","id":"method-solveKepler","meta":{}},{"name":"translateTime","tagname":"method","owner":"sp.calc.Calculator","id":"method-translateTime","meta":{}}],"alternateClassNames":[],"aliases":{},"id":"class-sp.calc.Calculator","short_doc":"Scenario calculator ...","component":false,"superclasses":[],"subclasses":[],"mixedInto":[],"mixins":[],"parentMixins":[],"requires":[],"uses":[],"html":"<div><pre class=\"hierarchy\"><h4>Files</h4><div class='dependency'><a href='source/sp.calc.Calculator.html#sp-calc-Calculator' target='_blank'>sp.calc.Calculator.js</a></div></pre><div class='doc-contents'><p>Scenario calculator</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>config</span> : Object (optional)<div class='sub-desc'><p>Configuration object</p>\n</div></li></ul></div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-property'>Properties</h3><div class='subsection'><div id='property-constants' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='sp.calc.Calculator'>sp.calc.Calculator</span><br/><a href='source/sp.calc.Calculator.html#sp-calc-Calculator-property-constants' target='_blank' class='view-source'>view source</a></div><a href='#!/api/sp.calc.Calculator-property-constants' class='name expandable'>constants</a> : Object<span class=\"signature\"></span></div><div class='description'><div class='short'>Astronomical constants. ...</div><div class='long'><p>Astronomical constants. Mostly related to the solar\nsystem but also to other calculations.</p>\n</div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='sp.calc.Calculator'>sp.calc.Calculator</span><br/><a href='source/sp.calc.Calculator.html#sp-calc-Calculator-method-' target='_blank' class='view-source'>view source</a></div><a href='#!/api/sp.calc.Calculator-method-' class='name expandable'></a>( <span class='pre'>e, M</span> ) : number<span class=\"signature\"></span></div><div class='description'><div class='short'>Approximate the eccententric anomaly by iteration ...</div><div class='long'><p>Approximate the eccententric anomaly by iteration</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>e</span> : number<div class='sub-desc'><p>Eccentricity</p>\n</div></li><li><span class='pre'>M</span> : number<div class='sub-desc'><p>Mean anomaly</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>number</span><div class='sub-desc'><p>Eccentric anomaly in radians</p>\n</div></li></ul></div></div></div><div id='method-getCenturies' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='sp.calc.Calculator'>sp.calc.Calculator</span><br/><a href='source/sp.calc.Calculator.html#sp-calc-Calculator-method-getCenturies' target='_blank' class='view-source'>view source</a></div><a href='#!/api/sp.calc.Calculator-method-getCenturies' class='name expandable'>getCenturies</a>( <span class='pre'>year, [month], [day], [hours], [minutes], [seconds]</span> ) : number<span class=\"signature\"></span></div><div class='description'><div class='short'>Translate date to th enumber of centuries from J2000.0 ...</div><div class='long'><p>Translate date to th enumber of centuries from J2000.0</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>year</span> : number<div class='sub-desc'><p>Requested year (yyyy)</p>\n</div></li><li><span class='pre'>month</span> : number (optional)<div class='sub-desc'><p>Requested month</p>\n</div></li><li><span class='pre'>day</span> : number (optional)<div class='sub-desc'><p>Requested day of the month</p>\n</div></li><li><span class='pre'>hours</span> : number (optional)<div class='sub-desc'><p>Hour of the day in 24h format</p>\n</div></li><li><span class='pre'>minutes</span> : number (optional)<div class='sub-desc'><p>Minutes after the hour</p>\n</div></li><li><span class='pre'>seconds</span> : number (optional)<div class='sub-desc'><p>Seconds after the minute</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>number</span><div class='sub-desc'><p>Number of centuries from epoch J2000.0</p>\n</div></li></ul></div></div></div><div id='method-getJDNTime' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='sp.calc.Calculator'>sp.calc.Calculator</span><br/><a href='source/sp.calc.Calculator.html#sp-calc-Calculator-method-getJDNTime' target='_blank' class='view-source'>view source</a></div><a href='#!/api/sp.calc.Calculator-method-getJDNTime' class='name expandable'>getJDNTime</a>( <span class='pre'>year, month, day, [hours], [minutes], [seconds]</span> ) : number<span class=\"signature\"></span></div><div class='description'><div class='short'>Return a JDN (Julian Day Number) from J2000.0, converted from a Gregorian date and time ...</div><div class='long'><p>Return a JDN (Julian Day Number) from J2000.0, converted from a Gregorian date and time</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>year</span> : number<div class='sub-desc'><p>Requested year (yyyy)</p>\n</div></li><li><span class='pre'>month</span> : number<div class='sub-desc'><p>Requested month</p>\n</div></li><li><span class='pre'>day</span> : number<div class='sub-desc'><p>Requested day of the month</p>\n</div></li><li><span class='pre'>hours</span> : number (optional)<div class='sub-desc'><p>Hour of the day in 24h format</p>\n</div></li><li><span class='pre'>minutes</span> : number (optional)<div class='sub-desc'><p>Minutes after the hour</p>\n</div></li><li><span class='pre'>seconds</span> : number (optional)<div class='sub-desc'><p>Seconds after the minute</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>number</span><div class='sub-desc'><p>JDN, number of days from epoch J2000.0</p>\n</div></li></ul></div></div></div><div id='method-solveKepler' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='sp.calc.Calculator'>sp.calc.Calculator</span><br/><a href='source/sp.calc.Calculator.html#sp-calc-Calculator-method-solveKepler' target='_blank' class='view-source'>view source</a></div><a href='#!/api/sp.calc.Calculator-method-solveKepler' class='name expandable'>solveKepler</a>( <span class='pre'>vars, [jd]</span> ) : Object<span class=\"signature\"></span></div><div class='description'><div class='short'>Solve the Kepler equation for the given parameters to get the object's\nposition in space. ...</div><div class='long'><p>Solve the Kepler equation for the given parameters to get the object's\nposition in space. This position is raw heliocentric space coordiates</p>\n\n<p>Calculation taken from NASA JPL Formula:\nhttp://ssd.jpl.nasa.gov/?planet_pos\nAnd\nhttps://gist.github.com/bartolsthoorn/7913357</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>vars</span> : Object<div class='sub-desc'><p>Variables necessary for calculation.</p>\n<ul><li><span class='pre'>a</span> : number[]<div class='sub-desc'><p>Semi-major axis (au and au/cy)</p>\n</div></li><li><span class='pre'>e</span> : number[]<div class='sub-desc'><p>Eccentricity ( no units and no units/cy)</p>\n</div></li><li><span class='pre'>I</span> : number[]<div class='sub-desc'><p>Inclination (degrees and degrees/cy)</p>\n</div></li><li><span class='pre'>L</span> : number[]<div class='sub-desc'><p>Mean longitude (degrees and degrees/cy)</p>\n</div></li><li><span class='pre'>long_peri</span> : number[]<div class='sub-desc'><p>Longitude of perihelion (degree and degrees/cy)</p>\n</div></li><li><span class='pre'>long_node</span> : number[]<div class='sub-desc'><p>Longitude of the ascending node (degrees and degrees/cy)</p>\n</div></li></ul></div></li><li><span class='pre'>jd</span> : number (optional)<div class='sub-desc'><p>Julian Days from J2000.0. If not given, calculated for J2000.0</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Object</span><div class='sub-desc'><p>Three-dimensional position in space, values in km</p>\n</div></li></ul></div></div></div><div id='method-translateTime' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='sp.calc.Calculator'>sp.calc.Calculator</span><br/><a href='source/sp.calc.Calculator.html#sp-calc-Calculator-method-translateTime' target='_blank' class='view-source'>view source</a></div><a href='#!/api/sp.calc.Calculator-method-translateTime' class='name expandable'>translateTime</a>( <span class='pre'>year, month, day, time_of_day</span> ) : number<span class=\"signature\"></span></div><div class='description'><div class='short'>Calculate the absolute time needed for proper calculations. ...</div><div class='long'><p>Calculate the absolute time needed for proper calculations.\nIn our case, it is the number of days from 1999 Dec 31, 0:00 UT</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>year</span> : number<div class='sub-desc'><p>Requested year (YYYY)</p>\n</div></li><li><span class='pre'>month</span> : number<div class='sub-desc'><p>Requested month</p>\n</div></li><li><span class='pre'>day</span> : number<div class='sub-desc'><p>Requested day of the month</p>\n</div></li><li><span class='pre'>time_of_day</span> : number<div class='sub-desc'><p>Time of day in decimals 0-24</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>number</span><div class='sub-desc'><p>The decimal number of days from 1999 Dec 31, 0:00 UT</p>\n</div></li></ul></div></div></div></div></div></div></div>","meta":{}});