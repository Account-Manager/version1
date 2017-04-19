(function() {
	"use strict";
	sap.ui.jsview("manager.start", {
		getControllerName: function() { // default OpenUI5 function
			return "manager.start";
		},
		
		createContent: function(oController) { // default OpenUI5 function
			console.log("View called!");

            const oPage = new sap.m.Page(this.createId("page"), {
                title: "Account Manager Test",
                content: [
                    // oView.oFlexBoxLayout
                ]
            });

            oPage.addHeaderContent(new sap.m.Button({
                visible: false
            }));

            return oPage;
		}
	});
})();