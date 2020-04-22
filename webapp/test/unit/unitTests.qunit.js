/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"com/seaco/sd_fiori/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});