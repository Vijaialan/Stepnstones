<?php
// [company bu project ss] action comment
// (ad::add-action-comment-ss action comment (ad::theperson username))
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
    die('["ERROR", "not permitted"]');
  }
}

$q="select * from action where
 coid=$coid and buid=$buid and pjid=$pjid and ssid=$ssid and actionid=$actionid";
$result=obtain_query_result($q);
if(!mysqli_fetch_assoc($result)) {
  die('["ERROR", "action not found"]');
}

if(array_key_exists ("comment",$_REQUEST)){
  $comment=slashquote($_REQUEST["comment"]);
} else {
  missing("comment");
}

$q="insert into action_comment set
 coid=$coid, buid=$buid, pjid=$pjid, ssid=$ssid, actionid=$actionid,
 creationtime=now(), comment='$comment',author=" . $row['pnid'];
$result=obtain_query_result($q);
echo '["",""]';

?>
