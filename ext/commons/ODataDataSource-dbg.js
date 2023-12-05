/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define(["sap/ui/base/EventProvider",
	"sap/ui/model/odata/v2/ODataModel",
	"cus/sd/so/mccs1/ext/commons/constants"
], function (EventProvider, ODataModel, constants) {

	return EventProvider.extend("cus.sd.so.mccs1.ext.commons.ODataDataSource", {
		constructor: function (oDataModel) {
			this._oDataModel = oDataModel;
		},
		getServiceModel: function () {
			return this._oDataModel;
		},
		readActionMenuItems: function (aActionFilter, sActionType, oButtonSource) {
			var oDataModel = this.getServiceModel();
			return new Promise(function (resolve, reject) {
				oDataModel.read("/SlsDocActy", {
					filters: aActionFilter,
					urlParameters: {
						"$select": constants.ODATA.URL_PARAMS.SALES_DOC_MC_ACTION_DESC + "," + constants.ODATA.URL_PARAMS.SALES_DOC_MC_ACTION_ID +
							"," + constants.ACTION_CATEGORY.NAME + "," + constants.DB_FIELD_NAMES.NAME
					},
					success: resolve,
					error: function () {
						var i18nBundle = this.getOwnerComponent().getModel("@i18n").getResourceBundle();
						sap.m.MessageToast.show(i18nBundle.getText("actionMenuLoadFailed"));
						reject();
					}
				});
			});
		},
		getPartnerFilterData: function (aFilters) {
			var oDataModel = this.getServiceModel();
			return new Promise(function (resolve, reject) {
				oDataModel.read("/C_NonStdPartFuncBySlsDocCatVH", {
					filters: aFilters,
					success: resolve,
					error: reject
				});
			});
		}
	});

});