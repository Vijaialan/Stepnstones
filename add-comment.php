<?php
// [company bu] project step comment who (I now remove the who)

require 'CONNECT_TO_DB.php';
//$row is the row of person for this user
//$admin is "admin" if the person works for CMS, otherwise ""

$coid=getcompany();
$buid=getbu();
$pjid=getproject();

if(array_key_exists ("comment",$_REQUEST)){
  $comment=slashquote($_REQUEST["comment"]);
}else{
  missing("comment");
}

if(array_key_exists ("step",$_REQUEST)){
  $step=slashquote($_REQUEST["step"]);
}else{
  missing("step");
}

$q="select * from project where coid=$coid and buid=$buid and pjid=$pjid";
$result=obtain_query_result($q);
if(!mysqli_fetch_assoc($result)) {
  die('["ERROR", "Project not found"]');
}

if($admin!="admin"){
  // logged in user must be on team of project
  $q="select * from project_team where
  coid=$coid and buid=$buid and pjid=$pjid and personid=" . $row['pnid'];
  $result=obtain_query_result($q);
  if(!mysqli_fetch_assoc($result)) {
    die('["ERROR", "not permitted"]');
  }
}

$q="insert into project_step_comment set
 coid=$coid, buid=$buid, pjid=$pjid, step='$step', comment='$comment',
 creationtime=now(), author=" . $row['pnid'];
$result=obtain_query_result($q);
echo '["",""]';

?>
