<?php
    /**
     * This file contains all functions that should be used to delete Data from Server
     */

    // set header
    header("Content-type: application/json;charset=utf-8");

    // checking function name parameter
    $sFunctionName = "";
    $bFunctionNameSet = false;
    if (isset($_GET["sFunctionName"]) && !empty($_GET["sFunctionName"])) {
        if (gettype($_GET["sFunctionName"]) === "string") {
            $sFunctionName = $_GET["sFunctionName"];
            $bFunctionNameSet = true;
        }
    }
    if ($bFunctionNameSet && $sFunctionName !== "") {
        if (is_callable($sFunctionName)) {
            // if this is executed, error handling is passed to called function
            // ATTENTION: functions have no parameters! must be read from $_POST[]!
            call_user_func($sFunctionName);
        } else {
            $bFunctionNameSet = false;
        }
    } else {
        $bFunctionNameSet = false;
    }
    if (!$bFunctionNameSet) {
        $oResponse = array(
            "bError" => true,
            "sErrorMessage" => "Function non-existent!"
        );
        echo json_encode($oResponse);
        exit();
    }

    function deleteBooking() {
        $oResponse = array(
            "bError" => true
        );
        $sBookingId = "";
        if (isSetAndFilled($_POST["sBookingId"])) {
            $sBookingId = $_POST["sBookingId"];
            try {
                $oDB = new PDO('mysql:host=localhost;dbname=track_ui5', 'track_ui5', 'openui5database');
                $sQuery = "DELETE FROM am_bookings WHERE book_id = :sBookingId";
                $oStatement = $oDB->prepare($sQuery);
                $oStatement->bindParam("sBookingId", $sBookingId);
                $oStatement->execute();
                $oResponse["aDeletedBooking"] = array(
                    "sBookingId" => $sBookingId
                );
                $oResponse["bError"] = false;
            } catch (PDOException $ePDO) {
                $oResponse["sErrorMessage"] = $ePDO->getMessage();
                $oResponse["sShortError"] = "Error on Database execution";
            } catch (Exception $e) {
                $oResponse["sErrorMessage"] = $e->getMessage();
                $oResponse["sShortError"] = "Non-PDO error on Database execution";
            }
        } else {
            $oResponse["sErrorMessage"] = "Booking id not supplied";
        }
        echo json_encode($oResponse);
        exit();
    }

    /**
     * helper functions - TODO: move to own file
     */
    function isSetAndFilled($sParam) {
        if (gettype($sParam) === "string") {
            if (isset($sParam) && !empty($sParam)) {
                return true;
            }
        }
        return false;
    }