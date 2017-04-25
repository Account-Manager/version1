(function() {
	"use strict";
	sap.ui.jsview("manager.start", {
		getControllerName: function() { // default OpenUI5 function
			return "manager.start";
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

            const btnAdd = new sap.m.Button({
                text: oBundle.getText("std.add"),
                icon: "sap-icon://add",
                press: function() {
                    oBookingCreateDialog.open();
                }
            });

            const btnEdit = new sap.m.Button({
                text: oBundle.getText("std.edit"),
                enabled: false,
                icon: "sap-icon://edit"
            });

            const btnDelete = new sap.m.Button({
                text: oBundle.getText("std.delete"),
                enabled: false,
                icon: "sap-icon://delete",
                press: function() {
                    oController.handleDeleteTableItem();
                }
            });

            // ********** booking create/edit dialog ********** // TODO: edit function

			const oTextAreaComment = new sap.m.TextArea({
                value: "Test data",
                // height: "100px"
            });

            const oCategoryComboBox = new sap.m.ComboBox({
                items: [
                    new sap.ui.core.Item({
                        key: "general",
                        text: "General"
                    }),
                    new sap.ui.core.Item({
                        key: "food",
                        text: "Food"
                    }),
                    new sap.ui.core.Item({
                        key: "week",
                        text: "Week"
                    }),
                    new sap.ui.core.Item({
                        key: "category",
                        text: "Category"
                    })
                ],
                selectedKey: "general"
            });

            const oCategoryFlexBox = new sap.m.FlexBox({
                alignItems: sap.m.FlexAlignItems.Center,
                items: [
                    new sap.m.Label({ text: "Category" }), // TODO: add paddingRight
                    oCategoryComboBox
                ]
            });

            const oValueFlexBox = new sap.m.FlexBox({
                alignItems: sap.m.FlexAlignItems.Center,
                items: [
                    new sap.m.Label({ text: "Value" }), // TODO: add paddingRight
                    new sap.m.Input({ width: "5rem" }) // TODO: numbers only & auto format
                ]
            });

            const oBookingDatePicker = new sap.m.DatePicker({

            });

            const oDateFlexBox = new sap.m.FlexBox({
                alignItems: sap.m.FlexAlignItems.Center,
                items: [
                    new sap.m.Label({ text: "Date" }), // TODO: add paddingRight
                    oBookingDatePicker
                ]
            });

            // TODO: replace content with Form? uses auto-align etc
            const oBookingCreateDialog = new sap.m.Dialog({
                title: "Add a booking",
                content: [
                    oCategoryFlexBox,
                    oDateFlexBox,
                    oValueFlexBox,
                    oTextAreaComment
                ],
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
                        text: "All"
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
                    btnAdd,
                    btnEdit,
                    btnDelete
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
                noDataText: "empty table",
                selectionChange: function(oControlEvent) {
                    if(viewUtils.getSelectedItemFromTable(this)) {
                        btnEdit.setEnabled(true);
                        btnDelete.setEnabled(true);
                    } else {
                        btnEdit.setEnabled(false);
                        btnDelete.setEnabled(false);
                    }
                }
            });

            oView.oBookingTable.bindAggregation("items", "/", new sap.m.ColumnListItem({
                cells: oController.getBookingTableTemplate()
            }));

            oView.oBookingTable.setSelectedItem(oView.oBookingTable.getItems()[0]);

            // ********** general **********

            const oFooter = new sap.m.Bar({
                contentMiddle: [
                    new sap.m.Button({ text: "Impressum" }),
                    new sap.m.Text({ text: "© 2017" })
                ]
            });

            const oPage = new sap.m.Page(this.createId("page"), {
                title: "Account Manager",
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