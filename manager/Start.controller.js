(function() {
	"use strict";
	sap.ui.controller("manager.Start", {
		onInit: function() { // default OpenUI5 function
			console.log("Controller called!");
			const oController = this;
            const oView = oController.getView();
            oController.initBookingCreateDialog();

			let oDate = new Date();
			let oStartDate = new Date(oDate.getFullYear(), oDate.getMonth(), 1);
			let oEndDate = new Date(oDate.getFullYear(), oDate.getMonth() + 1, 0);
			let sStartDate = viewUtils.formatDateToBackendString(oStartDate);
			let sEndDate = viewUtils.formatDateToBackendString(oEndDate);

			oWebservice1.getUserAccounts("Loading accounts...", function(oResponse) {
				if (oResponse && !oResponse.bError) {
					oWebservice1.getBookings("Loading booking data", oResponse.aAccounts, sStartDate, sEndDate, function(oResponseBooking) {
						let oBookings = oResponseBooking.aBookings;
						let oBookingData = new sap.ui.model.json.JSONModel();
						oBookingData.setData(oBookings);
						oView.oBookingTable.setModel(oBookingData);
						oController.handleResetFilters();
					});
					let oAccounts = oResponse.aAccounts;
					let oAccountData = new sap.ui.model.json.JSONModel();
					oAccountData.setData(oAccounts);
					oView.oAccountDataTable.setModel(oAccountData);
					oAccounts.forEach(function(oItem) {
						oView.oAccountComboBox.addItem(new sap.ui.core.Item({
							key: oItem.sAccountId,
							text: oItem.sAccountName
						}));
					});
					oView.oAccountComboBox.setSelectedKey(oAccounts[0].sAccountId);
					sessionStorage.bookingAccount = oAccounts[0].sAccountId;
				}
			});

			// oWebservice.getBookings("Loading booking data", sStartDate, sEndDate, function(oResponse) { // TODO: translate loading text
			// 	if (oResponse && !oResponse.bError) {
			// 		let oBookings = oResponse.aBookings;
			// 		let oBookingData = new sap.ui.model.json.JSONModel();
			// 		oBookingData.setData(oBookings);
			// 		oView.oBookingTable.setModel(oBookingData);
             //        oController.handleResetFilters();
			// 	}
			// });

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
            const sBookingId = oItem.sBookingId;

            oWebservice.deleteBooking("Deleting Booking...", sBookingId, function(oResponse) { // TODO: translation
				if (oResponse && !oResponse.bError) {
					sap.m.MessageToast.show("Booking deleted successfully");
					viewUtils.deleteTableItemByKeyAndValue(oTable, "sBookingId", sBookingId);
					oTable.removeSelections();
					// TODO: disable edit and remove buttons
				}
			});
        },

		handleEditBooking: function(oEvent) {
			const oController = this;
			const oView = oController.getView();
			const oItem = viewUtils.getSelectedItemFromTable(oView.oBookingTable);

			// TODO: rework, this is just a temporary version to test backend connection

			let inpBookingType = new sap.m.Input({
				value: oItem.iBookingType,
				tooltip: "Buchungstyp"
			});
			let inpBookingFrequency = new sap.m.Input({
				value: oItem.iBookingFrequency,
				tooltip: "Häufigkeit"
			});
			let inpBookingCategory = new sap.m.Input({
				value: oItem.iBookingCategory,
				tooltip: "Kategorie"
			});
			let inpBookingTitle = new sap.m.Input({
				value: oItem.sBookingTitle,
				tooltip: "Beschreibung"
			});
			let inpBookingValue = new sap.m.Input({
				value: oItem.fBookingValue,
				tooltip: "Betrag"
			});

			let oEditPopup = new sap.m.Dialog({
				title: "Edit Booking",
				contentWidth: "20rem", // as wide as shell
				showHeader: true,
				resizable: false,
				draggable: true,
				stretch: !!sap.ui.Device.system.phone,
				buttons: [
					new sap.m.Button({
						text: oBundle.getText("std.edit"),
						icon: "sap-icon://save",
						press: function(oEvent) {
							// TODO: edit booking
							let sBookingId = oItem.sBookingId;
							let iBookingType = inpBookingType.getValue();
							let iBookingFrequency = inpBookingFrequency.getValue();
							let iBookingCategory = inpBookingCategory.getValue();
							let sBookingTitle = inpBookingTitle.getValue();
							let fBookingValue = inpBookingValue.getValue();
							oWebservice.updateBooking("Updating Booking...", sBookingId, iBookingCategory, iBookingType, iBookingFrequency, sBookingTitle, fBookingValue, function(oResponse) {
								console.log(oResponse);
								if (oResponse && !oResponse.bError) {
									sap.m.MessageToast.show("Booking updated successfully.", {});
								}
							});
						}
					}),
					new sap.m.Button({
						text: oBundle.getText("std.cancel"),
						icon: "sap-icon://sys-cancel-2",
						press: function(oEvent) {
							oEditPopup.close();
							oEditPopup.destroy();
						}
					})
				],
				content: [
					new sap.m.FlexBox({
						height: "100%",
						width: "100%",
						direction: sap.m.FlexDirection.Column,
						items: [
							inpBookingType,
							inpBookingFrequency,
							inpBookingCategory,
							inpBookingTitle,
							inpBookingValue
						]
					})
				]
			});

			oEditPopup.open();
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

		getAccountsTableColumnKeys: function() {
			return [
				"sAccountName",
				"sAccountValue"
			];
		},

		getAccountsTableTemplate: function() {
			let oTemplate = [];
			const sKeys = this.getAccountsTableColumnKeys();
			sKeys.forEach(function(sKey) {
				switch(sKey) {
					case "sAccountName":
						oTemplate.push(new sap.m.Text({
							wrapping: false,
							maxlines: 1,
							text: {
								path: sKey
							}
						}));
				}
			});
			return oTemplate;
		},

		getBookingTableColumnKeys: function() {
			return [
				"sBookingDate",
				"iBookingType",
				"iBookingFrequency",
				"sMainCategory",
				"sBookingDescription",
				"fBookingValue",
				"iAccountId",
				"iBookingId",
				"sSubCategory"
			]
			// return [
			// 	"oBookingDate",
			// 	"iBookingType",
			// 	"iBookingFrequency",
			// 	"iBookingCategory",
			// 	"sBookingTitle",
			// 	"fBookingValue"
			// ];
        },

		getBookingTableTemplate: function() {
		    let oTemplate = [];
		    const aKeys = this.getBookingTableColumnKeys();
		    aKeys.forEach(function (sKey) {
		        switch (sKey) {
                    case "sBookingDate":
                        oTemplate.push(new sap.m.Text({
                                wrapping: false,
                                maxLines: 1,
                                text: {
                                    path: sKey,
                                    formatter: function(sValue) {
                                        return viewUtils.formatBackendStringToFrontendDate(sValue);
                                    }
                                },
                            })
                        );
                        break;
                    case "iBookingType":
                        oTemplate.push(new sap.m.Text({
                                wrapping: false,
                                maxLines: 1,
                                text: {
                                    path: sKey,
									formatter: function(sValue) {
                                        switch(sValue) {
                                            case 0:
                                                return oBundle.getText("booking.type.expense");
                                                break;
                                            case 1:
                                                return oBundle.getText("booking.type.income");
                                                break;
											default:
												break;
                                        }
									}
                                },
                            })
                        );
                        break;
                    case "iBookingFrequency":
                        oTemplate.push(new sap.m.Text({
                                wrapping: false,
                                maxLines: 1,
                                text: {
                                    path: sKey,
                                    formatter: function(sValue) {
                                    	switch(sValue) {
											case 0:
                                                return oBundle.getText("booking.frequency.unique");
											case 1:
                                                return oBundle.getText("booking.frequency.daily");
											case 2:
                                                return oBundle.getText("booking.frequency.weekly");
											case 3:
                                                return oBundle.getText("booking.frequency.monthly");
										}
                                    }
                                },
                            })
                        );
                        break;
                    case "sBookingDescription":
                        oTemplate.push(new sap.m.Input({
                                placeholder: oBundle.getText("std.description"),
                                value: {
                                    path: sKey
                                }
                            })
                        );
                        break;
                    case "fBookingValue":
                        let oInput = new sap.m.Input({
                            placeholder: oBundle.getText("std.value"),
                            textAlign: sap.ui.core.TextAlign.End,
                            description: "€",
                            width: "130%",
                            type: sap.m.InputType.Number,
                            value: {
                                path: sKey,
                                formatter: function(sValue) {
                                    return parseFloat(sValue).toFixed(2)
                                }
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
                                wrapping: false,        //TODO: category => wrapping allowed
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

		handleFilterItems: function(sPath, sValue) {
		    const oView = this.getView();
		    let aFilters = [];
		    if(sValue !== "all"){
                let oFilter =  new sap.ui.model.Filter(sPath, "EQ", sValue);
                aFilters.push(oFilter);
            }
		    const oBinding = oView.oBookingTable.getBinding("items");
		    oBinding.filter(aFilters);
        },

		handleResetFilters: function() {
		    const oView = this.getView();
            oView.oBookingTypeFilter.setSelectedKey("all");
            sessionStorage.filterBookingTypeKey = "all";
            oView.oAccountFilter.setSelectedKey("all");
            sessionStorage.filterAccountKey = "all";
            oView.oFrequencyFilter.setSelectedKey("all");
            sessionStorage.filterFrequencyKey = "all";
            oView.oPeriodFilter.setSelectedKey("all");
            sessionStorage.filterPeriodKey = "all";
            const oBinding = oView.oBookingTable.getBinding("items");
            oBinding.filter();
        },

		initBookingCreateDialog: function() {
			const oView = this.getView();
            const aFormElements = oView.oBookingCreateDialog.getContent()[0].getFormContainers()[0].getFormElements();
            aFormElements[0].getFields()[0].setSelectedKey("expense");
            sessionStorage.bookingType = "expense";
            aFormElements[0].getFields()[1].setSelectedKey("001");
            sessionStorage.bookingAccount = "expense";
            aFormElements[1].getFields()[0].setDateValue(new Date());
            aFormElements[1].getFields()[1].setSelectedKey("unique");
            sessionStorage.bookingFrequency = "expense";
            aFormElements[2].getFields()[0].setSelectedKey("general");
            sessionStorage.bookingCategory = "general";
            aFormElements[2].getFields()[2].setValue("");
            aFormElements[3].getFields()[0].setValue("");
            oView.bInputAlready = false;
		},

		makeAdminPanel: function() {
			const oController = this;
			const oView = oController.getView();

			let oAdminPanel = new sap.m.Dialog({
				title: "Admin-Panel",
				contentWidth: "1280px", // as wide as shell
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
				stretchContentHeight: true,
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
					let oBookingDate = new Date();
					let sBookingDate = viewUtils.formatDateToBackendString(oBookingDate);

					oWebservice.setBooking("Generating random Booking...", 1, 1, 1, sBookingDate, 1, "Monatsgehalt", 714.12, function(oResponse) {
						console.log(oResponse);
						if (oResponse && !oResponse.bError) {
							sap.m.MessageToast.show("Booking saved successfully", {});
						} else {
							sap.m.MessageToast.show("Error saving booking", {});
						}
					});

					// let oStartDate = new Date("2016", "01", "01"), oEndDate = new Date();
					// let sStartDate = oStartDate.toJSON(), sEndDate = oEndDate.toJSON();
					// oWebservice.getBookings("Loading Bookings...", function(oResponse) {
					// 	console.log(oResponse);
					// }, sStartDate, sEndDate);
				}
			});
			oView.btnCloseAdminPanel = new sap.m.Button({
				text: "Close",
				icon: "sap-icon://sys-cancel-2",
				press: function(oEvent) {
					oView.oAdminPanel.close();
				}
			});
			oAdminPanel.addButton(oView.btnUserAdd);
			oAdminPanel.addButton(oView.btnUserDelete);
			oAdminPanel.addButton(oView.btnAccountAdd);
			oAdminPanel.addButton(oView.btnBookingAdd);
			oAdminPanel.addButton(oView.btnCloseAdminPanel);
			// oAdminPanel.addButton(new sap.m.Button({
			// 	text: "Close",
			// 	icon: "sap-icon://sys-cancel-2",
			// 	press: function(oEvent) {
			// 		oView.oAdminPanel.close();
			// 	}
			// }));

			oAdminPanel.addContent(oView.oIconTabBar);

			return oAdminPanel;
		},

		getAdminPanelOverview: function() {
			const oContoller = this;
			const oView = oContoller.getView();

			oWebservice.getAdminPanelOverview("Loading overview data...", function(oResponse) {
				if (oResponse && !oResponse.bError) {
					oView.oUserTab.setCount(oResponse.aCounts[0].sUserCount);
					oView.oAccountsTab.setCount(oResponse.aCounts[0].sAccountsCount);
					oView.oBookingsTab.setCount(oResponse.aCounts[0].sBookingsCount);
					oWebservice.getUserData("Loading User informations...", function(oUserResponse) {
						let oUserModel = new sap.ui.model.json.JSONModel();
						oUserModel.setData(oUserResponse);
						oView.oUserTable.setModel(oUserModel);
					});
				}
			});
		},

		showBookingAddDialog: function(oEvent) {
			const oController = this;
			const oView = oController.getView();

			// let oAccountId = new sap.m.Input({ value: "1" });
			// let oBookingCategory = new sap.m.Input({ value: "1" });
			// let oBookingType = new
		},

		saveBooking: function(oEvent, oBookingFormContainer) {
			const oController = this;
			const oView = oController.getView();

			console.log(oBookingFormContainer);
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