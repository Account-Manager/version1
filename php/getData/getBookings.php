<?PHP
    /*
     * getBookings.php
     */

    // 1. check parameters
    $oStartDate = $_POST["oStartDate"];
    $oEndDate = $_POST["oEndDate"];
    $sStartDate = date("Y-m-d H:i:s", strtotime($oStartDate));
    $sEndDate = date("Y-m-d H:i:s", strtotime($oEndDate));
//    echo $oStartDate . "\n" . $oEndDate . "\n";
//    echo $sStartDate . "\n" . $sEndDate;
    // TODO: get UserID from $_SESSION
    // $sUserId = $_SESSION["USERID"];
    $oResponse = array(
        "bSaveSuccess" => true
    );

    $oDB = new PDO('mysql:host=localhost;dbname=track_ui5', 'track_ui5', 'openui5database');
    $sQuery = "SELECT * FROM am_bookings WHERE book_date BETWEEN ? AND ?";
    $oStatement = $oDB->prepare($sQuery);
    $oStatement->execute(array("2016-04-26 00:00:00", "2017-05-26 00:00:00"));
    $iRows = $oStatement->rowCount();
    $aResponse = array();
    for ($i = 0; $i < $iRows; $i++) {
        array_push($aResponse, $oStatement->fetch(PDO::FETCH_ASSOC));
    }
    header("Content-type: application/json;charset=utf-8");
    echo json_encode($aResponse);


    /*
// book_id AS sBookingId, book_cat AS iBookingCategory, book_date AS oBookingDate, book_freq AS iBookingFrequency, book_title AS sBookingTitle, book_value AS BookingValue
    $oDB = new PDO('mysql:host=localhost;dbname=track_ui5', 'track_ui5', 'openui5database');
//    $sQuery = "SELECT * FROM am_bookings WHERE book_date BETWEEN '?' AND '?')";
//    echo "\n" . $sQuery . "\n";
    $oStatement = $oDB->prepare("SELECT * FROM am_bookings WHERE book_date BETWEEN ':sStartDate' AND '?:sEndDate'");
    $oStatement->bindParam(":sStartDate", $sStartDate);
    $oStatement->bindParam(":sEndDate", $sEndDate);
    $oStatement->execute();
//    $oStatement->execute(array($sStartDate, $sEndDate));
    $iRows = $oStatement->rowCount();
    $aResponse = array();
    for ($i = 0; $i < $iRows; $i++) {
        array_push($aResponse, $oStatement->fetch(PDO::FETCH_ASSOC));
    }
    echo "\n" . $iRows . "\n" . $aResponse . "\n";
    $oResponse["oBookings"] = $aResponse;
    header("Content-type: application/json;charset=utf-8");
    echo json_encode($oResponse);
*/
?>