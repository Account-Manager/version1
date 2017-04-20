(function() {
	"use strict";

	sap.ui.localResources("manager");
	
	//window.app = new account.manager.App("account.manager.app");
	
	sap.ui.getCore().attachInit(function () {
		let oStartView = new sap.ui.jsview("manager.start");
        const oApp = new sap.m.App({ initialPage:"start" });		//TODO check naming
		oApp.addPage(oStartView);
		window.app = new sap.m.Shell({
            app: oApp
        }).placeAt("content");
	});
})();