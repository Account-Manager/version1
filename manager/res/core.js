(function() {
	"use strict";

	sap.ui.localResources("manager");
	
	//window.app = new account.manager.App("account.manager.app");
	
	sap.ui.getCore().attachInit(function () {
		let oStartView = new sap.ui.jsview("manager.start");
        window.oApp = new sap.m.App({initialPage:"start"});		//TODO check naming
		window.oApp.addPage(oStartView);
		window.oApp.placeAt("content");
	});
})();