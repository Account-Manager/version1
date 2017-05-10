sap.ui.define(["jquery.sap.global"],
	function(jQuery) {
		"use strict";
		jQuery.sap.declare("manager.extensions.Webservice1");

		let oWebservice1 = manager.extensions.Webservice1 = function() {};

		/**
		 * executes AJAX call
		 * @param sLoadingText: text shown in loading popover
		 * @param mTarget: request target adress
		 * @param fnSuccessCallback: function called on request success
		 * @param fnErrorCallback: function called on request error
		 * @param oParameters: parameters send with request
		 * @param oOptions: options to modify request
		 */
		oWebservice1.prototype.execute = function(sLoadingText, mTarget, fnSuccessCallback, fnErrorCallback, oParameters, oOptions) {
			const oLoadingDialog = new sap.m.BusyDialog({
				text: sLoadingText || oBundle.getText("std.loading"),
				title: oBundle.getText("std.loading")
			});

			/**
			 * @attribute bHideLoading: don't show loading dialog
			 * @attribute bUsePost: use method "POST" or "GET"
			 * @attribute bAsync: ececute request async or not
			 */
			oOptions = oOptions || {};
			if (!oOptions.bHideLoading) {
				oLoadingDialog.open();
			}
			let bUsePost = oOptions.bUsePost || true; // set POST as default method
			let bAsync = oOptions.bAsnyc || true; // execute AJAX call async by default

			oParameters = oParameters || {};

			let oModel = new sap.ui.model.json.JSONModel();

			let sUrlPath = "";
			if (typeof mTarget === "string") {
				sUrlPath = mTarget;
			} else if (typeof mTarget === "object") {
				sUrlPath = encodeURI(`http://api.track.bplaced.net/${mTarget.sAction}.php?sFunctionName=${mTarget.sFunctionName}`);
			}

			let oErrorDialog = new sap.m.Dialog({
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

			// loading text and urlpath must be (non empty) strings
			if (sLoadingText && sLoadingText !== "" && sUrlPath && sUrlPath !== "") {
				if (fnSuccessCallback && typeof fnSuccessCallback === "function") {
					if (fnErrorCallback && typeof fnErrorCallback === "function") {
						oModel.attachRequestCompleted(function(oEvent) {
							// hide loading dialog
							if (!oOptions.bHideLoading) oLoadingDialog.close();

							if (oEvent.mParameters.success) {
								// call success callback function
								fnSuccessCallback(this.getData());
							} else {
								// call error callback function
								fnErrorCallback();
							}
						});
					} else {
						oModel.attachRequestCompleted(function(oEvent) {
							// hide loading dialog
							if (!oOptions.bHideLoading) oLoadingDialog.close();

							if (oEvent.mParameters.success) {
								// call success callback function
								fnSuccessCallback(this.getData());
							} else {
								// show standard error dialog
								oErrorDialog.open();
							}
						});
					}
				}
			} else if (fnErrorCallback && typeof fnErrorCallback === "function") {
				// only error callback provided

				oModel.attachRequestCompleted(function(oEvent) {
					// hide loading dialog
					if (!oOptions.bHideLoading) oLoadingDialog.close();

					if (!oEvent.mParameters.success) {
						// call success callback function
						fnErrorCallback();
					}
				});
			} else {
				oModel.attachRequestCompleted(function(oEvent) {
					// hide loading dialog
					if (!oOptions.bHideLoading) oLoadingDialog.close();

					if (!oEvent.mParameters.success) {
						// show standard error dialog
						oErrorDialog.open();
					}
				});
			}

			// execute request
			oModel.loadData(sUrlPath, oParameters, bAsync, bUsePost ? "POST" : "GET");
		};

		/**
		 * returns id and name of acoounts current user is involved with
		 * @param sLoadingText
		 * @param fnSuccessCallback
		 */
		oWebservice1.prototype.getUserAccounts = function(sLoadingText, fnSuccessCallback) {
			let oTarget = {
				"sAction": "get",
				"sFunctionName": "getUserAccounts"
			};

			this.execute(sLoadingText, oTarget, fnSuccessCallback);
		};

		oWebservice1.prototype.getBookings = function (sLoadingText, aAccountIds, sStartDate, sEndDate, fnSuccessCallback) {
			let oTarget = {
				"sAction": "get",
				"sFunctionName": "getBookings"
			};

			this.execute(sLoadingText, oTarget, fnSuccessCallback, undefined, {
				"aAccounts": aAccountIds,
				"sStartDate": sStartDate,
				"sEndDate": sEndDate
			});
		};

		return oWebservice1;
	}
);