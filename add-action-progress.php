<?php
// [company bu project ss] action percent comment date (for prior projects or past dates)

require 'CONNECT_TO_DB.php';
//$row is the row of person for this user
//$admin is "admin" if the person works for CMS, otherwise ""

$coid=getcompany();
$buid=getbu();
$pjid=getproject();
$ssid=getss();
$actionid=getaction();

if($admin!="admin"){
  // logged in user must be on team of project
  $q="select * from project_team where
  coid=$coid and buid=$buid and pjid=$pjid and personid=" . $row['pnid'];
  $result=obtain_query_result($q);
  if(!mysqli_fetch_assoc($result)) {
    die('["ERROR", "You are not permitted to do this operation!"]');
  }
}

if(array_key_exists ("percent",$_REQUEST)){
  if(is_numeric($_REQUEST["percent"])){
    $percent=intval($_REQUEST["percent"]);
  } else {
  die('["ERROR", "percent not numeric"]');
  }
} else{
  missing("percent");
}
if(array_key_exists ("comment",$_REQUEST)){
  $comment=slashquote($_REQUEST["comment"]);
}else{
  $comment= "";
}
if(array_key_exists ("date",$_REQUEST)){
  $date = str_replace('/', '-', $_REQUEST["date"]);
  $date = date('Y-m-d H:i:s', strtotime($date));
}else{
  $date=date('Y-m-d H:i:s', time());
}

$ss_sql = "UPDATE action a SET completiontime=null, dropped = 0 WHERE actionid = $actionid";
$result=obtain_query_result($ss_sql);
$q="insert into action_progress set
 coid=$coid, buid=$buid, pjid=$pjid, ssid=$ssid, actionid=$actionid,
 comment='$comment', lastupdate='$date',
 creationtime=now(), pctcomplete=$percent, author=" . $row['pnid'];
$result=obtain_query_result($q);
echo '["",""]';


?>
