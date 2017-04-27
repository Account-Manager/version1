(function() {
	"use strict";
	sap.ui.controller("manager.Start", {
		onInit: function() { // default OpenUI5 function
			console.log("Controller called!");
			const oController = this;
            const oView = oController.getView();

			oWebservice.getBookingExample("Loading booking data", function(oResponse) { // TODO: translate loading text
				if (oResponse) {
					let oBookingData = new sap.ui.model.json.JSONModel();
					oBookingData.setData(oResponse);
					oView.oBookingTable.setModel(oBookingData);
				}
			});
		},
		
		onBeforeRendering: function() { // default OpenUI5 function
			
		},
		
		onAfterRendering: function() { // default OpenUI5 function
			
		},
		
		onExit: function() { // default OpenUI5 function
			
		},

		handleDeleteTableItem: function(oTable) {
		    const oController = this;
		    const oView = oController.getView();
            const oItem = viewUtils.getSelectedItemFromTable(oTable);
            oTable.getModel().setData(undefined);
            console.log(oTable.getModel().getData());

            //TODO delete item in model (delete by id)
        },

		handleEditBooking: function(oEvent) {
			const oController = this;
			const oView = oController.getView();
			const oItem = viewUtils.getSelectedItemFromTable(oView.oBookingTable);

			console.log(oItem);
		},

		getBookingTableColumns: function() {
			const aColumns = [
                new sap.m.Column({
                    header: new sap.m.Label({
                        text: oBundle.getText("std.date")
                    }),
                }),
                new sap.m.Column({
                    header: new sap.m.Label({
                        text: oBundle.getText("booking.type")
                    })
                }),
                new sap.m.Column({
                    header: new sap.m.Label({
                        text: oBundle.getText("booking.frequency")
                    })
                }),
                new sap.m.Column({
                    header: new sap.m.Label({
                        text: oBundle.getText("std.category")
                    })
                }),
                new sap.m.Column({
                    header: new sap.m.Label({
                        text: oBundle.getText("booking.description")
                    })
                }),
                new sap.m.Column({
                    header: new sap.m.Label({
                        text: oBundle.getText("std.value")
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
		        switch (sKey) {
                    case "description" :
                        oTemplate.push(new sap.m.Input({
                                placeholder: oBundle.getText("std.description"),
                                value: {
                                    path: sKey,
                                }
                            }));
                        break;
                    case "value" :
                        let oCurrencyLabel = new sap.m.Label({
                            text: "€",
                        }).addStyleClass("textSize14pt");
                        let oInput = new sap.m.Input({
                            placeholder: oBundle.getText("std.value"),
                            value: {
                                path: sKey,
                            },
                            width: "7rem"
                        });
                        oInput.attachBrowserEvent(
                            "focusout",function() {
                                let regex = /^[0-9]+$/;
                                let input = this.getValue();
                                if (!input.match(regex)) {      // only numeric values are allowed
                                    this.setValueState(sap.ui.core.ValueState.Error);
                                } else {
                                    this.setValueState(sap.ui.core.ValueState.None);
                                }
                            }
                        );
                        let oFlexBox = new sap.m.FlexBox({
                            items: [
                                oInput,
                                oCurrencyLabel.addStyleClass("marginLeft1rem")
                            ],
                            alignItems: sap.m.FlexAlignItems.Center
                        }).addStyleClass("sapUiNoContentPadding");
                        oTemplate.push(oFlexBox);
                        break;
                    default:
                        oTemplate.push(new sap.m.Text({
                                wrapping: false,
                                maxLines: 1,
                                text: {
                                    path: sKey
                                }
                            }))
                        break;
                }
            });

		    return oTemplate;
        }
	});
})();