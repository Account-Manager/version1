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