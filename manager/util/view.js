(function() {
    "use strict";

    jQuery.sap.declare("manager.util.view");

    manager.util.View = function(){

    };

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
    }

	/**
	 * formats JS Date Object to string
	 *
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
    }
})();