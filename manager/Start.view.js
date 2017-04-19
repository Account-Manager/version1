(function() {
	"use strict";
	sap.ui.jsview("manager.start", {
		getControllerName: function() { // default OpenUI5 function
			return "manager.start";
		},
		
		createContent: function(oController) { // default OpenUI5 function

            const oView = this;
			console.log("View called!");

            oView.btnAdd = new sap.m.Button({
                text: "add",
                icon: "sap-icon://add"
            });

            oView.btnEdit = new sap.m.Button({
                text: "edit",
                icon: "sap-icon://edit"
            });

            oView.btnDelete = new sap.m.Button({
                text: "delete",
                icon: "sap-icon://delete"
            });

            const oAccountData = new sap.m.Panel({
                content: [
                     new sap.m.Title({text: "Account dates"})
                ]
            });

            const oAccountStats = new sap.m.Panel({
                content: [
                    new sap.m.Title({text: "Account stats"})
                ]
            });

            const oHeaderInfo = new sap.m.FlexBox({
                justifyContent: sap.m.FlexJustifyContent.Right,
                alignItems: sap.m.FlexAlignItems.Right,
                width: "100%",
                items: [
                    oAccountStats,
                    oAccountData
                ]
            });

            const oHeaderToolBar = new sap.m.Bar({
                contentLeft: [
                    oView.btnAdd,
                    oView.btnEdit,
                    oView.btnDelete
                ],
                contentMiddle: [ new sap.m.Text({ text: "Filter" }) ]
            });

            oView.oHeaderPanel = new sap.m.Panel({
                content: [
                    oHeaderInfo,
                    oHeaderToolBar
                ],
                width: "100%"
            });

            const oFooter = new sap.m.Bar({
                contentMiddle: [
                    new sap.m.Button({ text: "Impressum" }),
                    new sap.m.Text({ text: "© 2017" })
                ]
            });


            const oPage = new sap.m.Page(this.createId("page"), {
                title: "Account Manager",
                height: "10rem",
                content: [
                    oView.oHeaderPanel,
                ],
                footer: oFooter
            });

            // is this needed? | I don't think so - DS
            // oPage.addHeaderContent(new sap.m.Button({
            //     visible: false
            // }));


            return oPage;
		}
	});
})();