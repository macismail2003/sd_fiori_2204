sap.ui.define([], function () {
	"use strict";

	return {

		/**
		 * Rounds the number unit value to 2 digits
		 * @public
		 * @param {string} sValue the number string to be rounded
		 * @returns {string} sValue with 2 digits rounded
		 */
		numberUnit: function (sValue) {
			if (!sValue) {
				return "";
			}
			return parseFloat(sValue).toFixed(2);
		},

		cpagVisible: function (sValue) {
			if (!sValue) {
				return false;
			}
			return true;
		},

		concatenateCustomerAndName: function (customer, customerName) {
			var result = customer + " - " + customerName;
			return result;
		},

		validationPassedDSS: function (validationPassed, editMode, leaseType) {

			// if (this.getView().getModel("bookinginitial").getProperty("/validationPassed")) {
			// 	return true;
			// } else {
			// 	return false;
			// }

			var newBookingSelected = this.getView().getModel("bookinginitial").getProperty("/NewBookingSelected");
			var displayMode = this.getView().getModel("bookinginitial").getProperty("/displayMode");
			// var editMode = this.getView().getModel("bookinginitial").getProperty("/editMode");

			if (displayMode && (leaseType === "ZMP")) {
				return true; // If display mode, no harm in showing DSS
			}
			// leaseType = "ZMP";
			if (newBookingSelected && validationPassed && (leaseType === "ZMP")) { // New Booking Selected but Unit Type is Editable
				return validationPassed;
			}

			if (newBookingSelected && !validationPassed) { // New Booking Selected but Unit Type is not Editable
				return validationPassed;
			}

			// If it is edit mode, check if unit type is editable...
			if (editMode && validationPassed && (leaseType === "ZMP")) { // Existing Booking Selected but Unit Type is Editable
				return validationPassed;
			}

			if (editMode && !validationPassed) { // Existing Booking Selected but Unit Type is not Editable
				return validationPassed;
			}

			return false;

		},

		validationPassedCPAGVCON: function (validationPassed, editMode) {
			// if (this.getView().getModel("bookinginitial").getProperty("/validationPassed")) {
			// 	return true;
			// } else {
			// 	return false;
			// }

			var newBookingSelected = this.getView().getModel("bookinginitial").getProperty("/NewBookingSelected");
			var displayMode = this.getView().getModel("bookinginitial").getProperty("/displayMode");
			// var editMode = this.getView().getModel("bookinginitial").getProperty("/editMode");

			if (displayMode) {
				return true; // If display mode, unit type editable is false
			}

			if (newBookingSelected && validationPassed) { // New Booking Selected but Unit Type is Editable
				return validationPassed;
			}

			if (newBookingSelected && !validationPassed) { // New Booking Selected but Unit Type is not Editable
				return validationPassed;
			}

			// If it is edit mode, check if unit type is editable...
			if (editMode && validationPassed) { // Existing Booking Selected but Unit Type is Editable
				return validationPassed;
			}

			if (editMode && !validationPassed) { // Existing Booking Selected but Unit Type is not Editable
				return validationPassed;
			}

			if (validationPassed) {
				return validationPassed;
			}

		},

		validationPassed: function (validationPassed, editMode) {
			// if (this.getView().getModel("bookinginitial").getProperty("/validationPassed")) {
			// 	return true;
			// } else {
			// 	return false;
			// }

			var newBookingSelected = this.getView().getModel("bookinginitial").getProperty("/NewBookingSelected");
			var displayMode = this.getView().getModel("bookinginitial").getProperty("/displayMode");
			// var editMode = this.getView().getModel("bookinginitial").getProperty("/editMode");

			if (displayMode) {
				return false; // If display mode, unit type editable is false
			}

			if (newBookingSelected && validationPassed) { // New Booking Selected but Unit Type is Editable
				return validationPassed;
			}

			if (newBookingSelected && !validationPassed) { // New Booking Selected but Unit Type is not Editable
				return validationPassed;
			}

			// If it is edit mode, check if unit type is editable...
			if (editMode && validationPassed) { // Existing Booking Selected but Unit Type is Editable
				return validationPassed;
			}

			if (editMode && !validationPassed) { // Existing Booking Selected but Unit Type is not Editable
				return validationPassed;
			}

			if (validationPassed) {
				return validationPassed;
			}

		},

		validationFailed: function (validationFailed, editMode) {
			// if (this.getView().getModel("bookinginitial").getProperty("/validationFailed")) {
			// 	return true;
			// } else {
			// 	return false;
			// }

			var newBookingSelected = this.getView().getModel("bookinginitial").getProperty("/NewBookingSelected");
			var displayMode = this.getView().getModel("bookinginitial").getProperty("/displayMode");
			// var editMode = this.getView().getModel("bookinginitial").getProperty("/editMode");

			if (displayMode) {
				return false; // If display mode, unit type editable is false
			}

			if (newBookingSelected && validationFailed) { // New Booking Selected but Unit Type is Editable
				return validationFailed;
			}

			if (newBookingSelected && !validationFailed) { // New Booking Selected but Unit Type is not Editable
				return validationFailed;
			}

			// If it is edit mode, check if unit type is editable...
			if (editMode && validationFailed) { // Existing Booking Selected but Unit Type is Editable
				return validationFailed;
			}

			if (editMode && !validationFailed) { // Existing Booking Selected but Unit Type is not Editable
				return validationFailed;
			}

			if (validationFailed) {
				return validationFailed;
			}

		},

		// displayMode: function (sValue) {
		// 	debugger;
		// 	if (this.getView().getModel("bookinginitial").getProperty("/displayMode")) {
		// 		return true;
		// 	} else {
		// 		return false;
		// 	}
		// },

		// editMode: function (sValue) {
		// 	debugger;
		// 	if (this.getView().getModel("bookinginitial").getProperty("/editMode")) {
		// 		return true;
		// 	} else {
		// 		return false;
		// 	}
		// },

		modeCheck: function (sValue) {

			// sValue - editMode
			var editMode = sValue;
			var newBookingSelected = this.getView().getModel("bookinginitial").getProperty("/NewBookingSelected");

			if (newBookingSelected) { // New Booking Selected...
				// this.getView().getModel("bookinginitial").setProperty("/editMode", false);
				return true; // Edit Mode True - If new booking selected
			} else if (editMode) {
				// this.getView().getModel("bookinginitial").setProperty("/editMode", false);
				return true; // Edit Mode true
			} else {
				// this.getView().getModel("bookinginitial").setProperty("/editMode", true);
				return false; // Edit Mode False (Display Mode)
			}
		},

		modeCheckUnitTypeEditable: function (unitTypeEditable, editMode) {

			// // sValue - editMode
			// var editMode = sValue;
			// var newBookingSelected = this.getView().getModel("bookinginitial").getProperty("/NewBookingSelected");
			// var displayMode = this.getView().getModel("bookinginitial").getProperty("/displayMode");
			// var unitTypeEditable = this.getView().getModel("booking").getProperty("/unitTypeEditable");

			// if (newBookingSelected) { // New Booking Selected...
			// 	// this.getView().getModel("bookinginitial").setProperty("/editMode", false);
			// 	return true; // Edit Mode True - If new booking selected
			// }

			// if (!editMode) {
			// 	return false; // Unit Type Editable is False, if Display Mode
			// }

			// // If it is edit mode, check if unit type is editable...

			// if (unitTypeEditable) {
			// 	return true;
			// }

			// if (editMode) {
			// 	// this.getView().getModel("bookinginitial").setProperty("/editMode", false);
			// 	return true; // Edit Mode true
			// } else {
			// 	// this.getView().getModel("bookinginitial").setProperty("/editMode", true);
			// 	return false; // Edit Mode False (Display Mode)
			// }

			// sValue - editMode

			var newBookingSelected = this.getView().getModel("bookinginitial").getProperty("/NewBookingSelected");
			var displayMode = this.getView().getModel("bookinginitial").getProperty("/displayMode");
			// var editMode = this.getView().getModel("bookinginitial").getProperty("/editMode");

			if (displayMode) {
				return false; // If display mode, unit type editable is false
			}

			if (newBookingSelected && unitTypeEditable) { // New Booking Selected but Unit Type is Editable
				return unitTypeEditable;
			}

			if (newBookingSelected && !unitTypeEditable) { // New Booking Selected but Unit Type is not Editable
				return unitTypeEditable;
			}

			// If it is edit mode, check if unit type is editable...
			if (editMode && unitTypeEditable) { // Existing Booking Selected but Unit Type is Editable
				return unitTypeEditable;
			}

			if (editMode && !unitTypeEditable) { // Existing Booking Selected but Unit Type is not Editable
				return unitTypeEditable;
			}

			if (unitTypeEditable) {
				return unitTypeEditable;
			}

		},

		modeCheckUnitTypeNonEditable: function (unitTypeEditable, editMode, dummy) {

			// if dummy is passed, then it is for visible...

			// sValue - editMode

			var newBookingSelected = this.getView().getModel("bookinginitial").getProperty("/NewBookingSelected");
			var displayMode = this.getView().getModel("bookinginitial").getProperty("/displayMode");
			// var editMode = this.getView().getModel("bookinginitial").getProperty("/editMode");

			if (displayMode) {
				if (dummy !== undefined && this.byId("idRBOBS").getProperty("selected")) { // if for visible and by serial is selected...
					return true;
				}
				return false; // if for editable and by serial is selected...
			}

			if (newBookingSelected && unitTypeEditable) { // New Booking Selected but Unit Type is Editable
				return !unitTypeEditable;
			}

			if (newBookingSelected && !unitTypeEditable) { // New Booking Selected but Unit Type is not Editable
				return !unitTypeEditable;
			}

			// If it is edit mode, check if unit type is editable...
			if (editMode && unitTypeEditable) { // Existing Booking Selected but Unit Type is Editable
				return !unitTypeEditable;
			}

			if (editMode && !unitTypeEditable) { // Existing Booking Selected but Unit Type is not Editable
				return !unitTypeEditable;
			}

			if (unitTypeEditable) {
				return !unitTypeEditable;
			}

		},

		customerFormatter: function (customer, customername) {
			if (customer) {
				return customer + " - " + customername;
			} else {
				return "";
			}

		},

		ColumnVisibility1: function (transtype, incomingcolumn) {

			return false;

		},

		ColumnVisibility: function (transtype, incomingcolumn) {

			var columnsForTransType = this.columnVisibilityMatrix[transtype];
			if (!columnsForTransType) {
				return false;
			} else {
				for (var c = 0; c < columnsForTransType.length; c++) {
					if (incomingcolumn === columnsForTransType[c]) {
						return true;
					}
				}
			}
			return false;

		},

		ColumnVisibilityFromController: function (columnVisibilityMatrix, transtype, incomingcolumn) {

			var columnsForTransType = columnVisibilityMatrix[transtype];
			if (!columnsForTransType) {
				return false;
			} else {
				for (var c = 0; c < columnsForTransType.length; c++) {
					if (incomingcolumn === columnsForTransType[c]) {
						return true;
					}
				}
			}
			return false;

		},

		BookingRAColumnTextFromController: function (transtype) {

			switch (transtype) {
			case "BOOKING":
				return "Booking";
				break;
			case "RETURN":
				return "Return Auth.";
				break;
			case "LEASE":
				return "Lease";
				break;
			case "RETSCH":
				return "Return Schedule";
				break;
			default:
				// code block
			}

		},

		ExtrefColumnTextFromController: function (transtype) {

			if (transtype === "RETURN") {
				return "Internal Order";
			} else {
				return "Ext. Reference";
			}

		},

		DateFormatter: function (date) {
			if (date === "01-01-1970") {
				return "";
			} else {
				return date;
			}
		}

	};

});