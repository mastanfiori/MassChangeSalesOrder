/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([],function(){"use strict";var f={formatFlag:function(F){if(F===false){this.getParent().addStyleClass("sapUiLargeMarginBegin");return F;}else{return F;}},formatDate:function(d){var a="";var D=sap.ui.core.format.DateFormat.getDateInstance();if(!d){a="";}else if(typeof d==="object"){a=D.format(d,true);}else if(typeof d==="string"){var j=new Date(parseInt(d.substr(6),10));a=D.format(j,true);}return a;},displayReadOnlyData:function(u,v,V){if(typeof V!=="undefined"&&V!==""){v=V+" ("+v+")";}if(u===false){return v;}else{return"";}}};return f;},true);
