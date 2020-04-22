sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"../model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/BusyDialog",
	"sap/m/MessageBox",
	"sap/ui/core/Fragment",
	"sap/ui/export/Spreadsheet"
], function (BaseController, JSONModel, formatter, Filter, FilterOperator, BusyDialog, MessageBox, Fragment, Spreadsheet) {
	"use strict";

	function openInNewTab(url) {
		var win = window.open(url, '_blank');
		win.focus();
	}

	function convert_undefined_space(value) {
		var outputValue = "";
		if (value === undefined) {
			return outputValue;
		} else {
			return value;
		}
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

	return BaseController.extend("com.seaco.sd_fiori.controller.Worklist", {

		formatter: formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the worklist controller is instantiated.
		 * @public
		 */
		onInit: function () {
			// var oViewModel,
			// 	iOriginalBusyDelay,
			// 	oTable = this.byId("table");

			// // Put down worklist table's original value for busy indicator delay,
			// // so it can be restored later on. Busy handling on the table is
			// // taken care of by the table itself.
			// iOriginalBusyDelay = oTable.getBusyIndicatorDelay();
			// // keeps the search state
			// this._aTableSearchState = [];

			// // Model used to manipulate control states
			// oViewModel = new JSONModel({
			// 	worklistTableTitle : this.getResourceBundle().getText("worklistTableTitle"),
			// 	saveAsTileTitle: this.getResourceBundle().getText("saveAsTileTitle", this.getResourceBundle().getText("worklistViewTitle")),
			// 	shareOnJamTitle: this.getResourceBundle().getText("worklistTitle"),
			// 	shareSendEmailSubject: this.getResourceBundle().getText("shareSendEmailWorklistSubject"),
			// 	shareSendEmailMessage: this.getResourceBundle().getText("shareSendEmailWorklistMessage", [location.href]),
			// 	tableNoDataText : this.getResourceBundle().getText("tableNoDataText"),
			// 	tableBusyDelay : 0
			// });
			// this.setModel(oViewModel, "worklistView");

			// // Make sure, busy indication is showing immediately so there is no
			// // break after the busy indication for loading the view's meta data is
			// // ended (see promise 'oWhenMetadataIsLoaded' in AppController)
			// oTable.attachEventOnce("updateFinished", function(){
			// 	// Restore original busy indicator delay for worklist's table
			// 	oViewModel.setProperty("/tableBusyDelay", iOriginalBusyDelay);
			// });
			// // Add the worklist page to the flp routing history
			// this.addHistoryEntry({
			// 	title: this.getResourceBundle().getText("worklistViewTitle"),
			// 	icon: "sap-icon://table-view",
			// 	intent: "#Booking-display"
			// }, true);
			var globalThis = this;
			this.bookUrl =
				"https://webidetesting4674935-s0010886312trial.dispatcher.hanatrial.ondemand.com/webapp/index.html?hc_orionpath=%2FDI_webide_di_workspacehl06cof9wlgmarf6%2Fcrm_booking&neo-di-affinity=BIGipServer~jpaas_folder~disapwebide.hanatrial.ondemand.com+%21N1pZB7z3QR3NpqnfolxFifn6mxJej1rrOev9nrC3UZ%2FT%2FFq%2BRxeYmUkukYD%2BxKa3nVBOwB5VUmfun4M%3D&origional-url=index.html&sap-ui-appCacheBuster=..%2F&sap-ui-xx-componentPreload=off";;

			this.buttonRoleMatrix = {
				"ZSD.CRE_LEAS": false,
				"ZSD.CRE_RSCH": false,
				"ZSD.CRE_RETA": false,
				"ZSD.CRE_BOOK": false,
				"ZSD.COP_LEAS": false,
				"ZSD.EDI_LEAS": false, // Not a button
				"ZSD.EDI_RSCH": false, // Not a button
				"ZSD.EDI_RETA": false, // Not a button
				"ZSD.EDI_BOOK": false // Not a button
			};

			this.buttonAvailabilityMatrix = {
				"LEASE": ["CRE_RSCH", "CRE_LEAS", "CRE_BOOK", "CRE_RETA", "COP_LEAS"],
				"RETURN": ["CRE_RETA"],
				"BOOKING": ["CRE_BOOK"],
				"ALL": ["CRE_RSCH", "CRE_LEAS", "CRE_BOOK", "CRE_RETA", "COP_LEAS"]
			};

			this.busyDialog = new BusyDialog();

			this.columnVisibilityMatrix = {
				"LEASE": ["Retsch", "Lease", "Extref", "Customer", "Customername", "AccManager", "AccManagername", "Salesorg", "Statustext"],
				"BOOKING": ["Retsch", "Lease", "Bookingorreturn", "Extref", "Customer", "Customername", "ValidFrom",
					"ValidTo", "Salesorg", "Statustext"
				],
				"RETURN": ["Retsch", "Lease", "Bookingorreturn", "Extref", "Customer", "Customername", "ValidFrom",
					"ValidTo", "Salesorg", "Statustext"
				],
				"ALL": ["Retsch", "Lease", "Bookingorreturn", "Extref", "Customer", "Customername", "AccManager", "AccManagername", "ValidFrom",
					"ValidTo", "Salesorg", "Statustext"
				]
			};

			this.excelColumns = [{
				label: 'Return Schedule',
				property: 'Retsch',
				type: 'string'
			}, {
				label: 'Lease',
				property: 'Lease',
				type: 'string'
			}, {
				label: 'Booking or Return',
				property: 'Bookingorreturn',
				type: 'string'
			}, {
				label: 'Ext. Reference',
				property: 'Extref',
				type: 'string'
			}, {
				label: 'Customer',
				property: 'Customer',
				type: 'string'
			}, {
				label: 'Customer Name',
				property: 'Customername',
				type: 'string'
			}, {
				label: 'Acc. Manager',
				property: 'AccManager',
				type: 'string'
			}, {
				label: 'Acc. Manager Name',
				property: 'AccManagername',
				type: 'string'
			}, {
				label: 'Valid From',
				property: 'ValidFrom',
				type: 'string'
			}, {
				label: 'Valid To',
				property: 'ValidTo',
				type: 'string'
			}, {
				label: 'Sales Org.',
				property: 'Salesorg',
				type: 'string'
			}, {
				label: 'Status',
				property: 'Statustext',
				type: 'string'
			}];

			var oModelList = new JSONModel({
				listData: []
			});
			this.setModel(oModelList, "worklistView");
			// this.getView().getModel("worklistView").setBindingMode("OneWay");

			this.TransTypes = [];

			// this.TransTypes.push({ // Customer Service - TILE3
			// 	key: "",
			// 	text: ""
			// });

			// this.TransTypes.push({ // Customer Service - TILE3
			// 	key: "RETSCH",
			// 	text: "Return Schedule"
			// });

			this.TransTypes.push({ // Customer Service - TILE3
				key: "LEASE",
				text: "Lease & Ret. Schedule"
			});

			this.TransTypes.push({ // Customer Service - TILE3
				key: "BOOKING",
				text: "Booking"
			});

			this.TransTypes.push({ // Customer Service - TILE3
				key: "RETURN",
				text: "Return Auth."
			});

			var oTransTypeModel = new JSONModel({});
			oTransTypeModel.setSizeLimit(1000);
			this.getView().setModel(oTransTypeModel, "oTransTypeModel");

			this.getView().getModel("oTransTypeModel").setProperty("/type", this.TransTypes);

			// Initialization

			this.getView().getModel("worklistView").setProperty("/TransType", "LEASE");
			this.getView().getModel("worklistView").setProperty("/masterTableVisible", true);

			this.busyDialog.open();
			this.getOwnerComponent().getModel().read("/f4TxnSet", {
				// filters: laFilters,
				success: function (oData) {
					this.f4CustomerData = [];
					this.f4AccManagerData = [];
					this.f4LeaseStatus = [];
					this.f4ReleaseStatus = [];
					this.f4ReturnStatus = [];
					this.f4UnitTypeData = [];
					this.f4ProdCateData = [];
					this.f4LocationData = [];

					for (var i = 0; i < oData.results.length; i++) {

						if (oData.results[i].Types === "CUST") {
							this.f4CustomerData.push({
								key: oData.results[i].Key,
								text: oData.results[i].Text
							});
						} else if (oData.results[i].Types === "ACCM") {
							this.f4AccManagerData.push({
								key: oData.results[i].Key,
								text: oData.results[i].Text
							});
						} else if (oData.results[i].Types === "STATUS" && (oData.results[i].Otherfieldtext.substr(0, 2) === "ZM")) {
							this.f4LeaseStatus.push({
								key: oData.results[i].Key,
								text: oData.results[i].Text,
								additionalText: oData.results[i].Otherfield
							});
						} else if (oData.results[i].Types === "STATUS" && (oData.results[i].Otherfieldtext === "ZRX_HS")) {
							this.f4ReleaseStatus.push({
								key: oData.results[i].Key,
								text: oData.results[i].Text,
								additionalText: oData.results[i].Otherfield
							});
						} else if (oData.results[i].Types === "STATUS" && (oData.results[i].Otherfieldtext === "ZRA_HS")) {
							this.f4ReturnStatus.push({
								key: oData.results[i].Key,
								text: oData.results[i].Text,
								additionalText: oData.results[i].Otherfield
							});
						} else if (oData.results[i].Types === "MATNR") {
							this.f4UnitTypeData.push({
								key: oData.results[i].Key,
								text: oData.results[i].Text
							});
						} else if (oData.results[i].Types === "PRODH") {
							this.f4ProdCateData.push({
								key: oData.results[i].Key,
								text: oData.results[i].Text
							});
						} else if (oData.results[i].Types === "LOCAT") {
							this.f4LocationData.push({
								key: oData.results[i].Key,
								text: oData.results[i].Text
							});
						}
					}

					/* Model : Customer */
					var oCustomerModel = new JSONModel({});
					oCustomerModel.setSizeLimit(100000);
					this.getView().setModel(oCustomerModel, "oCustomerModel");

					this.getView().getModel("oCustomerModel").setProperty("/", this.f4CustomerData);

					/* Model : Account Manager */

					var oAccManagerModel = new JSONModel({});
					oAccManagerModel.setSizeLimit(10000);
					this.getView().setModel(oAccManagerModel, "oAccManagerModel");

					this.getView().getModel("oAccManagerModel").setProperty("/", this.f4AccManagerData);

					/* Model : Status */

					var oHeaderStatusModel = new JSONModel({});
					oHeaderStatusModel.setSizeLimit(1000);
					this.getView().setModel(oHeaderStatusModel, "oHeaderStatusModel");

					this.getView().getModel("oHeaderStatusModel").setProperty("/", this.f4LeaseStatus); // By default Lease Status

					/* Model : Location Code */

					var oLocationModel = new JSONModel({});
					oLocationModel.setSizeLimit(1000);
					this.getView().setModel(oLocationModel, "oLocationModel");

					this.getView().getModel("oLocationModel").setProperty("/", this.f4LocationData);

					/* Model : Unit Type */

					var oUnitTypeModel = new JSONModel({});
					oUnitTypeModel.setSizeLimit(1000);
					this.getView().setModel(oUnitTypeModel, "oUnitTypeModel");

					this.getView().getModel("oUnitTypeModel").setProperty("/", this.f4UnitTypeData);

					/* Model : Prod Cate */

					var oProdCateModel = new JSONModel({});
					oProdCateModel.setSizeLimit(1000);
					this.getView().setModel(oProdCateModel, "oProdCateModel");

					this.getView().getModel("oProdCateModel").setProperty("/", this.f4ProdCateData);

					this.busyDialog.close();

				}.bind(this),
				error: function (oData) {
					this.busyDialog.close();
				}.bind(this)
			});

			this.getTransactions();

		},

		onPressCloseserialnos: function (oEvent) {
			this._oPopover.close();
		},

		handlePopoverSerialNo: function (oEvent) {
			var oButton = oEvent.getSource();
			// create popover
			if (!this._oPopover) {
				Fragment.load({
					name: "com.seaco.sd_fiori.view.fragments.SerialNo",
					controller: this
				}).then(function (pPopover) {
					pPopover.setTitle("Serial No.(s)");
					this._oPopover = pPopover;
					this.getView().addDependent(this._oPopover);
					// this._oPopover.bindElement("/items/" + sPath);
					this._oPopover.openBy(oButton);
				}.bind(this));
			} else {
				this._oPopover.setTitle("Serial No.(s)");
				// this._oPopover.bindElement("/items/" + sPath);
				this._oPopover.openBy(oButton);
			}
		},

		resetTransType: function (oEvent) {

			var Transtype = this.getView().getModel("worklistView").getProperty("/TransType");
			if (Transtype === "LEASE") {
				this.getView().getModel("oHeaderStatusModel").setProperty("/", this.f4LeaseStatus);
				this.getView().byId("idLeaseFilter").setVisible(true);
				this.getView().byId("idRetschFilter").setVisible(true);
				this.getView().byId("idBookingorreturnFilter").setVisible(false);
			} else if (Transtype === "BOOKING") {
				this.getView().getModel("oHeaderStatusModel").setProperty("/", this.f4ReleaseStatus);
				this.getView().byId("idLeaseFilter").setVisible(false);
				this.getView().byId("idRetschFilter").setVisible(false);
				this.getView().byId("idBookingorreturnFilter").setVisible(true);
				this.getView().byId("idBookingorreturnFilter").setLabel("Booking");
				this.getView().byId("idExtRaFilter").setLabel("Ext. Reference");
			} else if (Transtype === "RETURN") {
				this.getView().getModel("oHeaderStatusModel").setProperty("/", this.f4ReturnStatus);
				this.getView().byId("idLeaseFilter").setVisible(false);
				this.getView().byId("idRetschFilter").setVisible(false);
				this.getView().byId("idBookingorreturnFilter").setVisible(true);
				this.getView().byId("idExtRaFilter").setLabel("Ext. RA");
			}

		},

		getTransactions: function () {

			this.activeTransType = this.getView().getModel("worklistView").getProperty("/TransType");

			var laFilters = [];
			var filter = null;

			var Transtype = this.getView().getModel("worklistView").getProperty("/TransType");
			Transtype = convert_undefined_space(Transtype);
			filter = new sap.ui.model.Filter("Transtype", sap.ui.model.FilterOperator.EQ, Transtype);
			laFilters.push(filter);

			var Lease = this.getView().getModel("worklistView").getProperty("/Lease");
			Lease = convert_undefined_space(Lease);
			filter = new sap.ui.model.Filter("Lease", sap.ui.model.FilterOperator.EQ, Lease);
			laFilters.push(filter);

			var Retsch = this.getView().getModel("worklistView").getProperty("/Retsch");
			Retsch = convert_undefined_space(Retsch);
			filter = new sap.ui.model.Filter("Retsch", sap.ui.model.FilterOperator.EQ, Retsch);
			laFilters.push(filter);

			var Bookingorreturn = this.getView().getModel("worklistView").getProperty("/Bookingorreturn");
			Bookingorreturn = convert_undefined_space(Bookingorreturn);
			filter = new sap.ui.model.Filter("Bookingorreturn", sap.ui.model.FilterOperator.EQ, Bookingorreturn);
			laFilters.push(filter);

			var Customer = this.getView().getModel("worklistView").getProperty("/Customer");
			Customer = convert_undefined_space(Customer);
			filter = new sap.ui.model.Filter("Customer", sap.ui.model.FilterOperator.EQ, Customer);
			laFilters.push(filter);

			var Customername = this.getView().getModel("worklistView").getProperty("/Customername");
			Customername = convert_undefined_space(Customername);
			filter = new sap.ui.model.Filter("Customername", sap.ui.model.FilterOperator.EQ, Customername);
			laFilters.push(filter);

			var AccManagername = this.getView().getModel("worklistView").getProperty("/AccManagername");
			AccManagername = convert_undefined_space(AccManagername);
			filter = new sap.ui.model.Filter("AccManagername", sap.ui.model.FilterOperator.EQ, AccManagername);
			laFilters.push(filter);

			var AccManager = this.getView().getModel("worklistView").getProperty("/AccManager");
			AccManager = convert_undefined_space(AccManager);
			filter = new sap.ui.model.Filter("AccManager", sap.ui.model.FilterOperator.EQ, AccManager);
			laFilters.push(filter);

			var CreationPeriodFrom = this.getView().getModel("worklistView").getProperty("/CreationPeriodFrom");
			CreationPeriodFrom = prepare_edmdatetime_format(CreationPeriodFrom);
			filter = new sap.ui.model.Filter("CreationPeriodFrom", sap.ui.model.FilterOperator.EQ, CreationPeriodFrom);
			laFilters.push(filter);

			var CreationPeriodTo = this.getView().getModel("worklistView").getProperty("/CreationPeriodTo");
			CreationPeriodTo = prepare_edmdatetime_format(CreationPeriodTo);
			filter = new sap.ui.model.Filter("CreationPeriodTo", sap.ui.model.FilterOperator.EQ, CreationPeriodTo);
			laFilters.push(filter);

			var ChangePeriodFrom = this.getView().getModel("worklistView").getProperty("/ChangePeriodFrom");
			ChangePeriodFrom = prepare_edmdatetime_format(ChangePeriodFrom);
			filter = new sap.ui.model.Filter("ChangePeriodFrom", sap.ui.model.FilterOperator.EQ, ChangePeriodFrom);
			laFilters.push(filter);

			var ChangePeriodTo = this.getView().getModel("worklistView").getProperty("/ChangePeriodTo");
			ChangePeriodTo = prepare_edmdatetime_format(ChangePeriodTo);
			filter = new sap.ui.model.Filter("ChangePeriodTo", sap.ui.model.FilterOperator.EQ, ChangePeriodTo);
			laFilters.push(filter);

			var HeaderStatus = this.getView().getModel("worklistView").getProperty("/HeaderStatus");
			HeaderStatus = convert_undefined_space(HeaderStatus);
			filter = new sap.ui.model.Filter("HeaderStatus", sap.ui.model.FilterOperator.EQ, HeaderStatus);
			laFilters.push(filter);

			var ExtRa = this.getView().getModel("worklistView").getProperty("/ExtRa");
			ExtRa = convert_undefined_space(ExtRa);
			filter = new sap.ui.model.Filter("ExtRa", sap.ui.model.FilterOperator.EQ, ExtRa);
			laFilters.push(filter);

			var LocCode = this.getView().getModel("worklistView").getProperty("/LocCode");
			LocCode = convert_undefined_space(LocCode);
			filter = new sap.ui.model.Filter("LocCode", sap.ui.model.FilterOperator.EQ, LocCode);
			laFilters.push(filter);

			var UnitType = this.getView().getModel("worklistView").getProperty("/UnitType");
			UnitType = convert_undefined_space(UnitType);
			filter = new sap.ui.model.Filter("UnitType", sap.ui.model.FilterOperator.EQ, UnitType);
			laFilters.push(filter);

			var ProdCate = this.getView().getModel("worklistView").getProperty("/ProdCate");
			ProdCate = convert_undefined_space(ProdCate);
			filter = new sap.ui.model.Filter("ProdCate", sap.ui.model.FilterOperator.EQ, ProdCate);
			laFilters.push(filter);

			var SerialNos = this.getView().getModel("worklistView").getProperty("/SerialNos");
			SerialNos = convert_undefined_space(SerialNos);
			filter = new sap.ui.model.Filter("SerialNos", sap.ui.model.FilterOperator.EQ, SerialNos);
			laFilters.push(filter);

			/* Clear selection, filters and sorting */
			var oTable = this.getView().byId("idMasterTable").clearSelection();

			var iColCounter = 0;
			oTable.clearSelection();
			var iTotalCols = oTable.getColumns().length;
			var oListBinding = oTable.getBinding();
			if (oListBinding) {
				oListBinding.aSorters = null;
				oListBinding.aFilters = null;
			}
			this.getView().getModel("worklistView").refresh(true);
			for (iColCounter = 0; iColCounter < iTotalCols; iColCounter++) {
				oTable.getColumns()[iColCounter].setSorted(false);
				oTable.getColumns()[iColCounter].setFilterValue("");
				oTable.getColumns()[iColCounter].setFiltered(false);
			}

			this.busyDialog.open();
			this.getOwnerComponent().getModel().read("/getTransactionsSet", {
				filters: laFilters,
				success: function (oData) {
					this.listData = [];

					for (var i = 0; i < oData.results.length; i++) {
						this.listData.push(oData.results[i]);
						this.listData[i].ContStrDate = sap.ui.core.format.DateFormat.getDateTimeInstance({
							pattern: "dd-MM-yyyy"
						}).format(new Date(oData.results[i].ContStrDate));

						this.listData[i].TermStrDate = sap.ui.core.format.DateFormat.getDateTimeInstance({
							pattern: "dd-MM-yyyy"
						}).format(new Date(oData.results[i].TermStrDate));

						this.listData[i].ContExpDate = sap.ui.core.format.DateFormat.getDateTimeInstance({
							pattern: "dd-MM-yyyy"
						}).format(new Date(oData.results[i].ContExpDate));

						this.listData[i].TermTrmDate = sap.ui.core.format.DateFormat.getDateTimeInstance({
							pattern: "dd-MM-yyyy"
						}).format(new Date(oData.results[i].TermTrmDate));

						this.listData[i].ValidFrom = sap.ui.core.format.DateFormat.getDateTimeInstance({
							pattern: "dd-MM-yyyy"
						}).format(new Date(oData.results[i].ValidFrom));

						this.listData[i].ValidTo = sap.ui.core.format.DateFormat.getDateTimeInstance({
							pattern: "dd-MM-yyyy"
						}).format(new Date(oData.results[i].ValidTo));
					}

					this.getView().getModel("worklistView").setProperty("/listData", this.listData);
					this.getView().getModel("worklistView").setProperty("/masterTableVisible", true);

					// update the worklist's object counter after the table update
					var sTitle,
						iTotalItems = this.listData.length;
					// only update the counter if the length is final and
					// the table is not empty

					var TransTypeText = "";
					Transtype = this.getView().getModel("worklistView").getProperty("/TransType");
					switch (Transtype) {
					case "BOOKING":
						TransTypeText = "Booking";
						break;
					case "RETURN":
						TransTypeText = "Return Auth.";
						break;
					case "LEASE":
						TransTypeText = "Lease";
						break;
					case "RETSCH":
						TransTypeText = "Return Schedule";
						break;
					default:
						// code block
					}

					sTitle = TransTypeText + " : " + iTotalItems;

					if (iTotalItems > 20) {
						this.getModel("worklistView").setProperty("/worklistTableVisibleRowCount", 20);
					} else {
						this.getModel("worklistView").setProperty("/worklistTableVisibleRowCount", iTotalItems);
					}
					this.getModel("worklistView").setProperty("/worklistTableTitle", sTitle);

					this.adjustColumns();
					this.setButtons();
					this.busyDialog.close();

				}.bind(this),
				error: function (oData) {
					this.busyDialog.close();
				}.bind(this)
			});

		},

		setButtons: function () {
			this.rolesFromBackend = [];

			this.rolesFromBackend = {
				"ZSD.CRE_LEAS": true,
				"ZSD.CRE_RSCH": true,
				"ZSD.CRE_RETA": true,
				"ZSD.CRE_BOOK": true,
				"ZSD.COP_LEAS": true,
				"ZSD.LSRBUTTON": true
			};

			for (var roleName in this.rolesFromBackend) {
				if (this.rolesFromBackend[roleName] === true) {
					this.buttonRoleMatrix[roleName] = true;
				} else if (this.rolesFromBackend[roleName] === false) {
					this.buttonRoleMatrix[roleName] = false;
				}
			}

			var Transtype = this.getView().getModel("worklistView").getProperty("/TransType");
			var buttonsAvailable = this.buttonAvailabilityMatrix[Transtype];
			var buttonsALL = this.buttonAvailabilityMatrix["ALL"];

			var buttonWithId = "";
			var buttonWithRole = "";

			for (var i = 0; i < buttonsALL.length; i++) {
				buttonWithId = "idButton" + buttonsALL[i];
				buttonWithRole = "ZSD." + buttonsALL[i];
				this.getView().byId(buttonWithId).setVisible(false); // Initially set all buttons visibility to false
			}

			for (var i = 0; i < buttonsAvailable.length; i++) {
				buttonWithId = "idButton" + buttonsAvailable[i];
				buttonWithRole = "ZSD." + buttonsAvailable[i];
				this.getView().byId(buttonWithId).setVisible(this.buttonRoleMatrix[buttonWithRole]);
			}

			// visible: oJSONSDASHMAuthorizationRoles["ZSD.CRE_LEAS"]

		},

		adjustColumns: function () {

			var Transtype = this.getView().getModel("worklistView").getProperty("/TransType");
			var columns = this.columnVisibilityMatrix["ALL"];
			var isColVisible = false;
			var colId = "";

			for (var i = 0; i < columns.length; i++) {
				isColVisible = formatter.ColumnVisibilityFromController(this.columnVisibilityMatrix, Transtype, columns[i]);
				colId = "container-sd_fiori---worklist--idCol" + columns[i];
				this.getView().byId(colId).setVisible(isColVisible);
				if (colId === "container-sd_fiori---worklist--idColExtref") {
					var colText = formatter.ExtrefColumnTextFromController(Transtype);
					this.getView().byId(colId + "Text").setText(colText);
				}
				if (colId === "container-sd_fiori---worklist--idColBookingorreturn") {
					var colText = formatter.BookingRAColumnTextFromController(Transtype);
					this.getView().byId(colId + "Text").setText(colText);
				}
			}

		},

		onUpdateFinished: function (oEvent) {
			// update the worklist's object counter after the table update
			var sTitle,
				oTable = oEvent.getSource(),
				iTotalItems = oEvent.getParameter("total");
			// only update the counter if the length is final and
			// the table is not empty

			var TransTypeText = "";
			var Transtype = this.getView().getModel("worklistView").getProperty("/TransType");
			switch (Transtype) {
			case "BOOKING":
				TransTypeText = "Booking";
				break;
			case "RETURN":
				TransTypeText = "Return Auth.";
				break;
			case "LEASE":
				TransTypeText = "Lease";
				break;
			case "RETSCH":
				TransTypeText = "Return Schedule";
				break;
			default:
				// code block
			}

			if (iTotalItems && oTable.getBinding("items").isLengthFinal()) {
				sTitle = TransTypeText + " : " + iTotalItems;
			} else {
				sTitle = TransTypeText;
			}

			this.getModel("worklistView").setProperty("/worklistTableTitle", sTitle);
		},

		/**
		 * Event handler when a table item gets pressed
		 * @param {sap.ui.base.Event} oEvent the table selectionChange event
		 * @public
		 */
		onPressEDI_BOOKRA: function (oEvent) {

			var oItem = oEvent.getSource();
			var order = oItem.getText();
			var transType = this.getModel("worklistView").getProperty("/TransType");

			// if(transType === )
			var newUrl = this.bookUrl + "&ReqType=" + "EXI" + "&Bookings=" + order;

			openInNewTab(newUrl);

		},

		onPressCRE_BOOK: function (oEvent) {

			var oTable = this.getView().byId("idMasterTable");
			var selectedLease = "";

			var arraySelLines = oTable.getSelectedIndices();

			for (var i = 0; i < this.listData.length; i++) {
				var oDetData = oTable.getContextByIndex(i);
				if (oDetData != undefined) {
					var realPath = oDetData.getPath().split('/')[2];
					if (arraySelLines.indexOf(i) != -1 && this.listData[realPath].Lease) {
						selectedLease = this.listData[realPath].Lease;
						return;
					}
				}
			}

			var transType = this.getModel("worklistView").getProperty("/TransType");
			var newUrl = this.bookUrl + "&ReqType=" + "NEW" + "&Lease=" + selectedLease + "&Bookings=" + "";

			openInNewTab(newUrl);

		},

		onClearFB: function (oEvent) {
			this.getView().getModel("worklistView").setProperty("/TransType", "LEASE");
			this.getView().getModel("worklistView").setProperty("/Lease", "");
			this.getView().getModel("worklistView").setProperty("/Retsch", "");
			this.getView().getModel("worklistView").setProperty("/Bookingorreturn", "");
			this.getView().getModel("worklistView").setProperty("/Customer", "");
			this.getView().getModel("worklistView").setProperty("/Customername", "");
			this.getView().getModel("worklistView").setProperty("/AccManagername", "");
			this.getView().getModel("worklistView").setProperty("/AccManager", "");
			this.getView().getModel("worklistView").setProperty("/CreationPeriodFrom", "");
			this.getView().getModel("worklistView").setProperty("/CreationPeriodTo", "");
			this.getView().getModel("worklistView").setProperty("/ChangePeriodFrom", "");
			this.getView().getModel("worklistView").setProperty("/ChangePeriodTo", "");
			this.getView().getModel("worklistView").setProperty("/HeaderStatus", "");
			this.getView().getModel("worklistView").setProperty("/ExtRA", "");
			this.getView().getModel("worklistView").setProperty("/LocCode", "");
			this.getView().getModel("worklistView").setProperty("/UnitType", "");
			this.getView().getModel("worklistView").setProperty("/ProdCate", "");
			this.getView().getModel("worklistView").setProperty("/SerialNos", "");

		},

		onPressExcelDownload: function (oEvent) {
			var excelTitle = "";

			switch (this.activeTransType) {
			case "LEASE":
				excelTitle = "Lease & Ret. Sch Data";
				break;
			case "BOOKING":
				excelTitle = "Booking Data";
				break;
			case "RETURN":
				excelTitle = "Return Auth. Data";
				break;
			default:
				excelTitle = "Lease & Ret. Sch Data";
				break;
			}
			var oTable = this.getView().byId("idMasterTable");
			var visibleColumns = [];
			var colName = "";
			var thisColumn = [];
			var tableColumns = oTable.getColumns();
			for (var i = 0; i < tableColumns.length; i++) {
				if (tableColumns[i].getProperty("visible")) {
					colName = tableColumns[i].getProperty("name");
					thisColumn.push(this.excelColumns.filter(function (obj) {
						return (obj.property === colName);
					})[0]);

					if (colName === "Bookingorreturn") { // If column property is Bookingorreturn
						if (this.activeTransType === "BOOKING") {
							thisColumn[thisColumn.length - 1].label = "Booking";
						} else if (this.activeTransType === "RETURN") {
							thisColumn[thisColumn.length - 1].label = "Return";
						}
					}

				}
			}

			var aColProperties, aColumns, oSettings, oSheet;

			aColProperties = thisColumn;
			aColumns = this.listData;

			oSettings = {
				workbook: {
					columns: aColProperties
				},
				dataSource: aColumns,
				context: {},
				fileName: excelTitle
			};

			oSheet = new Spreadsheet(oSettings);

			oSheet.build()
				.then(function () {
					// MessageToast.show('Excel downloaded successfully');
				})
				.finally(function () {
					oSheet.destroy();
				});

		},

		/**
		 * Event handler for refresh event. Keeps filter, sort
		 * and group settings and refreshes the list binding.
		 * @public
		 */
		onRefresh: function () {
			var oTable = this.byId("table");
			oTable.getBinding("items").refresh();
		}

	});
});