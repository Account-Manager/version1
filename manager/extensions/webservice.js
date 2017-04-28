sap.ui.define(["jquery.sap.global"],
    function(jQuery) {
        "use strict";

        jQuery.sap.declare("manager.extensions.Webservice");

        let oWebservice = manager.extensions.Webservice = function() {

        };

        oWebservice.prototype.execute = function(sLoadingText, sUrlPath, fnSuccessCallback, fnErrorCallback, oOptions, oParameters) {
        	const oLoadingDialog = new sap.m.BusyDialog({
				text: sLoadingText,
				title: oBundle.getText("std.loading")
			});

			oOptions = oOptions || {};
			if (!oOptions.bHideLoading) {
				oLoadingDialog.open();
			}

            // initialize new JSON Model
            let oModel = new sap.ui.model.json.JSONModel();
            oParameters = oParameters || {};
			let bUsePost = oOptions.bUsePost || false;
			let bAsync = oOptions.bAsnyc || true;

            // check parameters
            if ((sLoadingText && sLoadingText) !== "" && (sUrlPath && sUrlPath !== "")) {
                // loading text AND urlpath must be typeof string and not empty
				if (fnSuccessCallback && typeof fnSuccessCallback === "function") {
					// check if error callback has been passed aswell
					if (fnErrorCallback && typeof fnErrorCallback === "function") {
						oModel.attachRequestCompleted(function(oEvent) {
							// hide loading dialog
							if (!oOptions.bHideLoading) {
								oLoadingDialog.close();
							}
							if (oEvent.mParameters.success) {
								// call success callback function
								fnSuccessCallback(this.getData());
							} else {
								// call error callback function
								fnErrorCallback();
							}
						});
					} else {
						// no error callback function defined, show standard error message
						oModel.attachRequestCompleted(function(oEvent) {
							// hide loading dialog
							if (!oOptions.bHideLoading) {
								oLoadingDialog.close();
							}
							if (oEvent.mParameters.success) {
								// call success callback function
								fnSuccessCallback(this.getData());
							} else {
								// show error message
								let oDialog = new sap.m.Dialog({
									title: oBundle.getText("std.error.occurred"),
									type: "Message",
									state: "Error",
									content: new sap.m.Text({
										text: oBundle.getText("std.error.loading")
									}),
									beginButton: new sap.m.Button({
										text: oBundle.getText("std.ok"),
										press: function() {
											oDialog.close();
										}
									}),
									afterClose: function() {
										oDialog.destroy();
									}
								});
								oDialog.open();
							}
						});
					}
				} else if (fnErrorCallback && typeof fnErrorCallback === "function") {
					// only error callback supplied
					oModel.attachRequestCompleted(function(oEvent) {
						// hide loading dialog
						if (!oOptions.bHideLoading) {
							oLoadingDialog.close();
						}
						if (!oEvent.mParameters.success) {
							// call error callback function
							fnErrorCallback();
						}
					});
				} else {
					// no success and error callback functions supplied
					oModel.attachRequestCompleted(function(oEvent) {
						// hide loading dialog
						if (!oOptions.bHideLoading) {
							oLoadingDialog.close();
						}
						if (!oEvent.mParameters.success) {
							// show error message
							let oDialog = new sap.m.Dialog({
								title: oBundle.getText("std.error.occurred"),
								type: "Message",
								state: "Error",
								content: new sap.m.Text({
									text: oBundle.getText("std.error.loading")
								}),
								beginButton: new sap.m.Button({
									text: oBundle.getText("std.ok"),
									press: function() {
										oDialog.close();
									}
								}),
								afterClose: function() {
									oDialog.destroy();
								}
							});
							if (!oOptions.bHideLoading) {

								oLoadingDialog.close();
							}
							oDialog.open();
						}
					});
				}

                oModel.loadData(sUrlPath, oParameters, bAsync, bUsePost ? "POST" : "GET"); // TODO: add async and method variable
            }
        };

        oWebservice.prototype.getBookingExample = function(sLoadingText, fnSuccessCallback, fnErrorCallback) {
            let sUrlPath = "manager/res/data/bookingData.mock.json";

            this.execute(sLoadingText, sUrlPath, fnSuccessCallback, fnErrorCallback || undefined);
        };

		oWebservice.prototype.getJSONFromBplaced = function(sLoadingText, fnSuccessCallback) {
			let sUrlPath = "http://track.bplaced.net/outputjson.php";

			this.execute(sLoadingText, sUrlPath, fnSuccessCallback);
		};

		oWebservice.prototype.getBookingData = function(sLoadingText, fnSuccessCallback) {
			let sUrlPath = "http://track.bplaced.net/php/getData/getBookingData.php";

			this.execute(sLoadingText, sUrlPath, fnSuccessCallback);
		};

		oWebservice.prototype.getAdminPanelOverview = function(sLoadingText, fnSuccessCallback) {
			let sUrlPath = "http://track.bplaced.net/php/getData/getAdminPanelOverview.php";

			this.execute(sLoadingText, sUrlPath, fnSuccessCallback);
		};

		oWebservice.prototype.getUserData = function(sLoadingText, fnSuccessCallback) {
			let sUrlPath = "http://track.bplaced.net/php/getData/getUserData.php";

			this.execute(sLoadingText, sUrlPath, fnSuccessCallback);
		};

		oWebservice.prototype.setNewUser = function(sLoadingText, fnSuccessCallback, fnErrorCallback, oParameters) {
			let sUrlPath = "http://track.bplaced.net/php/setData/setNewUser.php";

			this.execute(sLoadingText, sUrlPath, fnSuccessCallback, undefined, {
				bUsePost: true
			}, oParameters);
		};

        return oWebservice;
    }
);