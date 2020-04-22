sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"../model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/BusyDialog",
	"sap/m/MessageBox",
	"sap/base/Log",
	"sap/ui/model/SimpleType"
], function (BaseController, JSONModel, formatter, Filter, FilterOperator, BusyDialog, MessageBox, Console, SimpleType) {
	"use strict";

	var globalThis;
	var globalLeaseEntered = "";
	var globalOEvent = null;

	function get_condtype_text(condition, conditionData) {
		var conText = "";
		for (var y = 0; y < conditionData.length; y++) {
			if (condition === conditionData[y].ConditionType) {
				conText = conditionData[y].ConditionTypeText;
			}

		}
		return conText;
	}

	function checkConditionFoundInDraftBook(objectCondition, draftConditions) {

		var returnArrFound = [];

		if (!draftConditions) {
			return returnArrFound;
		}

		for (var i = 0; i < draftConditions.length; i++) {
			if (objectCondition.ConditionType === draftConditions[i].ConditionType && objectCondition.PriceType === draftConditions[i].PriceType) {

				returnArrFound.push({
					isFound: true,
					objectFound: {
						ItemNo: draftConditions[i].ItemNo,
						UnitType: draftConditions[i].Product,
						ProdHier: draftConditions[i].ProdHier,
						RequestedQuan: draftConditions[i].ReqQty,
						Location: draftConditions[i].Location,
						ConditionType: draftConditions[i].ConditionType,
						PriceType: draftConditions[i].PriceType,
						PriceTypeText: draftConditions[i].PriceTypeText,
						ValidFrom: draftConditions[i].ValidFrom,
						ValidTo: draftConditions[i].ValidTo,
						Currency: draftConditions[i].Currency,
						Amount: draftConditions[i].ReqQty,
						Handling: draftConditions[i].Handling,
						Dropoff: draftConditions[i].Dropoff,
						Mandatory: draftConditions[i].Mandatory
					}
				});
				//break;
			}

		}

		return returnArrFound;

	}

	function checkConditionFoundInDraft(objectCondition, draftConditions) {

		var returnArrFound = [];

		if (!draftConditions) {
			return returnArrFound;
		}

		for (var i = 0; i < draftConditions.length; i++) {
			if (objectCondition.ConditionType === draftConditions[i].CondType && objectCondition.PriceType === draftConditions[i].PriceType) {

				returnArrFound.push({
					isFound: true,
					objectFound: {
						ItemNo: draftConditions[i].ItemNo,
						UnitType: draftConditions[i].Product,
						ProdHier: draftConditions[i].ProdHier,
						RequestedQuan: draftConditions[i].ReqQty,
						Location: draftConditions[i].Location,
						ConditionType: draftConditions[i].CondType,
						PriceType: draftConditions[i].PriceType,
						PriceTypeText: draftConditions[i].PriceTypeText,
						ValidFrom: draftConditions[i].ValidFrom,
						ValidTo: draftConditions[i].ValidTo,
						Currency: draftConditions[i].Currency,
						Amount: draftConditions[i].ReqQty,
						Handling: draftConditions[i].Handling,
						Dropoff: draftConditions[i].Dropoff,
						Mandatory: draftConditions[i].Mandatory
					}
				});
				//break;
			}

		}

		return returnArrFound;

	}

	function setHeaderTransactionDataBOOKINGModel(that, model, property, value) {
		that.getView().getModel(model).setProperty(property, value);
	}

	function convert_date_ddmmyyyy(dateobj) {
		if (dateobj === null) {
			return "";
		}
		var dated = new Date(dateobj);
		var dd = dated.getDate();
		var mm = dated.getMonth() + 1; //January is 0!

		var yyyy = dated.getFullYear();
		if (dd < 10) {
			dd = '0' + dd;
		}
		if (mm < 10) {
			mm = '0' + mm;
		}
		var dated = dd + '.' + mm + '.' + yyyy;
		return dated;

	}

	function compare_location_material_prodhier(itemsData, CPAGData, isGlobal) {
		var objectsAreSame = true;
		CPAGData.LocCode = itemsData.LocCode;
		var propertyNames = [];
		var propertyName = "";
		// var locationNeeded = CPAGData.PriceTypeText.includes("Location") ? true : false; // If location is not part of price type, no need to validate location as well.
		// if (!isGlobal && locationNeeded) { // If it not Global, check also location. Else, no need!
		// 	propertyNames.push("LocCode");
		// }

		propertyNames.push("LocCode");
		propertyNames.push("UnitType");
		// propertyNames.push("ProdHier");
		for (var k = 0; k < propertyNames.length; k++) {
			propertyName = propertyNames[k];
			if (itemsData[propertyName] !== CPAGData[propertyName]) {
				objectsAreSame = false;
				break;
			}
		}
		return objectsAreSame;
	}

	function get_status_text(status, statusData) {
		var statusText = "";
		for (var y = 0; y < statusData.length; y++) {
			if (status === statusData[y].key) {
				statusText = statusData[y].text;
			}

		}
		return statusText;
	}

	function get_status_additionaltext(status, statusData) {
		var statusAText = "";
		for (var y = 0; y < statusData.length; y++) {
			if (status === statusData[y].key) {
				statusAText = statusData[y].additionalText;
			}

		}
		return statusAText;
	}

	function get_city_code(location, locData) {
		var locKey = "";
		for (var y = 0; y < locData.length; y++) {
			if (location === locData[y].text) {
				locKey = locData[y].key;
			}

		}
		return locKey;
	}

	function get_unique_properties_from_array(array, property) {
		var flags = [],
			output = [],
			l = array.length,
			i;
		for (i = 0; i < l; i++) {
			if (flags[array[i][property]]) continue;
			flags[array[i][property]] = true;
			output.push(array[i][property]);
		}
		return output;
	}

	function get_city_desc(location, locData) {
		var locText = "";
		for (var y = 0; y < locData.length; y++) {
			if (location === locData[y].key) {
				locText = locData[y].text;
			}

		}
		return locText;
	}

	function prepare_edmdatetime_format(value) {

		var convertedDate = "";
		if (value === undefined || value === null || value === "") {
			convertedDate = null; //'9999-09-09T00:00:00';
		} else {
			convertedDate = value.split(".").reverse().join('-') + 'T00:00:00';
		}
		return convertedDate;
	}

	function sort_by(field, reverse, primer) {

		var key = primer ?
			function (x) {
				return primer(x[field]);
			} :
			function (x) {
				return x[field];
			};

		reverse = !reverse ? 1 : -1;

		return function (a, b) {
			return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
		};
	}

	function remove_prod_hiers(productData, productHierData) {
		var matnrOnly = [];
		var isFound = false;
		for (var i = 0; i < productData.length; i++) {
			isFound = false;
			loop1: for (var j = 0; j < productHierData.length; j++) {
				if (productData[i].key === productHierData[j].key) {
					isFound = true;
					break loop1;
				}
			}
			if (!isFound) {
				matnrOnly.push(productData[i]);
			}
		}
		return matnrOnly;
	}

	return BaseController.extend("com.seaco.sd_fiori.controller.Worklist", {

		formatter: formatter,

		_onObjectMatched: function (oEvent) {
			debugger;
			var bookingId = oEvent.getParameter("arguments").bookingId;

			if (bookingId != "") {
				this.getModel().metadataLoaded().then(function () {
					var sObjectPath = this.getModel().createKey("Bookings", {
						Customer: sObjectId
					});
					this._bindView("/" + sObjectPath);
				}.bind(this));

				this.getOwnerComponent().getModel().read("/Bookings", {
					success: function (oData) {
						this.getModel("objectView").setProperty("/Change", oData.results);
					}.bind(this)
				});
				this._showFormFragment("DisplayDeal");
			}

		},

		onInit: function () {

			var iOriginalBusyDelay,
				oViewModel = new JSONModel({
					busy: true,
					delay: 0
				});

			this.getRouter().getRoute("bookingDisplay").attachPatternMatched(this._onObjectMatched, this);

			// Store original busy indicator delay, so it can be restored later on
			iOriginalBusyDelay = this.getView().getBusyIndicatorDelay();
			this.setModel(oViewModel, "objectView");
			this.getOwnerComponent().getModel().metadataLoaded().then(function () {
				// Restore original busy indicator delay for the object view
				oViewModel.setProperty("/delay", iOriginalBusyDelay);
			});

			globalThis = this;

			this.oCPAGDataAll = [];
			this.aCPAGRETSCHData = [];
			this.aCPAGLEASEData = [];
			var oInputJSON = new sap.ui.model.json.JSONModel();
			var oInputData = {
				ProductCollection: [{
					Name: 'a',
					ProductId: '1',
					SupplierName: 'ab',
					Price: '12'
				}, {
					Name: 'b',
					ProductId: '2',
					SupplierName: 'ab',
					Price: '12'
				}]
			};
			oInputJSON.setData(oInputData);
			this.setModel(oInputJSON, "bookingSuggest");

			var oModel = new JSONModel({
				ActiveBooking: "",
				Lease: "",
				Customer: "",
				validationPassed: false,
				unitTypeEditable: false,
				CitiesOnlyData: [{
						key: "SG-SIN",
						text: "Singapore"
					}, {
						key: "AU-MLB",
						text: "Melbourne"
					}]
					// RequestedQuantity: false
					// SelectioMode: ""
			});
			this.setModel(oModel, "booking");

			this.aLeaseTypeData = [];

			this.aLeaseTypeData.push({
				"key": "ZMF",
				"text": "Finance Lease"
			});

			this.aLeaseTypeData.push({
				"key": "ZMV",
				"text": "Variable Lease"
			});

			this.aLeaseTypeData.push({
				"key": "ZMP",
				"text": "Positioning Lease"
			});

			this.aLeaseTypeData.push({
				"key": "ZMX",
				"text": "Fixed Term Lease"
			});

			this.getView().getModel("booking").setProperty("/LeaseTypes", this.aLeaseTypeData);

			var oModelInitial = new JSONModel({
				tableVisibility: false,
				NewBookingSelected: false,
				ExiBookingSelected: false,
				validationPassed: false,
				validationFailed: true,
				displayMode: false,
				editMode: true,
				DisplayEditToggleVisible: false,
				DisplayEditToggleText: "Edit"
			});
			this.setModel(oModelInitial, "bookinginitial");

			this.ReqTypes = [];

			this.ReqTypes.push({ // Customer Service - TILE3
				key: "",
				text: ""
			});

			this.ReqTypes.push({ // Customer Service - TILE3
				key: "NEW",
				text: "New Booking"
			});

			this.ReqTypes.push({ // Customer Service - TILE3
				key: "EXI",
				text: "Display/Edit Booking"
			});

			var oReqTypeModel = new JSONModel({});
			oReqTypeModel.setSizeLimit(1000);
			this.getView().setModel(oReqTypeModel, "oReqTypeModel");

			this.getView().getModel("oReqTypeModel").setProperty("/type", this.ReqTypes);

			this.aLeaseData = [];
			this.aBookingData = [];
			this.aCustomerData = [];
			this.aLeaseBookingRelData = [];
			this.StatusData = [];

			this.aCurrencyData = [];
			this.aCurrencyData.push({
				key: "ZD1",
				text: "ZD1"
			});
			this.aCurrencyData.push({
				key: "ZD2",
				text: "ZD2"
			});
			this.aCurrencyData.push({
				key: "ZD3",
				text: "ZD3"
			});

			var oCurrencyDataModel = new JSONModel({});
			oCurrencyDataModel.setSizeLimit(1000);
			this.getView().setModel(oCurrencyDataModel, "oCurrencyDataModel");

			this.getView().getModel("oCurrencyDataModel").setProperty("/", this.aCurrencyData);

			this.getOwnerComponent().getModel("booking").read("/f4Set", {
				success: function (oData) {
					// this.aCustomerData = oData.results;

					for (var i = 0; i < oData.results.length; i++) {

						oData.results[i].Cargoworthy = (oData.results[i].Cargoworthy === "CW") ? "YES" : "NO";
						oData.results[i].CreationDate = sap.ui.core.format.DateFormat.getDateTimeInstance({
							pattern: "dd.MM.yyyy"
						}).format(new Date(oData.results[i].CreationDate));

						if (oData.results[i].LeaseType.substr(0, 2) === "ZR") {
							this.aBookingData.push(oData.results[i]);
						} else if (oData.results[i].LeaseType.substr(0, 2) === "ZM") {
							this.aLeaseData.push(oData.results[i]);
						} else if (oData.results[i].Status) {
							this.aLeaseBookingRelData.push(oData.results[i]);
						} else if (oData.results[i].EmployeeResponsible != "") {
							this.StatusData.push({
								key: oData.results[i].Lease,
								text: oData.results[i].EmployeeResponsible,
								additionalText: oData.results[i].CreatedBy,
								possibleStatus: oData.results[i].CustomerName
							});
						}

					}

					// Remove Duplicates from Lease Data

					var arr = {};

					for (var j = 0, len = this.aLeaseData.length; j < len; j++) {
						arr[this.aLeaseData[j]['Lease']] = this.aLeaseData[j];
					}

					this.aLeaseData = [];
					for (var key in arr)
						this.aLeaseData.push(arr[key]);
					this.aLeaseData.sort(sort_by('Lease', true, function (a) {
						return a.toUpperCase();
					}));

					// Remove Duplicates from Booking Data

					var arr = {};

					for (var j = 0, len = this.aBookingData.length; j < len; j++) {
						arr[this.aBookingData[j]['Lease']] = this.aBookingData[j];
					}

					this.aBookingData = [];
					for (var key in arr)
						this.aBookingData.push(arr[key]);
					this.aBookingData.sort(sort_by('Lease', true, function (a) {
						return a.toUpperCase();
					}));

					this.getView().getModel("booking").setProperty("/listLease", this.aLeaseData);
					this.getView().getModel("booking").setProperty("/listBooking", this.aBookingData);

					var oStatusModel = new JSONModel({});
					oStatusModel.setSizeLimit(1000);
					this.getView().setModel(oStatusModel, "oStatusModel");

					this.getView().getModel("oStatusModel").setProperty("/", this.StatusData);

					this.getView().getModel("booking").setSizeLimit(100000);
				}.bind(this)
			});

			this.CitiesOnlyData = [];
			this.ProdOnlyData = [];
			this.ProdHierOnlyData = [];

			this.busyDialog = new BusyDialog();
			this.busyDialog.open();
			this.getOwnerComponent().getModel().read("/LocationSet", {
				success: function (oData) {
					for (var i = 0; i < oData.results.length; i++) {
						oData.results[i].ReqQuanEditable = false;

						if (oData.results[i].ZCityDesc !== "") {
							this.CitiesOnlyData.push({
								key: oData.results[i].ZCouDesc, // oData.results[i].Country + "-" + 
								text: oData.results[i].ZCityDesc
							});
						}

						if (oData.results[i].Leve === "2") {
							this.ProdHierOnlyData.push({
								key: oData.results[i].Plevel2,
								text: oData.results[i].Plevel2
							});
						} else if (oData.results[i].Leve === "3") {
							this.ProdHierOnlyData.push({
								key: oData.results[i].Plevel3,
								text: oData.results[i].Plevel3
							});
						} else if (oData.results[i].Leve === "4") {
							this.ProdOnlyData.push({
								key: oData.results[i].Matnr,
								text: oData.results[i].Matnr
							});
						}

					}

					// Remove Duplicates from City Data

					var arr = {};

					for (var j = 0, len = this.CitiesOnlyData.length; j < len; j++) {
						arr[this.CitiesOnlyData[j]['key']] = this.CitiesOnlyData[j];
					}

					this.CitiesOnlyData = [];
					for (var key in arr)
						this.CitiesOnlyData.push(arr[key]);
					this.CitiesOnlyData.sort(sort_by('key', false, function (a) {
						return a.toUpperCase();
					}));

					var oCityModel = new JSONModel({});
					oCityModel.setSizeLimit(1000);
					this.getView().setModel(oCityModel, "oCityModel");

					this.getView().getModel("oCityModel").setProperty("/Cities", this.CitiesOnlyData);

					// Remove Duplicates from Prod Data

					var arr = {};

					for (var j = 0, len = this.ProdOnlyData.length; j < len; j++) {
						arr[this.ProdOnlyData[j]['key']] = this.ProdOnlyData[j];
					}

					this.ProdOnlyData = [];
					for (var key in arr)
						this.ProdOnlyData.push(arr[key]);
					this.ProdOnlyData.sort(sort_by('key', false, function (a) {
						return a.toUpperCase();
					}));

					var oProdModel = new JSONModel({});
					oProdModel.setSizeLimit(1000);
					this.getView().setModel(oProdModel, "oProdModel");
					this.ProdOnlyData = remove_prod_hiers(this.ProdOnlyData, this.ProdHierOnlyData);
					this.getView().getModel("oProdModel").setProperty("/Prods", this.ProdOnlyData);

					// Remove Duplicates from Prod Hier Data

					var arr = {};

					for (var j = 0, len = this.ProdHierOnlyData.length; j < len; j++) {
						arr[this.ProdHierOnlyData[j]['key']] = this.ProdHierOnlyData[j];
					}

					this.ProdHierOnlyData = [];
					for (var key in arr)
						this.ProdHierOnlyData.push(arr[key]);
					this.ProdHierOnlyData.sort(sort_by('key', false, function (a) {
						return a.toUpperCase();
					}));

					var oProdHierModel = new JSONModel({});
					oProdHierModel.setSizeLimit(1000);
					this.getView().setModel(oProdHierModel, "oProdHierModel");
					this.getView().getModel("oProdHierModel").setProperty("/Prods", this.ProdHierOnlyData);

					this.aAvailableQuantiy = oData.results;

					this.busyDialog.close();

				}.bind(this),
				error: function (oData) {
					this.busyDialog.close();
				}.bind(this)
			});

			this.getView().getModel("booking").setProperty("/ConditionRecordsBOOK", []); // MACTEMP+
			this.getView().getModel("booking").setProperty("/PriceRecordsBOOK", []);
			this.getView().getModel("booking").setProperty("/ConditionRecordsLEASE", []);
			this.getView().getModel("booking").setProperty("/PriceRecordsLEASE", []);

			this.getOwnerComponent().getModel().read("/PriceSet", {
				async: false,
				success: function (oData) {
					this.aConditionDataBOOK = [];
					this.aConditionDataBOOKUnique = [];
					this.aConditionDataBOOKOptional = [];
					this.aPriceDataBOOK = [];

					this.aConditionDataLEASE = [];
					this.aConditionDataLEASEUnique = [];
					this.aConditionDataLEASEOptional = [];

					for (var i = 0; i < oData.results.length; i++) {
						if (oData.results[i].Types === "BOOK") {
							// if (oData.results[i].Mandatory === "") {	// RLC#12- all ret sch condition types should be available in dropdown because there are no default values
							this.aConditionDataBOOKOptional.push(oData.results[i]);
							// }	// RLC#12- all ret sch condition types should be available in dropdown because there are no default values

							this.aConditionDataBOOK.push(oData.results[i]);
							this.aConditionDataBOOKUnique.push(oData.results[i]);
						} else if (oData.results[i].Types === "LEASE") {
							// if (oData.results[i].Mandatory === "") {	// RLC#12- all Lease condition types should be available in dropdown
							this.aConditionDataLEASEOptional.push(oData.results[i]);
							// }
							this.aConditionDataLEASE.push(oData.results[i]);
							this.aConditionDataLEASEUnique.push(oData.results[i]);
						}

					}

					// Remove Duplicates from Condition Records - BOOK

					var arr = {};

					for (var j = 0, len = this.aConditionDataBOOKUnique.length; j < len; j++) {
						arr[this.aConditionDataBOOKUnique[j]['ConditionType']] = this.aConditionDataBOOKUnique[j];
					}

					this.aConditionDataBOOKUnique = [];
					for (var key in arr)
						this.aConditionDataBOOKUnique.push(arr[key]);
					this.aConditionDataBOOKUnique.sort(sort_by('ConditionType', false, function (a) {
						return a.toUpperCase();
					}));

					this.getView().getModel("booking").setProperty("/ConditionRecordsBOOK", this.aConditionDataBOOKUnique);
					this.getView().getModel("booking").setProperty("/PriceRecordsBOOK", this.aPriceDataBOOK);

					// Remove Duplicates from Condition Records Optional - BOOK

					var arr = {};

					for (var j = 0, len = this.aConditionDataBOOKOptional.length; j < len; j++) {
						arr[this.aConditionDataBOOKOptional[j]['ConditionType']] = this.aConditionDataBOOKOptional[j];
					}

					this.aConditionDataBOOKOptional = [];
					for (var key in arr)
						this.aConditionDataBOOKOptional.push(arr[key]);
					this.aConditionDataBOOKOptional.sort(sort_by('ConditionType', false, function (a) {
						return a.toUpperCase();
					}));

					var oConditionModelBOOKCPAG = new JSONModel({});
					oConditionModelBOOKCPAG.setSizeLimit(1000);
					this.getView().setModel(oConditionModelBOOKCPAG, "oConditionModelBOOKCPAG");
					this.getView().getModel("oConditionModelBOOKCPAG").setProperty("/", this.aConditionDataBOOKOptional);

					// Remove Duplicates from Condition Records - LEASE

					var arr = {};

					for (var j = 0, len = this.aConditionDataLEASEUnique.length; j < len; j++) {
						arr[this.aConditionDataLEASEUnique[j]['ConditionType']] = this.aConditionDataLEASEUnique[j];
					}

					this.aConditionDataLEASEUnique = [];
					for (var key in arr)
						this.aConditionDataLEASEUnique.push(arr[key]);
					this.aConditionDataLEASEUnique.sort(sort_by('ConditionType', false, function (a) {
						return a.toUpperCase();
					}));

					this.getView().getModel("booking").setProperty("/ConditionRecordsLEASE", this.aConditionDataLEASEUnique);
					this.getView().getModel("booking").setProperty("/PriceRecordsLEASE", this.aPriceDataLEASE);

					// Remove Duplicates from Condition Records Optional - LEASE

					var arr = {};

					for (var j = 0, len = this.aConditionDataLEASEOptional.length; j < len; j++) {
						arr[this.aConditionDataLEASEOptional[j]['ConditionType']] = this.aConditionDataLEASEOptional[j];
					}

					this.aConditionDataLEASEOptional = [];
					for (var key in arr)
						this.aConditionDataLEASEOptional.push(arr[key]);
					this.aConditionDataLEASEOptional.sort(sort_by('ConditionType', false, function (a) {
						return a.toUpperCase();
					}));

					var oConditionModelLEASECPAG = new JSONModel({});
					oConditionModelLEASECPAG.setSizeLimit(1000);
					this.getView().setModel(oConditionModelLEASECPAG, "oConditionModelLEASECPAG");
					this.getView().getModel("oConditionModelLEASECPAG").setProperty("/", this.aConditionDataLEASEOptional);

					//RLC#12 Dropdown values for Price Type
					this.aPriceDataLEASE = [];
					this.aPriceDataLEASE.push({
						"PriceType": "605",
						"PriceTypeText": "Product,Location"
					});
					// this.aPriceDataLEASE.push({
					// 	"PriceType": "604",
					// 	"PriceTypeText": "Prod. Hier,Location"
					// });
					this.aPriceDataLEASE.push({
						"PriceType": "089",
						"PriceTypeText": "Product"
					});
					// this.aPriceDataLEASE.push({
					// 	"PriceType": "602",
					// 	"PriceTypeText": "Prod. Hier"
					// });

					var oPriceModelLEASECPAG = new JSONModel({});
					oPriceModelLEASECPAG.setSizeLimit(1000);
					this.getView().setModel(oPriceModelLEASECPAG, "oPriceModelLEASECPAG");
					this.getView().getModel("oPriceModelLEASECPAG").setProperty("/", this.aPriceDataLEASE);

					var oPriceModelBOOKCPAG = new JSONModel({});
					oPriceModelBOOKCPAG.setSizeLimit(1000);
					this.getView().setModel(oPriceModelBOOKCPAG, "oPriceModelBOOKCPAG");
					this.getView().getModel("oPriceModelBOOKCPAG").setProperty("/", this.aPriceDataLEASE);

					// this.getView().getModel("booking").setProperty("/oPriceModelLEASECPAG", this.aPriceDataLEASE);
					//RLC#12 Dropdown values for Price Type

					// this.getView().getModel("booking").setProperty("/oPriceModelBOOKCPAG", this.aPriceDataLEASE);

				}.bind(this)
			});

			var model = new sap.ui.model.json.JSONModel({
				items: [{
					ItemNo: 1,
					RequestedQuan: "",
					UnitType: "",
					ProdHier: "",
					SerialNo: "",
					Location: "",
					DepoCode: "",
					Comments: "",
					dssVisible: false,
					condVisible: false
				}, {
					ItemNo: 2,
					RequestedQuan: "",
					UnitType: "",
					ProdHier: "",
					SerialNo: "",
					Location: "",
					DepoCode: "",
					Comments: "",
					dssVisible: false,
					condVisible: false
				}, {
					ItemNo: 3,
					RequestedQuan: "",
					UnitType: "",
					ProdHier: "",
					SerialNo: "",
					Location: "",
					DepoCode: "",
					Comments: "",
					dssVisible: false,
					condVisible: false
				}, {
					ItemNo: 4,
					RequestedQuan: "",
					UnitType: "",
					ProdHier: "",
					SerialNo: "",
					Location: "",
					DepoCode: "",
					Comments: "",
					dssVisible: false,
					condVisible: false
				}, {
					ItemNo: 5,
					RequestedQuan: "",
					UnitType: "",
					ProdHier: "",
					SerialNo: "",
					Location: "",
					DepoCode: "",
					Comments: "",
					dssVisible: false,
					condVisible: false
				}]

			});
			this.getView().setModel(model);

			// this.getView().getModel("booking")

			// this.supplierObject = [{
			// 	key: "Titanium",
			// 	text: "Titanium"
			// }, {
			// 	key: "Technocom",
			// 	text: "Technocom"
			// }, {
			// 	key: "Red Point Stores",
			// 	text: "Red Point Stores"
			// }];

			// var oSupplierModel = new JSONModel({});
			// this.getView().setModel(oSupplierModel, "oSupplierModel");
			// this.getView().getModel("oSupplierModel").setProperty("/Supplier", this.supplierObject);

			// Initialization

			this.NoOfConditions = 0;
			this.getView().getModel("booking").setProperty("/NoOfConditions", this.NoOfConditions);
			this.getView().getModel("booking").setProperty("/CPAGTableVisible", false);
			this.getView().getModel("booking").setProperty("/DPAGTableVisible", false);
			this.getView().getModel("bookinginitial").setProperty("/GetLeaseVisible", true);

			/* Yes/No model */
			this.YesNoData = [{
				key: "",
				text: ""
			}, {
				key: "YES",
				text: "Yes"
			}, {
				key: "NO",
				text: "No"
			}];
			var oYesNoDataModel = new JSONModel({});
			oYesNoDataModel.setSizeLimit(1000);
			this.getView().setModel(oYesNoDataModel, "oYesNoDataModel");

			this.getView().getModel("oYesNoDataModel").setProperty("/", this.YesNoData);

			// Enter Key Events...

			// 1. Lease Field
			this.getView().byId("LeaseId").onsapenter = function (e) {
				if (sap.m.InputBase.prototype.onsapenter) {
					sap.m.InputBase.prototype.onsapenter.apply(this, arguments);
				}

				var lease = e.srcControl.getProperty("value");

				if (lease.length > 5) {
					var leaseData = globalThis.getView().getModel("booking").getProperty("/listLease");
					var aFilterItem = leaseData.filter(function (oFilterItem) {
						return oFilterItem.Lease === lease;
					});

					globalThis.getView().getModel("booking").setProperty("/LeaseStatus", aFilterItem[0].Status);
					globalThis.getView().getModel("booking").setProperty("/Currency", aFilterItem[0].Waerk);
					globalThis.getView().getModel("booking").setProperty("/Lease", aFilterItem[0].Lease);
					globalThis.getView().getModel("booking").setProperty("/Customer", (aFilterItem[0].Customer + " - " + aFilterItem[0].CustomerName));
					globalThis.getView().getModel("booking").setProperty("/CustomerName", aFilterItem[0].CustomerName);
					globalThis.getView().getModel("booking").setProperty("/LeaseType", aFilterItem[0].LeaseType);
					globalThis.getView().getModel("booking").setProperty("/CreationDate", aFilterItem[0].CreationDate);
					globalThis.getView().getModel("booking").setProperty("/CreatedBy", aFilterItem[0].CreatedBy);
					globalThis.getView().getModel("booking").setProperty("/EmployeeResponsible", aFilterItem[0].EmployeeResponsible);
					globalThis.getView().getModel("booking").setProperty("/SalesOrg", aFilterItem[0].SalesOrg);
					globalThis.onPressGo("NEW");
				}

			};

			// 2. Booking Field
			this.getView().byId("ReleaseId").onsapenter = function (e) {
				if (sap.m.InputBase.prototype.onsapenter) {
					sap.m.InputBase.prototype.onsapenter.apply(this, arguments);
				}

				var release = e.srcControl.getProperty("value");

				if (release.length > 5) {
					var bookingData = globalThis.getView().getModel("booking").getProperty("/listBooking");
					var aFilterItem = bookingData.filter(function (oFilterItem) {
						return oFilterItem.Lease === release;
					});

					// Get Lease from the selected booking
					var leaseFromBooking = "";
					var leaseStatus = "";
					for (var i = 0; i < globalThis.aLeaseBookingRelData.length; i++) {
						if (globalThis.aLeaseBookingRelData[i].Status === aFilterItem[0].Lease) {
							leaseFromBooking = globalThis.aLeaseBookingRelData[i].Lease;
							leaseStatus = globalThis.aLeaseBookingRelData[i].Waerk;
							break;
						}
					}

					globalThis.getView().getModel("booking").setProperty("/Currency", aFilterItem[0].Waerk);
					globalThis.getView().getModel("booking").setProperty("/Booking", aFilterItem[0].Lease);
					globalThis.getView().getModel("booking").setProperty("/Lease", leaseFromBooking);
					globalThis.getView().getModel("booking").setProperty("/LeaseStatus", leaseStatus);
					globalThis.getView().getModel("booking").setProperty("/Customer", (aFilterItem[0].Customer + " - " + aFilterItem[0].CustomerName));
					globalThis.getView().getModel("booking").setProperty("/CustomerName", aFilterItem[0].CustomerName);
					globalThis.getView().getModel("booking").setProperty("/LeaseType", aFilterItem[0].LeaseType);
					globalThis.getView().getModel("booking").setProperty("/CreationDate", aFilterItem[0].CreationDate);
					globalThis.getView().getModel("booking").setProperty("/CreatedBy", aFilterItem[0].CreatedBy);
					globalThis.getView().getModel("booking").setProperty("/EmployeeResponsible", aFilterItem[0].EmployeeResponsible);
					globalThis.getView().getModel("booking").setProperty("/SalesOrg", aFilterItem[0].SalesOrg);
					globalThis.onPressGo("EXI");
				}

			};

		},

		reqtypeSelected: function (oEvent) {

			var reqType = oEvent.getSource().getSelectedKey();
			if (reqType === "") {
				this.onPressReset(true);
			} else if (reqType === "NEW") {

				this.onPressReset(false);
				this.getView().byId("idPage").setTitle("New Booking");
				this.getView().getModel("bookinginitial").setProperty("/NewBookingSelected", true);
				this.getView().getModel("bookinginitial").setProperty("/ExiBookingSelected", false);

				var itemsData = [];

				for (var i = 0; i < 5; i++) {
					itemsData.push({
						ItemNo: (i + 1),
						RequestedQuan: "",
						UnitType: "",
						ProdHier: "",
						SerialNo: "",
						Location: "",
						DepoCode: "",
						Comments: "",
						condVisible: false,
						dssVisible: false
					});
				}

				this.getView().getModel().setProperty("/items", itemsData);
				this.getView().byId("idTable").setVisibleRowCount(itemsData.length);

				//var itemsDataAfterRemoveEmpty = this.getView().getModel().getData("/items").items;

				// for (var i = 0; i < itemsData.length; i++) {

				// 	var oItemsTableRow = this.getView().byId("idTable").getRows()[i];
				// 	if (!oItemsTableRow) {
				// 		continue;
				// 	}
				// 	oItemsTableRow.getCells()[1].setEnabled(true);
				// 	oItemsTableRow.getCells()[2].setEnabled(true);
				// 	oItemsTableRow.getCells()[3].setEnabled(true);
				// 	oItemsTableRow.getCells()[4].setEnabled(true);
				// }

			} else if (reqType === "EXI") {
				this.getView().byId("idPage").setTitle("Display Booking");
				this.onCurrentMode = "D";

				this.onPressReset(false);
				this.getView().getModel("bookinginitial").setProperty("/NewBookingSelected", false);
				this.getView().getModel("bookinginitial").setProperty("/ExiBookingSelected", true);
				var itemsData = [];

				for (var i = 0; i < 5; i++) {
					itemsData.push({
						ItemNo: (i + 1),
						RequestedQuan: "",
						UnitType: "",
						ProdHier: "",
						SerialNo: "",
						Location: "",
						DepoCode: "",
						Comments: "",
						condVisible: false,
						dssVisible: false
					});
				}

				this.getView().getModel().setProperty("/items", itemsData);
				this.getView().byId("idTable").setVisibleRowCount(itemsData.length);

			}
		},

		onPressDisplayEditToggle: function (oEvent) {

			if (this.onCurrentMode === "D") {
				this.getView().getModel("bookinginitial").setProperty("/displayMode", false);
				this.getView().getModel("bookinginitial").setProperty("/editMode", true);
				this.getView().byId("idPage").setTitle("Edit Booking");
				this.onCurrentMode = "E";
				this.getView().getModel("bookinginitial").setProperty("/DisplayEditToggleText", "Display");
			} else if (this.onCurrentMode === "E") {
				this.getView().getModel("bookinginitial").setProperty("/displayMode", true);
				this.getView().getModel("bookinginitial").setProperty("/editMode", false);
				this.getView().byId("idPage").setTitle("Display Booking");
				this.onCurrentMode = "D";
				this.getView().getModel("bookinginitial").setProperty("/DisplayEditToggleText", "Edit");
			}

			// this.getView().getModel("bookinginitial").updateBindings();

			// this.getView().getModel("bookinginitial").refresh();

			// this.getView().byId("idComboOrderStatus").setEnabled(false);

			// if (this.getView().getModel("booking").getProperty("/LeaseStatus") === "E0004") {
			// 	this.getView().byId("idComboOrderStatus").setEnabled(true);
			// }

			return;

			var isLockRequested = false;
			var lockSource = oEvent.getSource();

			if (oEvent.getSource().getPressed()) { // Edit Button Pressed
				isLockRequested = true;
			}

			if (isLockRequested) { // If it is going to edit, check if the object is locked and then lock!

				this.busyDialog.open();
				this.getOwnerComponent().getModel().read("/checkLockSet(Object='" + this.getView().getModel("booking").getProperty(
						"/ActiveBooking") +
					"',Checkonly=" + true + ",Lock=" + isLockRequested + ")", {
						success: function (oData) {

							if (isLockRequested && oData.Message != "") {
								MessageBox.alert(oData.Message);
								this.busyDialog.close();
								return;
							} else {

								//	If it is not locked, perform the action

								this.getOwnerComponent().getModel().read("/checkLockSet(Object='" + this.getView().getModel("booking").getProperty(
										"/ActiveBooking") +
									"',Lock=" + isLockRequested +
									",Checkonly=" + false +
									")", {
										success: function (oData) {

											// if (isLockRequested && oData.Message != "") {
											// 	MessageBox.alert(oData.Message);
											// 	return;
											// } else {

											// 	if (this.onCurrentMode === "D") {
											// 		this.getView().getModel("bookinginitial").setProperty("/displayMode", false);
											// 		this.getView().getModel("bookinginitial").setProperty("/editMode", true);
											// 		this.getView().byId("idPage").setTitle("Edit Booking");
											// 		this.onCurrentMode = "E";
											// 		this.getView().getModel("bookinginitial").setProperty("/DisplayEditToggleText", "Display");
											// 	} else if (this.onCurrentMode === "E") {
											// 		this.getView().getModel("bookinginitial").setProperty("/displayMode", true);
											// 		this.getView().getModel("bookinginitial").setProperty("/editMode", false);
											// 		this.getView().byId("idPage").setTitle("Display Booking");
											// 		this.onCurrentMode = "D";
											// 		this.getView().getModel("bookinginitial").setProperty("/DisplayEditToggleText", "Edit");
											// 	}
											// }

										}.bind(this),
										error: function (oData) {

										}.bind(this)
									});

								if (this.onCurrentMode === "D") {
									this.getView().getModel("bookinginitial").setProperty("/displayMode", false);
									this.getView().getModel("bookinginitial").setProperty("/editMode", true);
									this.getView().byId("idPage").setTitle("Edit Booking");
									this.onCurrentMode = "E";
									this.getView().getModel("bookinginitial").setProperty("/DisplayEditToggleText", "Display");
								} else if (this.onCurrentMode === "E") {
									this.getView().getModel("bookinginitial").setProperty("/displayMode", true);
									this.getView().getModel("bookinginitial").setProperty("/editMode", false);
									this.getView().byId("idPage").setTitle("Display Booking");
									this.onCurrentMode = "D";
									this.getView().getModel("bookinginitial").setProperty("/DisplayEditToggleText", "Edit");
								}

							}

							this.busyDialog.close();

						}.bind(this),
						error: function (oData) {
							this.busyDialog.close();
						}.bind(this)
					});

			} else { // If it is going to display, no need to check the lock but just unlock.

				this.getOwnerComponent().getModel().read("/checkLockSet(Object='" + this.getView().getModel("booking").getProperty(
						"/ActiveBooking") +
					"',Lock=" + isLockRequested +
					",Checkonly=" + false +
					")", {
						success: function (oData) {

						}.bind(this),
						error: function (oData) {

						}.bind(this)
					});

			}

		},
		onPressReset: function (wanttoclearreqtypefield) {

			if (wanttoclearreqtypefield) {
				this.getView().getModel("bookinginitial").setProperty("/reqtype", "");
			}

			if (this.getView().byId("idTable")) {
				this.getView().byId("idTable").clearSelection();
			}

			this.getView().getModel("bookinginitial").setProperty("/DisplayEditToggleVisible", false);
			this.getView().getModel(
				"bookinginitial").setProperty("/DisplayEditToggleText", "Edit");
			this.getView().byId("idPage").setTitle("Display Booking");
			this.onCurrentMode =
				"D";

			this.NoOfConditions = 0;
			// this.aConditionDataBOOK = [];
			// this.aConditionDataLEASE = [];

			this.aCPAGRETSCHData = [];
			this.aCPAGLEASEData = [];
			if (this.getView().getModel("booking")) {
				this.getView().getModel("booking").setProperty("/itemsCPAGRETSCH", []);
				this.getView().getModel("booking").setProperty("/itemsCPAGLEASE", []);
			}

			this.getView().getModel("booking").setProperty("/ActiveBooking", "");
			this.getView().getModel("booking").setProperty("/itemsCPAGBOOK", []);
			this.getView().getModel("booking").setProperty(
				"/NoOfConditions", this.NoOfConditions);
			this.getView().getModel("booking").setProperty("/CPAGTableVisible", false);
			this.getView()
				.getModel("booking").setProperty("/DPAGTableVisible", false);
			this.getView().getModel("bookinginitial").setProperty(
				"/tableVisibility", false);
			this.getView().getModel("booking").setProperty("/Customer", "");
			this.getView().getModel("booking").setProperty(
				"/Lease", "");
			this.getView().getModel("bookinginitial").setProperty("/GetLeaseVisible", true);
			this.getView().getModel(
				"bookinginitial").setProperty("/NewBookingSelected", false);
			this.getView().getModel("bookinginitial").setProperty(
				"/ExiBookingSelected", false);
			this.getView().byId("idFEComboOrderStatus").setVisible(false);
			this.getView().byId(
				"idComboOrderStatus").setEnabled(false);

			this.getView().getModel("bookinginitial").refresh();
			this.getView().getModel("bookinginitial").updateBindings();

			var oViewModel = this.getView().getModel();
			this.initializeMessageManager(this.getView().getModel());
			var oMessageManager = this.getMessageManager();
			oMessageManager.removeAllMessages();

		},

		handleSuggestionItemSelectedLease: function (oEvent) {
			this.getView().getModel("bookinginitial").setProperty("/tableVisibility", false);
			this.getView().getModel("bookinginitial").setProperty("/GetLeaseVisible", false);
			this.onPressGo("NEW");
		},

		handleSuggestionItemSelectedBooking: function (oEvent) {
			this.getView().getModel("bookinginitial").setProperty("/tableVisibility", false);
			this.getView().getModel("bookinginitial").setProperty("/GetLeaseVisible", false);
			this.onPressGo("EXI");
		},

		handleSuggestForBooking: function (oEvent) {
			var sTerm = oEvent.getParameter("suggestValue");

			var InputFilter = new sap.ui.model.Filter({
				filters: [
					new sap.ui.model.Filter("Lease", sap.ui.model.FilterOperator.Contains, sTerm)
				],
				and: false
			});

			oEvent.getSource().getBinding("suggestionRows").filter(InputFilter);
			oEvent.getSource().setFilterSuggests(false);
		},

		handleSuggestForLease: function (oEvent) {
			this.globalOEvent = oEvent.getParameter("suggestValue");
			var sTerm = oEvent.getParameter("suggestValue");

			var InputFilter = new sap.ui.model.Filter({
				filters: [
					new sap.ui.model.Filter("Lease", sap.ui.model.FilterOperator.Contains, sTerm)
				],
				and: false
			});

			oEvent.getSource().getBinding("suggestionRows").filter(InputFilter);
			oEvent.getSource().setFilterSuggests(false);

			// }
		},
		handleSuggest: function (oEvent) {

			var sTerm = oEvent.getParameter("suggestValue");

			var InputFilter = new sap.ui.model.Filter({
				filters: [
					new sap.ui.model.Filter("Customer", sap.ui.model.FilterOperator.Contains, sTerm),
					new sap.ui.model.Filter("CustomerName", sap.ui.model.FilterOperator.Contains, sTerm)
				],
				and: false
			});

			oEvent.getSource().getBinding("suggestionRows").filter(InputFilter);
			oEvent.getSource().setFilterSuggests(false);
		},

		onValueHelpLeaseRequested: function () {

			if (!this._oLeaseDialog) {
				this._oLeaseDialog = sap.ui.xmlfragment("idLeaseSearchDialog",
					"com.seaco.sd_fiori.view.fragments.LeaseDialog", this);
				this.getView().addDependent(this._oLeaseDialog);
			}

			this.getView().getModel("booking").setProperty("/listLease", this.aLeaseData);
			var leaseDialogVisibleRowCount = 10;
			if (this.aLeaseData.length < 10) {
				leaseDialogVisibleRowCount = this.aLeaseData.length;
			}
			this.getView().getModel("booking").setProperty("/leaseDialogTableVisibleRowCount", leaseDialogVisibleRowCount);

			var laFilters = [];
			var filter = null;

			var leaseValue = sap.ui.core.Fragment.byId("idLeaseSearchDialog", "idLease").getValue();
			if (leaseValue) {
				filter = new sap.ui.model.Filter("Lease", sap.ui.model.FilterOperator.StartsWith, leaseValue);
				laFilters.push(filter);
			}

			// var salesOrgValue = sap.ui.core.Fragment.byId("idLeaseSearchDialog", "idSalesOrg").getValue();
			// if (salesOrgValue) {
			// 	filter = new sap.ui.model.Filter("SalesOrg", sap.ui.model.FilterOperator.StartsWith, salesOrgValue);
			// 	laFilters.push(filter);
			// }

			var leaseTypeValue = sap.ui.core.Fragment.byId("idLeaseSearchDialog", "idLeaseType").getSelectedKey();
			if (leaseTypeValue) {
				filter = new sap.ui.model.Filter("LeaseType", sap.ui.model.FilterOperator.StartsWith, leaseTypeValue);
				laFilters.push(filter);
			}

			var creationDateValue = sap.ui.core.Fragment.byId("idLeaseSearchDialog", "idCreationDate").getValue();
			if (creationDateValue) {
				filter = new sap.ui.model.Filter("CreationDate", sap.ui.model.FilterOperator.EQ, creationDateValue);
				laFilters.push(filter);
			}

			var createdByValue = sap.ui.core.Fragment.byId("idLeaseSearchDialog", "idCreatedBy").getValue();
			if (createdByValue) {
				filter = new sap.ui.model.Filter("CreatedBy", sap.ui.model.FilterOperator.StartsWith, createdByValue);
				laFilters.push(filter);
			}

			var customer = sap.ui.core.Fragment.byId("idLeaseSearchDialog", "idCustomer").getValue();
			if (customer) {
				filter = new sap.ui.model.Filter("Customer", sap.ui.model.FilterOperator.StartsWith, customer);
				laFilters.push(filter);
			}

			var customername = sap.ui.core.Fragment.byId("idLeaseSearchDialog", "idCustomerName").getValue();
			if (customername) {
				filter = new sap.ui.model.Filter("CustomerName", sap.ui.model.FilterOperator.Contains, customer);
				laFilters.push(filter);
			}

			var oLeaseSearchDialogTable = sap.ui.core.Fragment.byId("idLeaseSearchDialog", "idLeaseTable");
			var binding = oLeaseSearchDialogTable.getBinding("rows");
			binding.filter(laFilters);

			this._oLeaseDialog.open();

		},

		onValueHelpBookingRequested: function () {

			if (!this._oBookingDialog) {
				this._oBookingDialog = sap.ui.xmlfragment("idBookingSearchDialog",
					"com.seaco.sd_fiori.view.fragments.BookingDialog", this);
				this.getView().addDependent(this._oBookingDialog);
			}

			var bookingDialogVisibleRowCount = 10;
			if (this.aBookingData.length < 10) {
				bookingDialogVisibleRowCount = this.aBookingData.length;
			}
			this.getView().getModel("booking").setProperty("/bookingDialogTableVisibleRowCount", bookingDialogVisibleRowCount);

			this.getView().getModel("booking").setProperty("/listBooking", this.aBookingData);

			var laFilters = [];
			var filter = null;

			var leaseValue = sap.ui.core.Fragment.byId("idBookingSearchDialog", "idBooking").getValue();
			if (leaseValue) {
				filter = new sap.ui.model.Filter("Lease", sap.ui.model.FilterOperator.StartsWith, leaseValue);
				laFilters.push(filter);
			}

			// var salesOrgValue = sap.ui.core.Fragment.byId("idLeaseSearchDialog", "idSalesOrg").getValue();
			// if (salesOrgValue) {
			// 	filter = new sap.ui.model.Filter("SalesOrg", sap.ui.model.FilterOperator.StartsWith, salesOrgValue);
			// 	laFilters.push(filter);
			// }

			// var leaseTypeValue = sap.ui.core.Fragment.byId("idBookingSearchDialog", "idBookingType").getSelectedKey();
			// if (leaseTypeValue) {
			// 	filter = new sap.ui.model.Filter("LeaseType", sap.ui.model.FilterOperator.StartsWith, leaseTypeValue);
			// 	laFilters.push(filter);
			// }

			var creationDateValue = sap.ui.core.Fragment.byId("idBookingSearchDialog", "idBookingCreationDate").getValue();
			if (creationDateValue) {
				filter = new sap.ui.model.Filter("CreationDate", sap.ui.model.FilterOperator.EQ, creationDateValue);
				laFilters.push(filter);
			}

			var createdByValue = sap.ui.core.Fragment.byId("idBookingSearchDialog", "idBookingCreatedBy").getValue();
			if (createdByValue) {
				filter = new sap.ui.model.Filter("CreatedBy", sap.ui.model.FilterOperator.StartsWith, createdByValue);
				laFilters.push(filter);
			}

			var oBookingSearchDialogTable = sap.ui.core.Fragment.byId("idBookingSearchDialog", "idBookingTable");
			var binding = oBookingSearchDialogTable.getBinding("rows");
			binding.filter(laFilters);
			this._oBookingDialog.open();

		},

		onSearchBooking: function () {

			// Special Case - Because we are removing duplicates ignoring material
			var bookingDataWithMaterialFilter = [];
			var materialValue = sap.ui.core.Fragment.byId("idBookingSearchDialog", "idBookingMaterials").getSelectedKey();
			if (materialValue) {
				// filter = new sap.ui.model.Filter("Material", sap.ui.model.FilterOperator.StartsWith, materialValue);
				// laFilters.push(filter);
				this.aBookingDataWithDuplicates = this.aBookingData;
				for (var i = 0; i < this.aBookingDataWithDuplicates.length; i++) {
					if (this.aBookingDataWithDuplicates[i].Material === materialValue) {
						bookingDataWithMaterialFilter.push(this.aBookingDataWithDuplicates[i]);
					}
				}

				this.getView().getModel("booking").setProperty("/listBooking", bookingDataWithMaterialFilter);
			}

			var laFilters = [];
			var filter = null;

			var leaseValue = sap.ui.core.Fragment.byId("idBookingSearchDialog", "idBooking").getValue();
			if (leaseValue) {
				filter = new sap.ui.model.Filter("Lease", sap.ui.model.FilterOperator.StartsWith, leaseValue);
				laFilters.push(filter);
			}

			// var salesOrgValue = sap.ui.core.Fragment.byId("idLeaseSearchDialog", "idSalesOrg").getValue();
			// if (salesOrgValue) {
			// 	filter = new sap.ui.model.Filter("SalesOrg", sap.ui.model.FilterOperator.StartsWith, salesOrgValue);
			// 	laFilters.push(filter);
			// }

			// var leaseTypeValue = sap.ui.core.Fragment.byId("idBookingSearchDialog", "idBookingType").getSelectedKey();
			// if (leaseTypeValue) {
			// 	filter = new sap.ui.model.Filter("LeaseType", sap.ui.model.FilterOperator.StartsWith, leaseTypeValue);
			// 	laFilters.push(filter);
			// }

			var creationDateValue = sap.ui.core.Fragment.byId("idBookingSearchDialog", "idBookingCreationDate").getValue();
			if (creationDateValue) {
				filter = new sap.ui.model.Filter("CreationDate", sap.ui.model.FilterOperator.EQ, creationDateValue);
				laFilters.push(filter);
			}

			var createdByValue = sap.ui.core.Fragment.byId("idBookingSearchDialog", "idBookingCreatedBy").getValue();
			if (createdByValue) {
				filter = new sap.ui.model.Filter("CreatedBy", sap.ui.model.FilterOperator.StartsWith, createdByValue);
				laFilters.push(filter);
			}

			// var cargoworthyValue = sap.ui.core.Fragment.byId("idLeaseSearchDialog", "idCargoworthy").getSelectedKey();
			// if (cargoworthyValue) {
			// 	filter = new sap.ui.model.Filter("Cargoworthy", sap.ui.model.FilterOperator.EQ, cargoworthyValue);
			// 	laFilters.push(filter);
			// }

			var oBookingSearchDialogTable = sap.ui.core.Fragment.byId("idBookingSearchDialog", "idBookingTable");
			var binding = oBookingSearchDialogTable.getBinding("rows");
			binding.filter(laFilters);

		},

		onSearchLease: function () {

			// Special Case - Because we are removing duplicates ignoring material
			var leaseDataWithMaterialFilter = [];
			var materialValue = sap.ui.core.Fragment.byId("idLeaseSearchDialog", "idMaterials").getSelectedKey();
			if (materialValue) {
				// filter = new sap.ui.model.Filter("Material", sap.ui.model.FilterOperator.StartsWith, materialValue);
				// laFilters.push(filter);
				this.aLeaseDataWithDuplicates = this.aLeaseData;
				for (var i = 0; i < this.aLeaseDataWithDuplicates.length; i++) {
					if (this.aLeaseDataWithDuplicates[i].Material === materialValue) {
						leaseDataWithMaterialFilter.push(this.aLeaseDataWithDuplicates[i]);
					}
				}

				this.getView().getModel("booking").setProperty("/listLease", leaseDataWithMaterialFilter);
			}

			var laFilters = [];
			var filter = null;

			var leaseValue = sap.ui.core.Fragment.byId("idLeaseSearchDialog", "idLease").getValue();
			if (leaseValue) {
				filter = new sap.ui.model.Filter("Lease", sap.ui.model.FilterOperator.StartsWith, leaseValue);
				laFilters.push(filter);
			}

			// var salesOrgValue = sap.ui.core.Fragment.byId("idLeaseSearchDialog", "idSalesOrg").getValue();
			// if (salesOrgValue) {
			// 	filter = new sap.ui.model.Filter("SalesOrg", sap.ui.model.FilterOperator.StartsWith, salesOrgValue);
			// 	laFilters.push(filter);
			// }

			var leaseTypeValue = sap.ui.core.Fragment.byId("idLeaseSearchDialog", "idLeaseType").getSelectedKey();
			if (leaseTypeValue) {
				filter = new sap.ui.model.Filter("LeaseType", sap.ui.model.FilterOperator.StartsWith, leaseTypeValue);
				laFilters.push(filter);
			}

			var creationDateValue = sap.ui.core.Fragment.byId("idLeaseSearchDialog", "idCreationDate").getValue();
			if (creationDateValue) {
				filter = new sap.ui.model.Filter("CreationDate", sap.ui.model.FilterOperator.EQ, creationDateValue);
				laFilters.push(filter);
			}

			var createdByValue = sap.ui.core.Fragment.byId("idLeaseSearchDialog", "idCreatedBy").getValue();
			if (createdByValue) {
				filter = new sap.ui.model.Filter("CreatedBy", sap.ui.model.FilterOperator.StartsWith, createdByValue);
				laFilters.push(filter);
			}

			var customer = sap.ui.core.Fragment.byId("idLeaseSearchDialog", "idCustomer").getValue();
			if (customer) {
				filter = new sap.ui.model.Filter("Customer", sap.ui.model.FilterOperator.StartsWith, customer);
				laFilters.push(filter);
			}

			var customername = sap.ui.core.Fragment.byId("idLeaseSearchDialog", "idCustomerName").getValue();
			if (customername) {
				filter = new sap.ui.model.Filter("CustomerName", sap.ui.model.FilterOperator.Contains, customer);
				laFilters.push(filter);
			}

			var oLeaseSearchDialogTable = sap.ui.core.Fragment.byId("idLeaseSearchDialog", "idLeaseTable");
			var binding = oLeaseSearchDialogTable.getBinding("rows");
			binding.filter(laFilters);

		},

		handleSuggestForLocation: function (oEvent) {

			// var sTerm = oEvent.getParameter("suggestValue");
			// var aFilters = [];
			// if (sTerm) {
			// 	aFilters.push(new Filter("ZCityDesc", sap.ui.model.FilterOperator.StartsWith, sTerm));
			// }
			// oEvent.getSource().getBinding("suggestionItems").filter(aFilters);

			var oInput = oEvent.getSource();
			if (!oInput.getSuggestionItems().length) {
				oInput.bindAggregation("suggestionItems", {
					path: "/CitiesOnly",
					template: new sap.ui.core.Item({
						text: "{text}"
					})
				});
			}

		},

		onPressGetLease: function () {

			this.aLeaseTypeData = [];

			this.aLeaseTypeData.push({
				"key": "ZMF",
				"text": "Finance Lease"
			});

			this.aLeaseTypeData.push({
				"key": "ZMV",
				"text": "Variable Lease"
			});

			this.aLeaseTypeData.push({
				"key": "ZMP",
				"text": "Positioning Lease"
			});

			this.aLeaseTypeData.push({
				"key": "ZMX",
				"text": "Fixed Term Lease"
			});

			this.getView().getModel("booking").setProperty("/LeaseTypes", this.aLeaseTypeData);

			// this.aLeaseTypeData = [];

			// this.aLeaseTypeData.push({
			// 	"key": "ZBF",
			// 	"text": "Finance Lease"
			// });

			// this.aLeaseTypeData.push({
			// 	"key": "ZBV",
			// 	"text": "Variable Lease"
			// });

			// this.aLeaseTypeData.push({
			// 	"key": "ZBP",
			// 	"text": "Positioning Lease"
			// });

			// this.aLeaseTypeData.push({
			// 	"key": "ZBX",
			// 	"text": "Fixed Term Lease"
			// });

			// this.getView().getModel("booking").setProperty("/LeaseTypes", this.aLeaseTypeData);

			// var aFilterItem = [];
			var sCustomer = this.getView().getModel("booking").getProperty("/Customer");

			if (!sCustomer) {
				return;
			}

			var laFilters = [];
			var filter = new sap.ui.model.Filter("Customer", sap.ui.model.FilterOperator.EQ, sCustomer);
			laFilters.push(filter);

			if (!this.aLeaseData) {
				this.busyDialog.open();
				this.getOwnerComponent().getModel().read("/f4Set", {
					filters: laFilters,
					success: function (oData) {
						this.aLeaseData = [];

						for (var i = 0; i < oData.results.length; i++) {
							this.aLeaseData.push(oData.results[i]);
							this.aLeaseData[i].Cargoworthy = (this.aLeaseData[i].Cargoworthy === "CW") ? "YES" : "NO";
							this.aLeaseData[i].CreationDate = sap.ui.core.format.DateFormat.getDateTimeInstance({
								pattern: "dd-MM-yyyy"
							}).format(new Date(oData.results[i].CreationDate));
						}

						this.aLeaseDataWithDuplicates = this.aLeaseData;

						// Remove Duplicates from Lease Data
						var arr = {};

						for (var j = 0, len = this.aLeaseData.length; j < len; j++) {
							arr[this.aLeaseData[j]['Lease']] = this.aLeaseData[j];
						}

						this.aLeaseData = [];
						for (var key in arr)
							this.aLeaseData.push(arr[key]);
						this.aLeaseData.sort(sort_by('Lease', false, function (a) {
							return a.toUpperCase();
						}));

						this.getView().getModel("booking").setProperty("/listLease", this.aLeaseData);

						if (!this._oLeaseDialog) {
							this._oLeaseDialog = sap.ui.xmlfragment("idLeaseSearchDialog",
								"com.seaco.sd_fiori.view.fragments.LeaseDialog", this);
							this.getView().addDependent(this._oLeaseDialog);
						}
						this.busyDialog.close();
						this._oLeaseDialog.open();

					}.bind(this),
					error: function (oData) {
						this.busyDialog.close();
					}.bind(this)
				});
			} else {
				if (!this._oLeaseDialog) {
					this._oLeaseDialog = sap.ui.xmlfragment("idLeaseSearchDialog",
						"com.seaco.sd_fiori.view.fragments.LeaseDialog", this);
					this.getView().addDependent(this._oLeaseDialog);
				}
				this._oLeaseDialog.open();
			}

			this.getView().getModel("booking").setProperty("/DPAGTableVisible", false);

		},

		onPressDialogCancel: function (oEvent) {
			oEvent.getSource().getParent().getParent().getParent().close();
		},

		onSelectConditionTypeBOOK: function (oEvent) {

			return;

			var oConditionType = oEvent.getSource().getSelectedKey();
			var conditionDataArray = this.aConditionDataBOOK;
			var priceRecordsProperty = "/oPriceModelBOOKCPAG";

			var priceDataArray = [];
			var priceDataLength = 0;

			oEvent.getSource().getParent().getCells()[1].removeAllItems(); // Initially remove all items from Price Type
			oEvent.getSource().getParent().getCells()[1].setSelectedKey("");

			for (var i = 0; i < conditionDataArray.length; i++) {
				if (conditionDataArray[i].ConditionType === oConditionType) {
					priceDataArray.push(conditionDataArray[i]);
					priceDataLength = priceDataArray.length;
					priceDataLength = priceDataLength - 1;
					priceDataArray[priceDataLength].Column = priceDataArray[priceDataLength].PriceTypeText.replace("VBELN,", "")
						.replace("HIENR", "Location")
						.replace("MATNR", "Product")
						.replace("PRODH", "Prod. Hier");

					oEvent.getSource().getParent().getCells()[1].addItem(new sap.ui.core.Item({ // Add Items to Price Type Combo instead of model - because it changes for every line based on selected condition type
						key: priceDataArray[priceDataLength].PriceType,
						text: priceDataArray[priceDataLength].Column
					}));

				}
			}

			// var oPriceModelLEASECPAG = new JSONModel({});
			// oPriceModelLEASECPAG.setSizeLimit(1000);
			// this.getView().setModel(oPriceModelLEASECPAG, "oPriceModelLEASECPAG");
			// this.getView().getModel("oPriceModelLEASECPAG").setProperty("/", priceDataArray);

		},

		onSelectConditionTypeLEASE: function (oEvent) {

			var oConditionType = oEvent.getSource().getSelectedKey();
			var conditionDataArray = this.aConditionDataLEASE;
			var priceRecordsProperty = "/oPriceModelLEASECPAG";

			var priceDataArray = [];
			var priceDataLength = 0;

			oEvent.getSource().getParent().getCells()[1].removeAllItems(); // Initially remove all items from Price Type
			oEvent.getSource().getParent().getCells()[1].setSelectedKey("");

			for (var i = 0; i < conditionDataArray.length; i++) {
				if (conditionDataArray[i].ConditionType === oConditionType) {
					priceDataArray.push(conditionDataArray[i]);
					priceDataLength = priceDataArray.length;
					priceDataLength = priceDataLength - 1;
					priceDataArray[priceDataLength].Column = priceDataArray[priceDataLength].PriceTypeText.replace("VBELN,", "")
						.replace("HIENR", "Location")
						.replace("MATNR", "Product")
						.replace("PRODH", "Prod. Hier");

					oEvent.getSource().getParent().getCells()[1].addItem(new sap.ui.core.Item({ // Add Items to Price Type Combo instead of model - because it changes for every line based on selected condition type
						key: priceDataArray[priceDataLength].PriceType,
						text: priceDataArray[priceDataLength].Column
					}));

				}
			}

			// var oPriceModelLEASECPAG = new JSONModel({});
			// oPriceModelLEASECPAG.setSizeLimit(1000);
			// this.getView().setModel(oPriceModelLEASECPAG, "oPriceModelLEASECPAG");
			// this.getView().getModel("oPriceModelLEASECPAG").setProperty("/", priceDataArray);

		},

		onSelectPriceTypeLEASE: function (oEvent) {

			var condUnit = oEvent.getSource().getBindingContext("booking").getObject().CondUnit;

			var priceDataSelectedValue = oEvent.getSource().getValue();
			var priceDataSelectedKey = oEvent.getSource().getSelectedKey();
			oEvent.getSource().getParent().getCells()[1].setSelectedKey(priceDataSelectedKey);

			oEvent.getSource().getParent().getCells()[2].setSelectedKey("");
			oEvent.getSource().getParent().getCells()[3].setSelectedKey("");
			oEvent.getSource().getParent().getCells()[4].setSelectedKey("");

			oEvent.getSource().getParent().getCells()[2].setEnabled(false);
			oEvent.getSource().getParent().getCells()[3].setEnabled(false);
			oEvent.getSource().getParent().getCells()[4].setEnabled(false);
			oEvent.getSource().getParent().getCells()[8].setEnabled(true); // Currency

			// Check if price type contains HIENR
			if (priceDataSelectedValue.includes("Location")) {
				oEvent.getSource().getParent().getCells()[2].setEnabled(true);
			}

			// Check if price type contains MATNR
			if (priceDataSelectedValue.includes("Product")) {
				oEvent.getSource().getParent().getCells()[3].setEnabled(true);
			}

			// Check if price type contains PRODH
			if (priceDataSelectedValue.includes("Prod. Hier")) {
				oEvent.getSource().getParent().getCells()[4].setEnabled(true);
			}

			if (condUnit === "A") { // Percentage
				oEvent.getSource().getParent().getCells()[8].setSelectedKey("%");
				oEvent.getSource().getParent().getCells()[8].setEnabled(false);
			}

		},

		deleteRowVCONTable: function (oEvent) {

			var tableId = "idCPAGLEASETable";
			var oData = this.getView().getModel("booking").getData().itemsCPAGLEASE;

			var oTable = sap.ui.core.Fragment.byId("idVCONDialog", tableId);
			if (oTable.getSelectedIndices().length === 0) {
				return;
			}

			var oModel = oTable.getModel("booking");

			var reverse = [].concat(oTable.getSelectedIndices()).reverse();
			reverse.forEach(function (index) {
				oData.splice(index, 1);
			});
			oModel.refresh();
			oTable.setSelectedIndex(-1);

			if (oData.length > 10) {
				oTable.setVisibleRowCount(10);
			} else {
				oTable.setVisibleRowCount(oData.length);
			}

			this.getView().getModel("booking").updateBindings();
			this.getView().getModel("booking").refresh();

		},

		addRowVCONTable: function (oEvent) {

			var tableId = "idCPAGLEASETable";
			var processIconTabBar = "LEASE";
			var existingArray = this.getView().getModel("booking").getData().itemsCPAGLEASE;
			var tabProperty = "/itemsCPAGLEASE";

			// var oVCONTableData = existingArray;
			if (!existingArray) {
				// dataArray = [];
				existingArray = [];
			}

			var today = new Date();
			var dd = today.getDate();
			var mm = today.getMonth() + 1; //January is 0!

			var yyyy = today.getFullYear();
			if (dd < 10) {
				dd = '0' + dd;
			}
			if (mm < 10) {
				mm = '0' + mm;
			}

			today = dd + '.' + mm + '.' + yyyy;

			var validFrom = today;

			existingArray.push({
				ItemNo: this.itemSelected,
				Types: processIconTabBar,
				CondType: "",
				CondTypeText: "",
				ReqQty: "",
				Currency: this.getView().getModel("booking").getData().Currency
			});
			this.getView().getModel("booking").setProperty(tabProperty, existingArray);
			if (existingArray > 10) {
				sap.ui.core.Fragment.byId("idVCONDialog", tableId).setVisibleRowCount(10);
			} else {
				sap.ui.core.Fragment.byId("idVCONDialog", tableId).setVisibleRowCount(existingArray.length);
			}

			this.getView().getModel("booking").updateBindings();
			this.getView().getModel("booking").refresh();
		},

		onPressConfirmSelectVCON: function (oEvent) {

			var existingArray = this.getView().getModel("booking").getData().itemsCPAGLEASE;

			existingArray = existingArray.filter(function (obj) {
				return obj.CondType != '' && obj.ReqQty != '';
			});

			var isDuplicated = false;
			for (var j = 0; j < existingArray.length; j++) {
				for (var k = (j + 1); k < existingArray.length; k++) {
					if (existingArray[j].CondType == existingArray[k].CondType) {
						isDuplicated = true;
						break;
					}
				}
			}

			if (isDuplicated) {
				MessageBox.alert("Condition Type cannot be repeated for the same item; Please remove duplicates!");
			} else {

				if (this.conditionsDataFromDraftLEASE.length === 0) {
					this.conditionsDataFromDraftLEASE = existingArray;
				} else {
					if (existingArray[0]) {
						var ItemNo = existingArray[0].ItemNo;
						this.conditionsDataFromDraftLEASE = this.conditionsDataFromDraftLEASE.filter(function (obj) {
							return obj.ItemNo != ItemNo;
						});
						this.conditionsDataFromDraftLEASE.push.apply(this.conditionsDataFromDraftLEASE, existingArray);
					}
				}
				this.updateDSSandCondIndicators();
				oEvent.getSource().getParent().getParent().getParent().close();
			}

		},

		onPressVCON: function (dontopen) {

			var oItemsData = this.getView().getModel().getData().items;
			var oTable = this.getView().byId("idTable");

			if (oTable.getSelectedIndices().length === 0) {
				MessageBox.alert("Please select an item");
				return;
			} else if (oTable.getSelectedIndices().length === 1) {
				var selectedItem = oItemsData[oTable.getSelectedIndices()[0]];
				if (selectedItem.Location === "") {
					MessageBox.alert("Please select a location");
					return;
				} else if (selectedItem.RequestedQuan === "" || selectedItem.RequestedQuan === 0) {
					MessageBox.alert("Please input requested quantity");
					return;
				}
			} else {
				MessageBox.alert("Please select one item at a time");
				return;
			}

			if (!this._oVCONDialog) {
				this._oVCONDialog = sap.ui.xmlfragment("idVCONDialog",
					"com.seaco.sd_fiori.view.fragments.VCONDialog", this);
				this.getView().addDependent(this._oVCONDialog);
			}

			this.itemSelected = oTable.getSelectedIndices()[0] + 1; // If 0th line is selected, it is 1st line.

			// Simple Remove Valid From and Valid To

			for (var i = 0; i < this.conditionsDataFromDraftLEASE.length; i++) {

				this.conditionsDataFromDraftLEASE[i].ValidFrom = null;
				this.conditionsDataFromDraftLEASE[i].ValidTo = null;

			}

			var ItemNo = selectedItem.ItemNo;
			var Location = selectedItem.Location;
			var LocCode = selectedItem.LocCode;
			var UnitType = selectedItem.UnitType;
			var ProdHier = selectedItem.ProdHier;

			var ConditionTitle = "Location " + Location;
			if (UnitType) {
				ConditionTitle = ConditionTitle + " | " + "Product " + UnitType;
			}
			// if (ProdHier) {
			// 	ConditionTitle = ConditionTitle + " | " + "Prod. Hier " + ProdHier;
			// }
			this.getView().getModel("booking").setProperty("/ConditionTitle", ConditionTitle);

			this.conditionsDataTemp = [];
			for (i = 0; i < 20; i++) {
				this.conditionsDataTemp.push({
					ItemNo: this.itemSelected,
					Types: "LEASE",
					CondType: "",
					CondTypeText: "",
					ReqQty: "",
					Currency: this.getView().getModel("booking").getData().Currency
				});
			}

			// Now Check If there is any data in draft...

			var lineIter = 0;
			if (this.conditionsDataFromDraftLEASE.length !== 0) {
				for (var i = 0; i < this.conditionsDataFromDraftLEASE.length; i++) {
					if (parseInt(ItemNo) === parseInt(this.conditionsDataFromDraftLEASE[i].ItemNo)) {
						this.conditionsDataTemp[lineIter].ReqQty = this.conditionsDataFromDraftLEASE[i].ReqQty;
						this.conditionsDataTemp[lineIter].Currency = this.conditionsDataFromDraftLEASE[i].Currency;
						this.conditionsDataTemp[lineIter].CondType = this.conditionsDataFromDraftLEASE[i].CondType;
						lineIter++;
					}
				}
			}

			this.getView().getModel("booking").setProperty("/itemsCPAGLEASE", this.conditionsDataTemp);
			sap.ui.core.Fragment.byId("idVCONDialog", "idCPAGLEASETable").setVisibleRowCount(this.conditionsDataTemp.length);

			this.getView().getModel("booking").updateBindings();
			this.getView().getModel("booking").refresh();

			// this.getView().getModel("booking").setProperty("/itemsCPAGLEASE", this.aCPAGLEASEData);
			// sap.ui.core.Fragment.byId("idVCONDialog", "idCPAGLEASETable").setVisibleRowCount(this.aCPAGLEASEData.length);

			this._oVCONDialog.open();

		},

		deleteRowDSSTable: function (oEvent) {

			var tableId = "idCPAGDSSTable";
			var oData = this.getView().getModel("booking").getData().itemsCPAGDSS;

			var oTable = sap.ui.core.Fragment.byId("idDSSDialog", tableId);
			if (oTable.getSelectedIndices().length === 0) {
				return;
			}

			var oModel = oTable.getModel("booking");

			var reverse = [].concat(oTable.getSelectedIndices()).reverse();
			reverse.forEach(function (index) {
				oData.splice(index, 1);
			});
			oModel.refresh();
			oTable.setSelectedIndex(-1);

			if (oData.length > 10) {
				oTable.setVisibleRowCount(10);
			} else {
				oTable.setVisibleRowCount(oData.length);
			}

			this.getView().getModel("booking").updateBindings();
			this.getView().getModel("booking").refresh();

		},

		addRowDSSTable: function (oEvent) {

			var tableId = "idCPAGDSSTable";
			var processIconTabBar = "DSS";
			var existingArray = this.getView().getModel("booking").getData().itemsCPAGDSS;
			var tabProperty = "/itemsCPAGDSS";

			if (!existingArray) {
				// dataArray = [];
				existingArray = [];
			}

			var today = new Date();
			var dd = today.getDate();
			var mm = today.getMonth() + 1; //January is 0!

			var yyyy = today.getFullYear();
			if (dd < 10) {
				dd = '0' + dd;
			}
			if (mm < 10) {
				mm = '0' + mm;
			}

			today = dd + '.' + mm + '.' + yyyy;

			var validFrom = today;

			existingArray.push({
				ItemNo: this.itemSelected,
				Types: processIconTabBar,
				LocCode: "",
				Location: "",
				ReqQty: "",
				Handling: "",
				Dropoff: "",
				Currency: this.getView().getModel("booking").getData().Currency
			});
			this.getView().getModel("booking").setProperty(tabProperty, existingArray);
			if (existingArray.length > 10) {
				sap.ui.core.Fragment.byId("idDSSDialog", tableId).setVisibleRowCount(10);
			} else {
				sap.ui.core.Fragment.byId("idDSSDialog", tableId).setVisibleRowCount(this.conditionsDataFromDraftDSS.length);
			}

			this.getView().getModel("booking").updateBindings();
			this.getView().getModel("booking").refresh();
		},

		onPressConfirmSelectDSS: function (oEvent) {

			var existingArray = this.getView().getModel("booking").getData().itemsCPAGDSS;

			existingArray = existingArray.filter(function (obj) {
				return obj.LocCode != '' && obj.ReqQty != '' && obj.Dropoff != '';
			});

			var isDuplicated = false;
			for (var j = 0; j < existingArray.length; j++) {
				for (var k = (j + 1); k < existingArray.length; k++) {
					if (existingArray[j].LocCode == existingArray[k].LocCode) {
						isDuplicated = true;
						break;
					}
				}
			}

			if (isDuplicated) {
				MessageBox.alert("Location cannot be repeated for the same item; Please remove duplicates!");
			} else {

				var exceededLines = [];
				var DSSMaxQtyAllowed = 0;
				for (var j = 0; j < existingArray.length; j++) {
					// DSSMaxQtyAllowed = DSSMaxQtyAllowed + parseInt(existingArray[j].ReqQty, 10);
					if (parseInt(existingArray[j].ReqQty, 10) > this.DSSMaxQtyAllowed) {
						exceededLines.push({
							locationExceeded: existingArray[j].Location,
							quantityExceeded: parseInt(existingArray[j].ReqQty, 10)
						});
					}
				}
				// if (DSSMaxQtyAllowed > this.DSSMaxQtyAllowed) {
				if (exceededLines.length !== 0) {
					var exceedError = "";
					for (var k = 0; k < exceededLines.length; k++) {
						if (k === 0) {
							exceedError = "Following locations have exceeded the item quantity : " + this.DSSMaxQtyAllowed + "\n";
							exceedError = exceedError + "\n" + exceededLines[k].locationExceeded + " : " + exceededLines[k].quantityExceeded;
						} else {
							exceedError = exceedError + "\n" + exceededLines[k].locationExceeded + " : " + exceededLines[k].quantityExceeded;
						}
					}

					if (exceedError !== "") {
						MessageBox.alert(exceedError);
						return;
					}
					// MessageBox.alert("Sum of Quantity cannot exceed Item Quantity : " + this.DSSMaxQtyAllowed);
				} else {

					if (this.conditionsDataFromDraftDSS.length === 0) {
						this.conditionsDataFromDraftDSS = existingArray;
					} else {
						if (existingArray[0]) {
							var ItemNo = existingArray[0].ItemNo;
							this.conditionsDataFromDraftDSS = this.conditionsDataFromDraftDSS.filter(function (obj) {
								return obj.ItemNo != ItemNo;
							});
							this.conditionsDataFromDraftDSS.push.apply(this.conditionsDataFromDraftDSS, existingArray);
						}
					}

					// Update the indicators - DSS and Cond.

					this.updateDSSandCondIndicators();

					oEvent.getSource().getParent().getParent().getParent().close();
				}

			}

		},

		updateDSSandCondIndicators: function () {

			var oItemsData = this.getView().getModel().getData().items;

			var itemsDSS = this.conditionsDataFromDraftDSS;
			if (itemsDSS) {
				for (var i = 0; i < oItemsData.length; i++) {
					oItemsData[i].dssVisible = false;
					loop2: for (var j = 0; j < itemsDSS.length; j++) {
						if ((parseInt(itemsDSS[j].ItemNo, 10) == (parseInt(oItemsData[i].ItemNo * 10), 10)) && itemsDSS[j].LocCode != "" && itemsDSS[
								j]
							.ReqQty != "") {
							oItemsData[i].dssVisible = true;
							break loop2;
						}
					}
				}
			} else {
				for (var i = 0; i < oItemsData.length; i++) {
					oItemsData[i].dssVisible = false;
				}
			}

			var itemsLEASE = this.conditionsDataFromDraftLEASE;
			if (itemsLEASE) {
				for (var i = 0; i < oItemsData.length; i++) {
					oItemsData[i].condVisible = false;
					loop2: for (var j = 0; j < itemsLEASE.length; j++) {
						// if (itemsLEASE[j].ItemNo === undefined) { // If ItemNo is undefined, it means it is fresh data from Validation
						// 	oItemsData[i].condVisible = true;
						// 	break loop2;
						// }
						if (parseInt(itemsLEASE[j].ItemNo, 10) == parseInt(oItemsData[i].ItemNo, 10) && (itemsLEASE[j].ReqQty) && (itemsLEASE[j].CondType)) {
							oItemsData[i].condVisible = true;
							break loop2;
						}
					}
				}
			} else {
				for (var i = 0; i < oItemsData.length; i++) {
					oItemsData[i].condVisible = false;
				}
			}

			this.getView().getModel().updateBindings();
			this.getView().getModel().refresh();

		},

		onPressDSS: function (oEvent) {

			// 			this.DSSMaxQtycondUnit = oEvent.getSource().getBindingContext().getObject().ReqQty;

			var oItemsData = this.getView().getModel().getData().items;
			var oTable = this.getView().byId("idTable");

			if (oTable.getSelectedIndices().length === 0) {
				MessageBox.alert("Please select an item");
				return;
			} else if (oTable.getSelectedIndices().length === 1) {
				var selectedItem = oItemsData[oTable.getSelectedIndices()[0]];
				if (selectedItem.Location === "") {
					MessageBox.alert("Please select a location");
					return;
				} else if (selectedItem.RequestedQuan === "" || selectedItem.RequestedQuan === 0) {
					MessageBox.alert("Please input requested quantity");
					return;
				}
			} else {
				MessageBox.alert("Please select one item at a time");
				return;
			}

			if (!this._oDSSDialog) {
				this._oDSSDialog = sap.ui.xmlfragment("idDSSDialog",
					"com.seaco.sd_fiori.view.fragments.DSSDialog", this);
				this.getView().addDependent(this._oDSSDialog);
			}

			this.itemSelected = (oTable.getSelectedIndices()[0] + 1) * 10; // If 0th line is selected, it is 1st line.
			this.DSSMaxQtyAllowed = (selectedItem.RequestedQuan != "") ? parseInt(selectedItem.RequestedQuan, 10) : 0;
			// this.condDataTemp = [];
			// for (var i = 0; i < this.conditionsDataFromDraftDSS.length; i++) {
			// 	if (this.conditionsDataFromDraftDSS[i].ItemNo == selectedItem.ItemNo) {
			// 		this.itemSelected = this.conditionsDataFromDraftDSS[i].ItemNo;
			// 		this.condDataTemp.push(this.conditionsDataFromDraftDSS[i]);
			// 	}
			// }

			// Simple Remove Valid From and Valid To

			for (var i = 0; i < this.conditionsDataFromDraftDSS.length; i++) {

				this.conditionsDataFromDraftDSS[i].ValidFrom = null;
				this.conditionsDataFromDraftDSS[i].ValidTo = null;

			}

			var ItemNo = selectedItem.ItemNo * 10;
			var Location = selectedItem.Location;
			var LocCode = selectedItem.LocCode;
			var UnitType = selectedItem.UnitType;
			var ProdHier = selectedItem.ProdHier;

			var DSSTitle = "Location " + Location;
			if (UnitType) {
				DSSTitle = DSSTitle + " | " + "Product " + UnitType;
			}
			// if (ProdHier) {
			// 	DSSTitle = DSSTitle + " | " + "Prod. Hier " + ProdHier;
			// }
			this.getView().getModel("booking").setProperty("/DSSTitle", DSSTitle);

			this.conditionsDataDSSTemp = [];
			for (i = 0; i < 20; i++) {
				this.conditionsDataDSSTemp.push({
					ItemNo: this.itemSelected,
					Types: "DSS",
					LocCode: "",
					Location: "",
					ReqQty: "",
					Handling: "",
					Dropoff: "",
					Currency: this.getView().getModel("booking").getData().Currency
				});
			}

			// Now Check If there is any data in draft...

			var lineIter = 0;
			if (this.conditionsDataFromDraftDSS.length !== 0) {
				for (var i = 0; i < this.conditionsDataFromDraftDSS.length; i++) {
					if (parseInt(ItemNo) === parseInt(this.conditionsDataFromDraftDSS[i].ItemNo)) {
						this.conditionsDataDSSTemp[lineIter].ReqQty = this.conditionsDataFromDraftDSS[i].ReqQty;
						this.conditionsDataDSSTemp[lineIter].Currency = this.conditionsDataFromDraftDSS[i].Currency;
						this.conditionsDataDSSTemp[lineIter].LocCode = this.conditionsDataFromDraftDSS[i].LocCode;
						this.conditionsDataDSSTemp[lineIter].Location = this.conditionsDataFromDraftDSS[i].Location;
						this.conditionsDataDSSTemp[lineIter].Handling = this.conditionsDataFromDraftDSS[i].Handling;
						this.conditionsDataDSSTemp[lineIter].Dropoff = this.conditionsDataFromDraftDSS[i].Dropoff;
						lineIter++;
					}
				}
			}

			this.getView().getModel("booking").setProperty("/itemsCPAGDSS", this.conditionsDataDSSTemp);
			sap.ui.core.Fragment.byId("idDSSDialog", "idCPAGDSSTable").setVisibleRowCount(this.conditionsDataDSSTemp.length);
			// this.getView().getModel("booking").setProperty("/itemsCPAGDSS", this.conditionsDataFromDraftDSS);

			this.getView().getModel("booking").updateBindings();
			this.getView().getModel("booking").refresh();

			this._oDSSDialog.open();

		},

		onPressCPAG: function (dontopen) {

			if (!this.conditionsDataFromDraftBOOK) {
				this.conditionsDataFromDraftBOOK = [];
			}

			this.getView().getModel("booking").setProperty("/itemsCPAGBOOK", this.conditionsDataFromDraftBOOK);

			if (!this._oCPAGDialog) {
				this._oCPAGDialog = sap.ui.xmlfragment("container-sd_fiori---worklist--idCPAGDialog",
					"com.seaco.sd_fiori.view.fragments.CPAGDialog", this);
				this.getView().addDependent(this._oCPAGDialog);
			}
			sap.ui.core.Fragment.byId("container-sd_fiori---worklist--idCPAGDialog", "idCPAGBOOKTable").setVisibleRowCount(this.conditionsDataFromDraftBOOK
				.length);
			this._oCPAGDialog.open();

		},

		onPressCPAGNEW: function (dontopen) {

			// Set Price Agreement Header...

			this.getView().getModel("booking").setProperty("/priceAgreementTitle", "Price Agreement");
			this.getView().getModel("booking").setProperty("/ConditionTitle", "Conditions");

			if (this.getView().getModel("booking").getProperty("/ActiveBooking")) {
				this.getView().getModel("booking").setProperty("/priceAgreementTitle", ("Price Agreement for Booking - " + this.getView().getModel(
					"booking").getProperty("/ActiveBooking")));

				this.getView().getModel("booking").setProperty("/ConditionTitle", ("Conditions for Booking - " + this.getView().getModel(
					"booking").getProperty("/ActiveBooking")));

			}

			var isMATNRORPRODH = "";
			var today = new Date();
			var dd = today.getDate();
			var mm = today.getMonth() + 1; //January is 0!

			var yyyy = today.getFullYear();
			if (dd < 10) {
				dd = '0' + dd;
			}
			if (mm < 10) {
				mm = '0' + mm;
			}

			today = dd + '.' + mm + '.' + yyyy;

			var day9998end = '31.12.9998';
			var day9999start = '01.01.9999';

			// if (!this._oCPAGDialog) {
			// 	this._oCPAGDialog = sap.ui.xmlfragment("container-sd_fiori---worklist--idCPAGDialog",
			// 		"com.seaco.sd_fiori.view.fragments.CPAGDialog", this);
			// 	this.getView().addDependent(this._oCPAGDialog);
			// }

			if (!this._oVCONDialog) {
				this._oVCONDialog = sap.ui.xmlfragment("idVCONDialog",
					"com.seaco.sd_fiori.view.fragments.VCONDialog", this);
				this.getView().addDependent(this._oVCONDialog);
			}

			var aItemsData = this.getView().getModel().getData("/items").items;
			this.aCPAGLEASEData = [];
			this.aCPAGBOOKData = [];

			// Set Dropdown Values first - before opening the dialog

			var locationValuesForCPAGDialog = get_unique_properties_from_array(aItemsData, "Location");
			var unitTypeValuesForCPAGDialog = get_unique_properties_from_array(aItemsData, "UnitType");
			var prodHierValuesForCPAGDialog = get_unique_properties_from_array(aItemsData, "ProdHier");
			var locationValuesForCPAGDialogKeyText = [];
			for (var i = 0; i < locationValuesForCPAGDialog.length; i++) {
				locationValuesForCPAGDialogKeyText.push({
					key: get_city_code(locationValuesForCPAGDialog[i], this.CitiesOnlyData),
					text: locationValuesForCPAGDialog[i]
				});
			}

			var unitTypeValuesForCPAGDialogKeyText = [];
			for (var i = 0; i < unitTypeValuesForCPAGDialog.length; i++) {
				unitTypeValuesForCPAGDialogKeyText.push({
					key: unitTypeValuesForCPAGDialog[i],
					text: unitTypeValuesForCPAGDialog[i]
				});
			}
			var prodHierValuesForCPAGDialogKeyText = [];
			for (var i = 0; i < prodHierValuesForCPAGDialog.length; i++) {
				prodHierValuesForCPAGDialogKeyText.push({
					key: prodHierValuesForCPAGDialog[i],
					text: prodHierValuesForCPAGDialog[i]
				});
			}

			var oCityModelDSS = new JSONModel({});
			oCityModelDSS.setSizeLimit(1000);
			this.getView().setModel(oCityModelDSS, "oCityModelDSS");
			var locationAllData = this.getView().getModel("oCityModel").getProperty("/Cities");
			this.getView().getModel("oCityModelDSS").setProperty("/Cities", locationAllData);

			// Check if one of the values in Location is Global
			var isAtLeastOneGlobalEntered = false;
			for (var y = 0; y < aItemsData.length; y++) {
				if (aItemsData[y].Location === "GLOBAL") {
					isAtLeastOneGlobalEntered = true;
					break;
				}
			}

			// isAtLeastOneGlobalEntered = true; // Open Location with All Values...

			// Limited Values for Lease
			if (isAtLeastOneGlobalEntered) { // If at least one global is entered outside, enable all possible values for location in CPAG
				var oCityModelCPAG = new JSONModel({});
				oCityModelCPAG.setSizeLimit(1000);
				this.getView().setModel(oCityModelCPAG, "oCityModelCPAG");
				var locationAllData = this.getView().getModel("oCityModel").getProperty("/Cities");
				this.getView().getModel("oCityModelCPAG").setProperty("/Cities", locationAllData);
			} else {

				// Remove Duplicates from City Data

				var arr = {};

				for (var j = 0, len = locationValuesForCPAGDialogKeyText.length; j < len; j++) {
					arr[locationValuesForCPAGDialogKeyText[j]['key']] = locationValuesForCPAGDialogKeyText[j];
				}

				locationValuesForCPAGDialogKeyText = [];
				for (var key in arr)
					locationValuesForCPAGDialogKeyText.push(arr[key]);
				locationValuesForCPAGDialogKeyText.sort(sort_by('key', false, function (a) {
					return a.toUpperCase();
				}));

				var oCityModelCPAG = new JSONModel({});
				oCityModelCPAG.setSizeLimit(1000);
				this.getView().setModel(oCityModelCPAG, "oCityModelCPAG");

				this.getView().getModel("oCityModelCPAG").setProperty("/Cities", locationValuesForCPAGDialogKeyText);
			}

			// Remove Duplicates from UnitType Data

			arr = {};

			for (var j = 0, len = unitTypeValuesForCPAGDialogKeyText.length; j < len; j++) {
				arr[unitTypeValuesForCPAGDialogKeyText[j]['key']] = unitTypeValuesForCPAGDialogKeyText[j];
			}

			unitTypeValuesForCPAGDialogKeyText = [];
			for (var key in arr)
				unitTypeValuesForCPAGDialogKeyText.push(arr[key]);
			unitTypeValuesForCPAGDialogKeyText.sort(sort_by('key', false, function (a) {
				return a.toUpperCase();
			}));

			var oProdModelCPAG = new JSONModel({});
			oProdModelCPAG.setSizeLimit(1000);
			this.getView().setModel(oProdModelCPAG, "oProdModelCPAG");
			this.getView().getModel("oProdModelCPAG").setProperty("/Prods", unitTypeValuesForCPAGDialogKeyText);

			// Remove Duplicates from Prod Hier Data

			arr = {};

			for (var j = 0, len = prodHierValuesForCPAGDialogKeyText.length; j < len; j++) {
				arr[prodHierValuesForCPAGDialogKeyText[j]['key']] = prodHierValuesForCPAGDialogKeyText[j];
			}

			prodHierValuesForCPAGDialogKeyText = [];
			for (var key in arr)
				prodHierValuesForCPAGDialogKeyText.push(arr[key]);
			prodHierValuesForCPAGDialogKeyText.sort(sort_by('key', false, function (a) {
				return a.toUpperCase();
			}));

			var oProdHierModelCPAG = new JSONModel({});
			oProdHierModelCPAG.setSizeLimit(1000);
			this.getView().setModel(oProdHierModelCPAG, "oProdHierModelCPAG");
			this.getView().getModel("oProdHierModelCPAG").setProperty("/Prods", prodHierValuesForCPAGDialogKeyText);

			this.reeferOrTankData = [];
			// for (var i = 0; i < aItemsData.length; i++) {
			// 	loop2: for (var p = 0; p < this.ProdOnlyData.length; p++) {
			// 		if (this.ProdOnlyData[p].key === aItemsData[i].UnitType) {

			// 			if (this.ProdOnlyData[p].matkl === "1400") {
			// 				this.reeferOrTankData.push({
			// 					matkl: "Reefer",
			// 					itemno: i + 1
			// 				});
			// 			} else if (this.ProdOnlyData[p].matkl === "1200") {
			// 				this.reeferOrTankData.push({
			// 					matkl: "Tank",
			// 					itemno: i + 1
			// 				});
			// 			}

			// 			break loop2;
			// 		}
			// 	}
			// }

			var isReefer = false,
				isTank = false;
			for (var w = 0; w < aItemsData.length; w++) {
				isReefer = false;
				isTank = false;

				loop2: for (var p = 0; p < this.ProdOnlyData.length; p++) {
					if (this.ProdOnlyData[p].key === aItemsData[w].UnitType) {

						if (this.ProdOnlyData[p].matkl === "1400") {
							this.reeferOrTankData.push({
								matkl: "Reefer",
								itemno: i + 1
							});
							isReefer = true;
						} else if (this.ProdOnlyData[p].matkl === "1200") {
							this.reeferOrTankData.push({
								matkl: "Tank",
								itemno: i + 1
							});
							isTank = true;
						}

						break loop2;
					}
				}

				// Check for each line item - UnitType is entered or prod hierarchy is entered
				var oItemNo = aItemsData[w].ItemNo;
				var oUnitType = aItemsData[w].UnitType;
				var oProdHier = aItemsData[w].ProdHier;
				var oRequestedQuan = aItemsData[w].RequestedQuan;
				var oLocation = aItemsData[w].Location;
				var tempisMATNRORPRODH = "";

				if (oUnitType) {
					isMATNRORPRODH = "MATNR";
				} else if (oProdHier) {
					isMATNRORPRODH = "PRODH";
				}

				this.aConditionDataBOOK.sort(sort_by('ConditionType', false, function (a) {
					return a.toUpperCase();
				}));

				// var isValueFoundInDraft = false;
				var valueFoundInDraft = {};
				var valuesFoundInDraft = [];

				if (this.aConditionDataBOOK) {
					for (var i = 0; i < this.aConditionDataBOOK.length; i++) {
						valuesFoundInDraft = [];
						valueFoundInDraft = {};
						// if (this.aConditionDataBOOK[i].PriceTypeText.includes(isMATNRORPRODH)) {
						valuesFoundInDraft = checkConditionFoundInDraftBook(this.aConditionDataBOOK[i], this.conditionsDataFromDraftBOOK);
						for (var x = 0; x < valuesFoundInDraft.length; x++) {
							valueFoundInDraft = valuesFoundInDraft[x];
							if (this.aConditionDataBOOK[i].Mandatory === "X" || valueFoundInDraft.isFound) {
								if (valueFoundInDraft.isFound) { // If value found is draft
									this.aCPAGBOOKData.push({
										Types: "BOOK",
										ConditionType: valueFoundInDraft.objectFound.ConditionType,
										ConditionTypeText: get_condtype_text(valueFoundInDraft.objectFound.ConditionType, this.aConditionDataBOOK),
										PriceType: valueFoundInDraft.objectFound.PriceType,
										PriceTypeText: valueFoundInDraft.objectFound.PriceTypeText.replace("Sales Doc./", "").replace("HIENR", "Location").replace(
											"MATNR", "Product").replace("PRODH", "Prod. Hier"),
										Location: (valueFoundInDraft.objectFound.PriceTypeText.includes("Location")) ? valueFoundInDraft.objectFound.Location : "",
										UnitType: (valueFoundInDraft.objectFound.PriceTypeText.includes("Product")) ? valueFoundInDraft.objectFound.UnitType : "",
										ProdHier: (valueFoundInDraft.objectFound.PriceTypeText.includes("Prod. Hier")) ? valueFoundInDraft.objectFound.ProdHier : "",
										Qty: valueFoundInDraft.objectFound.Qty,
										Amount: valueFoundInDraft.objectFound.Amount,
										ValidFrom: convert_date_ddmmyyyy(valueFoundInDraft.objectFound.ValidFrom),
										ValidTo: convert_date_ddmmyyyy(valueFoundInDraft.objectFound.ValidTo),
										Currency: (this.aConditionDataBOOK[i].CondUnit === "A") ? "%" : valueFoundInDraft.objectFound.Currency,
										CurrencyEnabled: (this.aConditionDataBOOK[i].CondUnit === "A") ? false : true,
										Handling: valueFoundInDraft.objectFound.Handling,
										Dropoff: valueFoundInDraft.objectFound.Dropoff,
										ConditionEnabled: (valueFoundInDraft.objectFound.Mandatory === "X") ? true : true,
										PriceTypeEnabled: (valueFoundInDraft.objectFound.Mandatory === "X") ? true : true,
										LocationEnabled: (valueFoundInDraft.objectFound.PriceTypeText.includes("Location")) ? true : false,
										UnitTypeEnabled: (valueFoundInDraft.objectFound.PriceTypeText.includes("Product")) ? true : false,
										ProdHierEnabled: (valueFoundInDraft.objectFound.PriceTypeText.includes("Prod. Hier")) ? true : false,
										Mandatory: valueFoundInDraft.objectFound.Mandatory,
										CondUnit: this.aConditionDataBOOK[i].CondUnit
									});
								} else { // RLC#12 - No default values if it is a fresh transaction
									if (this.aConditionDataBOOK) {
										for (var i = 0; i < this.aConditionDataBOOK.length; i++) {

											if (this.aConditionDataBOOK[i].PriceTypeText.includes(isMATNRORPRODH)) {
												if (this.aConditionDataBOOK[i].Mandatory === "X") {
													this.aCPAGBOOKData.push({
														Types: "BOOK",
														ConditionType: this.aConditionDataBOOK[i].ConditionType,
														ConditionTypeText: this.aConditionDataBOOK[i].ConditionTypeText,
														PriceType: this.aConditionDataBOOK[i].PriceType,
														PriceTypeText: this.aConditionDataBOOK[i].PriceTypeText.replace("VBELN,", "").replace("HIENR", "Location").replace(
															"MATNR", "Product").replace("PRODH", "Prod. Hier"),
														Location: (this.aConditionDataBOOK[i].PriceTypeText.includes("HIENR")) ? oLocation : "",
														UnitType: (this.aConditionDataBOOK[i].PriceTypeText.includes("MATNR")) ? oUnitType : "",
														ProdHier: (this.aConditionDataBOOK[i].PriceTypeText.includes("PRODH")) ? oProdHier : "",
														Qty: "",
														Amount: "",
														ValidFrom: this.getView().getModel("booking").getProperty("/ContractStrDate") ? this.getView().getModel("booking").getProperty(
															"/ContractStrDate") : today,
														ValidTo: "31.12.9999",
														Currency: this.getView().getModel("booking").getData().Currency,
														Handling: "",
														Dropoff: "",
														ConditionEnabled: true,
														PriceTypeEnabled: true,
														LocationEnabled: (this.aConditionDataBOOK[i].PriceTypeText.includes("HIENR")) ? true : false,
														UnitTypeEnabled: (this.aConditionDataBOOK[i].PriceTypeText.includes("MATNR")) ? true : false,
														ProdHierEnabled: (this.aConditionDataBOOK[i].PriceTypeText.includes("PRODH")) ? true : false,
														Mandatory: "X"
													});
												}
											}
										}

										// Sort Final BOOK Table by Condition Type

										this.aCPAGBOOKData.sort(sort_by('ConditionType', false, function (a) {
											return a.toUpperCase();
										}));

									}
								}
							}
						}
						// }
					}

					// Sort Final BOOK Table by Condition Type

					this.aCPAGBOOKData.sort(sort_by('ConditionType', false, function (a) {
						return a.toUpperCase();
					}));

				}

				valueFoundInDraft = {};
				valuesFoundInDraft = [];
				if (this.aConditionDataLEASE) {
					for (var i = 0; i < this.aConditionDataLEASE.length; i++) {
						valueFoundInDraft = {};
						valuesFoundInDraft = [];
						if (this.aConditionDataLEASE[i].PriceTypeText.includes(isMATNRORPRODH)) {
							valuesFoundInDraft = checkConditionFoundInDraft(this.aConditionDataLEASE[i], this.conditionsDataFromDraftLEASE);
							if (valuesFoundInDraft.length === 0 && this.aConditionDataLEASE[i].Mandatory === "X") {
								var validFrom = today;
								var validTo = "31.12.9999";
								if (this.aConditionDataLEASE[i].ConditionType === "ZDR") {
									validTo = day9998end;
								}

								if (this.aConditionDataLEASE[i].ConditionType === "ZDRP") {
									validFrom = day9999start;
								} else if (this.getView().getModel("booking").getProperty("/ContractStrDate")) {
									validFrom = this.getView().getModel("booking").getProperty("/ContractStrDate");
								} else {
									validFrom = today;
								}

								this.aCPAGLEASEData.push({
									Types: "LEASE",
									ConditionType: this.aConditionDataLEASE[i].ConditionType,
									ConditionTypeText: this.aConditionDataLEASE[i].ConditionTypeText,
									PriceType: this.aConditionDataLEASE[i].PriceType,
									PriceTypeText: this.aConditionDataLEASE[i].PriceTypeText.replace("VBELN,", "").replace("HIENR", "Location").replace(
										"MATNR", "Product").replace("PRODH", "Prod. Hier"),
									Location: (this.aConditionDataLEASE[i].PriceTypeText.includes("HIENR")) ? oLocation : "",
									UnitType: (this.aConditionDataLEASE[i].PriceTypeText.includes("MATNR")) ? oUnitType : "",
									ProdHier: (this.aConditionDataLEASE[i].PriceTypeText.includes("PRODH")) ? oProdHier : "",
									Qty: "",
									Amount: "",
									ValidFrom: validFrom,
									ValidTo: validTo,
									Currency: (this.aConditionDataLEASE[i].CondUnit === "A") ? "%" : this.getView().getModel("booking").getData().Currency,
									CurrencyEnabled: (this.aConditionDataLEASE[i].CondUnit === "A") ? false : true,
									Handling: "",
									Dropoff: "",
									ConditionEnabled: true,
									PriceTypeEnabled: true,
									LocationEnabled: (this.aConditionDataLEASE[i].PriceTypeText.includes("HIENR")) ? true : false,
									UnitTypeEnabled: (this.aConditionDataLEASE[i].PriceTypeText.includes("MATNR")) ? true : false,
									ProdHierEnabled: (this.aConditionDataLEASE[i].PriceTypeText.includes("PRODH")) ? true : false,
									Mandatory: "X",
									CondUnit: this.aConditionDataLEASE[i].CondUnit
								});
							} else {
								for (var x = 0; x < valuesFoundInDraft.length; x++) {
									valueFoundInDraft = valuesFoundInDraft[x];
									if (this.aConditionDataLEASE[i].Mandatory === "X" || valueFoundInDraft.isFound) {
										if (valueFoundInDraft.isFound) { // If value found is draft
											this.aCPAGLEASEData.push({
												Types: "LEASE",
												ConditionType: valueFoundInDraft.objectFound.ConditionType,
												ConditionTypeText: get_condtype_text(valueFoundInDraft.objectFound.ConditionType, this.aConditionDataLEASE),
												PriceType: valueFoundInDraft.objectFound.PriceType,
												PriceTypeText: valueFoundInDraft.objectFound.PriceTypeText.replace("Sales Doc./", "").replace("HIENR", "Location").replace(
													"MATNR", "Product").replace("PRODH", "Prod. Hier"),
												Location: (valueFoundInDraft.objectFound.PriceTypeText.includes("Location")) ? valueFoundInDraft.objectFound.Location : "",
												UnitType: (valueFoundInDraft.objectFound.PriceTypeText.includes("Product")) ? valueFoundInDraft.objectFound.UnitType : "",
												ProdHier: (valueFoundInDraft.objectFound.PriceTypeText.includes("Prod. Hier")) ? valueFoundInDraft.objectFound.ProdHier : "",
												Qty: valueFoundInDraft.objectFound.Qty,
												Amount: valueFoundInDraft.objectFound.Amount,
												ValidFrom: convert_date_ddmmyyyy(valueFoundInDraft.objectFound.ValidFrom),
												ValidTo: convert_date_ddmmyyyy(valueFoundInDraft.objectFound.ValidTo),
												Currency: (this.aConditionDataLEASE[i].CondUnit === "A") ? "%" : valueFoundInDraft.objectFound.Currency,
												CurrencyEnabled: (this.aConditionDataLEASE[i].CondUnit === "A") ? false : true,
												Handling: valueFoundInDraft.objectFound.Handling,
												Dropoff: valueFoundInDraft.objectFound.Dropoff,
												ConditionEnabled: (valueFoundInDraft.objectFound.Mandatory === "X") ? true : true,
												PriceTypeEnabled: (valueFoundInDraft.objectFound.Mandatory === "X") ? true : true,
												LocationEnabled: (valueFoundInDraft.objectFound.PriceTypeText.includes("Location")) ? true : false,
												UnitTypeEnabled: (valueFoundInDraft.objectFound.PriceTypeText.includes("Product")) ? true : false,
												ProdHierEnabled: (valueFoundInDraft.objectFound.PriceTypeText.includes("Prod. Hier")) ? true : false,
												Mandatory: valueFoundInDraft.objectFound.Mandatory,
												CondUnit: this.aConditionDataLEASE[i].CondUnit
											});
										} else {

											var validFrom = today;
											var validTo = "31.12.9999";
											if (this.aConditionDataLEASE[i].ConditionType === "ZDR") {
												validTo = day9998end;
											}

											if (this.aConditionDataLEASE[i].ConditionType === "ZDRP") {
												validFrom = day9999start;
											} else if (this.getView().getModel("booking").getProperty("/ContractStrDate")) {
												validFrom = this.getView().getModel("booking").getProperty("/ContractStrDate");
											} else {
												validFrom = today;
											}

											this.aCPAGLEASEData.push({
												Types: "LEASE",
												ConditionType: this.aConditionDataLEASE[i].ConditionType,
												ConditionTypeText: this.aConditionDataLEASE[i].ConditionTypeText,
												PriceType: this.aConditionDataLEASE[i].PriceType,
												PriceTypeText: this.aConditionDataLEASE[i].PriceTypeText.replace("VBELN,", "").replace("HIENR", "Location").replace(
													"MATNR", "Product").replace("PRODH", "Prod. Hier"),
												Location: (this.aConditionDataLEASE[i].PriceTypeText.includes("HIENR")) ? oLocation : "",
												UnitType: (this.aConditionDataLEASE[i].PriceTypeText.includes("MATNR")) ? oUnitType : "",
												ProdHier: (this.aConditionDataLEASE[i].PriceTypeText.includes("PRODH")) ? oProdHier : "",
												Qty: "",
												Amount: "",
												ValidFrom: validFrom,
												ValidTo: validTo,
												Currency: (this.aConditionDataLEASE[i].CondUnit === "A") ? "%" : this.getView().getModel("booking").getData().Currency,
												CurrencyEnabled: (this.aConditionDataLEASE[i].CondUnit === "A") ? false : true,
												Handling: "",
												Dropoff: "",
												ConditionEnabled: true,
												PriceTypeEnabled: true,
												LocationEnabled: (this.aConditionDataLEASE[i].PriceTypeText.includes("HIENR")) ? true : false,
												UnitTypeEnabled: (this.aConditionDataLEASE[i].PriceTypeText.includes("MATNR")) ? true : false,
												ProdHierEnabled: (this.aConditionDataLEASE[i].PriceTypeText.includes("PRODH")) ? true : false,
												Mandatory: "X",
												CondUnit: this.aConditionDataLEASE[i].CondUnit
											});
										}
									}
								}
							}

						}
					}

					// Sort Final LEASE Table by Condition Type

					this.aCPAGLEASEData.sort(sort_by('ConditionType', false, function (a) {
						return a.toUpperCase();
					}));

					// Ensure to replace all / with ,
					for (var t = 0; t < this.aCPAGLEASEData.length; t++) {
						this.aCPAGLEASEData[t].PriceTypeText = this.aCPAGLEASEData[t].PriceTypeText.replace("/", ",");
					}

				}
			}

			// this.aCPAGBOOKData = []; // RLC#12
			this.getView().getModel("booking").setProperty("/itemsCPAGLEASE", this.aCPAGLEASEData);
			sap.ui.core.Fragment.byId("idVCONDialog", "idCPAGLEASETable").setVisibleRowCount(this.aCPAGLEASEData.length); // RLC#12

			this.getView().getModel("booking").setProperty("/itemsCPAGBOOK", this.aCPAGBOOKData); // RLC#12
			sap.ui.core.Fragment.byId("container-sd_fiori---worklist--idCPAGDialog", "idCPAGBOOKTable").setVisibleRowCount(this.aCPAGBOOKData
				.length);

			this.getView().getModel("booking").updateBindings();

			// if (dontopen !== "YES") {
			// 	this._oCPAGDialog.open();
			// }

		},

		// onSelectConditionType: function (oEvent) {
		// 	this.getView().getModel("booking").setProperty("/CPAGTableVisible", false);
		// 	var oConditionType = oEvent.getSource().getSelectedKey();
		// 	var priceDataLength = 0;
		// 	this.aPriceData = [];

		// 	for (var i = 0; i < this.aConditionDataLEASE.length; i++) {
		// 		if (this.aConditionDataLEASE[i].ConditionType === oConditionType) {
		// 			this.aPriceData.push(this.aConditionDataLEASE[i]);
		// 			priceDataLength = this.aPriceData.length;
		// 			priceDataLength = priceDataLength - 1;
		// 			this.aPriceData[priceDataLength].Column = this.aPriceData[priceDataLength].PriceTypeText.replace("VBELN", "Sales. Doc")
		// 				.replace("HIENR", "Location")
		// 				.replace("MATNR", "Material")
		// 				.replace("PRODH", "Prod. Hier");
		// 		}
		// 	}

		// 	this.getView().getModel("booking").setProperty("/PriceRecords", this.aPriceData);
		// 	this.getView().getModel("booking").setProperty("/ConditionType", oConditionType);
		// },

		onSelectPriceTypeNotUsed: function (oEvent) {
			this.getView().getModel("booking").setProperty("/CPAGTableVisible", false);
			var oPriceType = oEvent.getSource().getSelectedKey();
			// var oPriceTypeText = oEvent.getSource().getValue();

			var oPriceTypeText = "";

			for (var x = 0; x < this.aConditionDataLEASE.length; x++) {
				if (oPriceType === this.aConditionDataLEASE[x].PriceType) {
					oPriceTypeText = this.aConditionDataLEASE[x].PriceTypeText;
				}
			}

			this.getView().getModel("booking").setProperty("/PriceType", oPriceType);

			var oConditionType = sap.ui.core.Fragment.byId("container-sd_fiori---worklist--idCPAGDialog", "idCPAGComboConditionType").getSelectedKey();
			var oPriceRecords = this.getView().getModel("booking").getProperty("/PriceRecords");
			var noOfColumns = 0;
			var oColumns = [];
			var oColumnTitles = [];
			var aColumnData = [];
			var aRowData = [];
			var aColDescription = "";
			var colTemplate = null;
			this.locationColInCondRecord = 0;
			this.noOfPriceColumns = 0;
			for (var i = 0; i < oPriceRecords.length; i++) {
				if (oPriceRecords[i].ConditionType === oConditionType && oPriceRecords[i].PriceType === oPriceType) {
					noOfColumns = oPriceRecords[i].Column;

					oColumns = oPriceTypeText.split(',');
					oColumnTitles = oPriceRecords[i].PriceTypeText.split(',');

					// if (!noOfColumns) {
					noOfColumns = oColumns.length;
					this.noOfPriceColumns = noOfColumns;
					// }

					var oComboCityTemplate = new sap.ui.core.ListItem({
						key: "{oCityModel>key}",
						text: "{oCityModel>text}"
					});

					var oComboProdTemplate = new sap.ui.core.ListItem({
						key: "{oProdModel>key}",
						text: "{oProdModel>text}"
					});

					for (var j = 0; j < oColumnTitles.length; j++) {

						// Set sap.m.Input by default. Change it to sap.m.ComboBox only for HIENR and MATNR
						colTemplate = new sap.m.Input({
							editable: (oColumns[j] === "VBELN") ? false : true,
							visible: (oColumns[j] === "VBELN") ? false : true
						});

						switch (oColumnTitles[j]) {
						case "VBELN":
							aColDescription = "Sales Doc.";
							break;
						case "HIENR":
							aColDescription = "Location";
							colTemplate = new sap.m.ComboBox({
								editable: true,
								visible: true,
								items: {
									path: "oCityModel>/Cities",
									template: oComboCityTemplate
								}
								// items: { path: 'oCityModel>/Cities', templateShareable:true}" template: oComboCityTemplate
							});
							this.locationColInCondRecord = (j + 1);
							break;
						case "MATNR":
							aColDescription = "Material";
							colTemplate = new sap.m.ComboBox({
								editable: true,
								visible: true,
								items: {
									path: "oProdModel>/Prods",
									template: oComboProdTemplate
								}
								// items: "{ path: 'oProdModel>/Prods', templateShareable:true, template: oComboProdTemplate }"
							});
							break;
						case "PRODH":
							aColDescription = "Prod. Hier";
							break;
						default:
							aColDescription = oColumnTitles[j];
							break;
						}

						// aColDescription = oColumnTitles[j];
						aColumnData.push({
							columnId: "Col" + (j + 1),
							label: aColDescription,
							value: (oColumns[j] === "VBELN") ? "temp" : "",
							editable: (oColumns[j] === "VBELN") ? false : true,
							visible: (oColumns[j] === "VBELN") ? false : true,
							template: colTemplate
						});

						// aRowData.push({
						// 	oColumns: ""
						// });

					}
					break;
				}
			}

			// Quantity Column
			aColumnData.push({
				columnId: "Col" + (j + 1),
				label: "Qty",
				value: "",
				editable: true,
				visible: true,
				template: new sap.m.Input({
					editable: true,
					visible: true
				})
			});

			// Amount Column
			aColumnData.push({
				columnId: "Col" + (j + 2),
				label: "Amount",
				value: "",
				editable: true,
				visible: true,
				template: new sap.m.Input({
					editable: true,
					visible: true
				})
			});

			// Valid From Column
			aColumnData.push({
				columnId: "Col" + (j + 3),
				label: "Valid From",
				value: "",
				editable: true,
				visible: true,
				template: new sap.m.DatePicker({
					valueFormat: "dd.MM.yyyy",
					displayFormat: "dd.MM.yyyy",
					visible: true
				})
			});

			// Valid To Column
			aColumnData.push({
				columnId: "Col" + (j + 4),
				label: "Valid To",
				value: "",
				editable: true,
				visible: true,
				template: new sap.m.DatePicker({
					valueFormat: "dd.MM.yyyy",
					displayFormat: "dd.MM.yyyy",
					visible: true
				})
			});

			// Currency Column
			aColumnData.push({
				columnId: "Col" + (j + 5),
				label: "Curr.",
				value: this.getView().getModel("booking").getData().Currency,
				editable: false,
				visible: true,
				template: new sap.m.Input({
					editable: false,
					visible: true
				})
			});

			var today = new Date();
			var dd = today.getDate();
			var mm = today.getMonth() + 1; //January is 0!

			var yyyy = today.getFullYear();
			if (dd < 10) {
				dd = '0' + dd;
			}
			if (mm < 10) {
				mm = '0' + mm;
			}

			today = dd + '.' + mm + '.' + yyyy;

			if (noOfColumns == 3) {
				aRowData = [{
					Col1: "temp",
					Col2: "",
					Col3: "",
					Col4: "",
					Col5: "",
					Col6: today,
					Col7: "31.12.9999",
					Col8: this.getView().getModel("booking").getData().Currency
				}];
			} else if (noOfColumns == 2) {
				aRowData = [{
					Col1: "temp",
					Col2: "",
					Col3: "",
					Col4: "",
					Col5: today,
					Col6: "31.12.9999",
					Col7: this.getView().getModel("booking").getData().Currency
						// Col6: this.getView().getModel("booking").getData().Currency
				}];
			}

			var oModel = new sap.ui.model.json.JSONModel();

			oModel.setData({
				columns: aColumnData,
				rows: aRowData
			});

			var oTable = sap.ui.core.Fragment.byId("container-sd_fiori---worklist--idCPAGDialog", "idCPAGTable");
			oTable.setModel(oModel);
			sap.ui.core.Fragment.byId("container-sd_fiori---worklist--idCPAGDialog", "idCPAGTable").removeAllColumns();
			this.getView().getModel("booking").setProperty("/CPAGTableVisible", true);
			oTable.bindColumns("/columns", function (index, context) {
				var sColumnId = context.getObject().columnId;
				var label = context.getObject().label;
				// var editable = context.getObject().editable;
				var stemplate = context.getObject().template;
				var sVisible = context.getObject().visible;
				// var value = context.getObject().value;
				return new sap.ui.table.Column({
					//id: sColumnId,
					label: label,
					visible: sVisible,
					// template: new sap.m.Input({
					// 	value: "{" + sColumnId + "}",
					// 	change: function () {
					// 		// alert(JSON.stringify(this.getModel().getData()));
					// 	},
					// 	editable: editable
					// }),
					template: stemplate.bindProperty("value", sColumnId),
					sortProperty: sColumnId,
					filterProperty: sColumnId
				});
			});
			oTable.bindRows("/rows");

		},

		// validateCPAGF4Values: function (oEvent) {

		// 	var oCPAGBook = this.getView().getModel("booking").getProperty("/itemsCPAGBOOK");

		// 	var locationAllowedData = this.getView().getModel("oCityModelCPAG").setProperty("/Cities");
		// 	var productAllowedData = this.getView().getModel("oProdModelCPAG").setProperty("/Cities");

		// },

		validateCPAGAgainstMainItems: function (messageModel) {

			var itemsBookData = this.getView().getModel("booking").getProperty("/itemsCPAGBOOK");

			var aItemsData = this.getView().getModel().getData("/items").items;
			var isValidArray = [];
			var isValid = false;

			var additionalText = "";
			var errorMessage = "";

			for (var i = 0; i < this.aCPAGLEASEData.length; i++) {
				loop1: for (var j = 0; j < aItemsData.length; j++) {
					isValid = compare_location_material_prodhier(aItemsData[j], this.aCPAGLEASEData[i], (aItemsData[j].Location === "GLOBAL") ?
						true :
						false);

					if (isValid) {
						break loop1;
					}
				}

					if (!isValid) {

					additionalText = "";

					errorMessage = "Line No. " + (i + 1) +
						" Cond. Type " + this.aCPAGLEASEData[i].ConditionType +
						" Price Type " + this.aCPAGLEASEData[i].PriceTypeText;

					this.addMessages("Error", errorMessage, errorMessage, messageModel,
						i, additionalText);

					isValidArray.push({
						isValid: isValid,
						tableType: "LEASE"
					});
					isValid = false;
				}
			}

			var isAllSuccessFul = true;
			var tableControl = "";
			var tableIter = 0;
			var CPAGBookLength = itemsBookData.length;
			for (var i = 0; i < isValidArray.length; i++) {

				tableControl = sap.ui.core.Fragment.byId("container-sd_fiori---worklist--idCPAGDialog", "idCPAGBOOKTable");

				if (tableControl.getRows()[tableIter])
					tableControl.getRows()[tableIter].removeStyleClass("errorcolor");
				if (isValidArray[i].isValid === false) {
					if (tableControl.getRows()[tableIter])
					//tableControl.getRows()[tableIter].addStyleClass("errorcolor");
						isAllSuccessFul = false;
				}

				if ((tableIter + 1) === CPAGBookLength) {
					tableIter = 0;
					CPAGBookLength = 999999;
				} else {
					tableIter++;
				}

			}

			sap.ui.core.Fragment.byId("container-sd_fiori---worklist--idCPAGDialog", "idCPAGBOOKTable").getModel().refresh();

			this.getView().getModel("booking").setProperty("/itemsCPAGBOOK", itemsBookData);

			return isAllSuccessFul;

		},

		onPressConfirmSelectCPAG: function (oEvent) {

			this.initializeMessageManager(this.getView().getModel());
			var oMessageManager = this.getMessageManager();
			oMessageManager.removeAllMessages();
			var oViewModel = this.getView().getModel();

			// var isvalidateCPAGF4Values = this.validateCPAGF4Values(oViewModel);
			// if (!isvalidateCPAGF4Values) {
			// 	return;
			// }

			// var isvalidateCPAGGeneral = this.validateCPAGGeneral(oViewModel);
			// if (!isvalidateCPAGGeneral) {
			// 	return;
			// }

			// var isvalidateCPAGMandatory = this.validateCPAGMandatory(oViewModel);
			// if (!isvalidateCPAGMandatory) {
			// 	return;
			// }
			var isvalidateCPAGAgainstMainItemsPassed = this.validateCPAGAgainstMainItems(oViewModel);

			if (isvalidateCPAGAgainstMainItemsPassed) {
				oEvent.getSource().getParent().getParent().getParent().close();
			} else {

			}

			// if (this.getView().getModel("booking").getProperty("/ConditionType")) {
			// 	this.onPressAddConditionCPAG();
			// }

			// if (this.oCPAGDataAll.length > 0) {
			// 	this.getView().getModel("booking").setProperty("/DPAGTableVisible", true);
			// } else {
			// 	this.getView().getModel("booking").setProperty("/DPAGTableVisible", false);
			// }

			// this.initializeMessageManager(this.getView().getModel());
			// var oMessageManager = this.getMessageManager();
			// oMessageManager.removeAllMessages();
			// var oViewModel = this.getView().getModel();

			// oEvent.getSource().getParent().getParent().getParent().close();

		},

		addConditionsToMainTable: function () {

			var noOfColsInt = 0;
			if (this.noOfPriceColumns == 3) {
				noOfColsInt = 8;
			} else {
				noOfColsInt = 7;
			}

			var itemsDataDPAG = this.getView().getModel().getData().itemsDPAG;
			if (!itemsDataDPAG) {
				itemsDataDPAG = [];
			}

			this.DPAGData = itemsDataDPAG;

			var DPAGData = [];
			var singleLineDPAG = {
				ConditionType: "",
				PriceType: "",
				Location: "",
				// DepoCode: "",
				Material: "",
				ProdHier: "",
				Qty: "",
				Amount: "",
				ValidFrom: "",
				ValidTo: ""
			};

			var oCPAGDataCurr = this.getView().getModel("booking").getProperty("/CPAG");

			for (var x = 0; x < oCPAGDataCurr.length; x++) {

				var p = oCPAGDataCurr[x];

				if (noOfColsInt == 7) {
					singleLineDPAG.ConditionType = p.ConditionType;
					singleLineDPAG.PriceType = p.PriceType;
					// singleLineDPAG.Location = p.Col2;

					if (p.PriceTypeText === "MATNR") {
						singleLineDPAG.Material = p.Col2;
					} else if (p.PriceTypeText === "PRODH") {
						singleLineDPAG.ProdHier = p.Col2;
					}

					singleLineDPAG.Qty = p.Col3;
					singleLineDPAG.Amount = p.Col4;
					singleLineDPAG.ValidFrom = p.Col5;
					singleLineDPAG.ValidTo = p.Col6;
					singleLineDPAG.Currency = p.Col7;

				} else if (noOfColsInt == 8) {
					singleLineDPAG.ConditionType = p.ConditionType;
					singleLineDPAG.PriceType = p.PriceType;
					singleLineDPAG.Location = p.Col2;

					if (p.PriceTypeText === "MATNR") {
						singleLineDPAG.Material = p.Col3;
					} else if (p.PriceTypeText === "PRODH") {
						singleLineDPAG.ProdHier = p.Col3;
					}

					singleLineDPAG.Qty = p.Col4;
					singleLineDPAG.Amount = p.Col5;
					singleLineDPAG.ValidFrom = p.Col6;
					singleLineDPAG.ValidTo = p.Col7;
					singleLineDPAG.Currency = p.Col8;
				}
				// for (var key in p) {
				// 	if (p.hasOwnProperty(key)) {

				// 	}
				// }

				DPAGData.push(singleLineDPAG);

			}

			this.DPAGData.push.apply(this.DPAGData, DPAGData);

			this.getView().getModel().setProperty("/itemsDPAG", this.DPAGData);
			if (this.DPAGData.length > 10) {
				this.getView().byId("idDPAGTable").setVisibleRowCount(10);
			} else {
				this.getView().byId("idDPAGTable").setVisibleRowCount(this.DPAGData.length);
			}

			this.getView().byId("idDPAGTable").getModel().updateBindings();

		},

		checkMATNRorPRODH: function (priceType) {

			var priceRecordData = this.getView().getModel("booking").getData().PriceRecords;
			for (var i = 0; i < priceRecordData.length; i++) {
				if (priceRecordData[i].PriceType === priceType) {
					if (priceRecordData[i].PriceTypeText.includes("MATNR")) {
						return "MATNR";
					} else if (priceRecordData[i].PriceTypeText.includes("PRODH")) {
						return "PRODH";
					}
				}
			}
		},

		// onPressAddConditionCPAG: function () {

		// 	//var oCPAGData = this.getView().getModel("booking").getData().CPAG;
		// 	var oCPAGTable = sap.ui.core.Fragment.byId("container-sd_fiori---worklist--idCPAGDialog", "idCPAGTable");
		// 	var oCPAGModel = oCPAGTable.getModel();
		// 	var oCPAGData = oCPAGModel.getData().rows;
		// 	var isValidCPAG = true;
		// 	var enteredItemsWithoutDuplicate = [];

		// 	/* Remove Unwanted Lines first */

		// 	if (this.noOfPriceColumns == 3) {
		// 		for (var i = 0; i < oCPAGData.length; i++) { // Check if columns are entered - then add
		// 			if (oCPAGData[i].Col1 && oCPAGData[i].Col2 && oCPAGData[i].Col3 && oCPAGData[i].Col4 && oCPAGData[i].Col5 && oCPAGData[i].Col6 &&
		// 				oCPAGData[i].Col7 && oCPAGData[i].Col8) {
		// 				enteredItemsWithoutDuplicate.push(oCPAGData[i]);
		// 			} else if (!oCPAGData[i].Col1 && !oCPAGData[i].Col2 && !oCPAGData[i].Col3 && !oCPAGData[i].Col4 && !oCPAGData[i].Col5 && !
		// 				oCPAGData[i].Col6 &&
		// 				!oCPAGData[i].Col7 && !oCPAGData[i].Col8) { // Check if none of the columns are entered - then ignore

		// 			} else { // Check if some fields are entered - then error
		// 				isValidCPAG = false;
		// 			}
		// 		}
		// 	} else if (this.noOfPriceColumns == 2) {
		// 		for (var i = 0; i < oCPAGData.length; i++) {
		// 			if (oCPAGData[i].Col1 && oCPAGData[i].Col2 && oCPAGData[i].Col3 && oCPAGData[i].Col4 && oCPAGData[i].Col5 && oCPAGData[i].Col6 &&
		// 				oCPAGData[i].Col7) {
		// 				enteredItemsWithoutDuplicate.push(oCPAGData[i]);
		// 			} else if (!oCPAGData[i].Col1 && !oCPAGData[i].Col2 && !oCPAGData[i].Col3 && !oCPAGData[i].Col4 && !oCPAGData[i].Col5 && !
		// 				oCPAGData[i].Col6 &&
		// 				!oCPAGData[i].Col7) {

		// 			} else {
		// 				isValidCPAG = false;
		// 			}
		// 		}
		// 	}

		// 	if (!isValidCPAG) {
		// 		MessageBox.alert("Please ensure you have entered values for all columns!");
		// 		return;
		// 	}

		// 	for (var i = 0; i < oCPAGData.length; i++) {
		// 		oCPAGData[i].ConditionType = this.getView().getModel("booking").getProperty("/ConditionType");
		// 		oCPAGData[i].PriceType = this.getView().getModel("booking").getProperty("/PriceType");
		// 		oCPAGData[i].PriceTypeText = this.checkMATNRorPRODH(oCPAGData[i].PriceType);
		// 	}
		// 	this.getView().getModel("booking").setProperty("/CPAG", oCPAGData);

		// 	this.oCPAGDataAll.push.apply(this.oCPAGDataAll, oCPAGData);

		// 	this.getView().getModel("booking").setProperty("/CPAGALL", this.oCPAGDataAll);

		// 	this.NoOfConditions = this.oCPAGDataAll.length;
		// 	this.getView().getModel("booking").setProperty("/NoOfConditions", this.NoOfConditions);

		// 	if (sap.ui.core.Fragment.byId("container-sd_fiori---worklist--idCPAGDialog", "idCPAGTable")) {
		// 		sap.ui.core.Fragment.byId("container-sd_fiori---worklist--idCPAGDialog", "idCPAGTable").setVisible(false);
		// 	}

		// 	this.getView().getModel("booking").setProperty("/ConditionRecords", []);
		// 	this.getView().getModel("booking").setProperty("/PriceRecords", []);

		// 	this.getOwnerComponent().getModel().read("/PriceSet", {
		// 		async: false,
		// 		success: function (oData) {
		// 			this.aConditionData = [];
		// 			this.aConditionDataLEASEUnique = [];
		// 			this.aPriceData = [];

		// 			for (var i = 0; i < oData.results.length; i++) {
		// 				this.aConditionData.push(oData.results[i]);
		// 				this.aConditionDataLEASEUnique.push(oData.results[i]);
		// 			}

		// 			// Remove Duplicates from City Data

		// 			var arr = {};

		// 			for (var j = 0, len = this.aConditionDataLEASEUnique.length; j < len; j++) {
		// 				arr[this.aConditionDataLEASEUnique[j]['ConditionType']] = this.aConditionDataLEASEUnique[j];
		// 			}

		// 			this.aConditionDataLEASEUnique = [];
		// 			for (var key in arr)
		// 				this.aConditionDataLEASEUnique.push(arr[key]);
		// 			this.aConditionDataLEASEUnique.sort(sort_by('ConditionType', false, function (a) {
		// 				return a.toUpperCase();
		// 			}));

		// 			this.getView().getModel("booking").setProperty("/ConditionRecords", this.aConditionDataLEASEUnique);
		// 			this.getView().getModel("booking").setProperty("/PriceRecords", this.aPriceData);

		// 		}.bind(this)
		// 	});

		// 	this.addConditionsToMainTable();

		// 	this.getView().getModel("booking").setProperty("/ConditionType", "");
		// 	this.getView().getModel("booking").setProperty("/PriceType", "");

		// },

		selectRB: function () {
			this.onPressGo("NEW");
		},

		setDataFromTransaction: function (transactionData, isFromEditOption) {

			// Adjust Status F4 values accordingly..

			var statusTempData = [];
			var statusPossib = [];
			for (var i = 0; i < this.StatusData.length; i++) {
				if (this.StatusData[i].key === transactionData.OrderStatus) {
					statusPossib = this.StatusData[i].possibleStatus.split(',');
					for (var j = 0; j < statusPossib.length; j++) {
						statusTempData.push({
							key: statusPossib[j],
							text: get_status_text(statusPossib[j], this.StatusData),
							additionalText: get_status_additionaltext(statusPossib[j], this.StatusData)
						});
					}
				}
			}

			this.getView().getModel("oStatusModel").setProperty("/", statusTempData);

			// Set Header Data for below properties - Normal

			var headerNormalProps = [{
				Property: "Lease",
				isDateConvRequired: false
			}, {
				Property: "Customer",
				isDateConvRequired: false
			}, {
				Property: "LeaseType",
				isDateConvRequired: false
			}, {
				Property: "ZzresStart",
				isDateConvRequired: true
			}, {
				Property: "ZzresEnd",
				isDateConvRequired: true
			}, {
				Property: "OrderStatus",
				isDateConvRequired: false
			}];

			for (var i = 0; i < headerNormalProps.length; i++) {
				var valueForProperty = "";
				if (headerNormalProps[i].isDateConvRequired && transactionData[headerNormalProps[i].Property]) {
					valueForProperty = convert_date_ddmmyyyy(transactionData[headerNormalProps[i].Property]);
				} else {
					valueForProperty = transactionData[headerNormalProps[i].Property];

					// if (headerNormalProps[i].Property === "Auart") { // For Lease Type - add description like ZFX - Fixed Term Lease
					// 	for (var l = 0; l < this.LeaseTypeData.length; l++) {
					// 		if (valueForProperty === this.LeaseTypeData[l].key) {
					// 			valueForProperty = valueForProperty + " - " + this.LeaseTypeData[l].text;
					// 		}
					// 	}
					// }
				}
				setHeaderTransactionDataBOOKINGModel(this, "booking", ("/" + headerNormalProps[i].Property), valueForProperty);

			}

			// Set Items Data
			this.itemsDataFromDraft = [];
			var itemsData = transactionData.navheaderitems.results;

			// if (isFromEditOption && transactionData.OrderStatus === "E0004") { // RLC#24 When it is from Display/Edit mode and the status is Contract Live E0004, do not allow to delete or change unit type/locatio
			// 	for (var i = 0; i < itemsData.length; i++) {
			// 		this.itemsDataFromDraft.push({
			// 			ItemNo: String(parseInt(itemsData[i].Item, 10)),
			// 			UnitType: itemsData[i].Product,
			// 			UnitTypeEnabled: false,
			// 			ProdHier: itemsData[i].ProdHier,
			// 			ProdHierEnabled: false,
			// 			RequestedQuan: itemsData[i].ReqQty,
			// 			Location: itemsData[i].Location,
			// 			LocationEnabled: false,
			// 			Status: "NO-DELETE"
			// 		});
			// 	}
			// 	this.getView().getModel().setProperty("/items", this.itemsDataFromDraft);
			// 	//this.onSetSelectionTable();	// RLC#24
			// } else {

			var isItBySerialNo = false;
			for (var i = 0; i < itemsData.length; i++) {
				if (itemsData[i].SerialNo) {
					isItBySerialNo = true;
				}
				this.itemsDataFromDraft.push({
					ItemNo: String(parseInt(itemsData[i].ItemNo, 10)),
					RequestedQuan: itemsData[i].RequestedQuan,
					ReleasedQuan: itemsData[i].ReleasedQuan,
					PickQuan: itemsData[i].PickQuan,
					NotpickQuan: itemsData[i].NotpickQuan,
					UnitType: itemsData[i].UnitType,
					ProdHier: itemsData[i].ProdHier,
					SerialNo: itemsData[i].SerialNo,
					Location: get_city_desc(itemsData[i].LocCode, this.CitiesOnlyData),
					LocCode: itemsData[i].LocCode,
					DepoCode: itemsData[i].Depcode,
					Comments: itemsData[i].Comments
				});
			}
			this.getView().getModel().setProperty("/items", this.itemsDataFromDraft);

			if (isItBySerialNo) {
				this.byId("idRBOBS").setProperty("selected", true);
				this.byId("idRBOUT").setProperty("selected", false);
			} else {
				this.byId("idRBOUT").setProperty("selected", true);
				this.byId("idRBOBS").setProperty("selected", false);
			}
			var bRB1 = this.byId("idRBOBS").getProperty("selected");
			var bRB2 = this.byId("idRBOUT").getProperty("selected");
			if (bRB1) {
				this.getView().getModel("booking").setProperty("/unitTypeEditable", false);
			} else {
				this.getView().getModel("booking").setProperty("/unitTypeEditable", true);
			}
			// }

			// Set Conditions Data
			this.conditionsDataFromDraftLEASE = [];
			this.conditionsDataFromDraftBOOK = [];
			this.conditionsDataFromDraftDSS = [];

			var conditionsData = transactionData.navheaderitemconditions.results;
			for (var i = 0; i < conditionsData.length; i++) {
				if (conditionsData[i].Types === "LEASE") {
					this.conditionsDataFromDraftLEASE.push({
						ItemNo: conditionsData[i].ItemNo,
						UnitType: conditionsData[i].Product,
						ProdHier: conditionsData[i].ProdHier,
						ReqQty: conditionsData[i].ReqQty,
						Location: conditionsData[i].Location,

						CondType: conditionsData[i].CondType,
						PriceType: conditionsData[i].PriceType,
						PriceTypeText: conditionsData[i].PriceTypeText,

						ValidFrom: convert_date_ddmmyyyy(conditionsData[i].ValidFrom),
						ValidTo: convert_date_ddmmyyyy(conditionsData[i].ValidTo),
						Currency: conditionsData[i].Currency,

						Amount: conditionsData[i].ReqQty,
						Handling: conditionsData[i].Handling,
						Dropoff: conditionsData[i].Dropoff,
						Mandatory: conditionsData[i].Mandatory

					});
				} else if (conditionsData[i].Types === "DSS") {
					this.conditionsDataFromDraftDSS.push({
						ItemNo: conditionsData[i].ItemNo,
						Types: "DSS",
						LocCode: conditionsData[i].Location,
						Location: get_city_desc(conditionsData[i].Location, this.CitiesOnlyData),
						ReqQty: conditionsData[i].ReqQty,
						Handling: conditionsData[i].Handling,
						Dropoff: conditionsData[i].Dropoff,
						Currency: this.getView().getModel("booking").getData().Currency
					});
				} else if (conditionsData[i].Types === "BOOK") {
					this.conditionsDataFromDraftBOOK.push({
						ItemNo: conditionsData[i].ItemNo,
						UnitType: conditionsData[i].Product,
						ProdHier: conditionsData[i].ProdHier,
						RequestedQuan: conditionsData[i].ReqQty,
						LocCode: conditionsData[i].Location,
						Location: get_city_desc(conditionsData[i].Location, this.CitiesOnlyData),

						ConditionType: conditionsData[i].CondType,
						PriceType: conditionsData[i].PriceType,
						PriceTypeText: conditionsData[i].PriceTypeText,

						ValidFrom: convert_date_ddmmyyyy(conditionsData[i].ValidFrom),
						ValidTo: convert_date_ddmmyyyy(conditionsData[i].ValidTo),
						Currency: conditionsData[i].Currency,

						Amount: conditionsData[i].ReqQty,
						Handling: conditionsData[i].Handling,
						Dropoff: conditionsData[i].Dropoff,
						Mandatory: conditionsData[i].Mandatory

					});
				}

			}

			this.getView().getModel("booking").setProperty("/itemsCPAGLEASE", this.conditionsDataFromDraftBOOK);
			this.getView().getModel("booking").setProperty("/itemsCPAGBOOK", this.conditionsDataFromDraftLEASE);

			this.onPressCPAGNEW("YES"); // Just execute the functionality without opening CPAG Popup, because users can save/submit/reject without opening Price Agreement popup
			this.updateDSSandCondIndicators();

			this.getView().getModel("booking").setProperty("/isDraftActive", true);
			this.getView().getModel("bookinginitial").setProperty("/tableVisibility", true);
			this.getView().getModel("bookinginitial").setProperty("/validationPassed", false);
			this.getView().getModel("bookinginitial").setProperty("/validationFailed", true);
			this.getView().getModel("bookinginitial").setProperty("/GetLeaseVisible", false);

			this.getView().getModel("bookinginitial").setProperty("/displayMode", true);
			this.getView().getModel("bookinginitial").setProperty("/editMode", false);
			this.getView().getModel("bookinginitial").refresh();
			this.getView().getModel("bookinginitial").updateBindings();

		},

		onPressEDIT: function () {

			this.getView().getModel("bookinginitial").setProperty("/validationPassed", false);
			this.getView().getModel("bookinginitial").setProperty("/submitPassed", false);
			this.getView().getModel("bookinginitial").setProperty("/validationFailed", true);

			var itemsDataAfterRemoveEmpty = this.getView().getModel().getData("/items").items;

			var isFromEditOption = this.getView().getModel("booking").getProperty("/isFromEditOption");
			// var contractStatus = this.getView().byId("idComboOrderStatus").getSelectedKey();

			// if (isFromEditOption && contractStatus === "E0004") {
			// 	for (var i = 0; i < itemsDataAfterRemoveEmpty.length; i++) {
			// 		var oItemsTableRow = this.getView().byId("idTable").getRows()[i];

			// 		oItemsTableRow.getCells()[1].setEnabled(false);
			// 		oItemsTableRow.getCells()[2].setEnabled(false);
			// 		oItemsTableRow.getCells()[3].setEnabled(true); // Enable only Quantity field
			// 		oItemsTableRow.getCells()[4].setEnabled(false);

			// 	}
			// } else {

			for (var i = 0; i < itemsDataAfterRemoveEmpty.length; i++) {
				var oItemsTableRow = this.getView().byId("idTable").getRows()[i];
				// var oSelected = oEvent.getParameter("selected");
				// var oSelectedItem = oEvent.getParameter("listItem");

				// oItemsTableRow.getCells()[1].setEnabled(true);
				// oItemsTableRow.getCells()[2].setEnabled(true);
				// oItemsTableRow.getCells()[3].setEnabled(true);
				// oItemsTableRow.getCells()[4].setEnabled(true);
				// // oItemsTableRow.getCells()[5].setEnabled(true);
				// oItemsTableRow.getCells()[6].setEnabled(true);
				// oItemsTableRow.getCells()[8].setEnabled(true);

			}
			// }

		},

		onPressGo: function (neworexi) {

			var oViewModel = this.getView().getModel();
			this.initializeMessageManager(this.getView().getModel());
			var oMessageManager = this.getMessageManager();
			oMessageManager.removeAllMessages();

			var sCustomer = this.getView().getModel("booking").getProperty("/Customer");
			var sLease = this.getView().getModel("booking").getProperty("/Lease");

			if (!sLease) {
				MessageBox.alert("Please select Lease or Booking");
				return;
			}

			this.getView().byId("idFEComboOrderStatus").setVisible(false);
			this.getView().byId("idComboOrderStatus").setEnabled(false);

			if (neworexi === "NEW") {

				this.getView().getModel("bookinginitial").setProperty("/DisplayEditToggleVisible", false);
				this.getView().getModel("bookinginitial").setProperty("/DisplayEditToggleText", "Edit");
				this.getView().getModel("bookinginitial").setProperty("/NewBookingSelected", true);
				this.getView().getModel("bookinginitial").setProperty("/ExiBookingSelected", false);
				this.getView().getModel("booking").setProperty("/ActiveBooking", "");
				this.getView().getModel("bookinginitial").setProperty("/displayMode", false);
				this.getView().getModel("bookinginitial").setProperty("/editMode", true);

				var items = [{
					ItemNo: 1,
					RequestedQuan: "",
					UnitType: "",
					ProdHier: "",
					SerialNo: "",
					Location: "",
					DepoCode: "",
					Comments: "",
					dssVisible: false,
					condVisible: false
				}, {
					ItemNo: 2,
					RequestedQuan: "",
					UnitType: "",
					ProdHier: "",
					SerialNo: "",
					Location: "",
					DepoCode: "",
					Comments: "",
					dssVisible: false,
					condVisible: false
				}, {
					ItemNo: 3,
					RequestedQuan: "",
					UnitType: "",
					ProdHier: "",
					SerialNo: "",
					Location: "",
					DepoCode: "",
					Comments: "",
					dssVisible: false,
					condVisible: false
				}, {
					ItemNo: 4,
					RequestedQuan: "",
					UnitType: "",
					ProdHier: "",
					SerialNo: "",
					Location: "",
					DepoCode: "",
					Comments: "",
					dssVisible: false,
					condVisible: false
				}, {
					ItemNo: 5,
					RequestedQuan: "",
					UnitType: "",
					ProdHier: "",
					SerialNo: "",
					Location: "",
					DepoCode: "",
					Comments: "",
					dssVisible: false,
					condVisible: false
				}];

				var bRB1 = this.byId("idRBOBS").getProperty("selected");
				var bRB2 = this.byId("idRBOUT").getProperty("selected");
				if (bRB1 || bRB2) {
					var aFilterItem = this.aCustomerData.filter(function (oFilterItem) {
						return (oFilterItem.Lease === sLease);
					});
					// this.getView().getModel("booking").setData(aFilterItem[0]);

					for (var key in aFilterItem[0]) {
						if (typeof aFilterItem[0][key] === "string") {
							// console.log(key + "-" + aFilterItem[0][key])
							this.getView().getModel("booking").setProperty(("/" + key), aFilterItem[0][key]);
						}
					}

					this.itemsDataAfterRemoveEmpty = this.getView().byId("idTable").getModel().getData().items;

					for (var i = 0; i < this.itemsDataAfterRemoveEmpty.length; i++) {
						var oItemsTableRow = this.getView().byId("idTable").getRows()[i];
						// var oSelected = oEvent.getParameter("selected");
						// var oSelectedItem = oEvent.getParameter("listItem");

						// oItemsTableRow.getCells()[1].setEnabled(true);
						// oItemsTableRow.getCells()[2].setEnabled(true);
						// oItemsTableRow.getCells()[3].setEnabled(true);
						// oItemsTableRow.getCells()[4].setEnabled(true);
						// // oItemsTableRow.getCells()[5].setEnabled(true);
						// oItemsTableRow.getCells()[6].setEnabled(true);
						// oItemsTableRow.getCells()[8].setEnabled(true);

					}

					this.getView().getModel("booking").setProperty("/Lease", sLease);
					this.getView().getModel("bookinginitial").setProperty("/tableVisibility", true);
					this.getView().getModel("bookinginitial").setProperty("/validationPassed", false);
					this.getView().getModel("bookinginitial").setProperty("/validationFailed", true);
					this.getView().getModel("bookinginitial").setProperty("/GetLeaseVisible", false);
				} else {
					this.getView().getModel("bookinginitial").setProperty("/tableVisibility", false);
					this.getView().getModel("bookinginitial").setProperty("/validationPassed", false);
					this.getView().getModel("bookinginitial").setProperty("/validationFailed", true);
				}

				if (bRB1) {
					this.getView().byId("idButtonValidate").setEnabled(false);
					this.getView().getModel("booking").setProperty("/unitTypeEditable", false);
					this.getView().getModel().setProperty("/items", items);
				} else {
					this.getView().byId("idButtonValidate").setEnabled(true);
					this.getView().getModel("booking").setProperty("/unitTypeEditable", true);
					this.getView().getModel().setProperty("/items", items);
				}
				this.getView().getModel("booking").setProperty("/DPAGTableVisible", false);

				var oTable = this.getView().byId("idTable");
				oTable.setVisibleRowCount(5);

				// Initiliization

				// var yearEnd = "";
				var today = new Date();
				var dd = today.getDate();
				var mm = today.getMonth() + 1; //January is 0!

				var yyyy = today.getFullYear();
				if (dd < 10) {
					dd = '0' + dd;
				}
				if (mm < 10) {
					mm = '0' + mm;
				}

				today = dd + '.' + mm + '.' + yyyy;

				// yearEnd = '31' + '.' + '12' + '.' + yyyy;

				var todayplus7 = new Date();
				todayplus7.setDate(todayplus7.getDate() + 7);
				var ddplus7 = todayplus7.getDate();
				var mmplus7 = todayplus7.getMonth() + 1; //January is 0!

				var yyyyplus7 = todayplus7.getFullYear();
				if (ddplus7 < 10) {
					ddplus7 = '0' + ddplus7;
				}
				if (mmplus7 < 10) {
					mmplus7 = '0' + mmplus7;
				}

				todayplus7 = ddplus7 + '.' + mmplus7 + '.' + yyyyplus7;

				this.getView().getModel("booking").setProperty("/ZzresStart", today);
				this.getView().getModel("booking").setProperty("/ZzresEnd", todayplus7);

				this.getView().getModel("bookinginitial").refresh();
				this.getView().getModel("bookinginitial").updateBindings();

				// if (this.getView().getModel("booking").getProperty("/LeaseType") === "ZMP") {
				// 	sap.ui.core.Fragment.byId("idDSSDialog", tableId).setVisibleRowCount(10);
				// }

			} else if (neworexi === "EXI") {

				this.getView().getModel("bookinginitial").setProperty("/DisplayEditToggleVisible", true);
				this.getView().getModel("bookinginitial").setProperty("/DisplayEditToggleText", "Edit");
				this.getView().byId("idPage").setTitle("Display Booking");
				this.onCurrentMode = "D";
				this.getView().getModel("bookinginitial").setProperty("/NewBookingSelected", false);
				this.getView().getModel("bookinginitial").setProperty("/ExiBookingSelected", true);
				var activeBooking = this.getView().getModel("booking").getProperty("/Booking");
				this.getView().getModel("booking").setProperty("/ActiveBooking", activeBooking);

				this.getView().byId("idFEComboOrderStatus").setVisible(true);
				this.getView().byId("idComboOrderStatus").setEnabled(false);

				if (this.getView().getModel("booking").getProperty("/LeaseStatus") === "E0004") {
					this.getView().byId("idComboOrderStatus").setEnabled(true);
				}

				// this.getView().getModel("rlcinitial").setProperty("/ShowGetResetButtons", true);
				var oBooking = this.getView().getModel("booking").getProperty("/Booking");

				var fnSuccess = function (oData, oResponse) {
					this.setDataFromTransaction(oData.results[0], true);
					this.busyDialog.close();
				}.bind(this);

				var fnError = function (error) {
					this.busyDialog.close();
				}.bind(this);

				var laFilters = [];
				var filter = new sap.ui.model.Filter("Vbelnin", sap.ui.model.FilterOperator.EQ, oBooking);
				laFilters.push(filter);

				filter = new sap.ui.model.Filter("Change", sap.ui.model.FilterOperator.EQ, true);
				laFilters.push(filter);

				this.busyDialog.open();
				this.getOwnerComponent().getModel().read("/HeaderSet", {
					urlParameters: {
						"$expand": "navheaderitems,navheaderitemconditions,navheaderreturns"
					},
					filters: laFilters,
					success: fnSuccess.bind(this),
					error: fnError
				});

				return;
			}

		},

		onGetLocationFromDepot: function (oEvent) {

			var newValue = oEvent.getParameter("newValue");
			if (newValue.length > 5) {
				var currValue = newValue;

				currValue = currValue.substr(0, 5);
				oEvent.getSource().setValue(currValue);
			} else if (newValue.length === 4) {

				var sPath = oEvent.getSource().getBindingContext().sPath.split("/")[2];
				var currDepoIndex = parseInt(sPath);
				var oCurrLine = oEvent.getSource().getBindingContext().getObject();

				var laFilters = [];
				var filter = null;

				var sDepoCode = oEvent.getParameter("newValue");

				filter = new sap.ui.model.Filter("Sernrin", sap.ui.model.FilterOperator.EQ, sDepoCode);
				laFilters.push(filter);

				this.busyDialog.open();
				this.getOwnerComponent().getModel().read("/LocationSet", {
					filters: laFilters,
					success: function (oData) {
						this.busyDialog.close();
						// currDepoIndex
						if (oData.results.length === 0) {
							MessageBox.alert("Depot not found");
							oEvent.getSource().setValue("");
							return;
						}
						oCurrLine.LocCode = oData.results[0].ZCouDesc;
						oCurrLine.Location = get_city_desc(oCurrLine.LocCode, this.CitiesOnlyData);
						var aCurrItems = this.getView().getModel().getProperty("/items");
						aCurrItems[currDepoIndex] = oCurrLine;
						this.getView().getModel().updateBindings();
						this.getView().getModel().refresh();
					}.bind(this),
					error: function () {
						this.busyDialog.close();
					}.bind(this)

				});

			}

		},

		onPressAvailability: function (oEvent) {

			var sPath = oEvent.getSource().getBindingContext().sPath.split("/")[2];
			this.iDepoIndex = parseInt(sPath);

			var laFilters = [];
			var filter = null;

			var sLocation = oEvent.getSource().getBindingContext().getProperty("Location");

			if (sLocation) {

				var sLocCode = get_city_code(sLocation, this.CitiesOnlyData);
				filter = new sap.ui.model.Filter("Locationin", sap.ui.model.FilterOperator.EQ, sLocCode);
				laFilters.push(filter);
			}

			var sUnitType = oEvent.getSource().getBindingContext().getProperty("UnitType");
			var sProdHier = oEvent.getSource().getBindingContext().getProperty("ProdHier");
			var sProdHier = oEvent.getSource().getBindingContext().getProperty("SerialNo");

			if (sUnitType || sProdHier) {
				filter = new sap.ui.model.Filter("Matnrin", sap.ui.model.FilterOperator.EQ, sUnitType);
				laFilters.push(filter);
			}

			if (!sLocation || !sUnitType) {
				return;
			}

			this.busyDialog.open();
			this.getOwnerComponent().getModel().read("/LocationSet", {
				filters: laFilters,
				success: function (oData) {

					if (!globalThis._oAvailableQuantityDialog) {
						globalThis._oAvailableQuantityDialog = sap.ui.xmlfragment("idAvailableQuantityDialog",
							"com.seaco.sd_fiori.view.fragments.AvailableQuantity", globalThis);
						globalThis.getView().addDependent(globalThis._oAvailableQuantityDialog);
					}

					var oTable = sap.ui.core.Fragment.byId("idAvailableQuantityDialog", "idAvailableQuantityTable");
					globalThis._oAvailableQuantityDialog.open();
					oTable.getRows()[0].addStyleClass("bgcolor");

					globalThis.getView().getModel("booking").setProperty("/availableQuantity", oData.results);
					globalThis.busyDialog.close();
				},
				error: function () {

					globalThis.busyDialog.close();
				}

			});

			/*

				// var bRB1 = this.byId("idRBOBS").getProperty("selected");
				var oTableObject = oEvent.getSource().getBindingContext().getObject();
				var sPath = oEvent.getSource().getBindingContext().sPath.split("/")[2];
				this.iDepoIndex = parseInt(sPath);
				if (oTableObject.Location) {
					// if (bRB1) {
					// 	this.getView().getModel("booking").setProperty("/SelectioMode", "Single");
					// } else {
					// 	this.getView().getModel("booking").setProperty("/SelectioMode", "Multi");
					// }
					if (!this._oAvailableQuantityDialog) {
						this._oAvailableQuantityDialog = sap.ui.xmlfragment("idAvailableQuantityDialog",
							"com.seaco.sd_fiori.view.fragments.AvailableQuantity", this);
						this.getView().addDependent(this._oAvailableQuantityDialog);
					}
					var aFilterItem = this.aAvailableQuantiy.filter(function (oFilterItem) {
						return oFilterItem.ZCityDesc === oTableObject.Location;
					});
					this.getView().getModel("booking").setProperty("/availableQuantity", aFilterItem);
					var oTable = sap.ui.core.Fragment.byId("idAvailableQuantityDialog", "idAvailableQuantityTable");
					// oTable.getRows()[0].addStyleClass("bgcolor");               
					this._oAvailableQuantityDialog.open(); 

			} */
		},

		onPressConfirmSelectAvailableQuan: function (oEvent) {

			this.getView().getModel("booking").setProperty("/RequestedQuantity", true);
			var oTable = sap.ui.core.Fragment.byId("idAvailableQuantityDialog", "idAvailableQuantityTable");
			var aSelectedIndices = oTable.getSelectedIndex();
			// aSelectedIndices.forEach(function (oSelectedIndice){
			// var iIndex = oSelectedIndice;
			oTable.getRows()[aSelectedIndices].getBindingContext("booking").getObject().ReqQuanEditable = true;
			this.getView().getModel().refresh();
			this.getView().getModel("bookinginitial").setProperty("/validationFailed", true);
			this.getView().getModel("bookinginitial").setProperty("/validationPassed", false);
			// });

		},

		setValidationFailed: function () {
			this.getView().getModel("bookinginitial").setProperty("/validationFailed", true);
			this.getView().getModel("bookinginitial").setProperty("/validationPassed", false);
		},

		onChangeLocation: function (oEvent) {

			var sPath = oEvent.getSource().getBindingContext().sPath.split("/")[2];
			var currDepoIndex = parseInt(sPath, 10);
			var oCurrLine = oEvent.getSource().getBindingContext().getObject();

			oCurrLine.DepoCode = "";

			var aCurrItems = this.getView().getModel().getProperty("/items");
			aCurrItems[currDepoIndex] = oCurrLine;
			this.getView().getModel().updateBindings();
			this.getView().getModel().refresh();

			this.getView().getModel("bookinginitial").setProperty("/validationFailed", true);
			this.getView().getModel("bookinginitial").setProperty("/validationPassed", false);
		},

		onPressConfirmSelectDepo: function (oEvent) {
			var bFlag = true;
			var oTable = sap.ui.core.Fragment.byId("idAvailableQuantityDialog", "idAvailableQuantityTable");
			var a = this.getView().getModel().getProperty("/items");
			var aSelectedIndices = oTable.getSelectedIndices();

			aSelectedIndices = [];
			var bookingData = this.getView().getModel("booking").getData().availableQuantity;
			for (var i = 0; i < bookingData.length; i++) {
				if (bookingData[i].RequestedQuan !== 0 && bookingData[i].RequestedQuan !== "0") {
					aSelectedIndices.push(i);
				}
			}

			var aSlice = aSelectedIndices;
			var oMainModel = this.getModel("booking");
			var iTableIndex = this.iDepoIndex;
			// var sSelectionMode = this.getView().getModel("booking").getProperty("/SelectioMode")
			if (aSelectedIndices.length > 0) {

				for (var k = 0; k < aSelectedIndices.length; k++) {

					var iQuanIndex = aSelectedIndices[k];
					var oSelectedQuanContext = oTable.getContextByIndex(iQuanIndex);
					var oSelectedAvailQuan = oMainModel.getProperty(oSelectedQuanContext.getPath());
					if (oSelectedAvailQuan.RequestedQuan === null) {
						aSlice.splice(aSlice[k], 1);
						// var aSlice = Object.assign({},aSelectedIndices[k]);
					} else {
						oSelectedAvailQuan.RequestedQuan = parseInt(oSelectedAvailQuan.RequestedQuan);
						// }
						// oSelectedAvailQuan.RequestedQuan = parseInt(oSelectedAvailQuan.RequestedQuan);
						if (oSelectedAvailQuan.RequestedQuan > 9999999999) {
							// if (oSelectedAvailQuan.RequestedQuan > oSelectedAvailQuan.AvailableQuan) {
							oTable.getRows()[iQuanIndex].getCells()[2].setValueState("Error");
							oTable.getRows()[iQuanIndex].getCells()[2].setValueStateText("Requested Quantity should not be more than Available Quantity");
							bFlag = false;
							break;

						} else {
							oTable.getRows()[iQuanIndex].getCells()[2].setValueState("None");
						}
					}
				}
				aSelectedIndices = aSlice;
				// if (aSelectedIndices.length < 1) {
				// 	var iSelectedIndex = oTable.getSelectedIndex();
				// 	var oSelectedContext = oTable.getContextByIndex(iSelectedIndex);
				// 	var aDepo = this.getView().getModel("booking").getProperty("/availableQuantity");
				// 	var aFilterItem = aDepo.filter(function (oFilterItem) {
				// 		return oFilterItem.DepoCode === oSelectedContext.getProperty("DepoCode");
				// 	});

				// 	a[this.iDepoIndex].DepoCode = aFilterItem[0].DepoCode;
				// 	this._oAvailableQuantityDialog.close();
				// 	this.getView().getModel().refresh();
				// 	// this.getView().getModel().setProperty("/items", aFilterItem);
				// } else {
				// aSelectedIndices.forEach(function (oSelectedIndice) {
				if (bFlag) {
					for (var i = 0; i < aSelectedIndices.length; i++) {
						var iIndex = aSelectedIndices[i];
						var oSelectedContext = oTable.getContextByIndex(iIndex);
						oSelectedAvailQuan = oMainModel.getProperty(oSelectedContext.getPath());
						// oNewlySelectedWorkCenters.RequestedQuan = parseInt(oNewlySelectedWorkCenters.RequestedQuan);
						// if(oNewlySelectedWorkCenters.RequestedQuan > oNewlySelectedWorkCenters.AvailableQuan){
						// 	oTable.getRows()[iIndex].getCells()[2].setValueState("Error");
						// 	break;

						// } else {
						// 	oTable.getRows()[iIndex].getCells()[2].setValueState("None");
						if (!isNaN(oSelectedAvailQuan.RequestedQuan)) {
							var oNewTableItems = {
								Location: a[this.iDepoIndex].Location,
								SerialNo: a[this.iDepoIndex].SerialNo,
								UnitType: a[this.iDepoIndex].UnitType,
								ProdHier: a[this.iDepoIndex].ProdHier,
								DepoCode: oSelectedAvailQuan.Depot,
								RequestedQuan: String(oSelectedAvailQuan.RequestedQuan)
							};
							if (i === 0) {
								// oNewWorkCenter.ItemNo = a[this.iDepoIndex].ItemNo;
								a.splice(this.iDepoIndex, 1, oNewTableItems);
							} else {
								// oNewWorkCenter.ItemNo = a[this.iDepoIndex].ItemNo + 1;
								a.splice(iTableIndex + 1, 0, oNewTableItems);
							}
						}
						// aNewlySelectedWorkCenters.push(oNewWorkCenter);
					}
					for (var j = 0; j < a.length; j++) {
						a[j].ItemNo = j + 1;
					}

					this.getView().getModel().refresh();
					this._oAvailableQuantityDialog.close();
				}
				// for(var j=0; j<a.length; j++){
				// 	a[j].ItemNo = j + 1;
				// }

				// this.getView().getModel().refresh();
				// this._oAvailableQuantityDialog.close();
				// }

			} else {
				this._oAvailableQuantityDialog.close();
			}
			this.updateDSSandCondIndicators();
			var oTable = this.getView().byId("idTable");
			var oData = this.getView().getModel().getData().items;

			if (oData.length > 10) {
				oTable.setVisibleRowCount(10);
			} else {
				oTable.setVisibleRowCount(oData.length);
			}
		},

		onQuantityChange: function (oEvent) {
			var oTable = sap.ui.core.Fragment.byId("idAvailableQuantityDialog", "idAvailableQuantityTable");
			var oValue = oEvent.getSource().getValue();
			var iIndex = oEvent.getSource().getParent().getIndex();
			var oContextProperty = oTable.getContextByIndex(iIndex).getProperty();
			if (oContextProperty.AvailableQuan < oContextProperty.RequestedQuan) {
				oTable.getRows()[iIndex].getCells()[2].setValueState("Error");
			} else {
				oTable.getRows()[iIndex].getCells()[2].setValueState("None");
			}
		},

		InputSuggestion: function () {

		},

		onValueHelpCustRequested: function (oEvent) {

			globalLeaseEntered = oEvent.getSource().getProperty("value");
			this.getOwnerComponent().getModel().read("/f4Set", {
				success: function (oData) {
					this.aCustomerData = oData.results;

					if (!this._oCustomerDialog) {
						this._oCustomerDialog = sap.ui.xmlfragment("idCustomerSearchDialog",
							"com.seaco.sd_fiori.view.fragments.CustomerDialog", this);
						this.getView().addDependent(this._oCustomerDialog);
					}

					this.getView().getModel("booking").setProperty("/listCustomer", this.aCustomerData);
					// var filters = [];
					// // Pre Filter before opening Customer Dialog XML fragment
					// if (globalLeaseEntered && globalLeaseEntered.length > 0) {
					// 	var filter = new sap.ui.model.Filter("Customer", sap.ui.model.FilterOperator.StartsWith, globalLeaseEntered);
					// 	filters.push(filter);
					// }

					// var oTable = sap.ui.core.Fragment.byId("idCustomerSearchDialog", "idCustomerTable");
					// var binding = oTable.getBinding("rows");
					// binding.filter(filters);

					this._oCustomerDialog.open();
					// sap.ui.core.Fragment.byId("idCustomerSearchDialog", "idCustomer").setValue(globalLeaseEntered);
				}.bind(this)
			});

		},

		// searchCustomerLease: function (oEvent, idorname) {

		// 	// var id = oEvent.getSource().getId();
		// 	// var searchfield = "";
		// 	// var searchOtherfield = "";
		// 	// var searchOtherfieldId = "";
		// 	// switch (id) {
		// 	// case "idCustomerSearchDialog--idCustomer":
		// 	// 	searchfield = "Customer";
		// 	// 	searchOtherfield = "CustomerName";
		// 	// 	searchOtherfieldId = "idCustomerName";
		// 	// 	// code block
		// 	// 	break;
		// 	// case "idCustomerSearchDialog--idCustomerName":
		// 	// 	searchfield = "CustomerName";
		// 	// 	searchOtherfield = "Customer";
		// 	// 	searchOtherfieldId = "idCustomer";
		// 	// 	// code block
		// 	// 	break;
		// 	// default:
		// 	// 	// code block
		// 	// }
		// 	// var searchOtherFieldValue = sap.ui.core.Fragment.byId("idCustomerSearchDialog", searchOtherfieldId).getValue();
		// 	// var filters = [];
		// 	// var sQuery = oEvent.getSource().getValue();
		// 	// if (sQuery && sQuery.length > 0) {
		// 	// 	var filter = new sap.ui.model.Filter(searchfield, sap.ui.model.FilterOperator.StartsWith, sQuery);
		// 	// 	filters.push(filter);

		// 	// 	filter = new sap.ui.model.Filter(searchOtherfield, sap.ui.model.FilterOperator.StartsWith, searchOtherFieldValue);
		// 	// 	filters.push(filter);
		// 	// }
		// 	// var oTable = sap.ui.core.Fragment.byId("idCustomerSearchDialog", "idCustomerTable");
		// 	// var binding = oTable.getBinding("rows");
		// 	// binding.filter(filters);

		// 	var filters = [];
		// 	// var sQuery = oEvent.getSource().getValue();
		// 	// if (sQuery && sQuery.length > 0) {
		// 	var filter = new sap.ui.model.Filter("Lease", sap.ui.model.FilterOperator.StartsWith, sap.ui.core.Fragment.byId(
		// 		"idCustomerSearchDialog", "idLeaseNUmber").getValue());
		// 	filters.push(filter);

		// 	filter = new sap.ui.model.Filter("Customer", sap.ui.model.FilterOperator.StartsWith, sap.ui.core.Fragment.byId(
		// 		"idCustomerSearchDialog", "idCustomer").getValue());
		// 	filters.push(filter);

		// 	filter = new sap.ui.model.Filter("CustomerName", sap.ui.model.FilterOperator.StartsWith, sap.ui.core.Fragment.byId(
		// 		"idCustomerSearchDialog", "idCustomerName").getValue());
		// 	filters.push(filter);

		// 	// }
		// 	var oTable = sap.ui.core.Fragment.byId("idCustomerSearchDialog", "idCustomerTable");
		// 	var binding = oTable.getBinding("rows");
		// 	binding.filter(filters);

		// },

		onPressConfirmSelectLease: function (oEvent) {
			var oTable = sap.ui.core.Fragment.byId("idLeaseSearchDialog", "idLeaseTable");
			var iSelectedIndex = oTable.getSelectedIndex();
			if (iSelectedIndex !== -1) {
				var oSelectedContext = oTable.getContextByIndex(iSelectedIndex);
				var aLease = this.getView().getModel("booking").getProperty("/listLease");
				var aFilterItem = aLease.filter(function (oFilterItem) {
					return oFilterItem.Lease === oSelectedContext.getProperty("Lease");
				});

				this.getView().getModel("booking").setProperty("/LeaseStatus", aFilterItem[0].Status);
				this.getView().getModel("booking").setProperty("/Currency", aFilterItem[0].Waerk);
				this.getView().getModel("booking").setProperty("/Lease", aFilterItem[0].Lease);
				this.getView().getModel("booking").setProperty("/Customer", aFilterItem[0].Customer);
				this.getView().getModel("booking").setProperty("/CustomerName", aFilterItem[0].CustomerName);
				this.getView().getModel("booking").setProperty("/LeaseType", aFilterItem[0].LeaseType);
				this.getView().getModel("booking").setProperty("/CreationDate", aFilterItem[0].CreationDate);
				this.getView().getModel("booking").setProperty("/CreatedBy", aFilterItem[0].CreatedBy);
				this.getView().getModel("booking").setProperty("/EmployeeResponsible", aFilterItem[0].EmployeeResponsible);
				this.getView().getModel("booking").setProperty("/SalesOrg", aFilterItem[0].SalesOrg);
				this.onPressGo("NEW");
			}
			oEvent.getSource().getParent().getParent().close();
		},

		onPressConfirmSelectBooking: function (oEvent) {

			var oTable = sap.ui.core.Fragment.byId("idBookingSearchDialog", "idBookingTable");
			var iSelectedIndex = oTable.getSelectedIndex();
			if (iSelectedIndex !== -1) {
				var oSelectedContext = oTable.getContextByIndex(iSelectedIndex);
				var aLease = this.getView().getModel("booking").getProperty("/listBooking");
				var aFilterItem = aLease.filter(function (oFilterItem) {
					return oFilterItem.Lease === oSelectedContext.getProperty("Lease");
				});

				// Get Lease from the selected booking
				var leaseFromBooking = "";
				var leaseStatus = "";
				for (var i = 0; i < this.aLeaseBookingRelData.length; i++) {
					if (this.aLeaseBookingRelData[i].Status === aFilterItem[0].Lease) {
						leaseFromBooking = this.aLeaseBookingRelData[i].Lease;
						leaseStatus = globalThis.aLeaseBookingRelData[i].Waerk;
						break;
					}
				}

				globalThis.getView().getModel("booking").setProperty("/LeaseStatus", leaseStatus);
				this.getView().getModel("booking").setProperty("/Currency", aFilterItem[0].Waerk);
				this.getView().getModel("booking").setProperty("/Booking", aFilterItem[0].Lease);
				this.getView().getModel("booking").setProperty("/Lease", leaseFromBooking);
				this.getView().getModel("booking").setProperty("/Customer", aFilterItem[0].Customer);
				this.getView().getModel("booking").setProperty("/CustomerName", aFilterItem[0].CustomerName);
				this.getView().getModel("booking").setProperty("/LeaseType", aFilterItem[0].LeaseType);
				this.getView().getModel("booking").setProperty("/CreationDate", aFilterItem[0].CreationDate);
				this.getView().getModel("booking").setProperty("/CreatedBy", aFilterItem[0].CreatedBy);
				this.getView().getModel("booking").setProperty("/EmployeeResponsible", aFilterItem[0].EmployeeResponsible);
				this.getView().getModel("booking").setProperty("/SalesOrg", aFilterItem[0].SalesOrg);
				this.onPressGo("EXI");
			}
			oEvent.getSource().getParent().getParent().getParent().close();
		},

		deleteRowItemsTable: function (oEvent) {
			var oTable = this.getView().byId("idTable");
			if (oTable.getSelectedIndices().length === 0) {
				return;
			};
			var oModel = oTable.getModel();
			var oData = this.getView().getModel().getData().items;
			var reverse = [].concat(oTable.getSelectedIndices()).reverse();
			reverse.forEach(function (index) {
				oData.splice(index, 1);
			});
			oModel.refresh();
			oTable.setSelectedIndex(-1);

			for (var i = 0; i < oData.length; i++) {
				oData[i].ItemNo = (i + 1);
			}

			if (oData.length > 10) {
				oTable.setVisibleRowCount(10);
			} else {
				oTable.setVisibleRowCount(oData.length);
			}

			this.getView().byId("idTable").getModel().refresh();
			this.getView().getModel("bookinginitial").setProperty("/validationFailed", true);
			this.getView().getModel("bookinginitial").setProperty("/validationPassed", false);

		},

		deleteRowDPAGTable: function () {
			var oTable = this.getView().byId("idDPAGTable");
			if (oTable.getSelectedIndices().length === 0) {
				return;
			};
			var oModel = oTable.getModel();
			var oData = this.getView().getModel().getData().itemsDPAG;
			var reverse = [].concat(oTable.getSelectedIndices()).reverse();
			reverse.forEach(function (index) {
				oData.splice(index, 1);
			});
			oModel.refresh();
			oTable.setSelectedIndex(-1);

			for (var i = 0; i < oData.length; i++) {
				oData[i].ItemNo = (i + 1);
			}

			if (oData.length > 10) {
				oTable.setVisibleRowCount(10);
			} else {
				oTable.setVisibleRowCount(oData.length);
			}
			this.getView().byId("idDPAGTable").getModel().refresh();
		},

		addRowItemsTable: function (oEvent) {

			var itemsData = this.getView().getModel().getData().items;

			var singleLine = {};
			singleLine = {
				ItemNo: (itemsData.length + 1),
				RequestedQuan: "",
				UnitType: "",
				ProdHier: "",
				SerialNo: "",
				Location: "",
				DepoCode: "",
				Comments: "",
				dssVisible: false,
				condVisible: false
			};

			itemsData.push(singleLine);
			this.getView().getModel().setProperty("/items", itemsData);
			if (itemsData.length > 10) {
				this.getView().byId("idTable").setVisibleRowCount(10);
			} else {
				this.getView().byId("idTable").setVisibleRowCount(itemsData.length);
			}

			this.getView().byId("idTable").getModel().updateBindings();
			this.getView().getModel("bookinginitial").setProperty("/validationFailed", true);
			this.getView().getModel("bookinginitial").setProperty("/validationPassed", false);

			var bRB1 = this.byId("idRBOBS").getProperty("selected");

			if (bRB1) {
				this.getView().byId("idButtonValidate").setEnabled(false);
			} else {
				this.getView().byId("idButtonValidate").setEnabled(true);
			}

		},

		copyRowVCONTable: function (oEvent) {

			var tableId = "idCPAGLEASETable";
			var processIconTabBar = "LEASE";
			var existingArray = this.getView().getModel("booking").getData().itemsCPAGLEASE;
			var tabProperty = "/itemsCPAGLEASE";

			var oTable = sap.ui.core.Fragment.byId("idVCONDialog", tableId);
			if (oTable.getSelectedIndices().length === 0) {
				return;
			};

			var oVCONTableData = existingArray;
			if (!oVCONTableData) {
				// dataArray = [];
				oVCONTableData = [];
			}

			var reverse = oTable.getSelectedIndices();
			reverse.forEach(function (index) {
				// oData.splice(index, 1);
				existingArray.push(existingArray[index]);
			});
			this.getView().getModel("booking").setProperty(tabProperty, this.aCPAGLEASEData);
			if (this.aCPAGLEASEData.length > 10) {
				sap.ui.core.Fragment.byId("idVCONDialog", tableId).setVisibleRowCount(10);
			} else {
				sap.ui.core.Fragment.byId("idVCONDialog", tableId).setVisibleRowCount(this.aCPAGLEASEData.length);
			}

			this.getView().getModel("booking").updateBindings();
			this.getView().getModel("booking").refresh();

		},

		onSelectPriceType: function (oEvent) {

			var condUnit = oEvent.getSource().getBindingContext("booking").getObject().CondUnit;

			var priceDataSelectedValue = oEvent.getSource().getValue();
			var priceDataSelectedKey = oEvent.getSource().getSelectedKey();
			oEvent.getSource().getParent().getCells()[1].setSelectedKey(priceDataSelectedKey);

			oEvent.getSource().getParent().getCells()[2].setSelectedKey("");
			oEvent.getSource().getParent().getCells()[3].setSelectedKey("");
			oEvent.getSource().getParent().getCells()[4].setSelectedKey("");

			oEvent.getSource().getParent().getCells()[2].setEnabled(false);
			oEvent.getSource().getParent().getCells()[3].setEnabled(false);
			oEvent.getSource().getParent().getCells()[4].setEnabled(false);
			oEvent.getSource().getParent().getCells()[8].setEnabled(true); // Currency

			// Check if price type contains HIENR
			if (priceDataSelectedValue.includes("Location")) {
				oEvent.getSource().getParent().getCells()[2].setEnabled(true);
			}

			// Check if price type contains MATNR
			if (priceDataSelectedValue.includes("Product")) {
				oEvent.getSource().getParent().getCells()[3].setEnabled(true);
			}

			// Check if price type contains PRODH
			if (priceDataSelectedValue.includes("Prod. Hier")) {
				oEvent.getSource().getParent().getCells()[4].setEnabled(true);
			}

			if (condUnit === "A") { // Percentage
				oEvent.getSource().getParent().getCells()[8].setSelectedKey("%");
				oEvent.getSource().getParent().getCells()[8].setEnabled(false);
			}

		},

		copyRowCPAGTable: function (oEvent) {

			var tableId = "idCPAGBOOKTable";
			var processIconTabBar = "BOOK";
			var existingArray = this.getView().getModel("booking").getData().itemsCPAGBOOK;
			var tabProperty = "/itemsCPAGBOOK";

			var oTable = sap.ui.core.Fragment.byId("container-sd_fiori---worklist--idCPAGDialog", tableId);
			if (oTable.getSelectedIndices().length === 0) {
				return;
			};

			var oCPAGTableData = existingArray;
			if (!oCPAGTableData) {
				// dataArray = [];
				oCPAGTableData = [];
			}

			var reverse = oTable.getSelectedIndices();
			reverse.forEach(function (index) {
				// oData.splice(index, 1);
				existingArray.push(existingArray[index]);
			});
			this.getView().getModel("booking").setProperty(tabProperty, this.aCPAGBOOKData);
			if (this.aCPAGBOOKData.length > 10) {
				sap.ui.core.Fragment.byId("container-sd_fiori---worklist--idCPAGDialog", tableId).setVisibleRowCount(10);
			} else {
				sap.ui.core.Fragment.byId("container-sd_fiori---worklist--idCPAGDialog", tableId).setVisibleRowCount(this.aCPAGBOOKData.length);
			}

			this.getView().getModel("booking").updateBindings();
			this.getView().getModel("booking").refresh();

		},

		deleteRowCPAGTable: function (oEvent) {
			var tableId = "idCPAGBOOKTable";
			var oData = this.getView().getModel("booking").getData().itemsCPAGBOOK;

			var oTable = sap.ui.core.Fragment.byId("container-sd_fiori---worklist--idCPAGDialog", tableId);
			if (oTable.getSelectedIndices().length === 0) {
				return;
			}

			var oModel = oTable.getModel("booking");

			var today = new Date();
			var dd = today.getDate();
			var mm = today.getMonth() + 1; //January is 0!

			var yyyy = today.getFullYear();
			if (dd < 10) {
				dd = '0' + dd;
			}
			if (mm < 10) {
				mm = '0' + mm;
			}

			today = dd + '.' + mm + '.' + yyyy;

			var validFrom = today;

			var reverse = [].concat(oTable.getSelectedIndices()).reverse();
			reverse.forEach(function (index) {
				if (oData.length === 1) {
					oData.splice(index, 1);
					oData.push({
						Types: "BOOK",
						ConditionType: "",
						ConditionTypeText: "",
						PriceType: "",
						PriceTypeText: "",
						Location: "",
						UnitType: "",
						ProdHier: "",
						Qty: "",
						Amount: "",
						ValidFrom: validFrom,
						ValidTo: "31.12.9999",
						Currency: globalThis.getView().getModel("booking").getData().Currency,
						Handling: "",
						Dropoff: "",
						ConditionEnabled: true,
						PriceTypeEnabled: true,
						LocationEnabled: true,
						UnitTypeEnabled: true,
						ProdHierEnabled: false,
						CurrencyEnabled: true
					});
				} else {
					oData.splice(index, 1);
				}

			});
			oModel.refresh();
			oTable.setSelectedIndex(-1);

			if (oData.length > 10) {
				oTable.setVisibleRowCount(10);
			} else {
				oTable.setVisibleRowCount(oData.length);
			}

			this.getView().getModel("booking").updateBindings();
			this.getView().getModel("booking").refresh();

		},

		addRowCPAGTable: function (oEvent) {

			var tableId = "idCPAGBOOKTable";
			// var dataArray = this.aCPAGBOOKData;
			var processIconTabBar = "BOOK";
			var existingArray = this.getView().getModel("booking").getData().itemsCPAGBOOK;
			var tabProperty = "/itemsCPAGBOOK";

			var oCPAGTableData = existingArray;
			if (!oCPAGTableData) {
				// dataArray = [];
				oCPAGTableData = [];
			}

			var today = new Date();
			var dd = today.getDate();
			var mm = today.getMonth() + 1; //January is 0!

			var yyyy = today.getFullYear();
			if (dd < 10) {
				dd = '0' + dd;
			}
			if (mm < 10) {
				mm = '0' + mm;
			}

			today = dd + '.' + mm + '.' + yyyy;

			var validFrom = today;

			existingArray.push({
				Types: processIconTabBar,
				ConditionType: "",
				ConditionTypeText: "",
				PriceType: "",
				PriceTypeText: "",
				Location: "",
				UnitType: "",
				ProdHier: "",
				Qty: "",
				Amount: "",
				ValidFrom: validFrom,
				ValidTo: "31.12.9999",
				Currency: "ZD1", //this.getView().getModel("booking").getData().Currency
				Handling: "",
				Dropoff: "",
				ConditionEnabled: true,
				PriceTypeEnabled: true,
				LocationEnabled: true,
				UnitTypeEnabled: true,
				ProdHierEnabled: true,
				CurrencyEnabled: true
			});
			this.getView().getModel("booking").setProperty(tabProperty, existingArray);
			if (!this.aCPAGBOOKData) {
				this.aCPAGBOOKData = [];
			}
			if (this.aCPAGBOOKData.length > 10) {
				sap.ui.core.Fragment.byId("container-sd_fiori---worklist--idCPAGDialog", tableId).setVisibleRowCount(10);
			} else {
				sap.ui.core.Fragment.byId("container-sd_fiori---worklist--idCPAGDialog", tableId).setVisibleRowCount(existingArray.length);
			}

			this.getView().getModel("booking").updateBindings();
			this.getView().getModel("booking").refresh();
		},

		onValidate: function (oEvent) {
			var oViewModel = this.getView().getModel();
			this.initializeMessageManager(this.getView().getModel());
			var oMessageManager = this.getMessageManager();
			oMessageManager.removeAllMessages();
			var checkorvalidate = oEvent.getSource().data("saveorsubmit");

			if (checkorvalidate === "C") {

				var itemsData = this.getView().getModel().getData().items;
				var itemsDataToPass = [];

				for (var i = 0; i < itemsData.length; i++) {

					// if (!itemsData[i].Depcode) {
					// 	MessageBox.alert("Please ensure you have selected depot for all line items");
					// }
					if (itemsData[i].UnitType || itemsData[i].SerialNo) {
						itemsDataToPass.push({
							Lease: "",
							LeaseItem: "",
							ItemNo: String(itemsData[i].ItemNo),
							UnitType: itemsData[i].UnitType,
							ProdHier: itemsData[i].ProdHier,
							SerialNo: (itemsData[i].SerialNo == undefined) ? "" : itemsData[i].SerialNo,
							RequestedQuan: "0",
							ReleasedQuan: "0",
							PickQuan: "0",
							NotpickQuan: "0",
							Location: itemsData[i].Location,
							LocCode: get_city_code(itemsData[i].Location, this.CitiesOnlyData),
							Depot: itemsData[i].DepoCode,
							Depcode: itemsData[i].DepoCode,
							Comments: itemsData[i].Comments,
							LastCargo: itemsData[i].LastCargo
						});
					}
				}

				var postData = {
					// Lease: bookingData.Lease,
					// LeaseType: bookingData.LeaseType,
					// SalesOrg: bookingData.SalesOrg,
					// Vtweg: "",
					// Spart: "",
					// Customer: bookingData.Customer,
					// Customership: "",
					// Bukrs: "",
					// Change: false,
					// Vbelnin: "",
					// ConditionType: (bookingData.ConditionType) ? bookingData.ConditionType : "",
					// PriceType: (bookingData.PriceType) ? bookingData.PriceType : "",
					Saves: checkorvalidate,
					// ZzresStart: ZzresStart,
					// ZzresEnd: ZzresEnd,
					"navheaderitems": itemsDataToPass,
					"navheaderitemconditions": [],
					"navheaderreturns": []
				};

				var fnSuccess = function (oData, oResponse) {
					this.busyDialog.close();
					Console.debug("Check Succeeded");
					var errorMsg = "";
					var isCheckPassed = true;
					var checkedData = oData.navheaderitems.results;

					var aTableData = this.getView().getModel().getData("/items").items;

					for (var i = 0; i < aTableData.length; i++) {
						loop2: for (var j = 0; j < checkedData.length; j++) {
							if (aTableData[i].SerialNo !== "") {
								if (aTableData[i].SerialNo === checkedData[j].SerialNo) {
									aTableData[i].DepoCode = checkedData[j].Depcode;
									aTableData[i].LocCode = checkedData[j].LocCode;
									aTableData[i].Location = get_city_desc(checkedData[j].LocCode, this.CitiesOnlyData);
									aTableData[i].UnitType = checkedData[j].UnitType;
									aTableData[i].RequestedQuan = parseInt(checkedData[j].RequestedQuan, 10);

									additionalText = "";
									errorMsg = "";
									if (!checkedData[j].UnitType) {
										errorMsg = "Serial No. not found!";
									} else if (!checkedData[j].LocCode) {
										errorMsg = "Serial No. is not in depot!";
									}

									if (errorMsg !== "") {
										isCheckPassed = false;
										errorMessage = "Line No. " + (i + 1) + " " + errorMsg;

										this.addMessages("Error", errorMessage, errorMessage, oViewModel,
											0, additionalText);
									}

									break loop2;
								}
							}
						}
					}

					this.getView().getModel().setProperty("/items", aTableData);

					if (isCheckPassed) {
						this.getView().byId("idButtonValidate").setEnabled(true);
					} else {
						this.getView().byId("idButtonValidate").setEnabled(false);
					}

					this.updateDSSandCondIndicators();

				}.bind(this);

				var fnError = function (error) {
					this.busyDialog.close();
				}.bind(this);

				this.busyDialog.open();
				this.getOwnerComponent().getModel().create("/HeaderSet", postData, {
					success: fnSuccess,
					error: fnError
				});

			} else {

				var additionalText = "";
				var errorMessage = "";

				// Initially remove all background error colors

				var aTable = this.getView().getModel().getData("/items").items;
				for (var i = 0; i < aTable.length; i++) {
					if (this.getView().byId("idTable").getRows()[i])
						this.getView().byId("idTable").getRows()[i].removeStyleClass("errorcolor");
				}

				this.validationPassed = false;
				var enteredItems = this.getView().getModel().getData().items;
				this.enteredItemsWithoutDuplicate = [];

				this.itemsDataAfterRemoveEmpty = [];
				var isValid = true;
				var isAnythingEntered = false;

				/* Remove Unwanted Lines first */
				for (var i = 0; i < enteredItems.length; i++) {

					if (enteredItems[i].UnitType || enteredItems[i].ProdHier || enteredItems[i].DepoCode || enteredItems[i].RequestedQuan) {
						isAnythingEntered = true;
					}

					enteredItems[i].Status = "";
					enteredItems[i].Message = "";

					if ((enteredItems[i].UnitType || enteredItems[i].ProdHier) && enteredItems[i].RequestedQuan && enteredItems[i].Location &&
						enteredItems[i].DepoCode) {
						// if (enteredItems[i].UnitType && enteredItems[i].ProdHier) {

						// 	isValid = false;
						// 	additionalText = "";
						// 	errorMessage = "Line No. " + (i + 1) + "Enter either Unit Type or Prod. Hierarchy, not both";

						// 	this.addMessages("Error", errorMessage, errorMessage, oViewModel,
						// 		0, additionalText);

						// } else {
						this.itemsDataAfterRemoveEmpty.push(enteredItems[i]);
						// }
					} else if (!enteredItems[i].UnitType && !enteredItems[i].ProdHier && !enteredItems[i].RequestedQuan && !enteredItems[i].Location &&
						!enteredItems[i].DepoCode) {

					} else {
						isValid = false;
						enteredItems[i].Status = "Error";
						if (!enteredItems[i].UnitType && !enteredItems[i].ProdHier) {
							// enteredItems[i].Message = "Enter either Unit Type or Prod. Hierarchy";

							additionalText = "";
							errorMessage = "Line No. " + (i + 1) + " Enter either Unit Type or Prod. Hierarchy";

							this.addMessages("Error", errorMessage, errorMessage, oViewModel,
								0, additionalText);

						}

						// else if (enteredItems[i].UnitType && enteredItems[i].ProdHier) {

						// 	additionalText = "";
						// 	errorMessage = "Line No. " + (i + 1) + "Enter either Unit Type or Prod. Hierarchy, not both";

						// 	this.addMessages("Error", errorMessage, errorMessage, oViewModel,
						// 		0, additionalText);

						// }
						// else if (!enteredItems[i].Location) {
						// 	// enteredItems[i].Message = "Enter a location";

						// 	additionalText = "";
						// 	errorMessage = "Line No. " + (i + 1) + "Enter location";

						// 	this.addMessages("Error", errorMessage, errorMessage, oViewModel,
						// 		0, additionalText);

						// } 
						else if (!enteredItems[i].RequestedQuan) {
							// enteredItems[i].Message = "Enter requested quantity";

							additionalText = "";
							errorMessage = "Line No. " + (i + 1) + " Enter requested quantity";

							this.addMessages("Error", errorMessage, errorMessage, oViewModel,
								0, additionalText);

						} else if (!enteredItems[i].DepoCode) {
							// enteredItems[i].Message = "Enter requested quantity";

							additionalText = "";
							errorMessage = "Line No. " + (i + 1) + " Enter Depot";

							this.addMessages("Error", errorMessage, errorMessage, oViewModel,
								0, additionalText);

						}

					}

					if (enteredItems[i].UnitType || enteredItems[i].ProdHier || enteredItems[i].DepoCode || enteredItems[i].SerialNo) {
						this.enteredItemsWithoutDuplicate.push(enteredItems[i]);
					}
				}

				if (!isAnythingEntered) {
					this.addMessages("Error", "Enter at lease one line item", "Enter at lease one line item", oViewModel, 0);
					return;
				}

				if (this.enteredItemsWithoutDuplicate.length === 0) {
					this.getView().getModel("bookinginitial").setProperty("/validationPassed", false);
					this.getView().getModel("bookinginitial").setProperty("/validationFailed", true);
				}

				// 1. Check for duplicate serial number...

				var bRBBS = this.byId("idRBOBS").getProperty("selected");
				if (bRBBS) {

					var arr = {};

					for (var j = 0, len = this.enteredItemsWithoutDuplicate.length; j < len; j++) {
						arr[this.enteredItemsWithoutDuplicate[j]['SerialNo']] = this.enteredItemsWithoutDuplicate[j];
					}

					var serialNoWoDuplicates = [];
					for (var key in arr)
						serialNoWoDuplicates.push(arr[key]);

					if (this.enteredItemsWithoutDuplicate.length !== serialNoWoDuplicates.length) {
						this.addMessages("Error", "Remove duplicate serial numbers", "Remove duplicate serial numbers", oViewModel, i);
						return;
					}

					var modelwoduplicate = new sap.ui.model.json.JSONModel({
						items: this.enteredItemsWithoutDuplicate
					});
					// this.getView().setModel(modelwoduplicate);
					this.getView().getModel().setProperty("/items", this.enteredItemsWithoutDuplicate);
					this.getView().getModel().refresh();
					if (this.enteredItemsWithoutDuplicate.length > 0) {
						this.getView().byId("idTable").setVisibleRowCount(this.enteredItemsWithoutDuplicate.length);
					}
				}

				var bFlag = true;
				var bAtleaseOneItem = false;
				var bRBBS = this.byId("idRBOBS").getProperty("selected");
				if (bRBBS) {

					var aTableItems = this.enteredItemsWithoutDuplicate;
					for (var i = 0; i < aTableItems.length; i++) {
						bAtleaseOneItem = true;
						if (aTableItems[i].SerialNo) { // If serial no. is entered
							if (!aTableItems[i].DepoCode) {
								var depError = "";
								depError = "Line No. " + (i + 1) + " cannot find " + aTableItems[i].SerialNo + " in depot";
								this.addMessages("Error", depError, depError, oViewModel, i);
								isValid = false;
							}
						} else {
							aTableItems[i].Status = "Error";
							bFlag = false;
						}
					}

					// if (!bFlag) {
					// 	// var oTable = this.getView().byId("idTable").getModel().getData("items").items;
					// 	for (i = 0; i < aTableItems.length; i++) {
					// 		// if (aTableItems[i].SerialNo != undefined) {
					// 		if (aTableItems[i].Status === "Error") {
					// 			var sErrorText = "Error in line no." + " " + (i + 1); //aTableItems[i].SerialNo;
					// 			this.addMessages(aTableItems[i].Status, sErrorText, sErrorText, oViewModel, i);
					// 		}
					// 		// }

					// 	}
					// 	this._showMessageCount();
					// 	// this.getMessageManager.registerObject(this.getView().byId("idPanel"), true);
					// 	this.getView().setModel(this.getMessageModel(), "message");
					// 	this.getView().getModel().refresh();
					// 	this.validationPassed = false;
					// } else {
					// 	this.validationPassed = true;
					// 	this.getView().getModel().refresh();
					// }
				}
				var bRBUT = this.byId("idRBOUT").getProperty("selected");
				if (bRBUT) {

					var aTableItems = this.enteredItemsWithoutDuplicate;
					for (var i = 0; i < aTableItems.length; i++) {
						bAtleaseOneItem = true;
						if ((aTableItems[i].UnitType || aTableItems[i].ProdHier) && aTableItems[i].DepoCode) {

						} else {
							aTableItems[i].Status = "Error";
							bFlag = false;
						}
					}

					// if (!bFlag) {
					// 	// var oTable = this.getView().byId("idTable").getModel().getData("items").items;
					// 	for (i = 0; i < aTableItems.length; i++) {
					// 		// if (aTableItems[i].UnitType != undefined) {
					// 		if (aTableItems[i].Status === "Error") {
					// 			var sErrorText = "Error in Line No. " + (i + 1) + " " + "Product/Prod. Hier and Location are mandatory";
					// 			this.addMessages(aTableItems[i].Status, sErrorText, sErrorText, oViewModel, i);
					// 		}
					// 		// }

					// 	}
					// 	this._showMessageCount();
					// 	// this.getMessageManager.registerObject(this.getView().byId("idPanel"), true);
					// 	this.getView().setModel(this.getMessageModel(), "message");
					// 	this.getView().getModel().refresh();
					// 	this.validationPassed = false;
					// } else {
					// 	this.validationPassed = true;
					// 	this.getView().getModel().refresh();
					// }

				}

				var headerMandatoryFields = [{
					field: "ZzresStart",
					text: "Pickup Start Date"
				}, {
					field: "ZzresEnd",
					text: "Pickup End Date"
				}];

				var valueMandatory = "";
				var errorMessageMandatory = "";
				var oViewModel = this.getView().getModel();
				for (var i = 0; i < headerMandatoryFields.length; i++) {
					valueMandatory = this.getView().getModel("booking").getProperty("/" + headerMandatoryFields[i].field);
					if (!valueMandatory) {
						isValid = false;
						errorMessageMandatory = "Field " + headerMandatoryFields[i].text + " is mandatory";
						this.addMessages("Error", errorMessageMandatory, errorMessageMandatory, oViewModel, 0);
					}
				}

				if (bAtleaseOneItem && isValid) {

					// Only if frontend validation is successful, send for backend validation...
					this.onSaveFinal("V");

				} else {
					this.getView().getModel("bookinginitial").setProperty("/validationPassed", false);
					this.getView().getModel("bookinginitial").setProperty("/validationFailed", true);
					// for (i = 0; i < aTableItems.length; i++) {
					// 	if (aTableItems[i].Status === "Error") {
					// 		var sErrorText = "Item : " + " " + (i + 1) + aTableItems[i].Message; //aTableItems[i].SerialNo;
					// 		this.addMessages(aTableItems[i].Status, sErrorText, sErrorText, oViewModel, i);
					// 	}
					// }

				}

				// if (!bAtleaseOneItem) {
				// 	this.validationPassed = false;
				// }

				this.getView().getModel("bookinginitial").setProperty("/validationPassed", this.validationPassed);

				/*
				var bRB1 = this.byId("idRBOBS").getProperty("selected");
				if (bRB1) {
					var aTableItems = this.getView().byId("idTable").getModel().getData("items").items;
					for (var z = 0; z < aTableItems.length; z++) {
						if (aTableItems[z].SerialNo != undefined) {
							aTableItems[z].SerialNo = aTableItems[z].SerialNo.trim();
							this.getView().byId("idTable").getRows()[z].removeStyleClass("bgcolor");
						}
					}
					var bFlag;

					this.getOwnerComponent().getModel().read("/ItemsSet", {
						success: function (oData) {
							var aResults = oData.results;
							for (var i = 0; i < aTableItems.length; i++) {
								for (var j = 0; j < aResults.length; j++) {
									if (aTableItems[i].SerialNo === undefined) {
										break;
									} else if (aResults[j].SerialNo === aTableItems[i].SerialNo) {
										aTableItems[i].Status = "Success";
										bFlag = true;
										break;

									} else {
										aTableItems[i].Status = "Error";
										bFlag = false;
									}
									// }
								}
							}
							if (!bFlag) {
								this.initializeMessageManager(this.getView().getModel());
								var oMessageManager = this.getMessageManager();
								oMessageManager.removeAllMessages();
								// var oTable = this.getView().byId("idTable").getModel().getData("items").items;
								for (i = 0; i < aTableItems.length; i++) {
									if (aTableItems[i] != undefined) {
										if (aTableItems[i].Status === "Error") {
											var sErrorText = "Error for" + " " + aTableItems[i].SerialNo;
											var oViewModel = this.getView().getModel();
											this.addMessages(aTableItems[i].Status, sErrorText, sErrorText, oViewModel);
										}
									}

								}
								this._showMessageCount();
								// this.getMessageManager.registerObject(this.getView().byId("idPanel"), true);
								this.getView().setModel(this.getMessageModel(), "message");
								this.getView().getModel().refresh();
							} else {
								// var oTable = this.getView().byId("idTable").getModel().getData("items").items;
								for (i = 0; i < aTableItems.length; i++) {
									if (aTableItems[i].SerialNo != undefined) {
										var sSerialNo = aTableItems[i].SerialNo;
										var sOdataKey = this.getOwnerComponent().getModel().createKey("ItemsSet", {
											SerialNo: sSerialNo,
										});

										var sPath = "/" + sOdataKey;
										this.getOwnerComponent().getModel().read(sPath, {
											groupId: "ReadBookingItems"
										});
									}
								}
								this.getOwnerComponent().getModel().submitChanges({
									groupId: "ReadBookingItems",
									success: function (oData) {
										var i;
										var a = [];
										for (i = 0; i < oData.__batchResponses.length; i++) {
											if (oData.__batchResponses[i] != undefined) {
												a[i] = oData.__batchResponses[i].data;
											}
										}
										var oTableLength = a.length;
										// for (var k = 0; k < iNumber; k++) {
										// 	var y = {
										// 		Status: "",
										// 		City: "",
										// 		Flag: true
										// 	};
										// 	a[oTableLength] = y;
										// 	oTableLength++;
										// }
										this.getView().getModel().setProperty("/items", a);
										this.initializeMessageManager(this.getView().getModel());
										var oMessageManager = this.getMessageManager();
										// i;
										oMessageManager.removeAllMessages();
										var oTable = this.getView().byId("idTable").getModel().getData("items").items;
									}.bind(this),
									error: function (oError) {}
								});
							}
							// this.getView().getModel().setProperty("/items", aTableItems);
						}.bind(this)

					});
					// }
				} */
			}
		},

		_showMessageCount: function () {
			var oData, oViewModel = this.getModel("message"),
				i;
			if (!this._aMessages) {
				this._aMessages = [];

			}
			oData = this.getMessageModel().getData();
			for (i = 0; i < oData.length; i++) {
				this._aMessages.push(oData[i]);
			}
			this.getView().getModel("message").setProperty("/", this._aMessages);
			oViewModel.setProperty("/Errors/NoOfErrors", oData.length);
			if (oData.length > 0) {
				oViewModel.setProperty("/Errors/visible", true);
			} else {
				oViewModel.setProperty("/Errors/visible", false);
			}
		},

		handleMessagePopoverPress: function (oEvent) {
			if (!this.oErrorPopover) {
				this.oErrorPopover = sap.ui.xmlfragment("com.seaco.sd_fiori.view.fragments.MessagePopover", this);
			}
			this.getView().addDependent(this.oErrorPopover);
			if (!this.oErrorPopover.isOpen()) {
				this.oErrorPopover.openBy(oEvent.getSource());
			} else {
				this.oErrorPopover.close();
			}
		},

		activeTitle: function (oEvent) {
			var that = this;
			var oItem = oEvent.getParameter("item"),
				oPage = that.oView.byId("idPage"),
				oMessage = oItem.getBindingContext("message").getObject();
			// var sSerialNo = oItem.getBindingContext("message").getObject().description.split(" ")[2];
			// var sUnitType = oItem.getBindingContext("message").getObject().description.split(" ")[2];
			var aTable = this.getView().getModel().getData("/items").items;

			// var bRBBS = this.byId("idRBOBS").getProperty("selected");
			// var bRBUT = this.byId("idRBOUT").getProperty("selected");

			// for (var i = 0; i < aTable.length; i++) {
			// 	if (bRBUT) {
			// 		if (aTable[i].SerialNo === sSerialNo) {
			// 			var iIndex = i;
			// 		}
			// 	} else if (bRBUT) {
			// 		if (aTable[i].UnitType === sUnitType) {
			// 			var iIndex = i;
			// 		}
			// 	}
			// }

			var iIndex = oItem.getBindingContext("message").getObject().code;
			for (var i = 0; i < aTable.length; i++) {
				if (i === iIndex) {
					// aTable[iIndex].Colour = "true";
					this.getView().byId("idTable").getRows()[iIndex].addStyleClass("errorcolor");

				} else {
					this.getView().byId("idTable").getRows()[i].removeStyleClass("errorcolor");

				}
			}
			this.getView().getModel().setProperty("/items", aTable);
			this.oErrorPopover.close();
		},

		populateSerialDetails: function (oEvent) {
			var value = oEvent.getParameter("value");
		},

		onSaveFinal: function (oEvent) {

			var saveorsubmit = "";
			if (oEvent === "V") {
				saveorsubmit = oEvent;
				this.onSubmit(saveorsubmit);
			} else {
				saveorsubmit = oEvent.getSource().data("saveorsubmit");
				MessageBox.show(
					"Do you want to submit?", {
						icon: MessageBox.Icon.INFORMATION,
						title: "Submit",
						actions: [MessageBox.Action.YES, MessageBox.Action.NO],
						onClose: function (oAction) {
							if (oAction === "YES") {
								// Only if frontend validation is successful, send for save...
								globalThis.onSubmit(saveorsubmit);
							} else if (oAction === "NO") {

							}

						}
					}
				);
			}

		},

		onSubmit: function (saveorsubmit) {
			var oViewModel = this.getView().getModel();
			this.initializeMessageManager(this.getView().getModel());
			var oMessageManager = this.getMessageManager();
			oMessageManager.removeAllMessages();

			var additionalText = "";
			var errorMessage = "";

			var oTable = this.getView().byId("idTable").getRows();
			var i, bFlag = true;

			// for (var j = 0; j < oTable.length; j++) {
			// 	if (!oTable[j].getBindingContext().getObject()) {
			// 		continue;
			// 	}
			// 	if (oTable[j].getBindingContext() !== null && (oTable[j].getBindingContext().getObject().UnitType.substr(0, 1) === 'T' && oTable[j]
			// 			.getBindingContext()
			// 			.getObject().LastCargo === undefined)) {
			// 		this.getView().byId("idTable").getRows()[j].getCells("LastCargo")[8].setValueState("Error");
			// 		this.getView().byId("idTable").getRows()[j].getCells("LastCargo")[8].setValueStateText("Please enter Last Cargo");
			// 		bFlag = false;
			// 		var sErrorText = "Error in line no." + " " + (i + 1) + " " + "Please enter Last Cargo";
			// 		this.addMessages("Error", sErrorText, sErrorText, oViewModel, i);

			// 		break;
			// 	} else {
			// 		this.getView().byId("idTable").getRows()[j].getCells("LastCargo")[8].setValueState("None");
			// 	}
			// }
			if (bFlag) {
				for (i = 0; i < oTable.length; i++) {
					if (oTable[i].getBindingContext() !== null) {
						if (!oTable[i].getBindingContext().getObject()) {
							continue;
						}
						oTable[i].getBindingContext().getObject().Flag = false;
					}
				}
				this.getView().getModel().refresh();
				// this.getView().getModel("data").setProperty("/editDelete", true);
			}
			var bookingData = this.getView().getModel("booking").getData();
			var itemsData = this.getView().getModel().getData().items;
			var itemconditionssDataLEASE = []; //this.conditionsDataFromDraftLEASE; //this.getView().getModel("booking").getData().itemsCPAGLEASE;

			if (this.conditionsDataFromDraftLEASE) {
				for (var i = 0; i < this.conditionsDataFromDraftLEASE.length; i++) {
					if (this.conditionsDataFromDraftLEASE[i].ItemNo != "000000") {
						itemconditionssDataLEASE.push(this.conditionsDataFromDraftLEASE[i]);
					}
				}
			}

			var itemconditionssDataBOOK = this.getView().getModel("booking").getData().itemsCPAGBOOK;
			var itemconditionssDataDSS = this.conditionsDataFromDraftDSS; //this.getView().getModel("booking").getData().itemsCPAGDSS;

			var itemconditionssData = [];
			itemconditionssData.push.apply(itemconditionssData, itemconditionssDataLEASE);
			itemconditionssData.push.apply(itemconditionssData, itemconditionssDataBOOK);
			itemconditionssData.push.apply(itemconditionssData, itemconditionssDataDSS);

			var itemsDataToPass = [];
			var itemconditionssDataToPass = [];

			for (var i = 0; i < itemsData.length; i++) {
				if (itemsData[i].UnitType || itemsData[i].SerialNo) {
					itemsDataToPass.push({
						Lease: bookingData.Lease,
						LeaseItem: "",
						ItemNo: String(itemsData[i].ItemNo),
						UnitType: itemsData[i].UnitType,
						ProdHier: itemsData[i].ProdHier,
						SerialNo: (itemsData[i].SerialNo == undefined) ? "" : itemsData[i].SerialNo,
						RequestedQuan: (itemsData[i].RequestedQuan != "") ? String(itemsData[i].RequestedQuan) : "0.00",
						ReleasedQuan: "0",
						PickQuan: "0",
						NotpickQuan: "0",
						Location: itemsData[i].Location,
						LocCode: get_city_code(itemsData[i].Location, this.CitiesOnlyData),
						Depot: itemsData[i].DepoCode,
						Depcode: itemsData[i].DepoCode,
						Comments: itemsData[i].Comments,
						LastCargo: itemsData[i].LastCargo
					});
				}
			}

			// var lvValidFrom = "";
			// var lvValidTo = "";

			// if (itemconditionssData) {
			// 	// If location is selected in Price Type, make sure you convert the location into loc code before passing it to backend
			// 	for (var i = 0; i < itemconditionssData.length; i++) {

			// 		// Convert date format from dd.mm.yyyy to yyyymmdd

			// 		lvValidFrom = itemconditionssData[i].Col6;
			// 		var yourdate = itemconditionssData[i].Col6.split(".").reverse();
			// 		lvValidFrom = yourdate[0] + yourdate[1] + yourdate[2];

			// 		lvValidTo = itemconditionssData[i].Col7;
			// 		yourdate = itemconditionssData[i].Col7.split(".").reverse();
			// 		lvValidTo = yourdate[0] + yourdate[1] + yourdate[2];

			// 		itemconditionssDataToPass.push({
			// 			Lease: bookingData.Lease,
			// 			LeaseItem: "",
			// 			ItemNo: "0", //itemconditionssData[i].ItemNo,
			// 			Col1: itemconditionssData[i].Col1,
			// 			Col2: (this.locationColInCondRecord === 0) ? itemconditionssData[i].Col2 : get_city_code(itemconditionssData[i].Col2, this.CitiesOnlyData),
			// 			Col3: itemconditionssData[i].Col3,
			// 			Col4: itemconditionssData[i].Col4,
			// 			Col5: itemconditionssData[i].Col5,
			// 			Col6: lvValidFrom,
			// 			Col7: lvValidTo,
			// 			Col8: itemconditionssData[i].Col8
			// 		});

			// 	}

			// }

			var lvValidFrom = "";
			var lvValidTo = "";

			if (itemconditionssData && saveorsubmit === "X") {
				// If location is selected in Price Type, make sure you convert the location into loc code before passing it to backend
				for (var i = 0; i < itemconditionssData.length; i++) {

					if (itemconditionssData[i].Amount === "") {
						continue;
					}
					// Convert date format from dd.mm.yyyy to yyyymmdd

					lvValidFrom = itemconditionssData[i].ValidFrom;
					if (itemconditionssData[i].ValidFrom) {
						if (typeof (itemconditionssData[i].ValidFrom) === "string") {
							var yourdate = itemconditionssData[i].ValidFrom.split(".").reverse();
							lvValidFrom = yourdate[0] + yourdate[1] + yourdate[2];
						}
					}

					lvValidTo = itemconditionssData[i].ValidTo;
					if (itemconditionssData[i].ValidTo) {
						if (typeof (itemconditionssData[i].ValidTo) === "string") {
							yourdate = itemconditionssData[i].ValidTo.split(".").reverse();
							lvValidTo = yourdate[0] + yourdate[1] + yourdate[2];
						}
					}

					var condTypeLocal = "";
					var quantityLocal = "";

					if (itemconditionssData[i].Types === "LEASE") {
						condTypeLocal = (itemconditionssData[i].CondType) ? itemconditionssData[i].CondType : itemconditionssData[i].ConditionType;
						quantityLocal = (itemconditionssData[i].Amount) ? itemconditionssData[i].Amount : itemconditionssData[i].ReqQty;

						itemconditionssDataToPass.push({
							Lease: "",
							LeaseItem: "",
							ItemNo: (itemconditionssData[i].ItemNo) ? String(itemconditionssData[i].ItemNo) : String("10"), // Default it to 10, pricing data are not item related
							CondType: condTypeLocal,
							ReqQty: (quantityLocal != "") ? quantityLocal : "0.00",
							Currency: itemconditionssData[i].Currency,
							Types: itemconditionssData[i].Types,
							Mandatory: ""

						});
					} else if (itemconditionssData[i].Types === "DSS") {
						itemconditionssDataToPass.push({
							Lease: "",
							LeaseItem: "",
							ItemNo: (itemconditionssData[i].ItemNo) ? String(itemconditionssData[i].ItemNo) : String("10"), // Default it to 10, pricing data are not item related
							Location: itemconditionssData[i].LocCode,
							ReqQty: (itemconditionssData[i].ReqQty != "") ? itemconditionssData[i].ReqQty : "0.00",
							Handling: (itemconditionssData[i].Handling != "") ? itemconditionssData[i].Handling : "0.00",
							Dropoff: (itemconditionssData[i].Dropoff != "") ? itemconditionssData[i].Dropoff : "0.00",
							Currency: itemconditionssData[i].Currency,
							Types: itemconditionssData[i].Types,
							Mandatory: ""
						});
					} else {
						itemconditionssDataToPass.push({
							Lease: String("10"),
							LeaseItem: String("10"),
							ItemNo: String("10"), // Default it to 10, pricing data are not item related
							CondType: itemconditionssData[i].ConditionType,
							PriceType: "605",
							PriceTypeText: "Product,Location",
							Location: itemconditionssData[i].LocCode,
							Product: itemconditionssData[i].UnitType,
							ProdHier: itemconditionssData[i].ProdHier,
							ReqQty: (itemconditionssData[i].Amount != "") ? itemconditionssData[i].Amount : "0.00",
							Handling: "0.00",
							Dropoff: "0.00",
							ValidFrom: prepare_edmdatetime_format(itemconditionssData[i].ValidFrom),
							ValidTo: prepare_edmdatetime_format(itemconditionssData[i].ValidTo),
							Currency: itemconditionssData[i].Currency,
							Types: itemconditionssData[i].Types,
							Mandatory: ""

						});
					}

				}
			}

			var ZzresStart = prepare_edmdatetime_format(this.getView().getModel("booking").getProperty("/ZzresStart"));
			var ZzresEnd = prepare_edmdatetime_format(this.getView().getModel("booking").getProperty("/ZzresEnd"));

			var vbelnin = this.getView().getModel("booking").getProperty("/ActiveBooking");
			var vbelnString = "";
			if (vbelnin) {
				vbelnString = String(this.getView().getModel("booking").getProperty("/ActiveBooking"));
			} else {
				vbelnString = "";
			}

			var postData = {
				OrderStatus: bookingData.OrderStatus,
				Lease: bookingData.Lease,
				LeaseType: bookingData.LeaseType,
				SalesOrg: bookingData.SalesOrg,
				Vtweg: "",
				Spart: "",
				Customer: bookingData.Customer.split(" - ")[0],
				Customership: "",
				Bukrs: "",
				Change: this.getView().getModel("booking").getProperty("/ActiveBooking") ? true : false,
				Vbelnin: vbelnString,
				ConditionType: (bookingData.ConditionType) ? bookingData.ConditionType : "",
				PriceType: (bookingData.PriceType) ? bookingData.PriceType : "",
				Saves: saveorsubmit,
				ZzresStart: ZzresStart,
				ZzresEnd: ZzresEnd,
				"navheaderitems": itemsDataToPass,
				"navheaderitemconditions": itemconditionssDataToPass,
				"navheaderreturns": []
			};

			// this.busyDialog.open();
			// this.getOwnerComponent().getModel().create("/HeaderSet", postData, null, function (oData, oResponse) {
			// 		this.busyDialog.close();
			// 		MessageBox.alert("Sales Order Created");
			// 	},
			// 	function (err) {
			// 		MessageBox.alert("Sales Order cannot be created");
			// 		this.busyDialog.close();
			// 	});

			var fnSuccess = function (oData, oResponse) {
				this.busyDialog.close();
				this.conditionsDataFromDraftBOOK = [];
				this.conditionsDataFromDraftLEASE = [];
				this.conditionsDataFromDraftDSS = [];

				for (var i = 0; i < oData.navheaderitemconditions.results.length; i++) {
					if (oData.navheaderitemconditions.results[i].Types === "LEASE") {
						this.conditionsDataFromDraftLEASE.push(oData.navheaderitemconditions.results[i]);
					} else if (oData.navheaderitemconditions.results[i].Types === "BOOK") {
						// this.conditionsDataFromDraftBOOK.push(oData.navheaderitemconditions.results[i]);

						this.conditionsDataFromDraftBOOK.push({
							ConditionType: oData.navheaderitemconditions.results[i].CondType,
							ReqQty: oData.navheaderitemconditions.results[i].ReqQty,
							Amount: oData.navheaderitemconditions.results[i].ReqQty,
							Lease: oData.navheaderitemconditions.results[i].Lease,
							Handling: oData.navheaderitemconditions.results[i].Handling,
							LeaseItem: oData.navheaderitemconditions.results[i].LeaseItem,
							Dropoff: oData.navheaderitemconditions.results[i].Dropoff,
							PriceType: oData.navheaderitemconditions.results[i].PriceType,
							ItemNo: oData.navheaderitemconditions.results[i].ItemNo,
							// Location: oData.navheaderitemconditions.results[i].Location,
							LocCode: oData.navheaderitemconditions.results[i].Location,
							Location: get_city_desc(oData.navheaderitemconditions.results[i].Location, this.CitiesOnlyData),
							UnitType: oData.navheaderitemconditions.results[i].Product,
							ProdHier: oData.navheaderitemconditions.results[i].ProdHier,
							PriceTypeText: oData.navheaderitemconditions.results[i].PriceTypeText,
							Mandatory: oData.navheaderitemconditions.results[i].Mandatory,
							ValidFrom: convert_date_ddmmyyyy(oData.navheaderitemconditions.results[i].ValidFrom),
							ValidTo: convert_date_ddmmyyyy(oData.navheaderitemconditions.results[i].ValidTo),
							Currency: oData.navheaderitemconditions.results[i].Currency,
							Types: oData.navheaderitemconditions.results[i].Types
						});

					} else if (oData.navheaderitemconditions.results[i].Types === "DSS") {
						// this.conditionsDataFromDraftDSS.push(oData.navheaderitemconditions.results[i]);
						this.conditionsDataFromDraftDSS.push({
							// ItemNo: conditionsData[i].ItemNo,
							// Types: "DSS",
							// LocCode: conditionsData[i].Location,
							// Location: get_city_desc(conditionsData[i].Location, this.CitiesOnlyData),
							// ReqQty: conditionsData[i].ReqQty,
							// Handling: conditionsData[i].Handling,
							// Dropoff: conditionsData[i].Dropoff,
							// Currency: this.getView().getModel("booking").getData().Currency
							CondType: oData.navheaderitemconditions.results[i].CondType,
							ReqQty: oData.navheaderitemconditions.results[i].ReqQty,
							Lease: oData.navheaderitemconditions.results[i].Lease,
							Handling: oData.navheaderitemconditions.results[i].Handling,
							LeaseItem: oData.navheaderitemconditions.results[i].LeaseItem,
							Dropoff: oData.navheaderitemconditions.results[i].Dropoff,
							PriceType: oData.navheaderitemconditions.results[i].PriceType,
							ItemNo: oData.navheaderitemconditions.results[i].ItemNo,
							// Location: oData.navheaderitemconditions.results[i].Location,
							LocCode: oData.navheaderitemconditions.results[i].Location,
							Location: get_city_desc(oData.navheaderitemconditions.results[i].Location, this.CitiesOnlyData),
							Product: oData.navheaderitemconditions.results[i].Product,
							ProdHier: oData.navheaderitemconditions.results[i].ProdHier,
							PriceTypeText: oData.navheaderitemconditions.results[i].PriceTypeText,
							Mandatory: oData.navheaderitemconditions.results[i].Mandatory,
							ValidFrom: oData.navheaderitemconditions.results[i].ValidFrom,
							ValidTo: oData.navheaderitemconditions.results[i].ValidTo,
							Currency: oData.navheaderitemconditions.results[i].Currency,
							Types: oData.navheaderitemconditions.results[i].Types
						});
					}
				}
				Console.debug("Validation Succeeded");
				var txnCreatedMessage = "";
				var txnCreatedTitle = "";
				var isMessageBoxToBeShown = true;
				if (saveorsubmit === 'X') {

					if (!oData.EVbeln) {

						MessageBox.alert("Booking cannot be created");
						return;
					}
					if (this.getView().getModel("booking").getProperty("/ActiveBooking")) { // If it is already CHANGE MODE

						txnCreatedTitle = "Updated";
						txnCreatedMessage = "Booking Updated : " + parseInt(oData.EVbeln, 10);
						this.getView().getModel("booking").setProperty("/ActiveBooking", parseInt(oData.EVbeln, 10));
						this.onPressReset(true);

					} else {
						txnCreatedTitle = "Created";
						txnCreatedMessage = "Booking created : " + parseInt(oData.EVbeln, 10);
						this.getView().getModel("booking").setProperty("/ActiveBooking", parseInt(oData.EVbeln, 10));
						this.onPressReset(true);
					}

					this.aLeaseData = [];
					this.aBookingData = [];
					this.aCustomerData = [];
					this.aLeaseBookingRelData = [];
					this.StatusData = [];

					this.getOwnerComponent().getModel().read("/f4Set", {
						success: function (oData) {
							// this.aCustomerData = oData.results;

							for (var i = 0; i < oData.results.length; i++) {

								oData.results[i].Cargoworthy = (oData.results[i].Cargoworthy === "CW") ? "YES" : "NO";
								oData.results[i].CreationDate = sap.ui.core.format.DateFormat.getDateTimeInstance({
									pattern: "dd.MM.yyyy"
								}).format(new Date(oData.results[i].CreationDate));

								if (oData.results[i].LeaseType.substr(0, 2) === "ZR") {
									this.aBookingData.push(oData.results[i]);
								} else if (oData.results[i].LeaseType.substr(0, 2) === "ZM") {
									this.aLeaseData.push(oData.results[i]);
								} else if (oData.results[i].Status) {
									this.aLeaseBookingRelData.push(oData.results[i]);
								} else if (oData.results[i].EmployeeResponsible != "") {
									this.StatusData.push({
										key: oData.results[i].Lease,
										text: oData.results[i].EmployeeResponsible,
										additionalText: oData.results[i].CreatedBy,
										possibleStatus: oData.results[i].CustomerName
									});
								}

							}

							// Remove Duplicates from Lease Data

							var arr = {};

							for (var j = 0, len = this.aLeaseData.length; j < len; j++) {
								arr[this.aLeaseData[j]['Lease']] = this.aLeaseData[j];
							}

							this.aLeaseData = [];
							for (var key in arr)
								this.aLeaseData.push(arr[key]);
							this.aLeaseData.sort(sort_by('Lease', true, function (a) {
								return a.toUpperCase();
							}));

							// Remove Duplicates from Booking Data

							var arr = {};

							for (var j = 0, len = this.aBookingData.length; j < len; j++) {
								arr[this.aBookingData[j]['Lease']] = this.aBookingData[j];
							}

							this.aBookingData = [];
							for (var key in arr)
								this.aBookingData.push(arr[key]);
							this.aBookingData.sort(sort_by('Lease', true, function (a) {
								return a.toUpperCase();
							}));

							this.getView().getModel("booking").setProperty("/listLease", this.aLeaseData);
							this.getView().getModel("booking").setProperty("/listBooking", this.aBookingData);

							this.getView().getModel("booking").setSizeLimit(100000);
						}.bind(this)
					});

				} else if (saveorsubmit === 'V') {

					// this.getView().getModel("booking").setProperty("/ActiveBooking", "");
					var errorData = oData.navheaderreturns.results;
					// errorData = [];
					if (errorData.length !== 0) {
						isMessageBoxToBeShown = false;
						txnCreatedTitle = "Validation Failed";
						txnCreatedMessage = "Validation Failed : Please correct";

						this.initializeMessageManager(this.getView().getModel());
						var oMessageManager = this.getMessageManager();
						oMessageManager.removeAllMessages();

						var isValid = true;
						var itemsData = this.getView().getModel().getProperty("/items");
						for (var j = 0; j < errorData.length; j++) {
							loop2: for (var i = 0; i < itemsData.length; i++) {
								itemsData[i].Status = "";
								itemsData[i].Message = "";

								if (errorData[j].Id !== "0") {
									if (parseInt(errorData[j].Id, 10) == (i + 1)) {
										isValid = false;
										itemsData[i].Status = "Error";
										itemsData[i].Message = errorData[j].Message;

										var sErrorText = "Item " + " " + (i + 1) + " : " + itemsData[i].Message; //aTableItems[i].SerialNo;
										var oViewModel = this.getView().getModel();
										this.addMessages(itemsData[i].Status, sErrorText, sErrorText, oViewModel, i);

										break loop2;
									}
								} else {
									if (errorData[j].Type === "E") {
										isValid = false;
									}
									itemsData[i].Status = (errorData[j].Type === "W") ? "Warning" : "Error";
									itemsData[i].Message = errorData[j].Message;

									var sErrorText = "Header : " + itemsData[i].Message; //aTableItems[i].SerialNo;
									var oViewModel = this.getView().getModel();
									this.addMessages(itemsData[i].Status, sErrorText, sErrorText, oViewModel, undefined);
									break loop2;

								}
							}
						}
						if (!isValid) {
							this.getView().getModel("bookinginitial").setProperty("/validationPassed", false);
							this.getView().getModel("bookinginitial").setProperty("/validationFailed", true);
						} else {
							this.getView().getModel("bookinginitial").setProperty("/validationPassed", true);
							this.getView().getModel("bookinginitial").setProperty("/validationFailed", false);

							isMessageBoxToBeShown = false;
							txnCreatedTitle = "Validation Passed";
							txnCreatedMessage = "";

							this.getView().getModel().setProperty("/items", this.itemsDataAfterRemoveEmpty);
							this.getView().byId("idTable").setVisibleRowCount(this.itemsDataAfterRemoveEmpty.length);
							this.getView().getModel().refresh();
							this.getView().getModel().updateBindings();
							this.getView().getModel("bookinginitial").setProperty("/validationPassed", true);
							this.getView().getModel("bookinginitial").setProperty("/validationFailed", false);
							this.onPressCPAGNEW("YES");
							this.updateDSSandCondIndicators();

						}
					} else {
						isMessageBoxToBeShown = false;
						txnCreatedTitle = "Validation Passed";
						txnCreatedMessage = "";

						this.getView().getModel().setProperty("/items", this.itemsDataAfterRemoveEmpty);
						this.getView().byId("idTable").setVisibleRowCount(this.itemsDataAfterRemoveEmpty.length);
						this.getView().getModel().refresh();
						this.getView().getModel().updateBindings();
						this.getView().getModel("bookinginitial").setProperty("/validationPassed", true);
						this.getView().getModel("bookinginitial").setProperty("/validationFailed", false);
						this.onPressCPAGNEW("YES");
						this.updateDSSandCondIndicators();
					}

				}
				if (isMessageBoxToBeShown) {
					MessageBox.show(
						txnCreatedMessage, {
							icon: MessageBox.Icon.SUCCESS,
							title: txnCreatedTitle,
							actions: [MessageBox.Action.OK],
							onClose: function (oAction) {
								//globalThis.onPressReset();
								// /* do something */
								// // Refresh the page after the transaction is saved successfully...

								// var fnSuccessRefresh = function (oData, oResponse) {

								// 	if (saveorsubmit === 'S') {
								// 		globalThis.setDataFromTransaction(oData.results[0]);
								// 	} else if (saveorsubmit === 'X') {
								// 		//globalThis.onInit();
								// 	}

								// 	globalThis.busyDialog.close();
								// }.bind(globalThis);

								// var fnErrorRefresh = function (error) {
								// 	globalThis.busyDialog.close();
								// };

								// var laFilters = [];
								// var filter = new sap.ui.model.Filter("Txn", sap.ui.model.FilterOperator.EQ, globalThis.txn);
								// laFilters.push(filter);
								// globalThis.busyDialog.open();
								// globalThis.getOwnerComponent().getModel().read("/HeaderSet", {
								// 	urlParameters: {
								// 		"$expand": "navheaderitems,navheaderitemconditions,navheaderreturns"
								// 	},
								// 	filters: laFilters,
								// 	success: fnSuccessRefresh.bind(globalThis),
								// 	error: fnErrorRefresh
								// });
							}
						}
					);
					this.getView().getModel("booking").setProperty("/Txn", this.txn);
				}
			}.bind(this);

			var fnError = function (error) {
				this.busyDialog.close();
			}.bind(this);

			this.busyDialog.open();
			this.getOwnerComponent().getModel().create("/HeaderSet", postData, {
				success: fnSuccess,
				error: fnError
			});
		},

		onLeaseFieldLiveChange: function (oEvent) {

			var newValue = oEvent.getParameter("newValue");
			if (newValue.length > 6) {
				var currValue = newValue;

				currValue = currValue.substr(0, 6);
				oEvent.getSource().setValue(currValue);
			}

		},

		onCancelButtonPress: function (oEvent) {

			var currLine = oEvent.getSource().getBindingContext().getObject();
		}

	});
});