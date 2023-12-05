/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"cus/sd/so/mccs1/ext/commons/ObjectPageDetailsBase",
	"cus/sd/so/mccs1/ext/commons/constants"
], function (ObjectPageDetailsBase, constants) {
	"use strict";
	return ObjectPageDetailsBase.extend("cus.sd.so.mccs1.ext.salesorderdetails.controller.SalesOrderDetails", { 
		onInit: function () {
			ObjectPageDetailsBase.prototype.onInit.apply(this, arguments);

			var oRouter = this.getOwnerComponent().getRouter();
			var oTarget = oRouter.getTarget("salesOrderDetails");
			//implementation is at base level
			oTarget.attachDisplay(this.onTargetMatched.bind(this));
		},
		getActionId: function () {
			return constants.MENU_ITEMS.CHANGE_ACTION.HEADER_DATA;
		},
		getActionDescription: function () {
			return this.getView().getModel("i18n").getResourceBundle().getText("headerDataDescription");
		},
		/*getObjectPageJsonPath: function () {
			var sObjectPageJSON = jQuery.sap.getModulePath("cus.sd.so.mccs1", "/ext/salesorderdetails/model/objectPageJSON.json");
			return sObjectPageJSON;
		},*/
		getSelectAttributes: function () {
			return constants.SELECT_QUERY.SALESORDER;
		},
		getAllEditableSmartFields: function () {
			return sap.ui.getCore().byFieldGroupId(constants.SMART_FIELD.HEADER_ID);
		},
		getSmartFieldId: function () {
			return constants.SMART_FIELD.HEADER_ID;
		},
		setSelectedSubSection: function () {
			this.oObjectPageLayout = this.getView().byId("SalesOrderDetailsID");
			this.oHdrBasicDataObjPgSctn = this.getView().byId("soHeaderBasicDataObjPgSctn");
			this.oObjectPageLayout.setSelectedSection(this.oHdrBasicDataObjPgSctn.getId());
		},
		getCustomFieldGroupControl: function ()
		{
			return this.getView().byId("headerCustomFieldGroupId");	
		}
	});
});
