sap.ui.define(["jquery.sap.global"],
    function(jQuery) {
        "use strict";

        jQuery.sap.declare("manager.extensions.Webservice");

        let oWebservice = manager.extensions.Webservice = function() {

        };

        oWebservice.prototype.execute = function(sLoadingText, sUrlPath, fnSuccessCallback, fnErrorCallback, oOptions, oParameters) {
            // initialize new JSON Model
            let oModel = new sap.ui.model.json.JSONModel();
            oOptions = oOptions || {};
            oParameters = oParameters || {};
			let bUsePost = oOptions.bUsePost || false;
			let bAsync = oOptions.bAsnyc || true;

            // check parameters
            if ((sLoadingText && sLoadingText) !== "" && (sUrlPath && sUrlPath !== "")) {
                // loading text AND urlpath must be typeof string and not empty
                // TODO: Add loading message

                if (fnSuccessCallback && typeof fnSuccessCallback === "function") {
                    // add success callback if success function is passed
                    oModel.attachRequestCompleted(function() {
                        fnSuccessCallback(this.getData());
                    });
                }
                if (fnErrorCallback && typeof fnErrorCallback === "function") {
                    // add error callback if error function is passed
                    oModel.attachRequestFailed(function() {
                        fnErrorCallback(); // TODO: pass oModel? oModel.getData()?
                    });
                }

                oModel.loadData(sUrlPath, oParameters, bAsync, bUsePost ? "POST" : "GET"); // TODO: add async and method variable
            }
        };

        oWebservice.prototype.getBookingExample = function(sLoadingText, fnSuccessCallback, fnErrorCallback) {
            let sUrlPath = "manager/res/data/bookingData.mock.json";

            this.execute(sLoadingText, sUrlPath, fnSuccessCallback, fnErrorCallback || null);
        };

        return oWebservice;
    }
);