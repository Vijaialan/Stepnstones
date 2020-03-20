<?php
include 'dbUtils.php';
$ssData = json_decode($_REQUEST['data']);
$ssid = $ssData->currentSS;
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
$pnid = $loginData['pnid'];
$sql = "UPDATE strategy_statement SET ss_unimplement = 1, unimplement_date = '$currentTime', unimplement_by = $pnid WHERE ssid = $ssid";
updateData($sql, $con);
// var_dump($sql);
$percent = -1;
$comment = "Strategy statement unselected for implementation in V stage";
$action_sql = "SELECT * FROM action WHERE ssid = $ssid";
$action_data = getData($action_sql, $con);
foreach($action_data as $ad) {
    if($ad['completed'] == 1) continue;
    if($ad['dropped'] == 1) continue;
    $actionid = $ad['actionid'];
    $coid = $ad['coid'];
    $buid = $ad['buid'];
    $pjid = $ad['pjid'];
    $action_q="update action set completiontime = null, completed = 0, dropped = 1, dropped_date='$currentTime', dropped_by = $pnid, dropped_comment = '$comment' where ssid=$ssid and actionid=$actionid"; 
    updateData($action_q, $con);
    $action_progress_q="insert into action_progress set coid=$coid, buid=$buid, pjid=$pjid, ssid=$ssid, actionid=$actionid,
    comment='$comment', lastupdate='$currentTime', creationtime=now(), pctcomplete=$percent, author=" . $pnid;
    insertData($action_progress_q, $con);
}
echo '["",""]';

?>