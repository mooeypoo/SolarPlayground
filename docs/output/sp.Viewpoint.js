Ext.data.JsonP.sp_Viewpoint({"tagname":"class","name":"sp.Viewpoint","autodetected":{},"files":[{"filename":"sp.Viewpoint.js","href":"sp.Viewpoint.html#sp-Viewpoint"}],"mixins":["OO.EventEmitter"],"params":[{"tagname":"params","type":"Object","name":"config","optional":true,"doc":"<p>Configuration object</p>\n","html_type":"Object"}],"members":[{"name":"getCoordinates","tagname":"method","owner":"sp.Viewpoint","id":"method-getCoordinates","meta":{}},{"name":"getRadius","tagname":"method","owner":"sp.Viewpoint","id":"method-getRadius","meta":{}},{"name":"setPOV","tagname":"method","owner":"sp.Viewpoint","id":"method-setPOV","meta":{}},{"name":"setRadiiList","tagname":"method","owner":"sp.Viewpoint","id":"method-setRadiiList","meta":{}},{"name":"changePOV","tagname":"event","owner":"sp.Viewpoint","id":"event-changePOV","meta":{}}],"alternateClassNames":[],"aliases":{},"id":"class-sp.Viewpoint","short_doc":"Solar Playground viewpoint controller. ...","component":false,"superclasses":[],"subclasses":[],"mixedInto":[],"parentMixins":[],"requires":[],"uses":[],"html":"<div><pre class=\"hierarchy\"><h4>Mixins</h4><div class='dependency'>OO.EventEmitter</div><h4>Files</h4><div class='dependency'><a href='source/sp.Viewpoint.html#sp-Viewpoint' target='_blank'>sp.Viewpoint.js</a></div></pre><div class='doc-contents'><p>Solar Playground viewpoint controller.\nControls the presentation of the objects on the canvas.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>config</span> : Object (optional)<div class='sub-desc'><p>Configuration object</p>\n</div></li></ul></div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-getCoordinates' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='sp.Viewpoint'>sp.Viewpoint</span><br/><a href='source/sp.Viewpoint.html#sp-Viewpoint-method-getCoordinates' target='_blank' class='view-source'>view source</a></div><a href='#!/api/sp.Viewpoint-method-getCoordinates' class='name expandable'>getCoordinates</a>( <span class='pre'>spaceCoords</span> ) : Object<span class=\"signature\"></span></div><div class='description'><div class='short'>Translate between space coordinates and viewpoint coordinates\non the canvas. ...</div><div class='long'><p>Translate between space coordinates and viewpoint coordinates\non the canvas.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>spaceCoords</span> : Object<div class='sub-desc'><p>Original 3D space coordinates</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Object</span><div class='sub-desc'><p>Canvas 2d coordinates</p>\n</div></li></ul></div></div></div><div id='method-getRadius' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='sp.Viewpoint'>sp.Viewpoint</span><br/><a href='source/sp.Viewpoint.html#sp-Viewpoint-method-getRadius' target='_blank' class='view-source'>view source</a></div><a href='#!/api/sp.Viewpoint-method-getRadius' class='name expandable'>getRadius</a>( <span class='pre'>orig_radius</span> ) : number<span class=\"signature\"></span></div><div class='description'><div class='short'>Translate between the original radius and the canvas radius in pixels ...</div><div class='long'><p>Translate between the original radius and the canvas radius in pixels</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>orig_radius</span> : number<div class='sub-desc'><p>Object's original radius</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>number</span><div class='sub-desc'><p>Actual radius in pixels</p>\n</div></li></ul></div></div></div><div id='method-setPOV' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='sp.Viewpoint'>sp.Viewpoint</span><br/><a href='source/sp.Viewpoint.html#sp-Viewpoint-method-setPOV' target='_blank' class='view-source'>view source</a></div><a href='#!/api/sp.Viewpoint-method-setPOV' class='name expandable'>setPOV</a>( <span class='pre'>pov_coords</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Set the coordinates of the current POV object ...</div><div class='long'><p>Set the coordinates of the current POV object</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>pov_coords</span> : Object<div class='sub-desc'><p>The 3d coordinates of the current POV</p>\n</div></li></ul><h3 class='pa'>Fires</h3><ul><li><a href=\"#!/api/sp.Viewpoint-event-changePOV\" rel=\"sp.Viewpoint-event-changePOV\" class=\"docClass\">changePOV</a></li></ul></div></div></div><div id='method-setRadiiList' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='sp.Viewpoint'>sp.Viewpoint</span><br/><a href='source/sp.Viewpoint.html#sp-Viewpoint-method-setRadiiList' target='_blank' class='view-source'>view source</a></div><a href='#!/api/sp.Viewpoint-method-setRadiiList' class='name expandable'>setRadiiList</a>( <span class='pre'>rList</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Calculate radius size steps from a new radii list ...</div><div class='long'><p>Calculate radius size steps from a new radii list</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>rList</span> : Object<div class='sub-desc'><p>Actual size radii of all celestial objects\ndivided into 'stars' and 'planets' to distinguish relative sizes better</p>\n</div></li></ul></div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-event'>Events</h3><div class='subsection'><div id='event-changePOV' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='sp.Viewpoint'>sp.Viewpoint</span><br/><a href='source/sp.Viewpoint.html#sp-Viewpoint-event-changePOV' target='_blank' class='view-source'>view source</a></div><a href='#!/api/sp.Viewpoint-event-changePOV' class='name expandable'>changePOV</a>( <span class='pre'>New</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Change of the POV coordinates in space ...</div><div class='long'><p>Change of the POV coordinates in space</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>New</span> : Object<div class='sub-desc'><p>space coordinates of the POV</p>\n</div></li></ul></div></div></div></div></div></div></div>","meta":{}});