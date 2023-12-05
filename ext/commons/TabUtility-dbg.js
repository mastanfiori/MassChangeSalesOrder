/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
		"sap/ui/base/Object",
		"sap/ui/core/Fragment",
		"cus/sd/so/mccs1/ext/commons/constants"
	],
	function (Object, Fragment, constants) {
		"use strict";
		var instance;
		var tabutility = Object.extend("cus.sd.sa.mccs1.ext.commons.TabUtility", {
			constructor: function () {
				this._selectOption = "";
				//string
				this._filters = "";
				this._exclusionList = [];
				this._submitDialog = null;
			},
			clear: function () {
				this.setSelectOption("");
				this._exclusionList = [];
			},
			getExclusionList: function () {
				return this._exclusionList;
			},
			updateExlusionList: function (oSelChangeItem, selected) {
				//	if (!this._exclusionList.length) {
				//		return;
				//	}
				if (selected) {
					var iItemIndex = this._exclusionList.indexOf(oSelChangeItem);
					this._exclusionList[iItemIndex] = this._exclusionList[(this._exclusionList.length) - 1];
					this._exclusionList.pop();
				} else {
					this._exclusionList.push(oSelChangeItem);
				}
			},
			setExclusionList: function (exclusionList) {
				this._exclusionList = exclusionList;
			},
			getSelectOption: function () {
				return this._selectOption;
			},
			setSelectOption: function (sOption) {
				this._selectOption = sOption;
			},
			getExtensionApi: function () {
				return this._extensionApi;
			},
			setExtenionApi: function (oExtension) {
				this._extensionApi = oExtension;
			},
			getEntityLevel: function () {
				var tab = this._extensionApi.getQuickVariantSelectionKey();
				// var tab = selectedTab;
				if (tab === constants.ID.SALES_ORDER_TAB) {
					return constants.ENTITY_LEVEL.IF_SALES_ORDER;
				} else if (tab === constants.ID.SALES_ORDER_ITEMS_TAB) {
					return constants.ENTITY_LEVEL.IF_SALES_ORDER_ITEMS;
				} else {
					return constants.ENTITY_LEVEL.IF_SCHEDULE_LINES;
				}
			},
			getEntitySet: function () {
				var tab = this._extensionApi.getQuickVariantSelectionKey();
				var sEntitySet = null;
				if (tab === constants.ID.SALES_ORDER_TAB) {
					sEntitySet = constants.ODATA.ENTITYSET.MC_SALES_ORDER;
				} else if (tab === constants.ID.SALES_ORDER_ITEMS_TAB) {
					sEntitySet = constants.ODATA.ENTITYSET.MC_SALES_ORDER_ITEM;
				}
				return sEntitySet;
			},
			getTabSelected: function () {
				return this._extensionApi.getQuickVariantSelectionKey();
			},
			getSelectedContext: function () {
				var sOption = this.getSelectOption();
				if (sOption === constants.ROW_SELECTION_CASE.IF_INCLUSION) {
					return this._extensionApi.getSelectedContexts();
				} else if (sOption === constants.ROW_SELECTION_CASE.IF_SELECT_ALL) {
					return [];
				}
				//eclusion case
				return this.getExclusionList();
			},
			setExtensionApi: function (extensionApi) {
				this._extensionApi = extensionApi;
			},
			//for filters
			setFilters: function (sFilter) {
				this._filters = sFilter;
			},
			getFilters: function (sFilter) {
				return this._filters;
			},
			setFilterAndSearchParams: function (sUrl) {
 				var sFilterAndSearch = "";
 				var arr = sUrl.match(/\?([^ ]+)$/);
 				if (arr) {
 					sFilterAndSearch = arr[0];
 				} else {
 					sFilterAndSearch = "";
 				}
 				this._sFilterAndSearch = sFilterAndSearch;
 			},
 			getFilterAndSearchParams: function () {
 				return this._sFilterAndSearch;
 			}
		});
		return {
			getInstance: function () {
				if (!instance) {
					instance = new tabutility();
				}
				return instance;
			}
		};
	});