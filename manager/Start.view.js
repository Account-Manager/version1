(function() {
	"use strict";
	sap.ui.jsview("manager.Start", {
		getControllerName: function() { // default OpenUI5 function
			return "manager.Start";
		},
		
		createContent: function(oController) { // default OpenUI5 function
            const oView = this;
			console.log("View called!");

            // ********** buttons **********

			const btnCancel = sap.m.Button({
                text: oBundle.getText("std.cancel"),
                press: function() {
                    this.getParent().close();
                }
            });

            const btnBookingAdd = new sap.m.Button({
                text: oBundle.getText("std.add"),
                icon: "sap-icon://add",
                press: function() {
                    oBookingCreateDialog.open();
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

            // ********** booking create/edit dialog ********** // TODO: edit function

			const oCategoryComboBox = new sap.m.ComboBox({
				items: [
					new sap.ui.core.Item({
						key: "general",
						text: "General" // TODO: translation
					}),
					new sap.ui.core.Item({
						key: "food",
						text: "Food" // TODO: translation
					}),
                    //TODO add-category function
				],
				selectedKey: "general"
			});
			let oCategoryFormElement = new sap.ui.layout.form.FormElement({
				label: oBundle.getText("std.category"),
				fields: [ oCategoryComboBox ]
			});

			const oBookingDatePicker = new sap.m.DatePicker({
				// TODO: initializing etc
				dateValue: new Date(),
				maxDate: new Date() // recording a booking in the future isn't possible
			});
			let oDateFormElement = new sap.ui.layout.form.FormElement({
				label: oBundle.getText("std.date"),
				fields: [ oBookingDatePicker ]
			});

			const oValueInput = new sap.m.Input({
				// TODO: initializing etc
			});
			let oValueFormElement = new sap.ui.layout.form.FormElement({
				label: new sap.m.Label({
                    text: oBundle.getText("std.value"),
                    design: sap.m.LabelDesign.Bold,
                }),
				fields: [ oValueInput ]
			});

			const oTextArea = new sap.m.TextArea({
				placeholder: oBundle.getText("std.description")
			});
			let oDescriptionFormElement = new sap.ui.layout.form.FormElement({
				fields: [ oTextArea ]
			});

			let oBookingFormContainer = new sap.ui.layout.form.FormContainer({
				expanded: true,
				formElements: [
					oCategoryFormElement,
					oDateFormElement,
					oValueFormElement,
					oDescriptionFormElement
				]
			});

			let oBookingForm = new sap.ui.layout.form.Form({
				editable: true,
				formContainers: [ oBookingFormContainer ],
				layout: new sap.ui.layout.form.GridLayout({
					// TODO: layout optimization
				})
			}).addStyleClass("marginMinus1Rem");

            // TODO: replace content with Form? uses auto-align etc
            const oBookingCreateDialog = new sap.m.Dialog({
                title: "Add a booking", // TODO: translation
                content: [ oBookingForm ],
                contentWidth: "300px",
                endButton: btnCancel
            });

            // ********** header **********

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

            oView.oFilterAccount = new sap.m.ComboBox({
                items: [
                    new sap.ui.core.Item({
                        key: "all",
                        text: oBundle.getText("filter.account.all")
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

            oView.oFilterAccount.attachBrowserEvent(
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
                    oView.oFilterAccount
                ]
            });

            oView.oHeaderPanel = new sap.m.Panel({
                content: [
                    oHeaderInfo,
                    oHeaderToolBar
                ]
            }).addStyleClass("sapUiNoContentPadding");

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