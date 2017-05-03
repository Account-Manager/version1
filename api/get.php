<?php
    /**
     * This file contains all functions that should be used to get Data from Server
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
            call_user_func($sFunctionName);
        } else {
            $bFunctionNameSet = false;
        }
    } else {
        $bFunctionNameSet = false;
    }
    if (!$bFunctionNameSet) {
        // TODO: return error message
        $oResponse = array(
            "bError" => true,
            "sErrorMessage" => "Function non-existent!"
        );
        echo json_encode($oResponse);
        exit();
    }

    function getUserData() {
        // ATTENTION: functions have no parameters! have to be read from $_POST[]!
        echo "function getUserData called!";
    }

    function getBookings() {
        $sStartDate = "";
        $sEndDate = "";
        $oResponse = array();
        if (isSetAndFilled($_POST["sStartDate"]) && isSetAndFilled($_POST["sEndDate"])) {
            $sStartDate = $_POST["sStartDate"];
            $sEndDate = $_POST["sEndDate"];

            $oDatabase = new PDO('mysql:host=localhost;dbname=track_ui5', 'track_ui5', 'openui5database');

            $sQuery = "SELECT " .
                      "book_id AS sBookingId, book_cat AS iBookingCategory, book_date AS oBookingDate, book_freq AS iBookingFrequency, book_title AS sBookingTitle, book_value AS fBookingValue, " .
                      "acc_id AS sAccountId, book_type AS iBookingType " .
                      "FROM am_bookings WHERE book_date BETWEEN :sStartDate AND :sEndDate";
            $oStatement = $oDatabase->prepare($sQuery); // "SELECT * FROM am_bookings WHERE book_date BETWEEN :sStartDate AND :sEndDate");
            $oStatement->bindParam(":sStartDate", $sStartDate);
            $oStatement->bindParam(":sEndDate", $sEndDate);
            $oStatement->execute();
            $aRows = array();
            for ($i = 0; $i < $oStatement->rowCount(); $i++) {
                array_push($aRows, $oStatement->fetch(PDO::FETCH_ASSOC));
            }
            $oResponse["bError"]= false;
            $oResponse["aBookings"] = $aRows;
            echo json_encode($oResponse);

            // TODO: try/catch, errorhandling
        }
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