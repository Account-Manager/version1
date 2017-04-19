(function() {
	"use strict";

	sap.ui.localResources("manager");
	
	//window.app = new account.manager.App("account.manager.app");
	
	sap.ui.getCore().attachInit(function () {
		let oStartView = new sap.ui.jsview("manager.start");
		oStartView.placeAt("content");
     });
})();