(function() {
    "use strict";

    jQuery.sap.declare("manager.util.view");

    manager.util.View = function(){

    };

	/**
	 * returns the object from the binded model of the item selected in a table
	 * @param oTable
	 * @returns (object)
	 */
	manager.util.View.prototype.getSelectedItemFromTable = function(oTable) {
        if (oTable) {
            const oItem = oTable.getSelectedItem();
            if (oItem) {
                const sPath = oItem.getBindingContext().getPath();
                const oModel = oTable.getModel();
                const oObject = oModel.getProperty(sPath);
                return oObject;
            }
        }
    };

	manager.util.View.prototype.getIndexInTableModel = function(oTable, sKey, mValue) {
		if (oTable && sKey && mValue) {
			const oItem = this.getSelectedItemFromTable(oTable);
			const oModel = oTable.getModel();
			let oData = oModel.getData();
			let iIndexInTable = -1;
			oData.forEach(function(oElement, iIndex) {
				if (oElement[sKey] === mValue) {
					iIndexInTable = iIndex;
					return;
				}
			});
			return iIndexInTable;
		}
	};

	manager.util.View.prototype.setSessionStorageComboBoxKey = function(oComboBox, sTarget) {
        const sInputValue = oComboBox._getInputValue();
        oComboBox.getItems().forEach(function(item) {
            if(sInputValue === item.getText()) {
                sessionStorage[sTarget] = oComboBox.getSelectedKey();
            }
        });
	};

	manager.util.View.prototype.deleteTableItemByKeyAndValue = function(oTable, sKey, mValue) {
		if (oTable && sKey && mValue) {
			let oTableData = oTable.getModel().getData();
			let iIndexInTable = -1;
			oTableData.forEach(function(oElement, iIndex) {
				if (oElement[sKey] === mValue) {
					iIndexInTable = iIndex;
					return;
				}
			});
			if (iIndexInTable > -1) {
				oTableData.splice(iIndexInTable, 1);
				let oNewData = new sap.ui.model.json.JSONModel();
				oNewData.setData(oTableData);
				oTable.setModel(oNewData);
			}

			// let sIndexInModel = viewUtil.getIndexInTableModel(oTable);
			// let oTableModelData = oTable.getModel().getData();
			// oTableModelData.splice(sIndexInModel, 1);
			// let oNewTableData = new sap.ui.model.json.JSONModel();
			// oNewTableData.setData(oTableModelData);
			// oTable.setModel(oNewTableData);
		}
	};

	/**
	 * formats JS Date Object to string
	 * @param oDate
	 * @returns {string} {format: YYYY-MM-DD HH:mm:SS}
	 */
	manager.util.View.prototype.formatDateToBackendString = function(oDate) {
        if (oDate && typeof oDate === "object") {
        	let sYear = oDate.getFullYear();
        	let sMonth = oDate.getMonth() + 1;
			sMonth = sMonth > 9 ? sMonth : "0" + sMonth;
        	let sDay = oDate.getDate();
			sDay = sDay > 9 ? sDay : "0" + sDay;
			let sHours = oDate.getHours();
			sHours = sHours > 9 ? sHours : "0" + sHours;
			let sMinutes = oDate.getMinutes();
			sMinutes = sMinutes > 9 ? sMinutes : "0" + sMinutes;
			let sSeconds = oDate.getSeconds();
			sSeconds = sSeconds > 9 ? sSeconds : "0" + sSeconds;
        	return "" + sYear + "-" + sMonth + "-" + sDay +  " " + sHours + ":" + sMinutes + ":" + sSeconds;
        }
    };

	/**
	 * formats backend string JS Date Object
	 * @param sDate
	 * @returns {object} {format: depending on language}
	 */
	manager.util.View.prototype.formatBackendStringToFrontendDate = function(sDate) {
	    const oFormatOtions = { style: "medium" };
        const oLocale = new sap.ui.core.Locale(storage.getLanguage());
		const oDateFormat = sap.ui.core.format.DateFormat.getDateInstance(oFormatOtions, oLocale);
		return oDateFormat.format(new Date(sDate));
    };

	/**
	 * creates a JS Date Object from a date string
	 * @param sBackendString (format: YYYY-MM-DD HH:mm:SS)
	 * @returns {Date}
	 */
    manager.util.View.prototype.makeDateFromBackendString = function(sBackendString) {
		if (sBackendString && typeof sBackendString === "string" && sBackendString.length === 19) {
			return new Date(sBackendString.substring(0, 4), sBackendString.substring(5, 7) - 1, sBackendString.substring(8, 10), sBackendString.substring(11, 13), sBackendString.substring(14, 16), sBackendString.substring(17));
		}
	};
})();