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

    function setBooking() {
        $oResponse = array(
            "bError" => true
        );
        if (isSetAndFilled($_POST["sAccountId"]) && isSetAndFilled($_POST["sBookingCategory"]) && isSetAndFilled($_POST["iBookingType"])
            && isSetAndFilled($_POST["sBookingDate"]) && isSetAndFilled($_POST["iBookingFrequency"]) && isSetAndFilled($_POST["sBookingTitle"]) && isSetAndFilled($_POST["fBookingValue"])) {
            $sAccountId = $_POST["sAccountId"];
            $sBookingCategory = $_POST["sBookingCategory"];
            $iBookingType = $_POST["iBookingType"];
            $sBookingDate = $_POST["sBookingDate"];
            $iBookingFrequency = $_POST["iBookingFrequency"];
            $sBookingTitle = $_POST["sBookingTitle"];
            $fBookingValue = $_POST["fBookingValue"];
            try {
                $oDB = new PDO('mysql:host=localhost;dbname=track_ui5', 'track_ui5', 'openui5database');
                $sQuery = "INSERT INTO am_bookings (acc_id, book_cat, book_type, book_date, book_freq, book_title, book_value) " .
                    "VALUES (:sAccountId, :sBookingCategory, :iBookingType, :sBookingDate, :iBookingFrequency, :sBookingTitle, :fBookingValue)";
                $oStatement = $oDB->prepare($sQuery);

                $oStatement->bindParam(":sAccountId", $sAccountId);
                $oStatement->bindParam(":sBookingCategory", $sBookingCategory);
                $oStatement->bindParam(":iBookingType", $iBookingType);
                $oStatement->bindParam(":sBookingDate", $sBookingDate);
                $oStatement->bindParam(":iBookingFrequency", $iBookingFrequency);
                $oStatement->bindParam(":sBookingTitle", $sBookingTitle);
                $oStatement->bindParam(":fBookingValue", $fBookingValue);

                $oStatement->execute();

                $oResponse["bError"] = false;
                // TODO: return id of last insert
            } catch (PDOException $ePDO) {
                $oResponse["sErrorMessage"] = $ePDO->getMessage();
                $oResponse["sShortError"] = "Error on Database execution";
            } catch (Exception $e) {
                $oResponse["sErrorMessage"] = $e->getMessage();
                $oResponse["sShortError"] = "Non-PDO error on Database execution";
            }
        } else {
            $oResponse["sErrorMessage"] = "Not all required parameters supplied";
        }
        echo json_encode($oResponse);
        exit();
    }

    function updateBooking() {
        $oResponse = array(
            "bError" => true
        );
        if (isSetAndFilled($_POST["sBookingId"]) && isSetAndFilled($_POST["sBookingCategory"]) && isSetAndFilled($_POST["iBookingType"])
            && isSetAndFilled($_POST["iBookingFrequency"]) && isSetAndFilled($_POST["sBookingTitle"]) && isSetAndFilled($_POST["fBookingValue"])) {
            $sBookingId = $_POST["sBookingId"];
            $sBookingCategory = $_POST["sBookingCategory"];
            $iBookingType = $_POST["iBookingType"];
            $iBookingFrequency = $_POST["iBookingFrequency"];
            $sBookingTitle = $_POST["sBookingTitle"];
            $fBookingValue = $_POST["fBookingValue"];
            try {
                $oDB = new PDO('mysql:host=localhost;dbname=track_ui5', 'track_ui5', 'openui5database');
                $sQuery = "UPDATE am_bookings SET book_cat = :sBookingCategory, book_type = :iBookingType, book_freq = :iBookingFrequency, book_title = :sBookingTitle, " .
                          "book_value = :fBookingValue WHERE book_id = :sBookingId";

                $oStatement = $oDB->prepare($sQuery);

                $oStatement->bindParam(":sBookingId", $sBookingId);
                $oStatement->bindParam(":sBookingCategory", $sBookingCategory);
                $oStatement->bindParam(":iBookingType", $iBookingType);
                $oStatement->bindParam(":iBookingFrequency", $iBookingFrequency);
                $oStatement->bindParam(":sBookingTitle", $sBookingTitle);
                $oStatement->bindParam(":fBookingValue", $fBookingValue);

                $oStatement->execute();

                $oResponse["bError"] = false;
            } catch (PDOException $ePDO) {
                $oResponse["sErrorMessage"] = $ePDO->getMessage();
                $oResponse["sShortError"] = "Error on Database execution";
            } catch (Exception $e) {
                $oResponse["sErrorMessage"] = $e->getMessage();
                $oResponse["sShortError"] = "Non-PDO error on Database execution";
            }
        } else {
            $oResponse["sErrorMessage"] = "Not all required parameters supplied";
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