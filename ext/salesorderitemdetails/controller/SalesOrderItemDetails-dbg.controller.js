/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"cus/sd/so/mccs1/ext/commons/ObjectPageDetailsBase",
	"cus/sd/so/mccs1/ext/commons/constants"
], function (ObjectPageDetailsBase, constants) {
	"use strict";
	return ObjectPageDetailsBase.extend("cus.sd.so.mccs1.ext.salesorderitemdetails.controller.SalesOrderItemDetails", {
		onInit: function () {
			ObjectPageDetailsBase.prototype.onInit.apply(this, arguments);

			var oRouter = this.getOwnerComponent().getRouter();
			var oTarget = oRouter.getTarget("salesOrderItemDetails");
			//implementation is at base level
			oTarget.attachDisplay(this.onTargetMatched.bind(this));
		},
		getActionId: function () {
			return constants.MENU_ITEMS.CHANGE_ACTION.ITEM_DATA;
		},
		getActionDescription: function () {
			return this.getView().getModel("i18n").getResourceBundle().getText("itemDataDescription");
		},
		/*getObjectPageJsonPath: function () {
			var sObjectPageJSON = jQuery.sap.getModulePath("cus.sd.so.mccs1", "/ext/salesorderitemdetails/model/objectPageJSON.json");
			return sObjectPageJSON;
		},*/
		getSelectAttributes: function () {
			return constants.SELECT_QUERY.SALESORDERITEM;
		},
		getAllEditableSmartFields: function () {
			return sap.ui.getCore().byFieldGroupId(constants.SMART_FIELD.ITEM_ID);
		},
		getSmartFieldId: function () {
			return constants.SMART_FIELD.HEADER_ID;
		},
		setSelectedSubSection: function () {
			this.oObjectPageLayout = this.getView().byId("SalesOrderItemDetailsID");
			this.oHdrBasicDataObjPgSctn = this.getView().byId("soItemBasicDataObjPgSctn");
			this.oObjectPageLayout.setSelectedSection(this.oHdrBasicDataObjPgSctn.getId());
		},
		getCustomFieldGroupControl: function ()
		{
			return this.getView().byId("itemCustomFieldGroupId");	
		}

	});
});