<?php
include 'dbUtils.php';
$ssData = json_decode($_REQUEST['data']);
$query = "SELECT * FROM person WHERE email_address = '$ssData->username' AND loginid = '$ssData->token'";
$loginData = obtain_query_result($query, $con);
// var_dump($loginData);
if($loginData === NULL) {
    die(json_encode(array("ERROR", "invalid token: Please refresh the page to login ")));
}
// if($loginData['employer'] !== "1" && $loginData['role'] !== "1" ) {
//     die(json_encode(array("ERROR", "You are not an admin ")));
// }
$reopened_by = $loginData['pnid'];
$currentTime = date('Y-m-d H:i:s', time());
$sql = "UPDATE strategy_statement SET ss_complete = 0, reopened_date = '$currentTime',  reopened_by = $reopened_by WHERE ssid = $ssData->currentSS";
// var_dump($sql);
updateData($sql, $con);
echo '["",""]';
?>





