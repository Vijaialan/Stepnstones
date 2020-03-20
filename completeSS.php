<?php
include 'dbUtils.php';
$ssData = json_decode($_REQUEST['data']);
$query = "SELECT * FROM person WHERE email_address = '$ssData->username' AND loginid = '$ssData->token'";
$loginData = obtain_query_result($query, $con);
// var_dump($loginData);
$currentTime = date('Y-m-d H:i:s', time());
if($loginData === NULL) {
    die(json_encode(array("ERROR", "invalid token: Please refresh the page to login ")));
}
// if($loginData['employer'] !== "1" && $loginData['role'] !== "1" ) {
//     die(json_encode(array("ERROR", "You are not an admin ")));
// }
$completedBy = $loginData['pnid'];
$sql = "UPDATE strategy_statement SET ss_complete = 1, ss_complete_date = '$currentTime', ss_completed_by = $completedBy WHERE ssid = $ssData->currentSS";

updateData($sql, $con);
// var_dump($sql);
echo '["",""]';

?>
