/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([], function () {
	"use strict";
	return {
		DELIVERY_BLOCK: "Delivery Block",
		BILLING_BLOCK: "Billing Block",
		REJECT_ALL_ITEMS: "Reject All Items",
		ITEM_PARTNER: "Item Partner",
		NEW_PRICING: "New Pricing",

		JOB_NAME_PREFIX: "SD_Mass_Update_",
		SMART_FIELD: {
			ITEM_ID: "itemSmartFieldGroup",
			HEADER_ID: "headerSmartFieldGroup"
		},

		IGNORE_FIELDS_LIST: {
		SALESORDER: "Customer, Supplier, PartnerFunction, Personnel, ContactPerson," +
				"Product, SalesOrderItemCategory, TransactionCurrency, ProductHierarchyNode, DeliveryStatus, TotalDeliveryStatus,SDProcessStatus," +
				"OrderRelatedBillingStatus, SDDocumentRejectionStatus, ItemGeneralIncompletionStatus, ItemBillingIncompletionStatus, ProfitCenter, PricingIncompletionStatus, ItemDeliveryIncompletionStatus," +
				"SDDocReferenceStatus, TotalSDDocReferenceStatus, TrdCmplncEmbargoSts, TrdCmplncSnctndListChkSts, ChmlCmplncStatus, DangerousGoodsStatus, ContractItemDownPaymentStatus," +
				"PartnerFunction, Batch, Plant, StorageLocation, ShippingPoint, DeliveryPriority, ItemIsDeliveryRelevant, Route,BillingBlockStatus, TotalDeliveryStatus, DeliveryStatus," +
				"SalesDocumentRjcnReason, DeliveryBlockStatus, DeliveryConfirmationStatus, SafetyDataSheetStatus, WBSElementExternalID, WBSElementInternalID, IncotermsClassification", 
			SALESORDERITEM: "Customer, Supplier, PartnerFunction,TransactionCurrency, Personnel, ContactPerson, " +
				"SalesOrderType, CreatedByUser,OverallDeliveryStatus, CreationDate,SDDocumentReason, SalesQuotationApprovalReason, OverallTotalDeliveryStatusDesc, ItemIncotermsClassification," +
				"AdditionalCustomerGroup1, AdditionalCustomerGroup2, AdditionalCustomerGroup3, AdditionalCustomerGroup4,ProductName, OverallSafetyDataSheetStatus, AdditionalCustomerGroup5," +
				"OverallSDProcessStatus, SalesDocApprovalStatus, TotalBlockStatus, SDDocumentCategory, OverallSDDocumentRejectionSts,SlsDocMassChgEntityLevel, OverallOrdReltdBillgStatus, HdrGeneralIncompletionStatus, HeaderBillgIncompletionStatus," +
				"OverallPricingIncompletionSts,SalesOrderItemCategoryName,DeliveryPriorityDesc,SalesDocumentRjcnReasonName, OverallTrdCmplncEmbargoSts, OvrlTrdCmplncSnctndListChkSts, OverallChmlCmplncStatus, OverallDangerousGoodsStatus, ContractDownPaymentStatus,HeaderBillingBlockReason,DeliveryBlockReason,OverallDelivConfStatus,HeaderDelivIncompletionStatus"
		},
		SELECT_QUERY: {
			SALESORDER: "SDDocumentReason,PricingDate,BillingDocumentDate,ShippingCondition,CustomerPaymentTerms,IncotermsClassification,IncotermsLocation1,IncotermsLocation2",
			SALESORDERITEM: "SalesDocumentItemCategory,Product,ProductHierarchyNode,Batch,PricingDate,BillingDocumentDate,DeliveryPriority," +
				"StorageLocation,Plant,ShippingCondition,ShippingPoint,ShippingType,Route,CustomerPaymentTerms," +
				"IncotermsClassification,IncotermsLocation1,IncotermsLocation2"
		},
		DB_FIELD_NAMES: {
			NAME: "SlsDocMassChgEntityLevel",
			PARTENR: "Partner",
			PARTNER_FUNCTION: "PartnerFunction",
			CUSTOMER: "Customer",
			SUPPLIER: "Supplier",
			PERSONNEL: "Personnel",
			CONTACT_PERSON: "ContactPerson",
			PRICING_TYPE: "PricingType",
			DELIVERY_BLOCK_REASON: "DeliveryBlockReason",
			HEADER_BILLING_BLOCK_REASON: "HeaderBillingBlockReason",
			ITEM_BILLING_BLOCK_REASON: "ItemBillingBlockReason",
			RETURN_REASON: "ReturnReason",
			// for tab1
			SALES_DOCUMENT_HEADER: "SDDocument",
			//for tab2
			SALES_DOCUMENT: "SalesDocument",
			SALES_DOCUMENT_ITEM: "SalesDocumentItem",
			PRICING_DATE: "PricingDate",
			BILLING_DOCUMENT_DATE: "BillingDocumentDate",
			REQUESTED_DATE: "RequestedDeliveryDate"
		},
		PARTNER_TYPE: {
			CUSTOMER: "KU",
			CONTACT_PERSON: "AP",
			PERSONNEL: "PE",
			SUPPLIER: "LI"

		},

		MENU_ITEMS: {
			CHANGE_ACTION: {
				//header level option
				HEADER_DATA: "HDR001",
				CHANGE_HEADER_PARTNER: "HDR002",
				REMOVE_HEADER_PARTNER: "HDR003",
				SET_HEADER_BILLING_BLOCK: "HDR005",
				REMOVE_HEADER_BILLING_BLOCK: "HDR006",
				SET_HEADER_DELIVERY_BLOCK: "HDR007",
				REMOVE_HEADER_DELIVERY_BLOCK: "HDR008",
				REJECT_SALES_ORDER: "HDR004",
				// REJECT_ITEM: "HDR005",

				CHANGE_ITEM_PARTNER: "ITM002",
				REMOVE_ITEM_PARTNER: "ITM003",
				SET_ITEM_BILLING_BLOCK: "ITM005",
				REMOVE_ITEM_BILLING_BLOCK: "ITM006",
				SET_ITEM_DELIVERY_BLOCK: "ITM007",
				REMOVE_ITEM_DELIVERY_BLOCK: "ITM008",
				ITEM_DATA: "ITM001",
				REJECT_ALL_ITEMS: "ITM004"

			},
			CHECK_ACTION: {

				HEADER_UPDATE_PRICE: "HDR101",
				ITEM_UPDATE_PRICE: "ITM101"
			},
			CREATE_ACTION: {
				// HEADER_UPDATE_PRICE: "NULL",
				// ITEM_UPDATE_PRICE: "ITM004 "
			}
		},
		ROW_SELECTION_CASE: {
			IF_SELECT_ALL: "A",
			IF_EXCLUSION: "E",
			IF_INCLUSION: "I"
		},
		ENTITY_LEVEL: {
			NAME: "SlsDocMassChgEntityLevel",
			IF_SALES_ORDER: "H",
			IF_SALES_ORDER_ITEMS: "I",
			IF_SCHEDULE_LINES: "S"
		},
		DOCUMENT_CATEGORY: {
			NAME: "SDDocumentCategory",
			IF_SALES_ORDER: "C"
		},

		ACTION_CATEGORY: {
			NAME: "SlsDocMassChgActionCategory",
			IF_CHANGE: "CHG",
			IF_CHECK: "CHK",
			IF_CREATE: "CRT"
		},
		OBJECT_PAGE: {
			NO_VALUE: "No Value",
			CHANGE_CURRENT_VALUE: "CCV",
			DELETE_CURRENT_VALUE: "DCV"
		},
		ID: {
			SALES_ORDER_TAB: "_tab1",
			SALES_ORDER_ITEMS_TAB: "_tab2",
			SCHEDULE_LINES_TAB: "_tab3",

			LISTREPORT_SALES_ORDER_TAB: "listReport-_tab1",
			LISTREPORT_SALES_ORDER_ITEMS_TAB: "listReport-_tab2",
			LISTREPORT_SCHEDULE_LINES_TAB: "listReport-_tab3",
			LISTREPORT_FILTER: "listReportFilter",

			//For Action
			ACTION_CHANGE_BTN: "ActionSlsOrdItem1button",
			ACTION_CHECK_BTN: "CheckSlsOrdItem1button",
			ACTION_CREATE_BTN: "CreateSlsOrdItem1button",

			ICON_TABBAR: "cus.sd.so.mccs1::sap.suite.ui.generic.template.ListReport.view.ListReport::SlsOrdItem--template::IconTabBar",

			FILTERS: {
				PARTNER_FUNCTION: "listReportFilter-filterItemControlsmartFilterPartnersAdditionalInfo-PartnerFunction",
				CUSTOMER: "listReportFilter-filterItemControlsmartFilterPartnersAdditionalInfo-Customer",
				SUPPLIER: "listReportFilter-filterItemControlsmartFilterPartnersAdditionalInfo-Supplier",
				PERSONNEL: "listReportFilter-filterItemControlsmartFilterPartnersAdditionalInfo-Personnel",
				CONTACT_PERSON: "listReportFilter-filterItemControlsmartFilterPartnersAdditionalInfo-ContactPerson"
			}
		},

		ACTIONBTNID: {
			CHGICONHDR: "cus.sd.so.mccs1::sap.suite.ui.generic.template.ListReport.view.ListReport::SlsOrdItem--ActionSlsOrdItem1button-_tab1",
			CHKICONHDR: "cus.sd.so.mccs1::sap.suite.ui.generic.template.ListReport.view.ListReport::SlsOrdItem--CheckSlsOrdItem1button-_tab1",
			CHGICONITM: "cus.sd.so.mccs1::sap.suite.ui.generic.template.ListReport.view.ListReport::SlsOrdItem--ActionSlsOrdItem1button-_tab2",
			CHKICONITM: "cus.sd.so.mccs1::sap.suite.ui.generic.template.ListReport.view.ListReport::SlsOrdItem--CheckSlsOrdItem1button-_tab2"
		},
		EXTENSION: {
			EXTENSION_ENTITY_TYPE: {
				HEADER: "_SDH",
				ITEM: "_SDI"
			}
		},
		ODATA: {
			SERVICE_URL: "/sap/opu/odata/sap/SD_MCC_SO_MASS_UPDATE_SRV/",
			ENTITYSET: {
				MC_SALES_ORDER: "SlsOrder",
				MC_SALES_ORDER_ITEM: "SlsOrdItem",
				MC_SALES_ORDER_REQUEST: "SlsDocReq",
				MC_SALES_ORDER_ACTION_CHANGE: "SlsDocActy",
				I_SALES_DOCUMENT_CUSTOM_PARTNER: "I_SlsDocItmNonStdPartner",
				MC_SALES_DOCUMENT_READ_REQUEST: "SlsDocReadReq"
			},
			URL_PARAMS: {
				SALES_DOC_MC_ACTION_DESC: "SlsDocMassChgActionDescription",
				SALES_DOC_MC_ACTION_ID: "SlsDocMassChgActionID",
				BUSINESS_PARTNER: "BusinessPartner",
				BUSINESS_PARTNER_FULL_NAME: "BusinessPartnerFullName",
				PARTNER_FUNCTION: "PartnerFunction",
				PARTNER_FUNCTION_NAME: "PartnerFunctionName"
			}
		}
	};
});