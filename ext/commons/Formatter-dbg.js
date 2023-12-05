/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([], function () {
	"use strict";
	var oFormatter = {
		formatFlag: function (sFlag) {
			if (sFlag === false) {
				this.getParent().addStyleClass("sapUiLargeMarginBegin");
				return sFlag;
			} else {
				return sFlag;
			}
		},
		formatDate: function (oDate) {
			var formattedValue = "";
			var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance();
			if (!oDate) {
				formattedValue = "";
			} else if (typeof oDate === "object") {
				formattedValue = oDateFormat.format(oDate, true);
			} else if (typeof oDate === "string") {
				var jsDate = new Date(parseInt(oDate.substr(6), 10));
				formattedValue = oDateFormat.format(jsDate, true);
			}
			return formattedValue;
		},
		displayReadOnlyData: function (bUICTFlag, sValue, sValueDesc) {
				if (typeof sValueDesc !== "undefined" && sValueDesc !== "") {
					sValue = sValueDesc + " (" + sValue + ")";
				}
				if (bUICTFlag === false) {
					return sValue;
				} else {
					return "";
				}
			}
		};
	return oFormatter;
}, true);
