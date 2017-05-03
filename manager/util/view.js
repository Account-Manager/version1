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

    manager.util.View.prototype.formatDateToBackendString = function(oDate) {
        if (oDate && typeof oDate === "object") {
            let oDateFormatter = new sap.ui.core.format.DateFormat();
            oDateFormatter.format(oDate);
        }
    }
})();