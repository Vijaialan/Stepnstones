<?php
// [company bu project ss] action date
// (ad::set-action-completed action date)
require 'CONNECT_TO_DB.php';
//$row is the row of person for this user
//$admin is "admin" if the person works for CMS, otherwise ""

$coid=getcompany();
$buid=getbu();
$pjid=getproject();
$ssid=getss();
$actionid=getaction();
$person_id = $row['pnid'];
if($admin!="admin"){
  // logged in user must be on team of project
  $q="select * from project_team where
  coid=$coid and buid=$buid and pjid=$pjid and personid=" . $person_id;
  $result=obtain_query_result($q);
  if(!mysqli_fetch_assoc($result)) {
    die('["ERROR", "not permitted"]');
  }
}

$q="select * from action where
 coid=$coid and buid=$buid and pjid=$pjid and ssid=$ssid and actionid=$actionid";
$result=obtain_query_result($q);
if(!$row=mysqli_fetch_assoc($result)) {
  die('["ERROR", "action not found"]');
}
if(array_key_exists ("date",$_REQUEST)){
  $date = str_replace('/', '-', $_REQUEST["date"]);
  $date = date('Y-m-d H:i:s', strtotime($date));
} else {
  $date=date('Y-m-d', time());
}


if(array_key_exists ("dropped",$_REQUEST)){
  $dropped = $_REQUEST['dropped'] == 'true'? true : false;
} else {
  $dropped = false;
}

if(array_key_exists ("completed",$_REQUEST)){
  $completed = $_REQUEST['completed'] == "true" ? true : false ;
} else {
  $completed = false;
}

if(array_key_exists ("comment",$_REQUEST)){
  $comment = $_REQUEST['comment'];
} else {
  $comment = '';
}

if($completed) {
  if(! is_null($row['completiontime'])){
    die('["ERROR", "action is already completed"]');
  }else {
    $percent = 100;
    $q="update action set dropped = 0, completed = 1,completed_by =$pnid, completiontime='$date' where
    coid=$coid and buid=$buid and pjid=$pjid and ssid=$ssid and actionid=$actionid";       
  }
}
if($dropped) {
  if($row['dropped'] == 1){
    die('["ERROR", "action is already dropped"]');
  }else {
    $percent = -1;
    $q="update action set completiontime = null, completed = 0, dropped = 1, dropped_date='$date', dropped_by = $pnid, dropped_comment = '$comment' where
    coid=$coid and buid=$buid and pjid=$pjid and ssid=$ssid and actionid=$actionid";       
  }
}
$result=obtain_query_result($q);
$today = date('Y-m-d H:i:s', time());
$q="insert into action_progress set
 coid=$coid, buid=$buid, pjid=$pjid, ssid=$ssid, actionid=$actionid,
 comment='$comment', lastupdate='$date',
 creationtime=now(), pctcomplete=$percent, author=" . $person_id;
//  echo $q;
$result=obtain_query_result($q);

echo '["",""]';


?>
