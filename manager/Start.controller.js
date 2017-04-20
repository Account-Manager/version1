(function() {
	"use strict";
	sap.ui.controller("manager.start", {
		onInit: function() { // default OpenUI5 function
			console.log("Controller called!");
            const oView = this.getView();
            const oController = this;

			let oBookingTableModel = sap.ui.model.json.JSONModel();
			oView.oBookingTable.setModel(oBookingTableModel);

            const oBookingTableData = oController.loadData("bookingData.mock");
            oView.oBookingTable.getModel().setData(oBookingTableData);
		},
		
		onBeforeRendering: function() { // default OpenUI5 function
			
		},
		
		onAfterRendering: function() { // default OpenUI5 function
			
		},
		
		onExit: function() { // default OpenUI5 function
			
		},

		loadData: function(sDataId){
			const sResourceName = "manager/res/data/" + sDataId + ".json";
			return jQuery.sap.loadResource(sResourceName, {
				dataType: "json",
				async: false
			})
		},

		getBookingTableColumns: function() {
			const aColumns = [
                new sap.m.Column({
                    key: "date",
                    header: new sap.m.Label({
                        text: "Date"
                    }),
                }),
                new sap.m.Column({
					key: "bookingType",
                    header: new sap.m.Label({
                        text: "Booking type"
                    })
                }),
                new sap.m.Column({
                    key: "frequency",
                    header: new sap.m.Label({
                        text: "Frequency"
                    })
                }),
                new sap.m.Column({
                    key: "category",
                    header: new sap.m.Label({
                        text: "Category"
                    })
                }),
                new sap.m.Column({
                    key: "decription",
                    header: new sap.m.Label({
                        text: "Description"
                    })
                }),
                new sap.m.Column({
                    key: "value",
                    header: new sap.m.Label({
                        text: "Value"
                    })
                })
            ];
			return aColumns;
		}
	});
})();