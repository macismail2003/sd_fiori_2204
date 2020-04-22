sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"../model/formatter"
], function (BaseController, JSONModel, formatter) {
	"use strict";

	return BaseController.extend("com.seaco.sd_fiori.controller.Object", {

		formatter: formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the worklist controller is instantiated.
		 * @public
		 */
		onInit: function () {
			// Model used to manipulate control states. The chosen values make sure,
			// detail page is busy indication immediately so there is no break in
			// between the busy indication for loading the view's meta data
			var iOriginalBusyDelay,
				oViewModel = new JSONModel({
					busy: true,
					delay: 0
				});

			this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);

			// Store original busy indicator delay, so it can be restored later on
			iOriginalBusyDelay = this.getView().getBusyIndicatorDelay();
			this.setModel(oViewModel, "objectView");
			this.getOwnerComponent().getModel().metadataLoaded().then(function () {
				// Restore original busy indicator delay for the object view
				oViewModel.setProperty("/delay", iOriginalBusyDelay);
			});
		},

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		/**
		 * Event handler when the share in JAM button has been clicked
		 * @public
		 */
		onShareInJamPress: function () {
			var oViewModel = this.getModel("objectView"),
				oShareDialog = sap.ui.getCore().createComponent({
					name: "sap.collaboration.components.fiori.sharing.dialog",
					settings: {
						object: {
							id: location.href,
							share: oViewModel.getProperty("/shareOnJamTitle")
						}
					}
				});
			oShareDialog.open();
		},

		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

		/**
		 * Binds the view to the object path.
		 * @function
		 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
		 * @private
		 */
		_onObjectMatched: function (oEvent) {
			var sObjectId = oEvent.getParameter("arguments").objectId;
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
		},

		_showFormFragment: function (sFragmentName) {
			var oPage = this.getView().byId("idPage");
			oPage.removeAllContent();
			oPage.insertContent(this._getFormFragment(sFragmentName));
		},

		_getFormFragment: function (sFragmentName) {
			var oFormFragment = this._formFragments[sFragmentName];

			if (oFormFragment) {
				return oFormFragment;
			}

			oFormFragment = sap.ui.xmlfragment("idfragment", "com.seaco.sd_fiori.view.fragments.DisplayDeal", this);
			this.getView().addDependent(oFormFragment);

			return this._formFragments[sFragmentName] = oFormFragment;
		},

		_formFragments: {},

		onNavBack: function () {
			this.getRouter().navTo("worklist");
		},

		onPressEdit: function () {
			this._showFormFragment1("ChangeDeal");
		},

		_showFormFragment1: function (sFragmentName) {
			var oPage = this.getView().byId("idPage");
			oPage.removeAllContent();
			oPage.insertContent(this._getFormFragment1(sFragmentName));
		},

		_getFormFragment1: function (sFragmentName) {
			var oFormFragment = this._formFragments[sFragmentName];

			if (oFormFragment) {
				return oFormFragment;
			}

			oFormFragment = sap.ui.xmlfragment("idfragment1", "com.seaco.sd_fiori.view.fragments.ChangeDeal", this);
			this.getView().addDependent(oFormFragment);

			return this._formFragments[sFragmentName] = oFormFragment;
		},

		/**
		 * Binds the view to the object path.
		 * @function
		 * @param {string} sObjectPath path to the object to be bound
		 * @private
		 */
		_bindView: function (sObjectPath) {
			var oViewModel = this.getModel("objectView"),
				oDataModel = this.getModel();

			this.getView().bindElement({
				path: sObjectPath,
				events: {
					change: this._onBindingChange.bind(this),
					dataRequested: function () {
						oDataModel.metadataLoaded().then(function () {
							// Busy indicator on view should only be set if metadata is loaded,
							// otherwise there may be two busy indications next to each other on the
							// screen. This happens because route matched handler already calls '_bindView'
							// while metadata is loaded.
							oViewModel.setProperty("/busy", true);
						});
					},
					dataReceived: function () {
						oViewModel.setProperty("/busy", false);
					}
				}
			});
		},

		onCopyItems: function () {
			var aTable = sap.ui.core.Fragment.byId("idfragment1", "idDealItemTable");
			var iSelectedIndex = aTable.getSelectedIndex();
			var aTableItems = this.getView().getModel("objectView").getProperty("/Change");
			if (iSelectedIndex !== -1) {
				var oSelectedContext = aTable.getContextByIndex(iSelectedIndex);
				var oNewTableItems = {
					Customer: oSelectedContext.getProperty().Customer,
					
					Lease: oSelectedContext.getProperty().Lease,
					LeaseType: oSelectedContext.getProperty().LeaseType,
					CreatedBy: oSelectedContext.getProperty().CreatedBy,
					EmployeeResponsible: oSelectedContext.getProperty().EmployeeResponsible,
					CustomerName: oSelectedContext.getProperty().CustomerName,
				
				};
				aTableItems.splice(iSelectedIndex + 1, 0, oNewTableItems);
			}
			this.getView().getModel("objectView").refresh();
		},

		_onBindingChange: function () {
			var oView = this.getView(),
				oViewModel = this.getModel("objectView"),
				oElementBinding = oView.getElementBinding();

			// No data for the binding
			if (!oElementBinding.getBoundContext()) {
				this.getRouter().getTargets().display("objectNotFound");
				return;
			}

			var oResourceBundle = this.getResourceBundle(),
				oObject = oView.getBindingContext().getObject(),
				sObjectId = oObject.Customer,
				sObjectName = oObject.Customer;

			oViewModel.setProperty("/busy", false);
			// Add the object page to the flp routing history
			this.addHistoryEntry({
				title: this.getResourceBundle().getText("objectTitle") + " - " + sObjectName,
				icon: "sap-icon://enter-more",
				intent: "#Booking-display&/Bookings/" + sObjectId
			});

			oViewModel.setProperty("/saveAsTileTitle", oResourceBundle.getText("saveAsTileTitle", [sObjectName]));
			oViewModel.setProperty("/shareOnJamTitle", sObjectName);
			oViewModel.setProperty("/shareSendEmailSubject",
				oResourceBundle.getText("shareSendEmailObjectSubject", [sObjectId]));
			oViewModel.setProperty("/shareSendEmailMessage",
				oResourceBundle.getText("shareSendEmailObjectMessage", [sObjectName, sObjectId, location.href]));
		}

	});

});