/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"sap/m/MessageToast",
	'sap/m/MessageItem',
	'sap/m/MessagePopover',
	'sap/ui/core/library',
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/BusyIndicator",
	"sap/ui/core/routing/History",
	"cus/sd/so/mccs1/ext/commons/constants",
	"cus/sd/so/mccs1/ext/commons/TabUtility",
	"sap/ui/comp/odata/MetadataAnalyser",
	"sap/ui/comp/smartfield/SmartField",
	"sap/m/FlexBox",
	"sap/m/HBox",
	"sap/m/Input",
	"sap/ui/core/Icon",
	"sap/ui/core/Fragment",
	"sap/ui/comp/smartform/GroupElement",
	"cus/sd/so/mccs1/ext/commons/Formatter"
], function (MessageToast, MessageItem, MessagePopover, CoreLibrary, Controller, JSONModel, BusyIndicator, History, constants,
	TabUtility, MetadataAnalyser, SmartField, FlexBox, HBox, Input, Icon, Fragment, GroupElement, Formatter) {
	return Controller.extend("cus.sd.so.mccs1.ext.commons.ObjectPageDetailsBase", {
		_massChgActionsComponent: null,
		_readDocSuccessEvent: null,
		_readDocFailEvent: null,
		_jobSubmitSuccessEvent: null,
		_jobSubmiFailEvent: null,
		_messagePopover: null,
		_dataModel: null,
		formatter: Formatter,
		onInit: function () {
			this._dataModel = new JSONModel({
				submitButtonEnable: false,
				customFieldVisible: false,
				errroMessagesBtnVisible: false,
				errroMessages: [],
				errroMessagesCount: 0,
				changeOperation: {
					changeCurrentValueKey: constants.OBJECT_PAGE.CHANGE_CURRENT_VALUE,
					deleteCurrentValueKey: constants.OBJECT_PAGE.DELETE_CURRENT_VALUE
				},
				readOnlyData: {}
			});

			this.stateModel = this.getOwnerComponent().getModel("stateModel");
			this.getView().setModel(this.stateModel, "stateModel");
			this.getView().setModel(this._dataModel, "dataModel");
			this._tabUtility = TabUtility.getInstance();
			//	try {
			this.getOwnerComponent().getService("ShellUIService").then(function (oShellService) {
				oShellService.setBackNavigation(function () {
					this.onCancel();
				}.bind(this));
			}.bind(this));
		},
		_getMetaDataAnalyser: function () {
			if (!this._oMetaDataAnalyser) {
				this._oMetaDataAnalyser = new MetadataAnalyser(this.getView().getModel());
			}
			return this._oMetaDataAnalyser;
		},
		_extensibilityManageComponent: function () {
			var entityLevel = this._tabUtility.getEntityLevel();
			var aExtensionData = this._getMetaDataAnalyser().getFieldsByEntityTypeName("SlsDocReqType").filter(jQuery.proxy(function (oField) {
				var extensionEntityLevel = "";
				if (entityLevel === constants.ENTITY_LEVEL.IF_SALES_ORDER) {
					extensionEntityLevel = constants.EXTENSION.EXTENSION_ENTITY_TYPE.HEADER;
				} else if (entityLevel === constants.ENTITY_LEVEL.IF_SALES_ORDER_ITEMS) {
					extensionEntityLevel = constants.EXTENSION.EXTENSION_ENTITY_TYPE.ITEM;
				}
				if (oField.name.endsWith(extensionEntityLevel)) {
					return true;
				}
				return false;
			}, this));
			return aExtensionData;
		},
		_getState: function (oCustomFiled) {

			var obj = {
				"visible": true,
				"currentOperation": "",
				"key": oCustomFiled.name,
				"value": ""
			};
			return obj;
		},
		_addExtensionData: function (sId, oContext) {

			// var extensionData = this._extensibilityManageComponent();
			var aExtensionData = this._extensibilityManageComponent();
			if (!aExtensionData.length) {
				this._dataModel.setProperty("/customFieldVisible", false);
				return;
			}
			this._dataModel.setProperty("/customFieldVisible", true);
			var stateModelExtensionData = this.stateModel.getProperty("/CustomData");

			var customFieldGroupelement = this.getCustomFieldGroupControl();
			this.destroyGroupElements();

			for (var i = 0; i < aExtensionData.length; i++) {
				stateModelExtensionData[aExtensionData[i].name] = this._getState(aExtensionData[i]);

				var oHbox = new HBox({
					width: '1.5rem'
				});

				var oInput = new Input({
					value: '{dataModel>/readOnlyData/' + aExtensionData[i].name + '}',
					width: '20rem',
					editable: false
				});
				var smartfield = new SmartField({
					visible: {
						path: 'stateModel>currentOperation',
						formatter: this.onCCVOperationFormatter.bind(this)
					},
					value: '{' + aExtensionData[i].name + '}',
					change: this.onValueChange.bind(this),
					width: '20rem',
					mandatory: true,
					fieldGroupIds: this.getSmartFieldId()
				}).addStyleClass("smartFiledObjectPage");

				var oFlexBox = new FlexBox({
					renderType: "Bare"
				});

				var groupElement = new sap.ui.comp.smartform.GroupElement({
					label: aExtensionData[i]['sap:label'],
					useHorizontalLayout: true
						// binding: '{stateModel>/CustomData/' + extensionData.name + '}',
				});
				groupElement.bindElement('stateModel>/CustomData/' + aExtensionData[i].name);
				oFlexBox.addItem(oInput);
				oFlexBox.addItem(oHbox);
				oFlexBox.addItem(smartfield);

				Fragment.load({
					type: "XML",
					name: 'cus.sd.so.mccs1.ext.commons.fragment.ChangeMenu',
					controller: this
				}).then(function (FboxInner, fragment) {
					FboxInner.insertItem(fragment, 2);

				}.bind(this, oFlexBox));

				Fragment.load({
					type: "XML",
					name: 'cus.sd.so.mccs1.ext.commons.fragment.DeleteValue',
					controller: this
				}).then(function (FboxInner, fragment) {
					FboxInner.insertItem(fragment, 4);

				}.bind(this, oFlexBox));

				groupElement.addElement(oFlexBox);
				customFieldGroupelement.addGroupElement(groupElement);
			}

		},
		onTargetMatched: function () {
			this._dataModel.setProperty("/errroMessagesBtnVisible", false);
			// sap.ui.getCore().byId("backBtn").attachEventOnce("press", this.onLaunchPadBack.bind(this));
			if (!this._tabUtility.getExtensionApi()) {
				BusyIndicator.hide();
				this.onCancel();
				return;
			}
			this._addExtensionData();
			this.getView().getModel().setDeferredGroups(["ObjectPageFieldGroupId"]);
			this.getView().setBindingContext(this.getView().getModel().createEntry("/SlsDocReadReq", {
				groupId: "ObjectPageFieldGroupId"
			}));

			this._dataModel.setProperty("/readOnlyData", null);
			var oParams = this._prepareParams([], true);

			if (!this._massChgActionsComponent) {
				this._massChgActionsComponent = sap.ui.getCore().createComponent({
					name: "cus.sd.libmccs1.components.actions",
					settings: {
						extensionAPI: this._tabUtility.getExtensionApi(),
						model: this.getView().getModel()
					}
				});
				this._addEvents();
			}

			this._massChgActionsComponent.getServiceDocDetails(oParams);
		},
		_deleteViewBindingContext: function () {
			var oBindingContext = this.getView().getBindingContext();
			if (oBindingContext) {
				this.getView().getModel().deleteCreatedEntry(oBindingContext);
			}
		},
		getServiceDocDetailsSuccess: function (oEvent) {
			var oData = oEvent.getParameter('data');
			var seelctionCaseType = this._tabUtility.getSelectOption();
			if (seelctionCaseType !== constants.ROW_SELECTION_CASE.IF_INCLUSION) {
				oData = oData.__batchResponses[1].__changeResponses[0].data;
			}

			//if no data
			if (!oData) {
				return;
			}
			this._dataModel.setProperty("/readOnlyData", oData.to_MassChangeReadRequest);
			BusyIndicator.hide();
		},
		getServiceDocDetailsFail: function (error) {
			BusyIndicator.hide();
			this._dataModel.setProperty("/readOnlyData", null);
			this._showMessageToast("docReadFailed");
		},
		//Delete Current Operation
		onDCVOperationFormatter: function (sOperation) {
			if (sOperation && sOperation === constants.OBJECT_PAGE.DELETE_CURRENT_VALUE) {
				return true;
			}
			return false;
		},
		//Change Current Operation
		onCCVOperationFormatter: function (sOperation) {
			if (sOperation && sOperation === constants.OBJECT_PAGE.CHANGE_CURRENT_VALUE) {
				return true;
			}
			return false;
		},
		onMenuItemClick: function (oEvent) {
			var sKey = oEvent.getParameter('item').getKey();

			var sValue = (sKey === constants.OBJECT_PAGE.DELETE_CURRENT_VALUE) ? constants.OBJECT_PAGE.NO_VALUE : "";
			this.setUiStateData(oEvent.getSource().getBindingContext('stateModel'), false, sValue, sKey);
		},
		onValueChange: function (oEvent) {
			var oSource = oEvent.getSource();
			var oContext = oSource.getBindingContext("stateModel");
			this.stateModel.setProperty(oContext.getPath() + "/value", oEvent.getSource().getValue());
			this._validateValWithValueList(oEvent);
		},
		onUndoClick: function (oEvent) {
			var oContext = oEvent.getSource().getBindingContext('stateModel');
			this.setUiStateData(oContext, true);

			var oSlsDocReqContext = this.getView().getBindingContext();
			oSlsDocReqContext.getModel().setProperty(oSlsDocReqContext.getPath() + "/" + oContext.getProperty('key'), null);
			// oSlsDocReqContext.getModel().setProperty(oSlsDocReqContext.getPath() + "/" + oContext.getProperty('key'), "");
		},
		setUiStateData: function (oContext, bVisible, sValue, sOperation) {
			this.stateModel.setProperty(oContext.getPath() + "/visible", bVisible);
			this.stateModel.setProperty(oContext.getPath() + "/value", sValue ? sValue : "");
			this.stateModel.setProperty(oContext.getPath() + "/currentOperation", sOperation ? sOperation : "");
		},
		resetUiStateData: function () {
			this.getOwnerComponent().loadStateModel();
			this._dataModel.setProperty("/errroMessagesBtnVisible", false);
			this.setSelectedSubSection();
			this.destroyGroupElements();

		},
		onLaunchPadBack: function () {
			this.resetUiStateData();
		},

		// Display the number of messages with the highest severity
		getErrorMessagesCount: function (aErrorsMessages) {
			return aErrorsMessages.length;
		},
		errorBtnVisibleFormatter: function (errroMessagesBtnVisible, aErrorsMessages) {

			if (!aErrorsMessages.length) {
				return false;
			}

			return errroMessagesBtnVisible;
		},
		onMessagePopoverPress: function (oEvent) {
			if (!this._messagePopover) {

				var oMessageTemplate = new MessageItem({
					type: '{dataModel>type}',
					title: '{dataModel>title}',
					subtitle: '{dataModel>subtitle}'
				});

				this._messagePopover = new MessagePopover({
					items: {
						path: 'dataModel>/errroMessages',
						template: oMessageTemplate
					}
				});
			}

			this.byId("messagePopoverBtn").addDependent(this._messagePopover);
			this._messagePopover.openBy(oEvent.getSource());
		},
		_getMessageObject: function (oMessage) {
			return {
				type: CoreLibrary.MessageType.Error,
				title: "",
				subtitle: '',
				target: null
			};
		},
		// _removeErrorMsgs: function (oInput) {
		// 	// if (this._messagePopover && this._messagePopover.isOpen()) {
		// 	var sTarget = oInput.getBindingContext().getPath() + "/" + oInput.getBindingPath("value");
		// 	var aErrroMessages = this._dataModel.getProperty("/errroMessages");
		// 	var index = -1;
		// 	if (oInput.getValue() && oInput.getValueState() !== "Error") {
		// 		//remove current object
		// 		index = this._getCurrentInputControlIndex(aErrroMessages, sTarget);
		// 		if (index >= 0) {
		// 			aErrroMessages.splice(index, 1);
		// 		}
		// 	} else {
		// 		//update current object error details
		// 		index = this._getCurrentInputControlIndex(aErrroMessages, sTarget);
		// 		if (index >= 0) {
		// 			aErrroMessages[index] = this._getErrorMsg(oInput, oInput.getComputedTextLabel());
		// 		} else {
		// 			//insert new item
		// 			aErrroMessages.push(this._getErrorMsg(oInput, oInput.getComputedTextLabel()));
		// 		}
		// 	}
		// 	this._dataModel.setProperty("/errroMessages", aErrroMessages);
		// 	this._dataModel.refresh(true);

		// },
		_getCurrentInputControlIndex: function (aErrroMessages, sTarget) {
			for (var i = 0; i < aErrroMessages.length; i++) {
				if (aErrroMessages[i].target === sTarget) {
					return i;
				}
			}
			return -1;
		},
		_getErrorMsg: function (oInput, sParentLabel) {
			if (!oInput.getValue() || oInput.getValueState() === "Error") {
				var oI18nModel = this.getView().getModel("i18n");
				var sTarget = oInput.getBindingContext().getPath() + "/" + oInput.getBindingPath("value");
				if (oInput.getValueState() !== "Error") {
					oInput.setValueStateText(oI18nModel.getResourceBundle().getText("blankInputError"));
					oInput.setValueState("Error");
				}
				// oI18nModel.getResourceBundle().getText("blankInputError")
				// sErrorMessgae = () ? oInput.getValueStateText() : sErrorMessgae;
				var oMessage = this._getMessageObject();
				oMessage.title = oInput.getValueStateText();
				oMessage.subtitle = sParentLabel;
				oMessage.target = sTarget;
				return oMessage;
			}
			return null;
		},
		_checkInputs: function () {
			var aSmardFieldGroup = this.getAllEditableSmartFields();
			var aErrroMessages = [];
			for (var i = 0; i < aSmardFieldGroup.length; i++) {
				var oControl = aSmardFieldGroup[i];
				var isSmartFiled = (oControl instanceof sap.ui.comp.smartfield.SmartField);
				if (isSmartFiled && oControl.getVisible()) {
					var oInnerControl = oControl.getContent();
					if (oInnerControl instanceof sap.m.CheckBox) {
						continue;
					}
					var oMessage = this._getErrorMsg(oInnerControl, oInnerControl.getParent().getComputedTextLabel());
					if (oMessage) {
						aErrroMessages.push(oMessage);
					}
				}
			}
			this._dataModel.setProperty("/errroMessages", aErrroMessages);

			if (aErrroMessages.length) {
				return false;
			}
			return true;
		},
		onSubmitClick: function (oEvent) {

			var bValid = this._checkInputs();

			if (!bValid) {
				this._dataModel.setProperty("/errroMessagesBtnVisible", true);

				return;
			}

			this._dataModel.setProperty("/errroMessagesBtnVisible", false);
			var oUiStateData = this.stateModel.getProperty("/");
			var oChangeAttributes = [];
			for (var uiStateProperty in oUiStateData) {
				var oUiStateObj = oUiStateData[uiStateProperty];
				for (var eachProperty in oUiStateObj) {
					var eachStateObj = oUiStateObj[eachProperty];
					if (eachStateObj.currentOperation) {
						if (eachStateObj.currentOperation === constants.OBJECT_PAGE.DELETE_CURRENT_VALUE) {
							oChangeAttributes.push({
								key: eachStateObj.key,
								value: ""
							});
						}
						// var valueFromModel = this.getView().getBindingContext().getObject()[eachStateObj.key];
						// var value = valueFromModel ? valueFromModel : eachStateObj.value;
						// if (value) {
						// 	oChangeAttributes.push({
						// 		key: eachStateObj.key,
						// 		value: value
						// 	});
						// }
						else {
							var valueFromModel = this.getView().getBindingContext().getObject()[eachStateObj.key];
							var value = valueFromModel ? valueFromModel : eachStateObj.value;
							if (value) {
								// this is CCV hence not writting following logic 
								//eachStateObj.currentOperation === constants.OBJECT_PAGE.CHANGE_CURRENT_VALUE
								// var value = eachStateObj.value;
								// // if (eachStateObj.key === "PricingDate" || eachStateObj.key === "BillingDocumentDate")
								// if (eachStateObj.key === constants.DB_FIELD_NAMES.PRICINGDATE || eachStateObj.key === constants.DB_FIELD_NAMES.BILLING_DOCUMENT_DATE ||
								//         eachStateObj.key === constants.DB_FIELD_NAMES.REQUESTEDDATE) {
								//         value = this.getView().getBindingContext().getObject()[eachStateObj.key];
								// }
								oChangeAttributes.push({
									key: eachStateObj.key,
									value: value
								});
							}
						}

					}

				}
			}

			if (oChangeAttributes.length) {
				var oParams = this._prepareParams(oChangeAttributes, false);
				this._massChgActionsComponent.openSubmitDataDialog(oEvent, oParams);
			} else {
				this._showMessageToast("noAttributesModified");
			}
		},

		onCancel: function () {
			this._deleteViewBindingContext();
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();
			// oHistory.aHistory.pop();
			// this.extensionApi.refreshAncestor(1);
			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				window.history.back();
			}
			this.resetUiStateData();
		},
		jobSubmitSuccess: function (data) {
			this._showMessageToast("docReadSubmitSuccess");
			this.onCancel();
		},
		jobSubmitFail: function (error) {
			this._showMessageToast("docReadSubmitFailed");
		},

		getEntitySet: function () {
			var entityLevel = this._tabUtility.getEntityLevel();
			var entitySet = constants.ODATA.ENTITYSET.MC_SALES_ORDER;
			if (entityLevel !== constants.ENTITY_LEVEL.IF_SALES_ORDER) {
				entitySet = constants.ODATA.ENTITYSET.MC_SALES_ORDER_ITEM;
			}
			return entitySet;
		},
		_prepareParams: function (oChangeAttributes, bSimulate) {
			var oParams = {
				jobName: "",
				simulate: bSimulate,
				entityLevel: this._tabUtility.getEntityLevel(),
				entitySet: this.getEntitySet(),
				selectedContext: this._tabUtility.getSelectedContext(),
				documentCategory: constants.DOCUMENT_CATEGORY.IF_SALES_ORDER,
				caseType: this._tabUtility.getSelectOption(),
				actionId: this.getActionId(), //implemented in child class
				actionDescription: this.getActionDescription(),
				changeAttributes: oChangeAttributes,
				filters: this._tabUtility.getFilters(),
				selectQueryAttributes: this.getSelectAttributes()

			};
			return oParams;
		},
		_showMessageToast: function (sI18nKey) {
			var oI18nModel = this.getView().getModel("i18n");
			if (oI18nModel) {
				var oResourceBundle = oI18nModel.getResourceBundle();
				MessageToast.show(oResourceBundle.getText(sI18nKey));
			}
		},
		_addEvents: function () {
			//to avoid multiple events for same object
			if (this._massChgActionsComponent) {
				this._readDocSuccessEvent = this.getServiceDocDetailsSuccess.bind(this);
				this._massChgActionsComponent.attachDocReadSuccess(this._readDocSuccessEvent);
				this._readDocFailEvent = this.getServiceDocDetailsFail.bind(this);
				this._massChgActionsComponent.attachDocReadError(this._readDocFailEvent);

				this._jobSubmitSuccessEvent = this.jobSubmitSuccess.bind(this);
				this._massChgActionsComponent.attachActionSuccess(this._jobSubmitSuccessEvent);
				this._jobSubmiFailEvent = this.jobSubmitFail.bind(this);
				this._massChgActionsComponent.attachActionError(this._jobSubmiFailEvent);
			}
		},
		//cleanup logics starts
		_removeEvents: function () {
			if (this._massChgActionsComponent) {
				this._massChgActionsComponent.detachDocReadSuccess(this._readDocSuccessEvent);
				this._massChgActionsComponent.detachDocReadError(this._readDocFailEvent);
				this._massChgActionsComponent.detachActionSuccess(this._jobSubmitSuccessEvent);
				this._massChgActionsComponent.detachActionError(this._jobSubmiFailEvent);
			}
		},
		_destoryActionsComponent: function () {
			if (this._massChgActionsComponent) {
				this._removeEvents();
				this._massChgActionsComponent.destroy();
				this._massChgActionsComponent = null;
			}
		},
		destroyGroupElements: function () {
			var bCustomFiledsVisible = this._dataModel.getProperty("/customFieldVisible");
			if (bCustomFiledsVisible) {
				var customFieldGroupelement = this.getCustomFieldGroupControl();
				customFieldGroupelement.destroyGroupElements();
			}
		},
		_extractIdFromDescription: function (sValue) {
			var aValue = sValue.split(" ");
			if (aValue.length > 1) {
				var lastValue = aValue[aValue.length - 1];
				sValue = lastValue.substr(lastValue.lastIndexOf("(") + 1, lastValue.lastIndexOf(")") - 1);
			}
			return sValue;
		},
		_validateValWithValueList: function (oEvent) {
			var oSource = oEvent.getSource();
			var sValue = this._extractIdFromDescription(oSource.getValue());
			var oI18nModel = this.getView().getModel("i18n");
			if (sValue) {
				var oDataProperty = oSource.getDataProperty();
				var sCollectionPath = oDataProperty.property["com.sap.vocabularies.Common.v1.ValueList"].CollectionPath.String;
				var sProperty = oDataProperty.typePath;
				if (sCollectionPath) {
					var oModel = this.getView().getModel();
					var aFilters = [];
					var oFilter = new sap.ui.model.Filter(sProperty, "EQ", sValue);
					aFilters.push(oFilter);
					oModel.read("/" + sCollectionPath, {
						filters: aFilters,
						success: function (data) {
							if (data.results.length === 0) {
								oSource.setValueStateText(oI18nModel.getResourceBundle().getText("invalidInputError", sValue));
								oSource.setValueState("Error");
							} else {
								oSource.setValueState("None");
							}
						}
					});

				}
			}
		},
		onExit: function () {
			this._destoryActionsComponent();
		}
	});

});