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

    function getUserData() {
        echo "function getUserData called!";
    }

    function getBookings() {
        $sStartDate = "";
        $sEndDate = "";
        $oResponse = array(
            "bError" => true
        );
        if (isSetAndFilled($_POST["sStartDate"]) && isSetAndFilled($_POST["sEndDate"])) {
            $sStartDate = $_POST["sStartDate"];
            $sEndDate = $_POST["sEndDate"];

            try {
                $oDatabase = new PDO('mysql:host=localhost;dbname=track_ui5', 'track_ui5', 'openui5database');
                $sQuery = "SELECT " .
                    "book_id AS sBookingId, book_cat AS iBookingCategory, book_date AS sBookingDate, book_freq AS iBookingFrequency, book_title AS sBookingTitle, book_value AS fBookingValue, " .
                    "acc_id AS sAccountId, book_type AS iBookingType " .
                    "FROM am_bookings WHERE book_date BETWEEN :sStartDate AND :sEndDate";
                $oStatement = $oDatabase->prepare($sQuery);
                $oStatement->bindParam(":sStartDate", $sStartDate);
                $oStatement->bindParam(":sEndDate", $sEndDate);
                $oStatement->execute();
                $aRows = array();
                for ($i = 0; $i < $oStatement->rowCount(); $i++) {
                    array_push($aRows, $oStatement->fetch(PDO::FETCH_ASSOC));
                }
                $oResponse["bError"]= false;
                $oResponse["aBookings"] = $aRows;
            } catch (PDOException $ePDO) {
                $oResponse["sErrorMessage"] = $ePDO->getMessage();
                $oResponse["sShortError"] = "Error on Database execution";
            } catch (Exception $e) {
                $oResponse["sErrorMessage"] = $e->getMessage();
                $oResponse["sShortError"] = "Non-PDO error on Database execution";
            }
        } else {
            $oResponse["sErrorMessage"] = "Start and/or End Date not specified";
        }
        echo json_encode($oResponse);
        exit();
    }

    // getter for admin panel
    // TODO: move to own file/api
    function adminGetOverview() {
        $oResponse = array(
            "bError" => true
        );
        try {
            $oDB = new PDO('mysql:host=localhost;dbname=track_ui5', 'track_ui5', 'openui5database');
            $sQuery = "SELECT COUNT( DISTINCT am_user.id ) AS sUserCount, COUNT( DISTINCT am_accounts.acc_id ) AS sAccountsCount, COUNT( DISTINCT am_bookings.book_id ) AS sBookingsCount FROM am_user, am_accounts, am_bookings WHERE 1 = ?";
            $oStatement = $oDB->prepare($sQuery);
            $oStatement->execute(array(1));
            $oResponse["aCounts"] = array($oStatement->fetch(PDO::FETCH_ASSOC));
            $oResponse["bError"] = false;
        } catch (PDOException $ePDO) {
            $oResponse["sErrorMessage"] = $ePDO->getMessage();
            $oResponse["sShortError"] = "Error on Database execution";
        } catch (Exception $e) {
            $oResponse["sErrorMessage"] = $e->getMessage();
            $oResponse["sShortError"] = "Non-PDO error on Database execution";
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