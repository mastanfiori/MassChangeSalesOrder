/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define(["sap/ui/base/Object","sap/ui/core/Fragment","cus/sd/so/mccs1/ext/commons/constants"],function(O,F,c){"use strict";var i;var t=O.extend("cus.sd.sa.mccs1.ext.commons.TabUtility",{constructor:function(){this._selectOption="";this._filters="";this._exclusionList=[];this._submitDialog=null;},clear:function(){this.setSelectOption("");this._exclusionList=[];},getExclusionList:function(){return this._exclusionList;},updateExlusionList:function(s,a){if(a){var I=this._exclusionList.indexOf(s);this._exclusionList[I]=this._exclusionList[(this._exclusionList.length)-1];this._exclusionList.pop();}else{this._exclusionList.push(s);}},setExclusionList:function(e){this._exclusionList=e;},getSelectOption:function(){return this._selectOption;},setSelectOption:function(o){this._selectOption=o;},getExtensionApi:function(){return this._extensionApi;},setExtenionApi:function(e){this._extensionApi=e;},getEntityLevel:function(){var a=this._extensionApi.getQuickVariantSelectionKey();if(a===c.ID.SALES_ORDER_TAB){return c.ENTITY_LEVEL.IF_SALES_ORDER;}else if(a===c.ID.SALES_ORDER_ITEMS_TAB){return c.ENTITY_LEVEL.IF_SALES_ORDER_ITEMS;}else{return c.ENTITY_LEVEL.IF_SCHEDULE_LINES;}},getEntitySet:function(){var a=this._extensionApi.getQuickVariantSelectionKey();var e=null;if(a===c.ID.SALES_ORDER_TAB){e=c.ODATA.ENTITYSET.MC_SALES_ORDER;}else if(a===c.ID.SALES_ORDER_ITEMS_TAB){e=c.ODATA.ENTITYSET.MC_SALES_ORDER_ITEM;}return e;},getTabSelected:function(){return this._extensionApi.getQuickVariantSelectionKey();},getSelectedContext:function(){var o=this.getSelectOption();if(o===c.ROW_SELECTION_CASE.IF_INCLUSION){return this._extensionApi.getSelectedContexts();}else if(o===c.ROW_SELECTION_CASE.IF_SELECT_ALL){return[];}return this.getExclusionList();},setExtensionApi:function(e){this._extensionApi=e;},setFilters:function(f){this._filters=f;},getFilters:function(f){return this._filters;},setFilterAndSearchParams:function(u){var f="";var a=u.match(/\?([^ ]+)$/);if(a){f=a[0];}else{f="";}this._sFilterAndSearch=f;},getFilterAndSearchParams:function(){return this._sFilterAndSearch;}});return{getInstance:function(){if(!i){i=new t();}return i;}};});
