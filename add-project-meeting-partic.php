<?php
//  required: company bu project meeting peron (all id's)

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
  $meeting=intval($_REQUEST["meeting"]);
}else{
  missing("meeting");
}
if(array_key_exists ("person",$_REQUEST) && is_numeric($_REQUEST["person"])){
  $person=intval($_REQUEST["person"]);
}else{
  missing("person");
}
$q="insert into project_meeting_participant set
 coid=$coid, buid=$buid, pjid=$pjid, pjmeetingid=$meeting,participant=$person";
$result=obtain_query_result($q);

echo '["",""]';

?>
