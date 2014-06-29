Ext.data.JsonP.sp_ui_ext_ooui_Mod_Play({"tagname":"class","name":"sp.ui.ext.ooui.Mod.Play","autodetected":{},"files":[{"filename":"sp.ui.ext.ooui.Mod.Play.js","href":"sp.ui.ext.ooui.Mod.Play.html#sp-ui-ext-ooui-Mod-Play"}],"params":[{"tagname":"params","type":"sp.Container","name":"container","doc":"<p>The container to attach the GUI to</p>\n","html_type":"<a href=\"#!/api/sp.Container\" rel=\"sp.Container\" class=\"docClass\">sp.Container</a>"},{"tagname":"params","type":"Object","name":"config","optional":true,"doc":"<p>Gui module definition</p>\n","html_type":"Object"}],"members":[{"name":"toolbarGroups","tagname":"property","owner":"sp.ui.ext.ooui.Mod.Play","id":"property-toolbarGroups","meta":{}},{"name":"addToPOVList","tagname":"method","owner":"sp.ui.ext.ooui.Mod.Play","id":"method-addToPOVList","meta":{}},{"name":"createPOVTool","tagname":"method","owner":"sp.ui.ext.ooui.Mod.Play","id":"method-createPOVTool","meta":{}},{"name":"getToolbar","tagname":"method","owner":"sp.ui.ext.ooui.Mod.Play","id":"method-getToolbar","meta":{}},{"name":"initialize","tagname":"method","owner":"sp.ui.ext.ooui.Mod.Play","id":"method-initialize","meta":{"chainable":true}},{"name":"onScenarioChanged","tagname":"method","owner":"sp.ui.ext.ooui.Mod.Play","id":"method-onScenarioChanged","meta":{}},{"name":"onScenarioLoaded","tagname":"method","owner":"sp.ui.ext.ooui.Mod.Play","id":"method-onScenarioLoaded","meta":{}},{"name":"play","tagname":"event","owner":"sp.ui.ext.ooui.Mod.Play","id":"event-play","meta":{}},{"name":"pov","tagname":"event","owner":"sp.ui.ext.ooui.Mod.Play","id":"event-pov","meta":{}},{"name":"zoom","tagname":"event","owner":"sp.ui.ext.ooui.Mod.Play","id":"event-zoom","meta":{}}],"alternateClassNames":[],"aliases":{},"id":"class-sp.ui.ext.ooui.Mod.Play","short_doc":"OOUI Gui module ...","component":false,"superclasses":[],"subclasses":[],"mixedInto":[],"mixins":[],"parentMixins":[],"requires":[],"uses":[],"html":"<div><pre class=\"hierarchy\"><h4>Files</h4><div class='dependency'><a href='source/sp.ui.ext.ooui.Mod.Play.html#sp-ui-ext-ooui-Mod-Play' target='_blank'>sp.ui.ext.ooui.Mod.Play.js</a></div></pre><div class='doc-contents'><p>OOUI Gui module</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>container</span> : <a href=\"#!/api/sp.Container\" rel=\"sp.Container\" class=\"docClass\">sp.Container</a><div class='sub-desc'><p>The container to attach the GUI to</p>\n</div></li><li><span class='pre'>config</span> : Object (optional)<div class='sub-desc'><p>Gui module definition</p>\n</div></li></ul></div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-property'>Properties</h3><div class='subsection'><div id='property-toolbarGroups' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='sp.ui.ext.ooui.Mod.Play'>sp.ui.ext.ooui.Mod.Play</span><br/><a href='source/sp.ui.ext.ooui.Mod.Play.html#sp-ui-ext-ooui-Mod-Play-property-toolbarGroups' target='_blank' class='view-source'>view source</a></div><a href='#!/api/sp.ui.ext.ooui.Mod.Play-property-toolbarGroups' class='name expandable'>toolbarGroups</a> : Array<span class=\"signature\"></span></div><div class='description'><div class='short'>Define toolbar groups for OOUI ...</div><div class='long'><p>Define toolbar groups for OOUI</p>\n<p>Defaults to: <code>[{&#39;type&#39;: &#39;bar&#39;, &#39;include&#39;: [{&#39;group&#39;: &#39;playTools&#39;}]}, {&#39;type&#39;: &#39;menu&#39;, &#39;indicator&#39;: &#39;down&#39;, &#39;label&#39;: &#39;POV&#39;, &#39;icon&#39;: &#39;picture&#39;, &#39;include&#39;: [{&#39;group&#39;: &#39;povTools&#39;}]}, {&#39;type&#39;: &#39;bar&#39;, &#39;include&#39;: [{&#39;group&#39;: &#39;zoomTools&#39;}]}, {&#39;type&#39;: &#39;bar&#39;, &#39;include&#39;: [{&#39;group&#39;: &#39;viewTools&#39;}]}]</code></p></div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-addToPOVList' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='sp.ui.ext.ooui.Mod.Play'>sp.ui.ext.ooui.Mod.Play</span><br/><a href='source/sp.ui.ext.ooui.Mod.Play.html#sp-ui-ext-ooui-Mod-Play-method-addToPOVList' target='_blank' class='view-source'>view source</a></div><a href='#!/api/sp.ui.ext.ooui.Mod.Play-method-addToPOVList' class='name expandable'>addToPOVList</a>( <span class='pre'>name, title, [icon]</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Add a tool to the POV list ...</div><div class='long'><p>Add a tool to the POV list</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>name</span> : string<div class='sub-desc'><p>Tool name</p>\n</div></li><li><span class='pre'>title</span> : string<div class='sub-desc'><p>Title or alternate text</p>\n</div></li><li><span class='pre'>icon</span> : string (optional)<div class='sub-desc'><p>Tool icon</p>\n</div></li></ul></div></div></div><div id='method-createPOVTool' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='sp.ui.ext.ooui.Mod.Play'>sp.ui.ext.ooui.Mod.Play</span><br/><a href='source/sp.ui.ext.ooui.Mod.Play.html#sp-ui-ext-ooui-Mod-Play-method-createPOVTool' target='_blank' class='view-source'>view source</a></div><a href='#!/api/sp.ui.ext.ooui.Mod.Play-method-createPOVTool' class='name expandable'>createPOVTool</a>( <span class='pre'>name, icon, title</span> ) : <a href=\"#!/api/sp.ui.ext.ooui.POVTool\" rel=\"sp.ui.ext.ooui.POVTool\" class=\"docClass\">sp.ui.ext.ooui.POVTool</a><span class=\"signature\"></span></div><div class='description'><div class='short'>Create a POV tool ...</div><div class='long'><p>Create a POV tool</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>name</span> : string<div class='sub-desc'><p>Tool name</p>\n</div></li><li><span class='pre'>icon</span> : string<div class='sub-desc'><p>Tool icon</p>\n</div></li><li><span class='pre'>title</span> : string<div class='sub-desc'><p>Title or alternate text</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'><a href=\"#!/api/sp.ui.ext.ooui.POVTool\" rel=\"sp.ui.ext.ooui.POVTool\" class=\"docClass\">sp.ui.ext.ooui.POVTool</a></span><div class='sub-desc'><p>Tool</p>\n</div></li></ul></div></div></div><div id='method-getToolbar' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='sp.ui.ext.ooui.Mod.Play'>sp.ui.ext.ooui.Mod.Play</span><br/><a href='source/sp.ui.ext.ooui.Mod.Play.html#sp-ui-ext-ooui-Mod-Play-method-getToolbar' target='_blank' class='view-source'>view source</a></div><a href='#!/api/sp.ui.ext.ooui.Mod.Play-method-getToolbar' class='name expandable'>getToolbar</a>( <span class='pre'></span> ) : OO.ui.Toolbar<span class=\"signature\"></span></div><div class='description'><div class='short'>Get the Gui toolbar ...</div><div class='long'><p>Get the Gui toolbar</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>OO.ui.Toolbar</span><div class='sub-desc'><p>The toolbar connected to the gui</p>\n</div></li></ul></div></div></div><div id='method-initialize' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='sp.ui.ext.ooui.Mod.Play'>sp.ui.ext.ooui.Mod.Play</span><br/><a href='source/sp.ui.ext.ooui.Mod.Play.html#sp-ui-ext-ooui-Mod-Play-method-initialize' target='_blank' class='view-source'>view source</a></div><a href='#!/api/sp.ui.ext.ooui.Mod.Play-method-initialize' class='name expandable'>initialize</a>( <span class='pre'></span> ) : OO.ui.Toolbar<span class=\"signature\"><span class='chainable' >chainable</span></span></div><div class='description'><div class='short'>Initialize the Gui ...</div><div class='long'><p>Initialize the Gui</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>OO.ui.Toolbar</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-onScenarioChanged' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='sp.ui.ext.ooui.Mod.Play'>sp.ui.ext.ooui.Mod.Play</span><br/><a href='source/sp.ui.ext.ooui.Mod.Play.html#sp-ui-ext-ooui-Mod-Play-method-onScenarioChanged' target='_blank' class='view-source'>view source</a></div><a href='#!/api/sp.ui.ext.ooui.Mod.Play-method-onScenarioChanged' class='name expandable'>onScenarioChanged</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Respond to change in scenario state ...</div><div class='long'><p>Respond to change in scenario state</p>\n<h3 class='pa'>Fires</h3><ul><li>updateState</li></ul></div></div></div><div id='method-onScenarioLoaded' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='sp.ui.ext.ooui.Mod.Play'>sp.ui.ext.ooui.Mod.Play</span><br/><a href='source/sp.ui.ext.ooui.Mod.Play.html#sp-ui-ext-ooui-Mod-Play-method-onScenarioLoaded' target='_blank' class='view-source'>view source</a></div><a href='#!/api/sp.ui.ext.ooui.Mod.Play-method-onScenarioLoaded' class='name expandable'>onScenarioLoaded</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Respond to new scenario loaded ...</div><div class='long'><p>Respond to new scenario loaded</p>\n<h3 class='pa'>Fires</h3><ul><li>updateState</li></ul></div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-event'>Events</h3><div class='subsection'><div id='event-play' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='sp.ui.ext.ooui.Mod.Play'>sp.ui.ext.ooui.Mod.Play</span><br/><a href='source/sp.ui.ext.ooui.Mod.Play.html#sp-ui-ext-ooui-Mod-Play-event-play' target='_blank' class='view-source'>view source</a></div><a href='#!/api/sp.ui.ext.ooui.Mod.Play-event-play' class='name expandable'>play</a>( <span class='pre'>isPlay</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Play or pause scenario ...</div><div class='long'><p>Play or pause scenario</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>isPlay</span> : boolean<div class='sub-desc'><p>Play scenario or pause</p>\n</div></li></ul></div></div></div><div id='event-pov' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='sp.ui.ext.ooui.Mod.Play'>sp.ui.ext.ooui.Mod.Play</span><br/><a href='source/sp.ui.ext.ooui.Mod.Play.html#sp-ui-ext-ooui-Mod-Play-event-pov' target='_blank' class='view-source'>view source</a></div><a href='#!/api/sp.ui.ext.ooui.Mod.Play-event-pov' class='name expandable'>pov</a>( <span class='pre'>povObjName</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Change point of view object ...</div><div class='long'><p>Change point of view object</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>povObjName</span> : string<div class='sub-desc'><p>New POV object name or key</p>\n</div></li></ul></div></div></div><div id='event-zoom' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='sp.ui.ext.ooui.Mod.Play'>sp.ui.ext.ooui.Mod.Play</span><br/><a href='source/sp.ui.ext.ooui.Mod.Play.html#sp-ui-ext-ooui-Mod-Play-event-zoom' target='_blank' class='view-source'>view source</a></div><a href='#!/api/sp.ui.ext.ooui.Mod.Play-event-zoom' class='name expandable'>zoom</a>( <span class='pre'>zoomLevel</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Zoom in or out ...</div><div class='long'><p>Zoom in or out</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>zoomLevel</span> : number<div class='sub-desc'><p>How much to zoom. Negative to zoom out.</p>\n</div></li></ul></div></div></div></div></div></div></div>","meta":{}});