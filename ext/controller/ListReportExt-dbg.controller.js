/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"sap/m/MessageToast",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/core/Fragment",
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/Popup",
	"cus/sd/so/mccs1/ext/commons/TabUtility",
	"cus/sd/so/mccs1/ext/commons/ODataDataSource",
	"cus/sd/so/mccs1/ext/commons/constants"
], function (MessageToast, JSONModel, MessageBox, Filter, FilterOperator, Fragment, Controller, Popup, TabUtility, ODataDataSource,
	constants) {
	"use strict";
	return sap.ui.controller("cus.sd.so.mccs1.ext.controller.ListReportExt", {
		_tabUtility: null,
		_ODataDataSource: null,
		_massChgActionsComponent: null,
		_quickViewComponent: null,
		_partnerInfoPopup: null,
		_actionChangeMenu: null,
		_actionCheckMenu: null,
		_actionCreateMenu: null,
		_selectAllFlag: false,
		_actionFragments: {},
		onInit: function () {
			this._tabUtility = TabUtility.getInstance();
			this._actionFragments = {};
			this._tabUtility.setExtensionApi(this.extensionAPI);
			this._ODataDataSource = new ODataDataSource(this.getOwnerComponent().getModel());
			this.getView().byId("listReport-_tab1").setIgnoreFromPersonalisation(constants.IGNORE_FIELDS_LIST.SALESORDER);
			this.getView().byId("listReport-_tab2").setIgnoreFromPersonalisation(constants.IGNORE_FIELDS_LIST.SALESORDERITEM);
			try {
				this._massChgActionsComponent = sap.ui.getCore().createComponent({
					name: "cus.sd.libmccs1.components.actions",
					settings: {
						extensionAPI: this.extensionAPI,
						model: this.getOwnerComponent().getModel()
					}
				});
				this._quickViewComponent = sap.ui.getCore().createComponent({
					name: "cus.sd.libmccs1.components.quickview",
					settings: {
						model: this.getOwnerComponent().getModel()
					}
				});
			} catch (error) {}
			this.getOwnerComponent().getModel().attachBatchRequestCompleted(this._batchRequestedComplete.bind(this));
			var oSmFilter = this.getView().byId("listReportFilter");
			oSmFilter.attachFilterChange(this.onFilterValueChange.bind(this));
			//Dropdown icon on action buttons
			// this.getView().byId(constants.ACTIONBTNID.CHGICONHDR).setIcon("sap-icon://slim-arrow-down");
			// this.getView().byId(constants.ACTIONBTNID.CHGICONHDR).setProperty("iconFirst", false);
			// this.getView().byId(constants.ACTIONBTNID.CHKICONHDR).setIcon("sap-icon://slim-arrow-down");
			// this.getView().byId(constants.ACTIONBTNID.CHKICONHDR).setProperty("iconFirst", false);
			// this.getView().byId(constants.ACTIONBTNID.CHGICONITM).setIcon("sap-icon://slim-arrow-down");
			// this.getView().byId(constants.ACTIONBTNID.CHGICONITM).setProperty("iconFirst", false);
			// this.getView().byId(constants.ACTIONBTNID.CHKICONITM).setIcon("sap-icon://slim-arrow-down");
			// this.getView().byId(constants.ACTIONBTNID.CHKICONITM).setProperty("iconFirst", false);
			this._iconTabInit();
			this._initJSONModel();
			this._actionBtnInit();
			
			try {
                this.getOwnerComponent().getService("ShellUIService").then(function (oShellService) {
                    oShellService.setBackNavigation(function () {
                        // on Launchpad back button press
                        this._onTabSelect();
                        window.history.back();
                    }.bind(this));
                }.bind(this));
            } catch (err) {
                //do nothing
            }

			try {
				this.getOwnerComponent().getService("ShellUIService").then(function (oShellService) {
					oShellService.setBackNavigation(function () {
						// on Launchpad back button press
						this._onTabSelect();
						window.history.back();
					}.bind(this));
				}.bind(this));
			} catch (err) {
				//do nothing
			}

			//for batch call
			this.getOwnerComponent().getModel().attachBatchRequestCompleted(this._batchRequestedComplete.bind(this));
		},
		// function used to initialize the action buttons and their properties
		_actionBtnInit: function () {
			var sHeaderActionPath = "/" + constants.ENTITY_LEVEL.IF_SALES_ORDER;
			var sItemActionPath = "/" + constants.ENTITY_LEVEL.IF_SALES_ORDER_ITEMS;
			var toggleBtnVisible = function (aData) {
				if (aData && aData.length) {
					return true;
				}
				return false;
			};
			//change buttons
			this.getView().byId(constants.ACTIONBTNID.CHGICONHDR).setIcon("sap-icon://slim-arrow-down");
			this.getView().byId(constants.ACTIONBTNID.CHGICONHDR).setProperty("iconFirst", false);
			this.getView().byId(constants.ACTIONBTNID.CHGICONITM).setIcon("sap-icon://slim-arrow-down");
			this.getView().byId(constants.ACTIONBTNID.CHGICONITM).setProperty("iconFirst", false);

			this.getView().byId(constants.ACTIONBTNID.CHGICONHDR).bindProperty("visible", {
				path: sHeaderActionPath + "/change",
				model: "actionModel",
				formatter: toggleBtnVisible
			});
			this.getView().byId(constants.ACTIONBTNID.CHGICONITM).bindProperty("visible", {
				path: sItemActionPath + "/change",
				model: "actionModel",
				formatter: toggleBtnVisible
			});

			// check buttons
			this.getView().byId(constants.ACTIONBTNID.CHKICONHDR).setIcon("sap-icon://slim-arrow-down");
			this.getView().byId(constants.ACTIONBTNID.CHKICONHDR).setProperty("iconFirst", false);
			this.getView().byId(constants.ACTIONBTNID.CHKICONITM).setIcon("sap-icon://slim-arrow-down");
			this.getView().byId(constants.ACTIONBTNID.CHKICONITM).setProperty("iconFirst", false);

			this.getView().byId(constants.ACTIONBTNID.CHKICONHDR).bindProperty("visible", {
				path: sHeaderActionPath + "/check",
				model: "actionModel",
				formatter: toggleBtnVisible
			});
			this.getView().byId(constants.ACTIONBTNID.CHKICONITM).bindProperty("visible", {
				path: sItemActionPath + "/check",
				model: "actionModel",
				formatter: toggleBtnVisible
			});

			// create buttons
			// this.getView().byId(constants.ACTIONBTNID.CRTICONHDR).setIcon("sap-icon://slim-arrow-down");
			// this.getView().byId(constants.ACTIONBTNID.CRTICONHDR).setProperty("iconFirst", false);
			// this.getView().byId(constants.ACTIONBTNID.CRTICONITM).setIcon("sap-icon://slim-arrow-down");
			// this.getView().byId(constants.ACTIONBTNID.CRTICONITM).setProperty("iconFirst", false);

			// this.getView().byId(constants.ACTIONBTNID.CRTICONHDR).bindProperty("visible", {
			// 	path: sHeaderActionPath + "/create",
			// 	model: "actionModel",
			// 	formatter: toggleBtnVisible
			// });
			// this.getView().byId(constants.ACTIONBTNID.CRTICONITM).bindProperty("visible", {
			// 	path: sItemActionPath + "/create",
			// 	model: "actionModel",
			// 	formatter: toggleBtnVisible
			// });
		},
		_iconTabInit: function () {
			var ID = constants.ID;
			var oIconTabBar = this.byId(ID.ICON_TABBAR);
			oIconTabBar.attachSelect(this._onTabSelect.bind(this));

			//1st tab
			var oSalesOrderTab = this.getView().byId("listReport-_tab1");
			oSalesOrderTab.getCustomToolbar().insertContent(new sap.m.Text({
				text: '{uiModel>/' + ID.SALES_ORDER_TAB + '}'
			}));

			//2nd tab
			var oSalesOrderItemTab = this.getView().byId("listReport-_tab2");
			oSalesOrderItemTab.getCustomToolbar().insertContent(new sap.m.Text({
				text: '{uiModel>/' + ID.SALES_ORDER_ITEMS_TAB + '}'
			}));

			//3nd tab table changes
			// var oScheuleLineTab = this.getView().byId("listReport-_tab3");
			// oScheuleLineTab.getCustomToolbar().insertContent(new sap.m.Text({
			// 	text: '{uiModel>/' + ID.SCHEDULE_LINES_TAB + '}'
			// }));

			var aTabs = [oSalesOrderTab, oSalesOrderItemTab];
			for (var i = 0; i < aTabs.length; i++) {
				var oSmartTable = aTabs[i].getTable();
				oSmartTable.attachSelectionChange(this.onRowSelectionChange.bind(this));
				oSmartTable.attachUpdateFinished(this.onUpdateFinished.bind(this));
				oSmartTable.setSticky([sap.m.Sticky.HeaderToolbar, sap.m.Sticky.ColumnHeaders]);
			}
			this._getActionMenuItems();
		},
		_initJSONModel: function () {
			var oUIModel = new JSONModel({
				HeaderPartner: {
					bCustomerSelected: true,
					bPartnerSelected: false
				},
				jobFieldEnabled: true,
				backgroundJobOption: "Yes",
				backgroundJobFieldValue: constants.JOB_NAME_PREFIX,
				changePartnerSelected: false,
				removePartnerSelected: true,
				actionId: null

			});
			oUIModel.setProperty("/" + constants.ID.SALES_ORDER_TAB, "");
			oUIModel.setProperty("/" + constants.ID.SALES_ORDER_ITEMS_TAB, "");
			oUIModel.setProperty("/" + constants.ID.SCHEDULE_LINES_TAB, "");
			this.getView().setModel(oUIModel, "uiModel");

			var oDataModels = new JSONModel({
				changeAttributes: [{
					key: "",
					value: ""
				}]
			});

			var oActionModels = new JSONModel({
				H: {
					change: null,
					create: null,
					check: null
				},
				I: {
					change: null,
					create: null,
					check: null
				},
				actionData: {
					change: null,
					create: null,
					check: null
				}
			});
			this.getView().setModel(oDataModels, "dataModel");
			this.getView().setModel(oActionModels, "actionModel");
		},
		//for making selections when scrolled and also to clear selections when items are refreshed 
		onUpdateFinished: function (oEvent) {
			var aItems = oEvent.getSource().getItems();

			if (!aItems.length || oEvent.getParameter('reason') === "Refresh") {
				this._clearSelection();
			}
			if (oEvent.getParameter('reason') === "Growing") {

				if (this._tabUtility.getSelectOption() && this._tabUtility.getSelectOption() !== constants.ROW_SELECTION_CASE.IF_INCLUSION) {
					if (aItems.length) {
						var count = aItems.length - 20;
						for (var i = aItems.length - 1; i >= count; i--) {
							aItems[i].setSelected(true);
						}
					}
				}
			}
		},
		//logic to show selected items count on the table header
		_showSelectedItemsCount: function (oSource, bSelected) {
			var iCOunt = 0;
			var seelctionCaseType = this._tabUtility.getSelectOption();
			var tab = this._tabUtility.getTabSelected();
			var uiModel = this.getView().getModel("uiModel");
			if (seelctionCaseType === constants.ROW_SELECTION_CASE.IF_SELECT_ALL) {
				iCOunt = oSource.getMaxItemsCount();
			} else if (seelctionCaseType === constants.ROW_SELECTION_CASE.IF_EXCLUSION) {
				iCOunt = parseInt(uiModel.getProperty("/" + tab).split(" ")[0], 10);
				iCOunt = bSelected ? (iCOunt + 1) : (iCOunt - 1);
			} else {
				iCOunt = oSource.getSelectedItems().length;
			}

			var selectedText = this.getView().getModel("@i18n").getResourceBundle().getText("listReport.selectedText");
			uiModel.setProperty("/" + tab, iCOunt ? (iCOunt + " " + selectedText) : "");
		},

		// fired on selection of a row from the listreport(for all tabs)
		//needs to be rechecked for better way of doing
		onRowSelectionChange: function (oEvent) {
			var aSelectedItems = oEvent.getSource().getSelectedItems();
			var bSelected = false;
			if (oEvent.getParameter("selectAll")) {
				this._tabUtility.setSelectOption(constants.ROW_SELECTION_CASE.IF_SELECT_ALL);
				this._selectAllFlag = true;
				this._tabUtility.setExclusionList([]);
			} else if (aSelectedItems.length && this._selectAllFlag) {
				this._tabUtility.setSelectOption(constants.ROW_SELECTION_CASE.IF_EXCLUSION);
				var oSelChangeItem = oEvent.getParameter("listItem").getBindingContext();
				bSelected = oEvent.getParameter("selected");
				this._tabUtility.updateExlusionList(oSelChangeItem, bSelected);
			} else {
				this._tabUtility.setSelectOption(constants.ROW_SELECTION_CASE.IF_INCLUSION);
				this._selectAllFlag = false;
				this._tabUtility.setExclusionList([]);
			}
			this._showSelectedItemsCount(oEvent.getSource(), oEvent.getParameter("selected"));

		},
		_onTabSelect: function (oEvent) {
			this._selectAllFlag = false;
			this._clearSelection();
			this._tabUtility.clear();
			// this._clearActionMenuItems();
		},
		// _clearActionMenuItems: function () {
		// 	if (this._actionChangeMenu) {
		// 		this._actionChangeMenu.destroy();
		// 		this._actionChangeMenu = null;
		// 	}

		// 	if (this._actionCheckMenu) {
		// 		this._actionCheckMenu.destroy();
		// 		this._actionCheckMenu = null;
		// 	}

		// 	if (this._actionCreateMenu) {
		// 		this._actionCreateMenu.destroy();
		// 		this._actionCreateMenu = null;
		// 	}
		// },
		_clearSelection: function () {
			var oUIModel = this.getView().getModel("uiModel");
			var oSmartTableTab1 = this.getView().byId("listReport-_tab1").getTable();
			oSmartTableTab1.removeSelections();
			var oSmartTableTa2 = this.getView().byId("listReport-_tab2").getTable();
			oSmartTableTa2.removeSelections();
			// var oSmartTableTa3 = this.getView().byId("listReport-_tab3").getTable();
			// oSmartTableTa3.removeSelections();
			oUIModel.setProperty("/" + constants.ID.SALES_ORDER_TAB, "");
			oUIModel.setProperty("/" + constants.ID.SALES_ORDER_ITEMS_TAB, "");
			//	oUIModel.setProperty("/" + constants.ID.LISTREPORT_SCHEDULE_LINES_TAB, "");
		},

		//logic to check whehter user entred customer and parter combination or not 
		// _validatePartnerAndCustomerFilter: function (oFilterData) {
		// 	var bPartnerFunction = oFilterData.hasOwnProperty(constants.DB_FIELD_NAMES.PARTENR_FUNCTION);
		// 	var bCustomer = oFilterData.hasOwnProperty(constants.DB_FIELD_NAMES.CUSTOMER);

		// 	var oPartner = this.byId(constants.ID.FILTERS.PARTNER_FUNCTION);
		// 	var oCustomer = this.byId(constants.ID.FILTERS.CUSTOMER);
		// 	if (bPartnerFunction && !bCustomer) {
		// 		oPartner.setValueState("Error");
		// 		oPartner.setValueStateText(this.getView().getModel("@i18n").getResourceBundle().getText("listReport.customerError"));
		// 	} else if (!bPartnerFunction && bCustomer) {
		// 		oCustomer.setValueState("Error");
		// 		oCustomer.setValueStateText(this.getView().getModel("@i18n").getResourceBundle().getText("listReport.partnerError"));
		// 	} else {
		//
		// 		oPartner.setValueState("None");
		// 		oCustomer.setValueState("None");
		// 	}
		// },

		// _validatePartnerAndCustomerFilter: function (oFilterData) {
		// 	var bContactPerson_PF = oFilterData.hasOwnProperty(constants.DB_FIELD_NAMES.CONTACT_PERSON_PARTNER_FUNCTION);
		// 	var bContactPerson = oFilterData.hasOwnProperty(constants.DB_FIELD_NAMES.CONTACT_PERSON);
		// 	var oContactPerson_PF = this.byId(constants.ID.FILTERS.CONTACT_PERSON_PARTNER_FUNCTION);
		// 	var oContactPerson = this.byId(constants.ID.FILTERS.CONTACT_PERSON);
		// 	if (bContactPerson_PF && !bContactPerson) {
		// 		oContactPerson_PF.setValueState("Error");
		// 		oContactPerson_PF.setValueStateText(this.getView().getModel("@i18n").getResourceBundle().getText("contactError"));
		// 	} else if (!bContactPerson_PF && bContactPerson) {
		// 		oContactPerson.setValueState("Error");
		// 		oContactPerson.setValueStateText(this.getView().getModel("@i18n").getResourceBundle().getText("contactPartnerError"));
		// 	} else if ((typeof oContactPerson_PF == 'undefined') && (typeof oContactPerson == 'undefined')) {} else {
		// 		oContactPerson_PF.setValueState("None");
		// 		oContactPerson.setValueState("None");
		// 	}

		// 	var bPersonnel_PF = oFilterData.hasOwnProperty(constants.DB_FIELD_NAMES.PERSONNEL_PARTNER_FUNCTION);
		// 	var bPersonnel = oFilterData.hasOwnProperty(constants.DB_FIELD_NAMES.PERSONNEL);
		// 	var oPersonnel_PF = this.byId(constants.ID.FILTERS.PERSONNEL_PARTNER_FUNCTION);
		// 	var oPersonnel = this.byId(constants.ID.FILTERS.PERSONNEL);
		// 	if (bPersonnel_PF && !bPersonnel) {
		// 		oPersonnel_PF.setValueState("Error");
		// 		oPersonnel_PF.setValueStateText(this.getView().getModel("@i18n").getResourceBundle().getText("personnelError"));
		// 	} else if (!bPersonnel_PF && bPersonnel) {
		// 		oPersonnel.setValueState("Error");
		// 		oPersonnel.setValueStateText(this.getView().getModel("@i18n").getResourceBundle().getText("personnelPartnerError"));
		// 	} else if ((typeof oPersonnel_PF == 'undefined') && (typeof oPersonnel == 'undefined')) {} else {
		// 		oPersonnel_PF.setValueState("None");
		// 		oPersonnel.setValueState("None");
		// 	}

		// 	var bSupplier_PF = oFilterData.hasOwnProperty(constants.DB_FIELD_NAMES.SUPPLIER_PARTNER_FUNCTION);
		// 	var bSupplier = oFilterData.hasOwnProperty(constants.DB_FIELD_NAMES.SUPPLIER);
		// 	var oSupplier_PF = this.byId(constants.ID.FILTERS.SUPPLIER_PARTNER_FUNCTION);
		// 	var oSupplier = this.byId(constants.ID.FILTERS.SUPPLIER);
		// 	if (bSupplier_PF && !bSupplier) {
		// 		oSupplier_PF.setValueState("Error");
		// 		oSupplier_PF.setValueStateText(this.getView().getModel("@i18n").getResourceBundle().getText("supplierError"));
		// 	} else if (!bSupplier_PF && bSupplier) {
		// 		oSupplier.setValueState("Error");
		// 		oSupplier.setValueStateText(this.getView().getModel("@i18n").getResourceBundle().getText("supplierPartnerError"));
		// 	} else if ((typeof oSupplier_PF == 'undefined') && (typeof oSupplier == 'undefined')) {} else {
		// 		oSupplier_PF.setValueState("None");
		// 		oSupplier.setValueState("None");
		// 	}

		// 	var bCustomer_PF = oFilterData.hasOwnProperty(constants.DB_FIELD_NAMES.CUSTOMER_PARTNER_FUNCTION);
		// 	var bCustomer = oFilterData.hasOwnProperty(constants.DB_FIELD_NAMES.CUSTOMER);
		// 	var oCustomer_PF = this.byId(constants.ID.FILTERS.CUSTOMER_PARTNER_FUNCTION);
		// 	var oCustomer = this.byId(constants.ID.FILTERS.CUSTOMER);
		// 	if (bCustomer_PF && !bCustomer) {
		// 		oCustomer_PF.setValueState("Error");
		// 		oCustomer_PF.setValueStateText(this.getView().getModel("@i18n").getResourceBundle().getText("customerError"));
		// 	} else if (!bCustomer_PF && bCustomer) {
		// 		oCustomer.setValueState("Error");
		// 		oCustomer.setValueStateText(this.getView().getModel("@i18n").getResourceBundle().getText("customerPartnerError"));
		// 	} else if ((typeof oCustomer_PF == 'undefined') && (typeof oCustomer == 'undefined')) {} else {
		// 		oCustomer_PF.setValueState("None");
		// 		oCustomer.setValueState("None");
		// 	}

		// },

		// onFilterValueChange: function (oEvent) {
		// 	this._clearSelection();
		// 	var oSmFilter = oEvent.getSource();
		// 	var oFilterData = oSmFilter.getFilterData();
		// 	this._validatePartnerAndCustomerFilter(oFilterData);
		// },

		onFilterValueChange: function (oEvent) {
			this._clearSelection();
			var oPartnerFunctionFilter = this.byId(constants.ID.FILTERS.PARTNER_FUNCTION);
			var oFilterBar = oEvent.getSource();
			var oFilterData = oFilterBar.getFilterData();

			this._validateAndSetFilterState(constants.DB_FIELD_NAMES.CUSTOMER, constants.ID.FILTERS.CUSTOMER, oFilterData);
			this._validateAndSetFilterState(constants.DB_FIELD_NAMES.CONTACT_PERSON, constants.ID.FILTERS.CONTACT_PERSON, oFilterData);
			this._validateAndSetFilterState(constants.DB_FIELD_NAMES.PERSONNEL, constants.ID.FILTERS.PERSONNEL, oFilterData);
			this._validateAndSetFilterState(constants.DB_FIELD_NAMES.SUPPLIER, constants.ID.FILTERS.SUPPLIER, oFilterData);

			if (oFilterData.hasOwnProperty(constants.DB_FIELD_NAMES.PARTNER_FUNCTION)) {
				var oSelectedItem = oPartnerFunctionFilter.getSelectedItem();
				if (oSelectedItem) {
					this.sPartnerType = oSelectedItem.getBindingContext().getObject().SDDocumentPartnerType;
					this._validatePartnerFunctionFilter(this.sPartnerType, oFilterData);
				} else {
					this._setPartnerTypeAndValidate(oFilterData);
				}
			} else if (oPartnerFunctionFilter) {
				oPartnerFunctionFilter.setValueState("None");
			}
		},
		_setPartnerTypeAndValidate: function (oFilterData) {
			var aFilters = [];
			var oFilters = new Filter({
				filters: [
					new Filter({
						path: constants.DOCUMENT_CATEGORY.NAME,
						operator: FilterOperator.EQ,
						value1: "\'" + constants.DOCUMENT_CATEGORY.IF_SALES_ORDER + "\'"
					}),
					new Filter({
						path: constants.DB_FIELD_NAMES.PARTNER_FUNCTION,
						operator: FilterOperator.EQ,
						value1: "\'" + oFilterData.PartnerFunction + "\'"
					})
				],
				and: true
			});
			aFilters.push(oFilters);
			//MAHESH's
			var oPromise = this._ODataDataSource.getPartnerFilterData(aFilters);
			oPromise.then(function (oOuterFilterData, data) {
				if (data.results.length) {
					var sPartnerType = data.results[0].SDDocumentPartnerType;
					this._validatePartnerFunctionFilter(sPartnerType, oOuterFilterData);
				}
			}.bind(this, oFilterData), function (err) {
				MessageToast.show(this.i18nBundle.getText("partnerTypeReadFailed"));
			}.bind(this));
			//TANAYA's
			// var oModel = this.getView().getModel();    
			// oModel.read("/C_NonStdPartFuncBySlsDocCatVH", {
			// 	filters: aFilters,
			// 	success: function (data) {
			// 		this.sPartnerType = data.results[0].SDDocumentPartnerType;
			// 		this._validatePartnerFunctionFilter(this.sPartnerType, oFilterData);
			// 	}.bind(this),
			// 	error: function () {
			// 		MessageToast.show(this.i18nBundle.getText("partnerTypeReadFailed"));
			// 	}.bind(this)
			// });
		},
		_validateAndSetFilterState: function (sFilterType, sFilterID, oFilterData) {
			if (oFilterData.hasOwnProperty(sFilterType)) {
				this._validatePartnerFilter(oFilterData);
			} else {

				var oControl = this.byId(sFilterID);
				if (oControl) {
					oControl.setValueState("None");
				}

			}
		},

		_validatePartnerFilter: function (oFilterData) {
			var bPartnerFunction = oFilterData.hasOwnProperty(constants.DB_FIELD_NAMES.PARTNER_FUNCTION);
			var oPartnerFunction = this.byId(constants.ID.FILTERS.PARTNER_FUNCTION);
			var oSelectedItem = oPartnerFunction.getSelectedItem();

			var bCustomer = oFilterData.hasOwnProperty(constants.DB_FIELD_NAMES.CUSTOMER);
			var bContactPerson = oFilterData.hasOwnProperty(constants.DB_FIELD_NAMES.CONTACT_PERSON);
			var bPersonnel = oFilterData.hasOwnProperty(constants.DB_FIELD_NAMES.PERSONNEL);
			var bSupplier = oFilterData.hasOwnProperty(constants.DB_FIELD_NAMES.SUPPLIER);
			var oFilter;
			var partnerFnErrorMsg = this.getView().getModel("@i18n").getResourceBundle().getText("partnerFunctionError");
			// if (bPartnerFunction && oSelectedItem) {
			// 	var sPartnerType = oSelectedItem.getBindingContext().getObject().SDDocumentPartnerType;
			// }

			var sPartnerType = oSelectedItem ? oSelectedItem.getBindingContext().getObject().SDDocumentPartnerType : null;
			if (!bPartnerFunction && bCustomer || sPartnerType !== constants.PARTNER_TYPE.CUSTOMER && bCustomer) {
				oFilter = this.byId(constants.ID.FILTERS.CUSTOMER);
				oFilter.setValueState("Error");
				oFilter.setValueStateText(partnerFnErrorMsg);
			}

			if (!bPartnerFunction && bContactPerson || sPartnerType !== constants.PARTNER_TYPE.CONTACT_PERSON && bContactPerson) {
				oFilter = this.byId(constants.ID.FILTERS.CONTACT_PERSON);
				oFilter.setValueState("Error");
				oFilter.setValueStateText(partnerFnErrorMsg);
			}

			if (!bPartnerFunction && bPersonnel || sPartnerType !== constants.PARTNER_TYPE.PERSONNEL && bPersonnel) {
				oFilter = this.byId(constants.ID.FILTERS.PERSONNEL);
				oFilter.setValueState("Error");
				oFilter.setValueStateText(partnerFnErrorMsg);
			}

			if (!bPartnerFunction && bSupplier || sPartnerType !== constants.PARTNER_TYPE.SUPPLIER && bSupplier) {
				oFilter = this.byId(constants.ID.FILTERS.SUPPLIER);
				oFilter.setValueState("Error");
				oFilter.setValueStateText(partnerFnErrorMsg);
			}
		},

		_validatePartnerFunctionFilter: function (sPartnerType, oFilterData) {
			var bPartnerFunction = oFilterData.hasOwnProperty(constants.DB_FIELD_NAMES.PARTNER_FUNCTION);
			var oPartnerFunction = this.byId(constants.ID.FILTERS.PARTNER_FUNCTION);
			var sErrorText;

			switch (sPartnerType) {
			case constants.PARTNER_TYPE.CUSTOMER:
				var bCustomer = oFilterData.hasOwnProperty(constants.DB_FIELD_NAMES.CUSTOMER);
				var oCustomer = this.byId(constants.ID.FILTERS.CUSTOMER);
				sErrorText = this.getView().getModel("@i18n").getResourceBundle().getText("customerError");
				this._setParterTypeErrMsg(bPartnerFunction, oPartnerFunction, bCustomer, oCustomer, "customerError");
				break;
			case constants.PARTNER_TYPE.CONTACT_PERSON:
				var bContactPerson = oFilterData.hasOwnProperty(constants.DB_FIELD_NAMES.CONTACT_PERSON);
				var oContactPerson = this.byId(constants.ID.FILTERS.CONTACT_PERSON);
				sErrorText = this.getView().getModel("@i18n").getResourceBundle().getText("contactError");
				this._setParterTypeErrMsg(bPartnerFunction, oPartnerFunction, bContactPerson, oContactPerson, "contactError");
				break;
			case constants.PARTNER_TYPE.PERSONNEL:
				var bPersonnel = oFilterData.hasOwnProperty(constants.DB_FIELD_NAMES.PERSONNEL);
				var oPersonnel = this.byId(constants.ID.FILTERS.PERSONNEL);
				sErrorText = this.getView().getModel("@i18n").getResourceBundle().getText("personnelError");
				this._setParterTypeErrMsg(bPartnerFunction, oPartnerFunction, bPersonnel, oPersonnel, "personnelError");
				break;
			case constants.PARTNER_TYPE.SUPPLIER:
				var bSupplier = oFilterData.hasOwnProperty(constants.DB_FIELD_NAMES.SUPPLIER);
				var oSupplier = this.byId(constants.ID.FILTERS.SUPPLIER);
				sErrorText = this.getView().getModel("@i18n").getResourceBundle().getText("supplierError");
				this._setParterTypeErrMsg(bPartnerFunction, oPartnerFunction, bSupplier, oSupplier, "supplierError");
				break;
			default:
				oPartnerFunction.setValueState("None");
				break;
			}
		},
		_setParterTypeErrMsg: function (bPartnerFunction, oPartnerFunction, bPartnerType, oPartnerType, errTextKey) {

			var oResourceBundle = this.getView().getModel("@i18n").getResourceBundle();
			if (bPartnerFunction && !bPartnerType) {
				oPartnerFunction.setValueState("Error");
				oPartnerFunction.setValueStateText(oResourceBundle.getText(errTextKey));
			} else if ((typeof oPartnerFunction !== "undefined") && (typeof oPartnerType !== "undefined")) {
				oPartnerFunction.setValueState("None");
				oPartnerType.setValueState("None");
			}
		},
		_prepareChangeAttributes: function (aChangeAttributes) {
			var aModelchangeAttributes = this.getView().getModel("dataModel").getProperty("/changeAttributes");
			aModelchangeAttributes = []; //initialize
			for (var i = 0; i < aChangeAttributes.length; i++) {
				aModelchangeAttributes.push(aChangeAttributes[i]);
			}
			this.getView().getModel("dataModel").setProperty("/changeAttributes", aModelchangeAttributes);
		},
		onPartnerChange: function (oEvent) {
			this._oDialog.getBeginButton().setEnabled(true);
		},
		handleMenuItemPress: function (oEvent) {
			var oItem = oEvent.getParameter("item").getCustomData()[0];
			var actionId = oItem.getKey();
			this.getView().getModel("uiModel").setProperty("/actionId", actionId);
			var MENU_ITEMS = constants.MENU_ITEMS;

			if (actionId === MENU_ITEMS.CHANGE_ACTION.HEADER_DATA) {
				this._navToOBjectPage("navigateToHeaderObjectPage");
			} else if (actionId === MENU_ITEMS.CHANGE_ACTION.ITEM_DATA) {
				//setting filters for object page
				this._navToOBjectPage("navigateToItemObjectPage");
			} else {
				var entityLevel = this._tabUtility.getEntityLevel();
				var entitySet = constants.ODATA.ENTITYSET.MC_SALES_ORDER;
				if (entityLevel !== constants.ENTITY_LEVEL.IF_SALES_ORDER) {
					entitySet = constants.ODATA.ENTITYSET.MC_SALES_ORDER_ITEM;
				}

				var sFilterString = this._tabUtility.getFilters();
				var oParams = {
					entityLevel: entityLevel,
					entitySet: entitySet,
					selectedContext: this._tabUtility.getSelectedContext(),
					documentCategory: constants.DOCUMENT_CATEGORY.IF_SALES_ORDER,
					caseType: this._tabUtility.getSelectOption(),
					actionId: actionId,
					actionDescription: oItem.getValue(),
					filters: sFilterString
				};

				this._massChgActionsComponent.openActionDialog(oEvent, oParams);
			}
		},
		_navToOBjectPage: function (routeName) {
			var oNavigationController = this.extensionAPI.getNavigationController();
			oNavigationController.navigateInternal("", {
				routeName: routeName
			});
		},
		_batchRequestedComplete: function (oEvent) {
			var requestPayload = oEvent.getParameter("requests");
			if (requestPayload) {
				for (var i = 0; i < requestPayload.length; i++) {
					var sUrl = requestPayload[i].url;
					if (sUrl.match(/SlsOrder\/\$count/) || sUrl.match(/SlsOrdItem\/\$count/)) {
						var arr = sUrl.match(/\$filter=([^*]+)/);
						if (arr) {
							this._tabUtility.setFilters("?" + arr[0]);
						} else {
							this._tabUtility.setFilters("");
						}
					}
				}
			}

		},

		showJobSubmitDialog: function () {
			//for opening job submit popup //method to be renamed
			var oUiModel = this.getView().getModel("uiModel");
			oUiModel.setProperty("/backgroundJobFieldValue", constants.JOB_NAME_PREFIX + (new Date()).toLocaleDateString());
			var aSelectedContexts = this._tabUtility.getSelectedContext();
			oUiModel.setProperty("/jobFieldEnabled", aSelectedContexts.length > 10 ? false : true);
			if (!this._submitDialog) {
				this._submitDialog = sap.ui.xmlfragment("cus.sd.so.mccs1.ext.fragment.JobSubmitDialog", this);
				this.getView().addDependent(this._submitDialog);
			}
			this._submitDialog.open();

		},

		onPressCancel: function (oevent) {
			if (this._oDialog) {
				this._oDialog.destroy();
				this.oDialog = null;
			}
		},
		_prepareActionItemsChangeAttr: function (actionId) {

			var aChangeAttributes = [];
			return aChangeAttributes;
		},

		_prepareFilters: function (aFilters, aFinalFilters) {
			for (var i = 0; i < aFilters.length; i++) {
				var oFilter = aFilters[i];
				// var _bMultiFilter = oFilter.hasOwnProperty('_bMultiFilter');
				var _bArrayFilter = oFilter.hasOwnProperty('aFilters');
				if (_bArrayFilter && oFilter.aFilters) {
					this._prepareFilters(oFilter.aFilters, aFinalFilters);
				} else {
					aFinalFilters.push(oFilter);
				}
			}
			return aFinalFilters;
		},
		_createDataForInclusionCaseSuccess: function (oEvent) {
			// var data = oEvent.getParameter('data');
			this._showMessageToast("inclusionCaseSuccess");
		},
		_createDataForInclusionCaseFail: function (oEvent) {
			this._showMessageToast("errorOccured");
		},
		cancelJob: function () {
			this._submitDialog.destroy();
			this._submitDialog = null;
		},
		_prepareActionFilters: function (actionType) {
			var aActionFilter = [];
			//var tabId = this._tabUtility.getTabSelected();
			//setting variables for reading oData
			//	aActionFilter.push(new Filter(constants.ACTION_CATEGORY.NAME, FilterOperator.EQ, actionType));
			aActionFilter.push(new Filter(constants.DOCUMENT_CATEGORY.NAME, FilterOperator.EQ, constants.DOCUMENT_CATEGORY.IF_SALES_ORDER));
			// switch (tabId) {
			// case constants.ID.SALES_ORDER_TAB:
			// 	aActionFilter.push(new Filter(constants.ENTITY_LEVEL.NAME, FilterOperator.EQ, constants.ENTITY_LEVEL.IF_SALES_ORDER));
			// 	break;
			// case constants.ID.SALES_ORDER_ITEMS_TAB:
			// 	aActionFilter.push(new Filter(constants.ENTITY_LEVEL.NAME, FilterOperator.EQ, constants.ENTITY_LEVEL.IF_SALES_ORDER_ITEMS));
			// 	break;
			// case constants.ID.SCHEDULE_LINES_TAB:
			// 	aActionFilter.push(new Filter(constants.ENTITY_LEVEL.NAME, FilterOperator.EQ, constants.ENTITY_LEVEL.IF_SCHEDULE_LINES));
			// 	break;
			// default:
			// }
			return aActionFilter;
		},
		_filterHelper: function (oItem) {
			return oItem.SlsDocMassChgActionCategory === this.sActionCateory && oItem.SlsDocMassChgEntityLevel === this.sEntityLevel;
		},
		_filterAndSetActions: function (aActions) {
			var aEntityLevels = Object.values(constants.ENTITY_LEVEL);
			var oDataModel = this.getView().getModel("actionModel");
			for (var i = 0; i < aEntityLevels.length; i++) {
				var aChangeActions = aActions.filter(this._filterHelper, {
					sActionCateory: "CHG",
					sEntityLevel: aEntityLevels[i]
				});
				var aCheckActions = aActions.filter(this._filterHelper, {
					sActionCateory: "CHK",
					sEntityLevel: aEntityLevels[i]
				});
				var aCreateActions = aActions.filter(this._filterHelper, {
					sActionCateory: "CRT",
					sEntityLevel: aEntityLevels[i]
				});
				var path = "/" + aEntityLevels[i];
				oDataModel.setProperty(path + "/change", aChangeActions);
				oDataModel.setProperty(path + "/check", aCheckActions);
				oDataModel.setProperty(path + "/create", aCreateActions);
			}
		},
		_changeActionsData: function () {
			var oActionModel = this.getView().getModel("actionModel");
			var sPath = "/" + this._tabUtility.getEntityLevel();
			oActionModel.setProperty("/actionData", oActionModel.getProperty(sPath));
		},
		_getActionMenuItems: function () {
			this._destroyFragments();
			var aActionFilter = this._prepareActionFilters(constants.ACTION_CATEGORY.IF_CHANGE);
			var oPromise = this._ODataDataSource.readActionMenuItems(aActionFilter);
			oPromise.then(function (data) {
				if (data.results.length) {
					this._filterAndSetActions(data.results);
				} else {
					this._showMessageToast("actionMenuLoadFailed");
				}
			}.bind(this), function (err) {
				this._showMessageToast("actionMenuLoadFailed");
			}.bind(this));
		},
		_showActionFragment: function (sFragmentName, oButton) {
			this._changeActionsData();
			if (!this._actionFragments[sFragmentName]) {
				this._actionFragments[sFragmentName] = sap.ui.xmlfragment(sFragmentName, this);
				this.getView().addDependent(this._actionFragments[sFragmentName]);
			}
			this._actionFragments[sFragmentName].openBy(oButton, false, Popup.Dock.BeginTop, Popup.Dock.BeginBottom);
		},
		onActionChange: function (oEvent) {
			var oButton = oEvent.getSource();
			this._showActionFragment("cus.sd.so.mccs1.ext.fragment.ChangeActionMenu", oButton);

			// if (!this._actionChangeMenu) {
			// 	var aActionFilter = this._prepareActionFilters(constants.ACTION_CATEGORY.IF_CHANGE);
			// 	var oPromise = this._ODataDataSource.readActionMenuItems(aActionFilter);
			// 	oPromise.then(function (data) {
			// 		this._displayChangeMenuItems(data, oButton);
			// 	}.bind(this), function (err) {
			// 		this._showMessageToast("listReport.errorOccured");
			// 	}.bind(this));
			// } else {
			// 	this._actionChangeMenu.openBy(oButton, false, Popup.Dock.BeginTop, Popup.Dock.BeginBottom);
			// }
		},
		onActionCheck: function (oEvent) {
			var oButton = oEvent.getSource();
			this._showActionFragment("cus.sd.so.mccs1.ext.fragment.CheckActionMenu", oButton);
			// var oButton = oEvent.getSource();

			// if (!this._actionCheckMenu) {
			// 	var aActionFilter = this._prepareActionFilters(constants.ACTION_CATEGORY.IF_CHECK);

			// 	var oPromise = this._ODataDataSource.readActionMenuItems(aActionFilter);
			// 	oPromise.then(function (data) {
			// 		this._displayCheckMenuItems(data, oButton);
			// 	}.bind(this), function (err) {
			// 		this._showMessageToast("listReport.errorOccured");
			// 	}.bind(this));
			// } else {
			// 	this._actionCheckMenu.openBy(oButton, false, Popup.Dock.BeginTop, Popup.Dock.BeginBottom);
			// }
		},
		onActionCreate: function (oEvent) {
			var oButton = oEvent.getSource();
			this._showActionFragment("cus.sd.so.mccs1.ext.fragment.CreateActionMenu", oButton);
			// var oButton = oEvent.getSource();
			// if (!this._actionCreateMenu) {

			// 	var aActionFilter = this._prepareActionFilters(constants.ACTION_CATEGORY.IF_CREATE);

			// 	var oPromise = this._ODataDataSource.readActionMenuItems(aActionFilter);
			// 	oPromise.then(function (data) {
			// 		this._displayCreateMenuItems(data, oButton);
			// 	}.bind(this), function (err) {
			// 		this._showMessageToast("listReport.errorOccured");
			// 	}.bind(this));
			// } else {
			// 	this._actionCreateMenu.openBy(oButton, false, Popup.Dock.BeginTop, Popup.Dock.BeginBottom);
			// }
		},
		_readActionMenuItemsFail: function (error) {
			this._showMessageToast("errorOccured");
		},
		_displayChangeMenuItems: function (data, oButton) {
			if (data.results.length) {
				var oDataModel = this.getView().getModel("dataModel");
				oDataModel.setProperty("/actionData/change", data.results);
				this._actionChangeMenu = sap.ui.xmlfragment("cus.sd.so.mccs1.ext.fragment.ChangeActionMenu", this);
				this.getView().addDependent(this._actionChangeMenu);
				this._actionChangeMenu.openBy(oButton, false, Popup.Dock.BeginTop, Popup.Dock.BeginBottom);
			}
		},
		_displayCheckMenuItems: function (data, oButton) {
			if (data.results.length) {
				var oDataModel = this.getView().getModel("dataModel");
				oDataModel.setProperty("/actionData/check", data.results);
				this._actionCheckMenu = sap.ui.xmlfragment("cus.sd.so.mccs1.ext.fragment.CheckActionMenu", this);
				this.getView().addDependent(this._actionCheckMenu);
				this._actionCheckMenu.openBy(oButton, false, Popup.Dock.BeginTop, Popup.Dock.BeginBottom);
			}
		},
		_displayCreateMenuItems: function (data, oButton) {
			if (data.results.length) {
				var oDataModel = this.getView().getModel("dataModel");
				oDataModel.setProperty("/actionData/create", data.results);
				this._actionCreateMenu = sap.ui.xmlfragment("cus.sd.so.mccs1.ext.fragment.CreateActionMenu", this);
				this.getView().addDependent(this._actionCreateMenu);
				this._actionCreateMenu.openBy(oButton, false, Popup.Dock.BeginTop, Popup.Dock.BeginBottom);
			}
		},
		_readPartnerInfoFail: function (error) {
			this._showMessageToast("errorOccured");
		},
		_showMessageToast: function (sI18nKey) {
			var oResourceBundle = this.getView().getModel("@i18n").getResourceBundle();
			MessageToast.show(oResourceBundle.getText(sI18nKey));
		},
		navigateToSupplierFactsheet: function (oEvent) {
			var oApi = this.extensionAPI;
			var oNavigationController = oApi.getNavigationController();
			var supplierCode = oEvent.getSource().getProperty("text");
			var parameters = {
				"Supplier": supplierCode
			};
			oNavigationController.navigateExternal("Supplier", parameters);
		},
		onBeforeRebindTableExtension: function () {
			this._onTabSelect();
		},
		onPressPartnerLink: function (oEvent) {
			var aPartnerFilter = [];
			var sCurrentTab = this._tabUtility.getTabSelected();
			var oContext = oEvent.getSource().getBindingContext();
			//oContext is plain object. Properties can be accessed without /
			if (sCurrentTab === constants.ID.SALES_ORDER_TAB) {
				//need to check the database name for SDDocument
				aPartnerFilter.push(new Filter(constants.DB_FIELD_NAMES.SALES_DOCUMENT_HEADER, FilterOperator.EQ, oContext.getProperty(
					"SalesOrder")));
			} else {
				aPartnerFilter.push(new Filter(constants.DB_FIELD_NAMES.SALES_DOCUMENT, FilterOperator.EQ, oContext.getProperty("SalesOrder")));
				aPartnerFilter.push(new Filter(constants.DB_FIELD_NAMES.SALES_DOCUMENT_ITEM, FilterOperator.EQ, oContext.getProperty(
					"SalesOrderItem")));
			}
			var oParams = {
				entityLevel: this._tabUtility.getEntityLevel(),
				partnerFilters: aPartnerFilter,
				btnSource: oEvent.getSource()
			};

			this._quickViewComponent.showPartnerQuickView(oParams);
		},
		_destroyFragments: function () {
			if (this._actionFragments) {
				for (var key in this._actionFragments) {
					if (this._actionFragments.hasOwnProperty(key)) {
						this._actionFragments[key].destroy();
					}
				}
			}
			this._actionFragments = {};
		},
		onExit: function () {
			this.getOwnerComponent().getModel().detachBatchRequestCompleted(this._batchRequestedComplete.bind(this));
			this._destroyFragments();
		}
	});
});