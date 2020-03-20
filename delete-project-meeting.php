<?php
// 2017-07 modeled on delete-goal
// [company bu] project meeting

require 'CONNECT_TO_DB.php';
//$row is the row of person for this user
//$admin is "admin" if the person works for CMS, otherwise ""
if($admin!="admin"){
  die('["ERROR", "You are not permitted to do this operation!"]');
}

$coid=getcompany();
$buid=getbu();
$pjid=getproject();

$q="select * from project where coid=$coid and buid=$buid and pjid=$pjid";
$result=obtain_query_result($q);
if(!mysqli_fetch_assoc($result)) {
  die('["ERROR", "Project does not exist!"]');
}


if(array_key_exists ("meeting",$_REQUEST) && is_numeric($_REQUEST["meeting"])){
  $mtg=intval($_REQUEST["meeting"]);
}else{
  missing("meeting");
}
$q="delete from project_meeting where coid=$coid and buid=$buid and pjid='$pjid'
 and pjmeetingid='$mtg'";
$result=obtain_query_result($q);

echo '["",""]';

?>
