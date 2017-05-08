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

            oView.oGroupingComboBox = new sap.m.ComboBox({
                items: [
                    new sap.ui.core.Item({
                        key: "noGrouping",
                        text: oBundle.getText("grouping.noGrouping")
                    }),
                    new sap.ui.core.Item({
                        key: "date",
                        text: oBundle.getText("std.date")
                    }),
                    new sap.ui.core.Item({
                        key: "week",
                        text: "Week"
                    }),
                    new sap.ui.core.Item({
                        key: "category",
                        text: oBundle.getText("std.category")
                    })
                ],
                selectedKey: "noGrouping",
                selectionChange: function() {
                    const sInputValue = this._getInputValue();
                    const oComboBox = this;
                    this.getItems().forEach(function(item) {
                        if(sInputValue === item.getText()) {
                            sessionStorage.groupingKey = oComboBox.getSelectedKey()
                        }
                    })
                }
            });

            oView.oGroupingComboBox.attachBrowserEvent(
                "focusout",function() {
                    if(this.getSelectedKey() === "") {
                        this.setSelectedKey(sessionStorage.groupingKey)
                    }
                }
            );

            oView.oAccountComboBox = new sap.m.ComboBox({
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
                    const sInputValue = this._getInputValue();
                    const oComboBox = this;
                    this.getItems().forEach(function(item) {
                        if(sInputValue === item.getText()) {
                            sessionStorage.filterAccountKey = oComboBox.getSelectedKey()
                        }
                    })
                }
            });

            oView.oAccountComboBox.attachBrowserEvent(
                "focusout",function() {
                    if(this.getSelectedKey() === "") {
                        this.setSelectedKey(sessionStorage.filterAccountKey);
                    };
                }
            );

            const oAccountDataTable = new sap.m.Table({
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

            const oAccountStats = new sap.m.Label({
                text: oBundle.getText("account.stats"),
                width: "100%"
            });

            const oHeaderInfo = new sap.m.FlexBox({
                justifyContent: sap.m.FlexJustifyContent.End,
                items: [
                    oAccountStats,
                    oAccountDataTable
                ]
            });

            const oHeaderToolBar = new sap.m.Bar({
                contentLeft: [
                    btnBookingAdd,
                    btnBookingEdit,
                    btnBookingDelete
                ],
                contentMiddle: [
                    oView.oGroupingComboBox,
                    oView.oAccountComboBox
                ]
            });

            oView.oHeaderPanel = new sap.m.Panel({
                content: [
                    oHeaderInfo,
                    oHeaderToolBar
                ]
            }).addStyleClass("sapUiNoContentPadding");

            // ********** booking create/edit dialog ********** // TODO: edit function

            oView.bInputAlready = false;

            const oBookingTypeComboBox = new sap.m.ComboBox({
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
                }
            });
            const oAccountComboBox = new sap.m.ComboBox({
                tooltip: oBundle.getText("account.select"),
                items: [
                    new sap.ui.core.Item({
                        key: "001",
                        text: "Giro" // TODO: translation
                    }),
                    new sap.ui.core.Item({
                        key: "002",
                        text: "PayPal" // TODO: translation
                    }),
                ],
                selectionChange: function(){
                    oView.bInputAlready = true;
                }
            });
            const oAccountAddButton = new sap.m.Button({
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
                fields: [ oBookingTypeComboBox, oAccountComboBox, oAccountAddButton ]
            });

            const oBookingFrequencyComboBox = new sap.m.ComboBox({
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
                },
                layoutData: new sap.ui.layout.GridData({
                    span: "L4 M4 S4"
                })
            });
            const oBookingDatePicker = new sap.m.DatePicker({
                // TODO: initializing etc
                tooltip: oBundle.getText("date.select"),
                dateValue: new Date(),
                change: function(){
                    oView.bInputAlready = true;
                }
            });
            let oDateFormElement = new sap.ui.layout.form.FormElement({
                fields: [ oBookingDatePicker, oBookingFrequencyComboBox ]
            });

            const oCategoryComboBox = new sap.m.ComboBox({
                tooltip: oBundle.getText("category.select"),
                items: [
                    new sap.ui.core.Item({
                        key: "general",
                        text: "General" // TODO: translation
                    }),
                    new sap.ui.core.Item({
                        key: "food",
                        text: "Food" // TODO: translation
                    }),
                ],
                selectionChange: function(){
                    oView.bInputAlready = true;
                }
            });
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

            const oValueInput = new sap.m.Input({
                placeholder: oBundle.getText("std.value"),
                type: sap.m.InputType.Number,
                layoutData: new sap.ui.layout.GridData({
                    span: "L4 M4 S4"
                }),
                liveChange: function(){
                    oView.bInputAlready = true;
                }
            });
            oValueInput.attachBrowserEvent(
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
                fields: [ oCategoryComboBox, oCategoryAddButton, oValueInput ]
            });

            const oTextArea = new sap.m.TextArea({
                placeholder: oBundle.getText("std.description"),
                liveChange: function(){
                    oView.bInputAlready = true;
                }
            });
            let oDescriptionFormElement = new sap.ui.layout.form.FormElement({
                fields: [ oTextArea ]
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

            // TODO: replace content with Form? uses auto-align etc
            oView.oBookingCreateDialog = new sap.m.Dialog({
                title: oBundle.getText("booking.add"), // TODO: translation
                content: [ oBookingForm ],
                contentWidth: "30%",
				stretch: !!sap.ui.Device.system.phone,
                buttons: [ btnResetBooking, btnCloseBooking ]
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

            const btnCategoryCancel = new sap.m.Button({
                text: oBundle.getText("std.cancel"),
                press: function() {
                    this.getParent().close();
                }
            });

            const oAddCategoryDialog = new sap.m.Dialog({
                title: "Add a category",
                content: [],
                contentWidth: "300px",
                endButton: btnCategoryCancel
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
						icon: "sap-icon://role",
						press: function(oEvent) {
							oView.oAdminPanel.open();
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