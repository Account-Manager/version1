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
                        oTemplate.push(new sap.m.InputListItem({
                            content: new sap.m.Input({
                                placeholder: oBundle.getText("std.description"),
                                value: {
                                    path: sKey,
                                }
                            }).addStyleClass("inputListItemNoMargin")
                        }));
                        break;
                    case "value" :
                        let oCurrencyLabel = new sap.m.Label({
                            text: "€",
                        }).addStyleClass("textSize14pt");
                        let oInputListItem = new sap.m.InputListItem({
                            type: sap.m.ListType.inactive,
                            content: [
                                new sap.m.Input({
                                    placeholder: oBundle.getText("std.value"),
                                    value: {
                                        path: sKey,
                                    },
                                    width: "7rem"
                                }).addStyleClass("inputListItemNoMargin"),
                                oCurrencyLabel
                            ],
                        });
                        oInputListItem.attachBrowserEvent(
                            "focusout",function() {
                                let regex = /^[0-9]+$/;
                                let input = this.getContent()[0].getValue();
                                if (!input.match(regex)) {      // only numeric values are allowed
                                    this.getContent()[0].setValueState(sap.ui.core.ValueState.Error);
                                } else {
                                    this.getContent()[0].setValueState(sap.ui.core.ValueState.None);
                                }
                            }
                        );
                        oTemplate.push(oInputListItem);
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