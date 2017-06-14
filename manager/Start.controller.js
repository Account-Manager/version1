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

			oWebservice.getUserAccounts("Loading accounts...", function(oResponse) {
				if (oResponse && !oResponse.bError) {
					let aAccounts = [];
					oResponse.aAccounts.forEach(function(oItem) {
						aAccounts.push(oItem.sAccountId);
					});

					if (oResponse.sSessionId && oResponse.sSessionId !== "") {
						document.cookie = `PHPSESSID=${oResponse.sSessionId}`;
					}

					// TODO: check if aAccounts has items before execting following functions

					oView.oAccountsPanel.setHeaderText(`Accounts (${aAccounts.length})`);

					oWebservice.getCategories("Loading categories...", aAccounts, function(oResponseCategories) {
						if (oResponseCategories && !oResponseCategories.bError) {
							oWebservice.getBookings("Loading booking data", aAccounts, sStartDate, sEndDate, function(oResponseBooking) {
								let oBookings = oResponseBooking.aBookings;
								let oBookingData = new sap.ui.model.json.JSONModel();
								oBookingData.setData(oBookings);
								oView.oBookingTable.setModel(oBookingData);
								oController.handleResetFilters();
							});

							let oMainCategories = oResponseCategories.aMainCategories;
							let oSubCategories = oResponseCategories.aSubCategories;
							oView.aMainCategories = oMainCategories;
							oView.aSubCategories = oSubCategories;

							oMainCategories.forEach(function(oItem) {
								oView.oCategoryComboBox.addItem(new sap.ui.core.Item({
									key: oItem.iMainCategoryId,
									text: oItem.sMainCategoryName,
									customData: new sap.ui.core.CustomData({
										key: "iAccountId",
										value: oItem.iAccountId
									})
								}));
							});
							oView.oCategoryComboBox.setSelectedKey(oMainCategories[0].iMainCategoryId);
							sessionStorage.bookingCategory = oAccounts[0].sAccountId;
						}
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

			console.log(oItem);

			if (oItem) {
				let btnExpense = new sap.m.SegmentedButtonItem({
					text: "Expense",
					key: "0"
				});
				let btnIncome = new sap.m.SegmentedButtonItem({
					text: "Income",
					key: "1"
				});
				let btnTransferOut = new sap.m.SegmentedButtonItem({
					text: "(-) Transfer",
					key: "2"
				});
				let btnTransferIn = new sap.m.SegmentedButtonItem({
					text: "(+) Transfer",
					key: "2"
				});
				let btnBookingType = new sap.m.SegmentedButton({
					items: [
						btnExpense,
						btnIncome,
						btnTransferOut,
						btnTransferIn
					],
					width: "100%"
				});
				btnBookingType.setSelectedKey(oItem.iBookingType);

				let inpBookingFrequency = new sap.m.Input({
					value: oItem.iBookingFrequency,
					tooltip: "Häufigkeit"
				});
				let inpBookingDescription = new sap.m.Input({
					value: oItem.sBookingDescription,
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
								let iBookingType = parseInt(btnBookingType.getSelectedKey(), 10);
								let iBookingFrequency = parseInt(inpBookingFrequency.getValue(), 10);
								let sBookingDescription = inpBookingDescription.getValue();
								let fBookingValue = parseFloat(inpBookingValue.getValue());
								let iBookingId = oItem.iBookingId;
								let iAccountId = oItem.iAccountId;
								let sBookingDate = oItem.sBookingDate;
								let iMainCategoryId = oItem.iMainCategoryId;
								let iSubCategoryId = oItem.iSubCategoryId;

								oWebservice.setBooking("Saving Booking...", iBookingId, iAccountId, iMainCategoryId, iSubCategoryId, sBookingDate, sBookingDescription, iBookingFrequency, iBookingType, fBookingValue, function(oResponse) {
									console.log(oResponse);
									if (oResponse && !oResponse.bError) {
										// viewUtils.deleteTableItemByKeyAndValue(oView.oBookingTable, "iBookingId", oItem.iBookingId);

										let oTableData = oView.oBookingTable.getModel().getData();
										let oNewItem = {};
										oNewItem.sBookingDate = sBookingDate;
										oNewItem.iMainCategoryId = iMainCategoryId;
										oNewItem.iSubCategoryId = iSubCategoryId;
										oNewItem.fBookingValue = fBookingValue;
										oNewItem.sBookingDescription = sBookingDescription;
										oNewItem.iBookingFrequency = iBookingFrequency;
										oNewItem.iBookingType = iBookingType;
										oNewItem.iAccountId = iAccountId;
										oNewItem.iBookingId = iBookingId;

										viewUtils.updateTableItemByKeyAndValue(oView.oBookingTable, "iBookingId", oItem.iBookingId, oNewItem);

										//
										// oTableData.push(oNewItem);
										//
										// let oNewData = new sap.ui.model.json.JSONModel();
										// oNewData.setData(oTableData);
										// oView.oBookingTable.setModel(oNewData);

										oEditPopup.close();

										sap.m.MessageToast.show("Booking updated successfully.", {});
									} else {
										sap.m.MessageToast.show("Booking update failed.", {});
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
								// inpBookingType,
								btnBookingType,
								inpBookingFrequency,
								inpBookingDescription,
								inpBookingValue
							]
						})
					]
				});

				oEditPopup.open();
			} else {
				sap.m.MessageToast.show("No booking selected");
			}
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
				"fAccountBalance"
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
						break;
					case "fAccountBalance":
						oTemplate.push(new sap.m.Text({
							wrapping: false,
							maxlines: 1,
							text: {
								path: sKey
							}
						}));
						break;
					default:
						break;
				}
			});
			return oTemplate;
		},

		getBookingTableColumnKeys: function() {
			return [
				"sBookingDate",
				"iBookingType",
				"iBookingFrequency",
				// "sMainCategory",
				"iMainCategoryId",
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
			const oController = this;
			const oView = oController.getView();

		    let oTemplate = [];
		    const aKeys = oController.getBookingTableColumnKeys();
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
					case "iMainCategoryId": // TODO: somehow sub category has to be shown in same column
						oTemplate.push(new sap.m.Text({
								wrapping: false, // TODO: category => wrapping allowed
								maxLines: 1,
								text: {
									path: sKey,
									formatter: function(iValue) {
										for (let i = 0; i < oView.aMainCategories.length; i++) {
											if (iValue === oView.aMainCategories[i].iMainCategoryId) {
												return oView.aMainCategories[i].sMainCategoryName;
											}
										}
									}
								}
							})
						);
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

			/*
				TabBar
			 */
			oView.oAdminTabBar = new sap.m.IconTabBar({
				width: "100%",
				stretchContentHeight: true
				// items added afterwars
			});

			oView.oAdminUserTab = new sap.m.IconTabFilter({
				icon: "sap-icon://employee",
				key: "user"
				// content added afterwards
			});

			oView.oAdminUserToolBar = new sap.m.OverflowToolbar({});

			oView.oAdminUserAdd = new sap.m.OverflowToolbarButton({
				icon: "sap-icon://add",
				text: "Add",
				tooltip: "Add",
				press: function(oEvent) {
					oController.showAdminUserDialog();
				}
			});

			oView.oAdminUserUpdate = new sap.m.OverflowToolbarButton({
				icon: "sap-icon://user-edit",
				text: "Update",
				tooltip: "Update",
				enabled: false,
				press: function(oEvent) {
					let oItem = viewUtils.getSelectedItemFromTable(oView.oAdminUserTable);
					if (oItem) {
						oController.showAdminUserDialog(oItem);
					}
				}
			});

			oView.oAdminUserDelete = new sap.m.OverflowToolbarButton({
				icon: "sap-icon://delete",
				text: "Delete",
				tooltip: "Delete",
				enabled: false,
				press: function(oEvent) {
					let oItem = viewUtils.getSelectedItemFromTable(oView.oAdminUserTable);
					if (oItem) {
						sap.m.MessageBox.confirm(`Do you really want to delete "${oItem.sFirstName} ${oItem.sLastName}"?`, {
							icon: sap.m.MessageBox.Icon.WARNING,
							title: "Really delete User?",
							actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
							onClose: function(oAction) {
								if (oAction == sap.m.MessageBox.Action.YES) {
									oWebservice.deleteAdminUser("Deleting User...", oItem.iUserId, function(oResponse) {
										if (oResponse && !oResponse.bError) {
											viewUtils.deleteTableItemByKeyAndValue(oView.oAdminUserTable, "iUserId", oItem.iUserId);
											sap.m.MessageToast.show("Deleting User successfull");
											oView.oAdminUserUpdate.setEnabled(false);
											oView.oAdminUserDelete.setEnabled(false);
											oView.oAdminUserSetActive.setEnabled(false);
											oView.oAdminUserTab.setCount(parseInt(oView.oAdminUserTab.getCount(), 10)-1);
										} else {
											sap.m.MessageToast.show("Error trying to delete User");
										}
									});
								}
							}
						});
					}
				}
			});

			oView.oAdminUserSetActive = new sap.m.OverflowToolbarButton({
				icon: "sap-icon://citizen-connect",
				text: "Set as active",
				tooltip: "Set as active",
				enabled: false,
				press: function(oEvent) {
					let oItem = viewUtils.getSelectedItemFromTable(oView.oAdminUserTable);
					if (oItem) {
						sap.m.MessageBox.confirm(`Set "${oItem.sFirstName} ${oItem.sLastName}" as active User?`, {
							icon: sap.m.MessageBox.Icon.WARNING,
							title: "Change active User",
							actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
							onClose: function(oAction) {
								if (oAction == sap.m.MessageBox.Action.YES) {
									oWebservice.setAdminActiveUser("Changing active User...", oItem.iUserId, function(oResponse) {
										if (oResponse && !oResponse.bError) {
											sap.m.MessageToast.show("Changing User successfull");
											oView.oAdminUserUpdate.setEnabled(false);
											oView.oAdminUserDelete.setEnabled(false);
											oView.oAdminUserSetActive.setEnabled(false);
											location.reload();
										} else {
											sap.m.MessageToast.show("Error trying to change active User");
										}
									});
								}
							}
						});
					}
				}
			});

			oView.oAdminUserToolBar.addContent(new sap.m.ToolbarSpacer({}));
			oView.oAdminUserToolBar.addContent(oView.oAdminUserAdd);
			oView.oAdminUserToolBar.addContent(oView.oAdminUserUpdate);
			oView.oAdminUserToolBar.addContent(oView.oAdminUserDelete);
			oView.oAdminUserToolBar.addContent(oView.oAdminUserSetActive);

			oView.oAdminUserTable = new sap.m.Table({
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
							text: "Login-Name"
						})
					})
				],
				mode: sap.m.ListMode.SingleSelectMaster,
				selectionChange: function(oEvent) {
					let oItem = viewUtils.getSelectedItemFromTable(oView.oAdminUserTable);
					if (oItem) {
						oView.oAdminUserUpdate.setEnabled(true);
						oView.oAdminUserDelete.setEnabled(true);
						oView.oAdminUserSetActive.setEnabled(!oItem.bIsActive);
					}
				}
			}).bindAggregation("items", "/", new sap.m.ColumnListItem({
				vAlign: sap.ui.core.VerticalAlign.Middle,
				cells: [
					new sap.m.Text({
						text: {
							path: "iUserId"
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
				]
			}));

			oView.oAdminUserTab.addContent(oView.oAdminUserToolBar);
			oView.oAdminUserTab.addContent(oView.oAdminUserTable);

			oView.oAdminTabBar.addItem(oView.oAdminUserTab);

			/*
				Buttons
			 */
			oView.btnAdminClose = new sap.m.Button({
				text: "Close",
				icon: "sap-icon://sys-cancel-2",
				press: function(oEvent) {
					oView.oAdminPanel.close();
					oView.oAdminUserUpdate.setEnabled(false);
					oView.oAdminUserDelete.setEnabled(false);
					oView.oAdminUserSetActive.setEnabled(false);
				}
			});

			oAdminPanel.addButton(oView.btnAdminClose);

			// oView.btnCloseAdminPanel = new sap.m.Button({
			// 	text: "Close",
			// 	icon: "sap-icon://sys-cancel-2",
			// 	press: function(oEvent) {
			// 		oView.oAdminPanel.close();
			// 	}
			// });

			// oView.oUserTab = new sap.m.IconTabFilter({
			// 	icon: "sap-icon://employee",
			// 	key: "user",
			// 	content: [
			// 		oView.oUserTable
			// 	]
			// });

			// oView.oIconTabBar = new sap.m.IconTabBar({
			// 	width: "100%",
			// 	stretchContentHeight: true,
			// 	items: [
			// 		oView.oUserTab,
			// 		oView.oAccountsTab,
			// 		oView.oBookingsTab
			// 	]
			// }).attachSelect(function(oEvent) {
			// 	let sKey = oEvent.getParameters().key;
			// 	oView.oUserTable.removeSelections();
			// 	oView.btnUserAdd.setVisible(false);
			// 	oView.btnUserDelete.setVisible(false);
			// 	oView.btnAccountAdd.setVisible(false);
			// 	oView.btnBookingAdd.setVisible(false);
			// 	switch (sKey) {
			// 		case "user":
			// 			oView.btnUserAdd.setVisible(true);
			// 			break;
			// 		case "accounts":
			// 			oView.btnAccountAdd.setVisible(true);
			// 			break;
			// 		case "bookings":
			// 			oView.btnBookingAdd.setVisible(true);
			// 			break;
			// 		default:
			// 			break;
			// 	}
			// });

			// oView.oUserTable = new sap.m.Table({
			// 	columns: [
			// 		new sap.m.Column({
			// 			header: new sap.m.Label({
			// 				text: "ID"
			// 			})
			// 		}),
			// 		new sap.m.Column({
			// 			header: new sap.m.Label({
			// 				text: "Firstname"
			// 			})
			// 		}),
			// 		new sap.m.Column({
			// 			header: new sap.m.Label({
			// 				text: "Lastname"
			// 			}),
			// 		}),
			// 		new sap.m.Column({
			// 			header: new sap.m.Label({
			// 				text: "Login Name"
			// 			})
			// 		})
			// 	],
			// 	mode: sap.m.ListMode.SingleSelectMaster,
			// 	selectionChange: function(oEvent) {
			// 		console.log(oView.oUserTable.indexOfItem(oView.oUserTable.getSelectedItem()));
			// 		let oItem = oView.oUserTable.getSelectedItem();
			// 		if (oItem) {
			// 			oView.btnUserDelete.setVisible(true);
			// 		}
			// 	}
			// }).bindAggregation("items", "/", new sap.m.ColumnListItem({
			// 	cells: [
			// 		new sap.m.Text({
			// 			text: {
			// 				path: "sUserId"
			// 			}
			// 		}),
			// 		new sap.m.Text({
			// 			text: {
			// 				path: "sFirstName"
			// 			}
			// 		}),
			// 		new sap.m.Text({
			// 			text: {
			// 				path: "sLastName"
			// 			}
			// 		}),
			// 		new sap.m.Text({
			// 			text: {
			// 				path: "sLoginName"
			// 			}
			// 		})
			// 	],
			// 	vAlign: sap.ui.core.VerticalAlign.Middle
			// }));
			//
			// oView.oUserTab = new sap.m.IconTabFilter({
			// 	icon: "sap-icon://employee",
			// 	key: "user",
			// 	content: [
			// 		oView.oUserTable
			// 	]
			// });
			// oView.oAccountsTab = new sap.m.IconTabFilter({
			// 	icon: "sap-icon://contacts",
			// 	key: "accounts"
			// });
			// oView.oBookingsTab = new sap.m.IconTabFilter({
			// 	icon: "sap-icon://bar-code",
			// 	key: "bookings"
			// });
			// oView.oIconTabBar = new sap.m.IconTabBar({
			// 	width: "100%",
			// 	stretchContentHeight: true,
			// 	items: [
			// 		oView.oUserTab,
			// 		oView.oAccountsTab,
			// 		oView.oBookingsTab
			// 	]
			// }).attachSelect(function(oEvent) {
			// 	let sKey = oEvent.getParameters().key;
			// 	oView.oUserTable.removeSelections();
			// 	oView.btnUserAdd.setVisible(false);
			// 	oView.btnUserDelete.setVisible(false);
			// 	oView.btnAccountAdd.setVisible(false);
			// 	oView.btnBookingAdd.setVisible(false);
			// 	switch (sKey) {
			// 		case "user":
			// 			oView.btnUserAdd.setVisible(true);
			// 			break;
			// 		case "accounts":
			// 			oView.btnAccountAdd.setVisible(true);
			// 			break;
			// 		case "bookings":
			// 			oView.btnBookingAdd.setVisible(true);
			// 			break;
			// 		default:
			// 			break;
			// 	}
			// });
			//
			// oView.btnUserAdd = new sap.m.Button({
			// 	icon: "sap-icon://add",
			// 	text: "Add User",
			// 	visible: true,
			// 	press: function (oEvent) {
			// 		oController.showUserAddDialog(oEvent);
			// 	}
			// });
			// oView.btnUserDelete = new sap.m.Button({
			// 	icon: "sap-icon://decline",
			// 	text: "Delete User",
			// 	visible: false,
			// 	press: function (oEvent) {
			// 		// oController.showUserAddDialog(oEvent);
			// 		let oItem = viewUtils.getSelectedItemFromTable(oView.oUserTable);
			// 		oWebservice.deleteUser("Deleting User...", function(oResponse) {
			// 			if (oResponse && oResponse.bDeleteSuccess) {
			// 				sap.m.MessageToast.show("User deleted successfully.", {});
			// 				oView.btnUserDelete.setVisible(false);
			// 				oController.getAdminPanelOverview();
			// 			}
			// 		}, function() {
			// 			let oDialog = new sap.m.Dialog({
			// 				title: oBundle.getText("std.error.occurred"),
			// 				type: "Message",
			// 				state: "Error",
			// 				content: new sap.m.Text({
			// 					text: "Beim Löschen der Daten ist ein Fehler aufgetreten"
			// 				}),
			// 				beginButton: new sap.m.Button({
			// 					text: oBundle.getText("std.ok"),
			// 					press: function() {
			// 						oDialog.close();
			// 					}
			// 				}),
			// 				afterClose: function() {
			// 					oDialog.destroy();
			// 				}
			// 			});
			// 			oDialog.open();
			// 		}, {
			// 			"sUserId": oItem.sUserId
			// 		});
			// 	}
			// });
			// oView.btnAccountAdd = new sap.m.Button({
			// 	icon: "sap-icon://add",
			// 	text: "Add Account",
			// 	visible: false,
			// 	press: function (oEvent) {
			//
			// 	}
			// });
			// oView.btnBookingAdd = new sap.m.Button({
			// 	icon: "sap-icon://add",
			// 	text: "Add Booking",
			// 	visible: false,
			// 	press: function (oEvent) {
			// 		let oBookingDate = new Date();
			// 		let sBookingDate = viewUtils.formatDateToBackendString(oBookingDate);
			//
			// 		oWebservice.setBooking("Generating random Booking...", 1, 1, 1, sBookingDate, 1, "Monatsgehalt", 714.12, function(oResponse) {
			// 			console.log(oResponse);
			// 			if (oResponse && !oResponse.bError) {
			// 				sap.m.MessageToast.show("Booking saved successfully", {});
			// 			} else {
			// 				sap.m.MessageToast.show("Error saving booking", {});
			// 			}
			// 		});
			//
			// 		// let oStartDate = new Date("2016", "01", "01"), oEndDate = new Date();
			// 		// let sStartDate = oStartDate.toJSON(), sEndDate = oEndDate.toJSON();
			// 		// oWebservice.getBookings("Loading Bookings...", function(oResponse) {
			// 		// 	console.log(oResponse);
			// 		// }, sStartDate, sEndDate);
			// 	}
			// });

			// oAdminPanel.addButton(oView.btnUserAdd);
			// oAdminPanel.addButton(oView.btnUserDelete);
			// oAdminPanel.addButton(oView.btnAccountAdd);
			// oAdminPanel.addButton(oView.btnBookingAdd);
			// oAdminPanel.addButton(oView.btnCloseAdminPanel);
			// // oAdminPanel.addButton(new sap.m.Button({
			// // 	text: "Close",
			// // 	icon: "sap-icon://sys-cancel-2",
			// // 	press: function(oEvent) {
			// // 		oView.oAdminPanel.close();
			// // 	}
			// // }));

			oAdminPanel.addContent(oView.oAdminTabBar);

			return oAdminPanel;
		},

		showAdminUserDialog: function(oItem) {
			const oController = this;
			const oView = oController.getView();

			let oAdminUserDialog = new sap.m.Dialog({
				title: oItem ? "Update User" : "Add User",
				contentWidth: "640px", // as wide as shell
				stretch: !!sap.ui.Device.system.phone
			});

			let fnAdminUserCheck = function() {
				let sFirstName = inpFirstName.getValue();
				let sLastName = inpLastName.getValue();
				let sLoginName = inpLoginName.getValue();

				if (sFirstName !== "" && sLastName !== "" && sLoginName !== "") {
					btnAdminUserSave.setEnabled(true);
				} else {
					btnAdminUserSave.setEnabled(false);
				}
			};

			let inpFirstName = new sap.m.Input({
				value: oItem ? oItem.sFirstName : "",
				liveChange: function(oEvent) {
					fnAdminUserCheck();
				}
			});
			let oFirstNameElement = new sap.ui.layout.form.FormElement({
				label: "First Name",
				fields: [ inpFirstName ]
			});

			let inpLastName = new sap.m.Input({
				value: oItem ? oItem.sLastName : "",
				liveChange: function(oEvent) {
					fnAdminUserCheck();
				}
			});
			let oLastNameElement = new sap.ui.layout.form.FormElement({
				label: "Last Name",
				fields: [ inpLastName ]
			});

			let inpLoginName = new sap.m.Input({
				value: oItem ? oItem.sLoginName : "",
				liveChange: function(oEvent) {
					fnAdminUserCheck();
				}
			});
			let oLoginNameElement = new sap.ui.layout.form.FormElement({
				label: "Login-Name",
				fields: [ inpLoginName ]
			});

			let oAdminUserContainer = new sap.ui.layout.form.FormContainer({
				expanded: true,
				formElements: [
					oFirstNameElement,
					oLastNameElement,
					oLoginNameElement
				]
			});

			let oAdminUserForm = new sap.ui.layout.form.Form({
				editable: true,
				formContainers: [ oAdminUserContainer ],
				height: "100%",
				layout: new sap.ui.layout.form.ResponsiveGridLayout({
					breakpointXL: 1000,
					breakpointL: 700,
					breakpointM: 300
				})
			}).addStyleClass("marginMinus1Rem");

			let btnAdminUserSave = new sap.m.Button({
				text: "Save",
				icon: "sap-icon://save",
				enabled: false,
				press: function(oEvent) {
					let sFirstName = inpFirstName.getValue();
					let sLastName = inpLastName.getValue();
					let sLoginName = inpLoginName.getValue();
					let iUserId;
					if (oItem) {
						iUserId = oItem.iUserId;
					}
					// let iUserId = oItem.iUserId || undefined;

					if (sFirstName !== "" && sLastName !== "" && sLoginName !== "") {
						oWebservice.setAdminUser("Saving User...", iUserId, sFirstName, sLastName, sLoginName, function(oResponse) {
							if (oResponse && !oResponse.bError) {
								sap.m.MessageToast.show(`Saving User successfull`);

								if (!oItem) {
									let oTableData = oView.oAdminUserTable.getModel().getData();
									let oNewItem = {};
									oNewItem["sFirstName"] = sFirstName;
									oNewItem["sLastName"] = sLastName;
									oNewItem["sLoginName"] = sLoginName;
									oNewItem["iUserId"] = oResponse.iUserId;

									oTableData.push(oNewItem);

									let oNewData = new sap.ui.model.json.JSONModel();
									oNewData.setData(oTableData);
									oView.oAdminUserTable.setModel(oNewData);

									oView.oAdminUserTab.setCount(parseInt(oView.oAdminUserTab.getCount(), 10)+1);

									oAdminUserDialog.close();
								} else {
									// viewUtils.deleteTableItemByKeyAndValue(oView.oAdminUserTable, "iUserId", oItem.iUserId);
									// let oTableData = oView.oAdminUserTable.getModel().getData();
									let oNewItem = {};
									oNewItem["sFirstName"] = sFirstName;
									oNewItem["sLastName"] = sLastName;
									oNewItem["sLoginName"] = sLoginName;
									oNewItem["iUserId"] = oItem.iUserId;

									viewUtils.updateTableItemByKeyAndValue(oView.oAdminUserTable, "iUserId", oItem.iUserId, oNewItem);

									// oTableData.push(oNewItem);
									//
									// let oNewData = new sap.ui.model.json.JSONModel();
									// oNewData.setData(oTableData);
									// oView.oAdminUserTable.setModel(oNewData);

									oAdminUserDialog.close();
								}

								oView.oAdminUserUpdate.setEnabled(false);
								oView.oAdminUserDelete.setEnabled(false);
								oView.oAdminUserSetActive.setEnabled(false);
							} else {
								sap.m.MessageToast.show(`Error saving User. Please try again`);
							}
						});
					}
				}
			});

			let btnAdminUserClose = new sap.m.Button({
				text: "Close",
				icon: "sap-icon://sys-cancel-2",
				press: function(oEvent) {
					oAdminUserDialog.close();
					oAdminUserDialog.destroy();
				}
			});

			oAdminUserDialog.addButton(btnAdminUserSave);
			oAdminUserDialog.addButton(btnAdminUserClose);
			oAdminUserDialog.addContent(oAdminUserForm);

			oAdminUserDialog.open();
		},

		getAdminPanelOverview: function() {
			const oContoller = this;
			const oView = oContoller.getView();

			oWebservice.getAdminUsers("Loading users...", function(oResponse) {
				if (oResponse && !oResponse.bError) {
					let oUserModel = new sap.ui.model.json.JSONModel();
					oUserModel.setData(oResponse.aUser);
					oView.oAdminUserTable.setModel(oUserModel);
					oView.oAdminUserTab.setCount(oResponse.aUser.length);
				} else {
					sap.m.MessageToast.show("Unable to load data");
				}
			});

			// oWebservice.admin_getUsers("Loading user data...", function(oResponse) {
			// 	if (oResponse && !oResponse.bError) {
			// 		// oView.oUserTab.setCount(oResponse.aCounts[0].sUserCount);
			// 		// oView.oAccountsTab.setCount(oResponse.aCounts[0].sAccountsCount);
			// 		// oView.oBookingsTab.setCount(oResponse.aCounts[0].sBookingsCount);
			// 		// oWebservice.getUserData("Loading User informations...", function(oUserResponse) {
			// 		// 	let oUserModel = new sap.ui.model.json.JSONModel();
			// 		// 	oUserModel.setData(oUserResponse);
			// 		// 	oView.oUserTable.setModel(oUserModel);
			// 		// });
			//
			// 		let oUserModel = new sap.ui.model.json.JSONModel();
			// 		oUserModel.setData(oResponse);
			// 		oView.oUserTable.setModel(oUserModel);
			// 	}
			// });

			// oWebservice.getAdminPanelOverview("Loading overview data...", function(oResponse) {
			// 	if (oResponse && !oResponse.bError) {
			// 		oView.oUserTab.setCount(oResponse.aCounts[0].sUserCount);
			// 		oView.oAccountsTab.setCount(oResponse.aCounts[0].sAccountsCount);
			// 		oView.oBookingsTab.setCount(oResponse.aCounts[0].sBookingsCount);
			// 		oWebservice.getUserData("Loading User informations...", function(oUserResponse) {
			// 			let oUserModel = new sap.ui.model.json.JSONModel();
			// 			oUserModel.setData(oUserResponse);
			// 			oView.oUserTable.setModel(oUserModel);
			// 		});
			// 	}
			// });
		},

		showBookingAddDialog: function(oEvent) {
			const oController = this;
			const oView = oController.getView();

			// let oAccountId = new sap.m.Input({ value: "1" });
			// let oBookingCategory = new sap.m.Input({ value: "1" });
			// let oBookingType = new
		},

		saveBooking: function(oEvent) {
			const oController = this;
			const oView = oController.getView();

			let iType = (oView.oBookingTypeComboBox.getSelectedKey() === "income") ? 0 : 1;
			let iAccountId = oView.oAccountComboBox.getSelectedKey();
			let sBookingDate = viewUtils.formatDateToBackendString(oView.oBookingDatePicker.getDateValue());
			let sFrequencyKey = oView.oBookingFrequencyComboBox.getSelectedKey();
			let iFrequency = -1;
			switch(sFrequencyKey) {
				case "unique":
					iFrequency = 0;
					break;
				case "daily":
					iFrequency = 1;
					break;
				case "weekly":
					iFrequency = 2;
					break;
				case "monthly":
					iFrequency = 3;
					break;
				default:
					break;
			}
			let iBookingCategoryId = oView.oCategoryComboBox.getSelectedKey();
			let fBookingValue = 0.0;
			fBookingValue = parseFloat(oView.oValueInput.getValue()); // don't use toFixed(2), as it returns string
			let sBookingDescription = oView.oTextArea.getValue();

			if (typeof fBookingValue !== "number" || fBookingValue === NaN) {
				// TODO: fox check, this one isn't working
				// fBookingValue false
				console.log("fBookingValue false!");
			}
			console.log(iType);
			console.log(iAccountId);
			console.log(sBookingDate);
			console.log(iFrequency);
			console.log(iBookingCategoryId);
			console.log(fBookingValue + " ... " + typeof fBookingValue);
			console.log(sBookingDescription);
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