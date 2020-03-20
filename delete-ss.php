<?php
//  [company bu] project goal

require 'CONNECT_TO_DB.php';
//$row is the row of person for this user
//$admin is "admin" if the person works for CMS, otherwise ""
if($admin!="admin"){
  die('["ERROR", "not permitted"]');
}

$coid=getcompany();
$buid=getbu();
$pjid=getproject();

$q="select * from project where coid=$coid and buid=$buid and pjid=$pjid";
$result=obtain_query_result($q);
if(!mysqli_fetch_assoc($result)) {
  die('["ERROR", "Project does not exist!"]');
}

// goal perspective stakeholder
if(array_key_exists ("ss",$_REQUEST)){
  $ss=slashquote($_REQUEST["ss"]);
}else{
  missing("ss");
}
$ss_del="delete from strategy_statement WHERE ssid='$ss'";
$ss_savings_del="delete from strategy_statement_savings WHERE ssid='$ss'";
$ss_so_del="delete from ss_so WHERE ssid='$ss'";
$ss_risk_del="delete from ss_risk WHERE ssid='$ss'";
$ss_benefit_del="delete from ss_benefit WHERE ssid='$ss'";
$ss_action_del="delete from action WHERE ssid='$ss'";
$ss_action_comment_del="delete from action_comment WHERE ssid='$ss'";
// $ss_action_participants_del="delete from action_participants WHERE ssid='$ss'";
$ss_action_progress_del="delete from action_progress WHERE ssid='$ss'";

$result=obtain_query_result($ss_savings_del);
$result=obtain_query_result($ss_risk_del);
$result=obtain_query_result($ss_benefit_del);
$result=obtain_query_result($ss_so_del);
$result=obtain_query_result($ss_del);
$result=obtain_query_result($ss_action_progress_del);
$result=obtain_query_result($ss_action_comment_del);
// $result=obtain_query_result($ss_action_participants_del);
$result=obtain_query_result($ss_action_del);
echo '["",""]';

?>
