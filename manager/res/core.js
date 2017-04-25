(function() {
	"use strict";

	sap.ui.localResources("manager");
    jQuery.sap.require("manager.extensions.webservice");

    window.oWebservice = new manager.extensions.Webservice();
	
	//window.app = new account.manager.App("account.manager.app");

	jQuery.sap.require("manager.util.view");
	jQuery.sap.require("manager.util.storage");

	window.viewUtils = new manager.util.View();
	window.storage = new manager.util.Storage();

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