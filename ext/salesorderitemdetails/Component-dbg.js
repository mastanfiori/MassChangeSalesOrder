/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/suite/ui/generic/template/extensionAPI/ReuseComponentSupport",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/BusyIndicator"
], function (UIComponent, ReuseComponentSupport, JSONModel, BusyIndicator) {
	"use strict";

	/* Private static methods used in the domain specific logic of this reuse component */

	/* Definition of the reuse component */
	return UIComponent.extend("cus.sd.so.mccs1.ext.salesorderitemdetails.Component", {
		metadata: {
			"manifest": "json"
		},

		_stateModel: null,
		init: function () {
			UIComponent.prototype.init.apply(this, arguments);
			ReuseComponentSupport.mixInto(this, "component", true);
			this._stateModel = new JSONModel();
			this.loadStateModel();
			this.getRouter().initialize();
		},
		loadStateModel: function () {
			//implementation is in child class
			this._stateModel.loadData(this.getObjectPageJsonPath());
			this.setModel(this._stateModel, "stateModel");
		},
		getObjectPageJsonPath: function () {
			var sObjectPageJSON = jQuery.sap.getModulePath("cus.sd.so.mccs1", "/ext/salesorderitemdetails/model/objectPageJSON.json");
			return sObjectPageJSON;
		},
		//this is life cycle event called when there is a change in the context,
		//in our case it will be triggered only once as we are not setting any context
		stStart: function (oModel, oBindingContext, oExtensionAPI) {
			BusyIndicator.show(0);
			oExtensionAPI.attachPageDataLoaded(this._showItemDetails.bind(this));
			this.getRouter().getTargets().display("salesOrderItemDetails");
		},
		//this logic works as refresh and will be triggered evrytime we navigate to this page
		_showItemDetails: function () {
			BusyIndicator.show(0);
			this.getRouter().getTargets().display("salesOrderItemDetails");
		}

	});
});