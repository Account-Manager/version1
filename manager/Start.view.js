(function() {
	"use strict";
	sap.ui.jsview("manager.Start", {
		getControllerName: function() { // default OpenUI5 function
			return "manager.Start";
		},
		
		createContent: function(oController) { // default OpenUI5 function
			const oView = this;
			console.log("View called!");

			// ********** header **********

			oView.oAccountDataTable = new sap.m.Table({
				noDataText: oBundle.getText("std.noData"),
                columns: [
                    new sap.m.Column({
                        header: new sap.m.Label({
                            text: oBundle.getText("account.name")
                        })
                    }),
                    new sap.m.Column({
                        header: new sap.m.Label({
                            text: oBundle.getText("std.value")
                        })
                    })
                ],
                width: "20rem"
            });

			oView.oAccountDataTable.bindAggregation("items", "/", new sap.m.ColumnListItem({
				cells: oController.getAccountsTableTemplate(),
				vAlign: sap.ui.core.VerticalAlign.Middle
			}));

            const oAccountStats = new sap.m.Label({
                text: oBundle.getText("account.stats"),
                width: "100%"
            });

            const oHeaderInfo = new sap.m.FlexBox({
                justifyContent: sap.m.FlexJustifyContent.Begin,
                items: [
                    // oAccountStats,
                    oView.oAccountDataTable
                ]
            });

            // accountinfo moved to panel over booking table
			oView.oAccountsPanel = new sap.m.Panel({
				headerText: "Accounts",
				expandable: true,
				expanded: false,
				content: [ oHeaderInfo ]
			});

            const btnBookingAdd = new sap.m.Button({
                text: oBundle.getText("std.add"),
                icon: "sap-icon://add",
                press: function() {
                    oView.oBookingCreateDialog.open();
                }
            });

            const btnBookingEdit = new sap.m.Button({
                text: oBundle.getText("std.edit"),
                enabled: false,
                icon: "sap-icon://edit",
                press: function(oEvent) {
                    oController.handleEditBooking(oEvent);
                }
            });

            const btnBookingDelete = new sap.m.Button({
                text: oBundle.getText("std.delete"),
                enabled: false,
                icon: "sap-icon://delete",
                press: function() {
                    oController.handleDeleteTableItem(oView.oBookingTable);
                }
            });

            oView.oBookingTypeFilter = new sap.m.ComboBox({
                width: "10rem",
                items: [
                    new sap.ui.core.Item({
                        key: "all",
                        text: oBundle.getText("std.bookings.all")
                    }),
                    new sap.ui.core.Item({
                        key: "0",
                        text: oBundle.getText("booking.type.expense")
                    }),
                    new sap.ui.core.Item({
                        key: "1",
                        text: oBundle.getText("booking.type.income")
                    }),
                    new sap.ui.core.Item({
                        key: "2",
                        text: oBundle.getText("booking.type.transfer")
                    })
                ],
                selectedKey: "all",
                selectionChange: function() {
                    viewUtils.setSessionStorageComboBoxKey(this, "filterBookingTypeKey");
                    oController.handleFilterItems("iBookingType", oComboBox.getSelectedKey());
                }
            }).attachBrowserEvent(
                "focusout",function() {
                    if(this.getSelectedKey() === "") {
                        this.setSelectedKey(sessionStorage.filterBookingTypeKey)
                    }
                }
            );

            oView.oAccountFilter = new sap.m.ComboBox({
                    width: "10rem",
                items: [
                    new sap.ui.core.Item({
                        key: "all",
                        text: oBundle.getText("account.filter.all")
                    }),
                    new sap.ui.core.Item({
                        key: "giro",
                        text: "Giro account"
                    }),
                ],
                selectedKey: "all",
                selectionChange: function() {
                    viewUtils.setSessionStorageComboBoxKey(this, "filterAccountKey");
                    // oController.handleFilterItems("sAccountId", oComboBox.getSelectedKey()); TODO: set up filter
                }
            }).attachBrowserEvent(
                "focusout",function() {
                    if(this.getSelectedKey() === "") {
                        this.setSelectedKey(sessionStorage.filterAccountKey);
                    };
                }
            );

            oView.oFrequencyFilter = new sap.m.ComboBox({
                width: "10rem",
                items: [
                    new sap.ui.core.Item({
                        key: "all",
                        text: oBundle.getText("booking.frequency.all")
                    }),
                    new sap.ui.core.Item({
                        key: "0",
                        text: oBundle.getText("booking.frequency.unique")
                    }),
                    new sap.ui.core.Item({
                        key: "1",
                        text: oBundle.getText("booking.frequency.weekly")
                    }),
                    new sap.ui.core.Item({
                        key: "2",
                        text: oBundle.getText("booking.frequency.monthly")
                    })
                ],
                selectedKey: "all",
                selectionChange: function() {
                    viewUtils.setSessionStorageComboBoxKey(this, "filterFrequencyKey");
                    oController.handleFilterItems("iBookingFrequency", oComboBox.getSelectedKey());
                }
            }).attachBrowserEvent(
                "focusout",function() {
                    if(this.getSelectedKey() === "") {
                        this.setSelectedKey(sessionStorage.filterFrequencyKey);
                    };
                }
            );

            oView.oPeriodFilter = new sap.m.ComboBox({
                width: "12rem",
                items: [
                    new sap.ui.core.Item({
                        key: "all",
                        text: oBundle.getText("period.all")
                    }),
                    new sap.ui.core.Item({
                        key: "currentMonth",
                        text: oBundle.getText("period.current.month")
                    }),
                    new sap.ui.core.Item({
                        key: "lastMonth",
                        text: oBundle.getText("period.last.month")
                    }),
                    new sap.ui.core.Item({
                        key: "previousMonth",
                        text: oBundle.getText("period.next.month")
                    })
                ],
                selectedKey: "all",
                selectionChange: function() {
                    viewUtils.setSessionStorageComboBoxKey(this, "filterPeriodKey");
                    //oController.handleFilterItems("BookingPeriod", oComboBox.getSelectedKey()); TODO: custom filter which calculates the period
                }
            }).attachBrowserEvent(
                "focusout",function() {
                    if(this.getSelectedKey() === "") {
                        this.setSelectedKey(sessionStorage.filterPeriodKey);
                    };
                }
            );

            const btnResetFilters = new sap.m.Button({
                tooltip: oBundle.getText("std.filter.reset"),
                icon: "sap-icon://reset",
                press: function() {
                    oController.handleResetFilters();
                }
            });

            const oOverflowToolbar = new sap.m.OverflowToolbar({
                content: [
                    btnBookingAdd,
                    btnBookingEdit,
                    btnBookingDelete,
                    oView.oBookingTypeFilter,
                    oView.oAccountFilter,
                    oView.oFrequencyFilter,
                    oView.oPeriodFilter,
                    btnResetFilters
                ]
            });

            const oHeaderToolBar = new sap.m.Bar({
                contentLeft: [
                    oOverflowToolbar
                ]
            });

            oView.oHeaderPanel = new sap.m.Panel({
                content: [
					oView.oAccountsPanel,
                    // oHeaderInfo,
                    oHeaderToolBar
                ]
            }).addStyleClass("sapUiNoContentPadding");

            window.addEventListener('resize', fnResizeButtonTexts);

            function fnResizeButtonTexts() {
                if(window.innerWidth < 440) {
                    btnBookingAdd.setText();
                    btnBookingEdit.setText();
                    btnBookingDelete.setText();
                } else if(window.innerWidth > 440) {
                    btnBookingAdd.setText(oBundle.getText("std.add"));
                    btnBookingEdit.setText(oBundle.getText("std.edit"));
                    btnBookingDelete.setText(oBundle.getText("std.delete"));
                }
            };

            // ********** booking create/edit dialog ********** // TODO: edit function

            oView.bInputAlready = false;

			oView.oBookingTypeComboBox = new sap.m.ComboBox({
                tooltip: oBundle.getText("booking.type.select"),
                items: [
                    new sap.ui.core.Item({
                        key: "income",
                        text: oBundle.getText("booking.type.income")
                    }),
                    new sap.ui.core.Item({
                        key: "expense",
                        text: oBundle.getText("booking.type.expense")
                    }),
                ],
                selectionChange: function(){
                    oView.bInputAlready = true;
                    viewUtils.setSessionStorageComboBoxKey(this, "bookingType");
                }
            }).attachBrowserEvent(
                "focusout",function() {
                    if(this.getSelectedKey() === "") {
                        this.setSelectedKey(sessionStorage.bookingType);
                    };
                }
            );
            oView.oAccountComboBox = new sap.m.ComboBox({
                tooltip: oBundle.getText("account.select"),
                selectionChange: function(){
                    oView.bInputAlready = true;
                    viewUtils.setSessionStorageComboBoxKey(this, "bookingAccount");
                },
                layoutData: new sap.ui.layout.GridData({
                    span: "L6 M6 S6"
                })
            }).attachBrowserEvent(
                "focusout",function() {
                    if(this.getSelectedKey() === "") {
                        this.setSelectedKey(sessionStorage.bookingAccount);
                    };
                }
            );
            oView.oAccountAddButton = new sap.m.Button({
                tooltip: oBundle.getText("account.add"),
                icon: "sap-icon://add",
                press: function() {
                    oSettingsDialog.open();
                },
                layoutData: new sap.ui.layout.GridData({
                    span: "L2 M2 S2",
                })
            });
            let oAccountFormElement = new sap.ui.layout.form.FormElement({
                fields: [ oView.oBookingTypeComboBox, oView.oAccountComboBox, oView.oAccountAddButton ]
            });

            oView.oBookingFrequencyComboBox = new sap.m.ComboBox({
                tooltip: oBundle.getText("booking.frequency.select"),
                items: [
                    new sap.ui.core.Item({
                        key: "unique",
                        text: oBundle.getText("booking.frequency.unique")
                    }),
                    new sap.ui.core.Item({
                        key: "daily",
                        text: oBundle.getText("booking.frequency.daily")
                    }),
                    new sap.ui.core.Item({
                        key: "weekly",
                        text: oBundle.getText("booking.frequency.weekly")
                    }),
                    new sap.ui.core.Item({
                        key: "monthly",
                        text: oBundle.getText("booking.frequency.monthly")
                    }),
                ],
                selectionChange: function(){
                    oView.bInputAlready = true;
                    viewUtils.setSessionStorageComboBoxKey(this, "bookingFrequency");
                },
                layoutData: new sap.ui.layout.GridData({
                    span: "L5 M5 S5"
                })
            }).attachBrowserEvent(
                "focusout",function() {
                    if(this.getSelectedKey() === "") {
                        this.setSelectedKey(sessionStorage.bookingFrequency);
                    };
                }
            );
            oView.oBookingDatePicker = new sap.m.DatePicker({
                // TODO: initializing etc
                tooltip: oBundle.getText("date.select"),
                dateValue: new Date(),
                change: function(oEvent){
                    let bValid   = oEvent.getParameter("valid");
                    if(!bValid){
                        this.setValueState(sap.ui.core.ValueState.Error);
                    } else {
                        this.setValueState(sap.ui.core.ValueState.None);
                        oView.bInputAlready = true;
                    }
                }
            });

            let oDateFormElement = new sap.ui.layout.form.FormElement({
                fields: [ oView.oBookingDatePicker, oView.oBookingFrequencyComboBox ]
            });

            oView.oCategoryComboBox = new sap.m.ComboBox({
                tooltip: oBundle.getText("category.select"),
                // items: [
                //     new sap.ui.core.Item({
                //         key: "general",
                //         text: "General" // TODO: translation
                //     }),
                //     new sap.ui.core.Item({
                //         key: "food",
                //         text: "Food" // TODO: translation
                //     }),
                // ],
                selectionChange: function(){
                    oView.bInputAlready = true;
                    viewUtils.setSessionStorageComboBoxKey(this, "bookingCategory");
                },
            }).attachBrowserEvent(
                "focusout",function() {
                    if(this.getSelectedKey() === "") {
                        this.setSelectedKey(sessionStorage.bookingCategory);
                    };
                }
            );
            const oCategoryAddButton = new sap.m.Button({
                tooltip: oBundle.getText("category.add"),
                icon: "sap-icon://add",
                press: function() {
                    oAddCategoryDialog.open();
                },
                layoutData: new sap.ui.layout.GridData({
                    span: "L2 M2 S2",
                })
            });

            oView.oValueInput = new sap.m.Input({
                placeholder: oBundle.getText("std.value"),
                type: sap.m.InputType.Number,
                style: "bold",
                layoutData: new sap.ui.layout.GridData({
                    span: "L3 M3 S3"
                }),
                liveChange: function(){
                    oView.bInputAlready = true;
                },
            }).attachBrowserEvent(
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

            let oCategoryAndValueFormElement = new sap.ui.layout.form.FormElement({
                fields: [ oView.oCategoryComboBox, oCategoryAddButton, oView.oValueInput ]
            });

            oView.oTextArea = new sap.m.TextArea({
                placeholder: oBundle.getText("std.description"),
                liveChange: function(){
                    oView.bInputAlready = true;
                }
            });
            let oDescriptionFormElement = new sap.ui.layout.form.FormElement({
                fields: [ oView.oTextArea ]
            });

            let oBookingFormContainer = new sap.ui.layout.form.FormContainer({
                expanded: true,
                formElements: [
                    oAccountFormElement,
                    oDateFormElement,
                    oCategoryAndValueFormElement,
                    oDescriptionFormElement
                ]
            });

            let oBookingForm = new sap.ui.layout.form.Form({
                editable: true,
                formContainers: [ oBookingFormContainer ],
                layout: new sap.ui.layout.form.ResponsiveGridLayout({
                    breakpointXL: 1000,
                    breakpointL: 700,
                    breakpointM: 300
                })
            }).addStyleClass("marginMinus1Rem");

            const btnResetBooking = new sap.m.Button({
                text: oBundle.getText("std.reset"),
                press: function() {
                    if(oView.bInputAlready){
                        sap.m.MessageBox.confirm(oBundle.getText("booking.reset.question"), {
                            icon: sap.m.MessageBox.Icon.WARNING,
                            title: (oBundle.getText("booking.reset.title")),
                            actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
                            onClose: function(oAction) {
                                if (oAction == sap.m.MessageBox.Action.OK) {
                                    oController.initBookingCreateDialog();
                                }
                            }
                        });
                    }
                }
            });

            const btnCloseBooking = new sap.m.Button({
                text: oBundle.getText("std.close"),
                press: function() {
                    oView.oBookingCreateDialog.close();
                }
            });

            const btnSaveBooking = new sap.m.Button({
				text: oBundle.getText("booking.save"),
				press: function(oEvent) {
					oController.saveBooking(oEvent, oBookingFormContainer);
				}
			});

            // TODO: replace content with Form? uses auto-align etc
            oView.oBookingCreateDialog = new sap.m.Dialog({
                title: oBundle.getText("booking.add"), // TODO: translation
                content: [ oBookingForm ],
                contentWidth: "30%",
				stretch: !!sap.ui.Device.system.phone,
                buttons: [ btnSaveBooking, btnResetBooking, btnCloseBooking ]
            });

            // ********** content **********

            oView.oBookingTable = new sap.m.Table({
                columns: oController.getBookingTableColumns(),
                mode: sap.m.ListMode.SingleSelectMaster,
                noDataText: oBundle.getText("std.noData"),
                selectionChange: function(oControlEvent) {
                    if(viewUtils.getSelectedItemFromTable(this)) {
                        btnBookingEdit.setEnabled(true);
                        btnBookingDelete.setEnabled(true);
                    } else {
                        btnBookingEdit.setEnabled(false);
                        btnBookingDelete.setEnabled(false);
                    }
                }
            });

            oView.oBookingTable.bindAggregation("items", "/", new sap.m.ColumnListItem({
                cells: oController.getBookingTableTemplate(),
                vAlign: sap.ui.core.VerticalAlign.Middle
            }));

            oView.oBookingTable.setSelectedItem(oView.oBookingTable.getItems()[0]);

            // ********** add category dialog **********

            oView.oCategoryTable = new sap.m.Table({
                noDataText: oBundle.getText("std.noData"),
                columns: [
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
                            text: oBundle.getText("category.rubric")
                        })
                    }),
                    new sap.m.Column({
                        header: new sap.m.Label({
                            text: oBundle.getText("category.name")
                        })
                    }),
                ],
                mode: sap.m.ListMode.SingleSelectMaster,
                selectionChange: function(oEvent) {
                    //TODO
                }
            }).addStyleClass("sapUiNoContentPadding");

            const oCustomizingTabBar = new sap.m.IconTabBar({
                width: "100%",
                stretchContentHeight: true,
                items: [
                    new sap.m.IconTabFilter({
                        icon: "sap-icon://bullet-text",
                        text: oBundle.getText("customizing.categories"),
                        content: [ oView.oCategoryTable ]
                    }),
                    new sap.m.IconTabFilter({
                        icon: "sap-icon://cart-4",
                        text: oBundle.getText("customizing.accounts"),
                        content: []
                    })
                ]
            })

            const btnCustomzingCancel = new sap.m.Button({
                text: oBundle.getText("std.cancel"),
                press: function() {
                    this.getParent().close();
                }
            });

            const oAddCategoryDialog = new sap.m.Dialog({
                title: oBundle.getText("customizing.title"),
                content: [ oCustomizingTabBar ],
                contentWidth: "30%",
                contentHeight: "400px",
                buttons: [ btnCustomzingCancel ],
                stretch: !!sap.ui.Device.system.phone
            })

            // ********** general **********

			let oMenuItems = new sap.ui.unified.MenuItemBase({

			});

			let oMenu = new sap.ui.unified.Menu({
				items: [ oMenuItems ]
			});

            const oFooter = new sap.m.Bar({
                contentMiddle: [
                	new sap.m.Button({
						text: "Admin-Panel",
						icon: "sap-icon://key-user-settings",
						press: function(oEvent) {
							oView.oAdminPanel.open();
							oView.btnCloseAdminPanel.focus();
							oController.getAdminPanelOverview();
						}
					}),
                    new sap.m.Button({
						text: "Impressum"
                    }),
                    new sap.m.Text({ text: "© 2017" })
                ]
            });

            const oPage = new sap.m.Page(this.createId("page"), {
                title: oBundle.getText("std.title"),
                content: [
                    oView.oHeaderPanel,
                    oView.oBookingTable
                ],
                footer: oFooter
            });

            return oPage;
		}
	});
})();