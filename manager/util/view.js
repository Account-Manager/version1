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
            let sDate = oDate.getFullYear() + "-";
            let sMonth = oDate.getMonth() + 1;
			sMonth = sMonth > 9 ? sMonth : "0" + sMonth;
			let sDay = oDate.getDay();
            sDay = sDay > 9 ? sDay : "0" + sDay;
            sDate = sDate + sMonth + "-" + sMonth + " " + oDate.getHours() + ":" + oDate.getMinutes() + ":" + oDate.getSeconds();
            return sDate;
        }
    }
})();