(function() {
	"use strict";
	sap.ui.jsview("manager.start", {
		getControllerName: function() { // default OpenUI5 function
			return "manager.start";
		},
		
		createContent: function(oController) { // default OpenUI5 function
            const oView = this;
			console.log("View called!");

            const oFooter = new sap.m.Bar({
                contentMiddle: [ new sap.m.Text({ text: "Test" })]
            });

            oView.oFlexBoxLayout = new sap.m.FlexBox({
                direction: sap.m.FlexDirection.Column,
                items: [
                    oFooter
                ],
                justifyContent: sap.m.FlexJustifyContent.Center,
                alignItems: sap.m.FlexAlignItems.Center,
                width: "100%"
            });

            const oPage = new sap.m.Page(this.createId("page"), {
                title: "Account Manager",
                content: [
                    oView.oFlexBoxLayout
                ]
            });

            // is this needed?
            // oPage.addHeaderContent(new sap.m.Button({
            //     visible: false
            // }));

            return oPage;
		}
	});
})();