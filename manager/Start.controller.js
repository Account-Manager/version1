(function() {
	"use strict";
	sap.ui.controller("manager.Start", {
		onInit: function() { // default OpenUI5 function
			console.log("Controller called!");
			const oController = this;
            const oView = oController.getView();

			// oWebservice.getBookingExample("Loading booking data", function(oResponse) { // TODO: translate loading text
			// 	if (oResponse && !oResponse.bError) {
			// 		let oBookings = oResponse.aBookings;
			// 		let oBookingData = new sap.ui.model.json.JSONModel();
			// 		oBookingData.setData(oBookings);
			// 		oView.oBookingTable.setModel(oBookingData);
			// 	}
			// });
			let oDate = new Date();
			let oStartDate = new Date(oDate.getFullYear(), oDate.getMonth(), 1);
			let oEndDate = new Date(oDate.getFullYear(), oDate.getMonth() + 1, 0);
			let sStartDate = viewUtils.formatDateToBackendString(oStartDate);
			let sEndDate = viewUtils.formatDateToBackendString(oEndDate);
			oWebservice.getBookings("Loading booking data", sStartDate, sEndDate, function(oResponse) { // TODO: translate loading text
				console.log(oResponse);
				if (oResponse && !oResponse.bError) {
					let oBookings = oResponse.aBookings;
					let oBookingData = new sap.ui.model.json.JSONModel();
					oBookingData.setData(oBookings);
					oView.oBookingTable.setModel(oBookingData);
				}
			});

			oView.oAdminPanel = oController.makeAdminPanel();
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
			return [
				"oBookingDate",
				"iBookingType",
				"iBookingFrequency",
				"iBookingCategory",
				"sBookingTitle",
				"fBookingValue"
			];
		  // return ["date", "bookingType", "frequency", "category", "description", "value"]
        },

		getBookingTableTemplate: function() {
		    let oTemplate = [];
		    const aKeys = this.getBookingTableColumnKeys();
		    aKeys.forEach(function (sKey) {
		        switch (sKey) {
					case "sBookingTitle": // "description" :
                        oTemplate.push(new sap.m.Input({
                                placeholder: oBundle.getText("std.description"),
                                value: {
                                    path: sKey,
                                }
                            })
						);
                        break;
					case "fBookingValue": // "value" :
                        let oInput = new sap.m.Input({
                            placeholder: oBundle.getText("std.value"),
                            textAlign: sap.ui.core.TextAlign.End,
                            description: "€",
                            width: "15rem",
                            type: sap.m.InputType.Number,
                            value: {
                                path: sKey
                            }
                        });
                        oInput.attachBrowserEvent(
                            "focusout",function() {
                                let sInput = this.getValue();
                                if(sInput === "") {
                                    this.setValueState(sap.ui.core.ValueState.Error);
                                } else {
                                    this.setValueState(sap.ui.core.ValueState.None);
                                    let sFloat = parseFloat(sInput).toFixed(2);
                                    this.setValue(sFloat);
                                }
                            }
                        );
                        oTemplate.push(oInput);
                        break;
                    default:
                        oTemplate.push(new sap.m.Text({
                                wrapping: false,
                                maxLines: 1,
                                text: {
                                    path: sKey
                                }
                            })
						);
                        break;
                }
            });

		    return oTemplate;
        },

		makeAdminPanel: function() {
			const oController = this;
			const oView = oController.getView();

			let oAdminPanel = new sap.m.Dialog({
				title: "Admin-Panel",
				contentWidth: "90%",
				contentHeight: "90%",
				showHeader: false,
				resizable: true,
				draggable: true,
				stretch: !!sap.ui.Device.system.phone
			});

			oView.oUserTable = new sap.m.Table({
				columns: [
					new sap.m.Column({
						header: new sap.m.Label({
							text: "ID"
						})
					}),
					new sap.m.Column({
						header: new sap.m.Label({
							text: "Firstname"
						})
					}),
					new sap.m.Column({
						header: new sap.m.Label({
							text: "Lastname"
						}),
					}),
					new sap.m.Column({
						header: new sap.m.Label({
							text: "Login Name"
						})
					})
				],
				mode: sap.m.ListMode.SingleSelectMaster,
				selectionChange: function(oEvent) {
					console.log(oView.oUserTable.indexOfItem(oView.oUserTable.getSelectedItem()));
					let oItem = oView.oUserTable.getSelectedItem();
					if (oItem) {
						oView.btnUserDelete.setVisible(true);
					}
				}
			}).bindAggregation("items", "/", new sap.m.ColumnListItem({
				cells: [
					new sap.m.Text({
						text: {
							path: "sUserId"
						}
					}),
					new sap.m.Text({
						text: {
							path: "sFirstName"
						}
					}),
					new sap.m.Text({
						text: {
							path: "sLastName"
						}
					}),
					new sap.m.Text({
						text: {
							path: "sLoginName"
						}
					})
				],
				vAlign: sap.ui.core.VerticalAlign.Middle
			}));

			oView.oUserTab = new sap.m.IconTabFilter({
				icon: "sap-icon://employee",
				key: "user",
				content: [
					oView.oUserTable
				]
			});
			oView.oAccountsTab = new sap.m.IconTabFilter({
				icon: "sap-icon://contacts",
				key: "accounts"
			});
			oView.oBookingsTab = new sap.m.IconTabFilter({
				icon: "sap-icon://bar-code",
				key: "bookings"
			});
			oView.oIconTabBar = new sap.m.IconTabBar({
				width: "100%",
				items: [
					oView.oUserTab,
					oView.oAccountsTab,
					oView.oBookingsTab
				]
			}).attachSelect(function(oEvent) {
				let sKey = oEvent.getParameters().key;
				oView.oUserTable.removeSelections();
				oView.btnUserAdd.setVisible(false);
				oView.btnUserDelete.setVisible(false);
				oView.btnAccountAdd.setVisible(false);
				oView.btnBookingAdd.setVisible(false);
				switch (sKey) {
					case "user":
						oView.btnUserAdd.setVisible(true);
						break;
					case "accounts":
						oView.btnAccountAdd.setVisible(true);
						break;
					case "bookings":
						oView.btnBookingAdd.setVisible(true);
						break;
					default:
						break;
				}
			});

			oView.btnUserAdd = new sap.m.Button({
				icon: "sap-icon://add",
				text: "Add User",
				visible: true,
				press: function (oEvent) {
					oController.showUserAddDialog(oEvent);
				}
			});
			oView.btnUserDelete = new sap.m.Button({
				icon: "sap-icon://decline",
				text: "Delete User",
				visible: false,
				press: function (oEvent) {
					// oController.showUserAddDialog(oEvent);
					let oItem = viewUtils.getSelectedItemFromTable(oView.oUserTable);
					oWebservice.deleteUser("Deleting User...", function(oResponse) {
						if (oResponse && oResponse.bDeleteSuccess) {
							sap.m.MessageToast.show("User deleted successfully.", {});
							oView.btnUserDelete.setVisible(false);
							oController.getAdminPanelOverview();
						}
					}, function() {
						let oDialog = new sap.m.Dialog({
							title: oBundle.getText("std.error.occurred"),
							type: "Message",
							state: "Error",
							content: new sap.m.Text({
								text: "Beim Löschen der Daten ist ein Fehler aufgetreten"
							}),
							beginButton: new sap.m.Button({
								text: oBundle.getText("std.ok"),
								press: function() {
									oDialog.close();
								}
							}),
							afterClose: function() {
								oDialog.destroy();
							}
						});
						oDialog.open();
					}, {
						"sUserId": oItem.sUserId
					});
				}
			});
			oView.btnAccountAdd = new sap.m.Button({
				icon: "sap-icon://add",
				text: "Add Account",
				visible: false,
				press: function (oEvent) {

				}
			});
			oView.btnBookingAdd = new sap.m.Button({
				icon: "sap-icon://add",
				text: "Add Booking",
				visible: false,
				press: function (oEvent) {
					let oStartDate = new Date("2016", "01", "01"), oEndDate = new Date();
					let sStartDate = oStartDate.toJSON(), sEndDate = oEndDate.toJSON();
					oWebservice.getBookings("Loading Bookings...", function(oResponse) {
						console.log(oResponse);
					}, sStartDate, sEndDate);
				}
			});
			oAdminPanel.addButton(oView.btnUserAdd);
			oAdminPanel.addButton(oView.btnUserDelete);
			oAdminPanel.addButton(oView.btnAccountAdd);
			oAdminPanel.addButton(oView.btnBookingAdd);
			oAdminPanel.addButton(new sap.m.Button({
				text: "Close",
				icon: "sap-icon://sys-cancel-2",
				press: function(oEvent) {
					oView.oAdminPanel.close();
				}
			}));

			oAdminPanel.addContent(oView.oIconTabBar);

			return oAdminPanel;
		},

		getAdminPanelOverview: function() {
			const oContoller = this;
			const oView = oContoller.getView();

			oWebservice.getAdminPanelOverview("Loading overview data...", function(oResponse) {
				oView.oUserTab.setCount(oResponse.sUserCount);
				oView.oAccountsTab.setCount(oResponse.sAccountsCount);
				oView.oBookingsTab.setCount(oResponse.sBookingsCount);
				oWebservice.getUserData("Loading User informations...", function(oUserResponse) {
					let oUserModel = new sap.ui.model.json.JSONModel();
					oUserModel.setData(oUserResponse);
					oView.oUserTable.setModel(oUserModel);
				});
			});
		},

		showUserAddDialog: function(oEvent) {
			const oController = this;
			const oView = oController.getView();

			let oUserFirstNameInput = new sap.m.Input({
				placeholder: "Max"
			});
			let oUserFirstName = new sap.ui.layout.form.FormElement({
				label: "Firstname",
				fields: [ oUserFirstNameInput ]
			});

			let oUserLastNameInput = new sap.m.Input({
				placeholder: "Mustermann"
			});
			let oUserLastName = new sap.ui.layout.form.FormElement({
				label: "Lastname",
				fields: [ oUserLastNameInput ]
			});

			let oUserLoginNameInput = new sap.m.Input({
				placeholder: "max.mustermann"
			});
			let oUserLoginName = new sap.ui.layout.form.FormElement({
				label: "Loginname",
				fields: [ oUserLoginNameInput ]
			});

			let oUserPasswordInput = new sap.m.Input({
				type: sap.m.InputType.Password
			});
			let oUserPassword = new sap.ui.layout.form.FormElement({
				label: "Password",
				fields: [ oUserPasswordInput ]
			});

			let oUserAddContainer = new sap.ui.layout.form.FormContainer({
				expanded: true,
				formElements: [
					oUserFirstName,
					oUserLastName,
					oUserLoginName,
					oUserPassword
				]
			});

			let oUserAddForm = new sap.ui.layout.form.Form({
				editable: true,
				formContainers: [ oUserAddContainer ],
				layout: new sap.ui.layout.form.GridLayout({
					// TODO: layout optimization
				})
			}).addStyleClass("marginMinus1Rem");

			let oUserAddDialog = new sap.m.Dialog({
				title: "Add User",
				contentWidth: "40%",
				stretch: sap.ui.Device.system.phone? true : false,
				endButton: new sap.m.Button({
					text: "Cancel",
					press: function(oEvent) {
						oUserAddDialog.close();
					}
				}),
				beginButton: new sap.m.Button({
					text: "Save",
					press: function(oEvent) {
						if (oUserFirstNameInput.getValue().length > 0 && oUserLastNameInput.getValue().length > 0 &&
							oUserLoginNameInput.getValue().length > 0 && oUserPasswordInput.getValue().length > 0) {
							// everything supplied
							let oParameters = {};
							oParameters["sFirstName"] = oUserFirstNameInput.getValue();
							oParameters["sLastName"] = oUserLastNameInput.getValue();
							oParameters["sLoginName"] = oUserLoginNameInput.getValue();
							oParameters["sPassword"] = oUserPasswordInput.getValue();
							oWebservice.setNewUser("Saving User...", function(oResponse) {
								console.log(oResponse);
								if (oResponse && oResponse.bSaveSuccess) {
									sap.m.MessageToast.show("User saved successfully.", {});
									oUserAddDialog.close();
									// TODO: refresh
									oController.getAdminPanelOverview();
								}
							}, function() {
								let oDialog = new sap.m.Dialog({
									title: oBundle.getText("std.error.occurred"),
									type: "Message",
									state: "Error",
									content: new sap.m.Text({
										text: oBundle.getText("std.error.loading")
									}),
									beginButton: new sap.m.Button({
										text: oBundle.getText("std.ok"),
										press: function() {
											oDialog.close();
										}
									}),
									afterClose: function() {
										oDialog.destroy();
									}
								});
								oDialog.open();
							}, oParameters);
						} else {
							let oDialog = new sap.m.Dialog({
								title: oBundle.getText("std.error.occurred"),
								type: "Message",
								state: "Error",
								content: new sap.m.Text({
									text: "Fil in all fields to save user to database"
								}),
								beginButton: new sap.m.Button({
									text: oBundle.getText("std.ok"),
									press: function() {
										oDialog.close();
									}
								}),
								afterClose: function() {
									oDialog.destroy();
								}
							});
							oDialog.open();
						}
					}
				}),
				content: [ oUserAddForm ]
			});
			oUserAddDialog.open();
		}
	});
})();