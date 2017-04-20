(function() {
	"use strict";
	sap.ui.controller("manager.start", {
		onInit: function() { // default OpenUI5 function
			console.log("Controller called!");
            const oView = this.getView();
            const oController = this;

			let oBookingTableModel = sap.ui.model.json.JSONModel();
            const oBookingTableData = oController.loadData("bookingData.mock");
			oBookingTableModel.setData(oBookingTableData)
			oView.oBookingTable.setModel(oBookingTableModel);
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

		handleDeleteTableItem: function() {
		    const oController = this;
		    const oView = oController.getView();
            const oItem = viewUtils.getSelectedItemFromTable(oView.oBookingTable);
        },

		getBookingTableColumns: function() {
			const aColumns = [
                new sap.m.Column({
                    header: new sap.m.Label({
                        text: "Date"
                    }),
                }),
                new sap.m.Column({
                    header: new sap.m.Label({
                        text: "Booking type"
                    })
                }),
                new sap.m.Column({
                    header: new sap.m.Label({
                        text: "Frequency"
                    })
                }),
                new sap.m.Column({
                    header: new sap.m.Label({
                        text: "Category"
                    })
                }),
                new sap.m.Column({
                    header: new sap.m.Label({
                        text: "Description"
                    })
                }),
                new sap.m.Column({
                    header: new sap.m.Label({
                        text: "Value"
                    })
                })
            ];
			return aColumns;
		},

		getBookingTableColumnKeys: function() {
		  return ["date", "bookingType", "frequency", "category", "description", "value"]
        },

		getBookingTableTemplate: function() {
		    let oTemplate = [];
		    const aKeys = this.getBookingTableColumnKeys();
		    aKeys.forEach(function (sKey) {
                oTemplate.push(new sap.m.Text({
                    wrapping: false,
                    maxLines: 1,
                    text: {
                        path: sKey
                    }
                }))
            });
		    return oTemplate;
        }
	});
})();