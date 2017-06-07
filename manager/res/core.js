(function() {
	"use strict";

	sap.ui.localResources("manager");
	jQuery.sap.require("manager.extensions.webservice");

    window.oWebservice = new manager.extensions.Webservice();
	
	//window.app = new account.manager.App("account.manager.app");

	jQuery.sap.require("manager.util.view");
	jQuery.sap.require("manager.util.storage");
    jQuery.sap.require("sap.m.MessageBox");
    jQuery.sap.require("sap.ui.core.format.DateFormat");

	window.viewUtils = new manager.util.View();
	window.storage = new manager.util.Storage();

	// custom error handling
	window.onerror = function(sMessage, sUrl, iLine, iCol, sError) {
		sap.m.MessageBox.confirm(oBundle.getText("std.error.message"), {
			icon: sap.m.MessageBox.Icon.ERROR,
			title: oBundle.getText("std.error.title"),
			actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
			onClose: function(oAction) {
				if (oAction == sap.m.MessageBox.Action.YES) {

				}
			}
		});
	};

	storage.setLanguage("de");  //TODO changeable from frontend

    window.oBundle = jQuery.sap.resources({
        url: "manager/res/i18n/i18n.properties",
        locale: storage.getLanguage()
    });

	sap.ui.getCore().attachInit(function () {
		let oStartView = new sap.ui.jsview("manager.Start");
        const oApp = new sap.m.App({ initialPage: "Start" }); // TODO: check naming
		oApp.addPage(oStartView);
		window.app = new sap.m.Shell({
            app: oApp
        }).placeAt("content");
	});
})();