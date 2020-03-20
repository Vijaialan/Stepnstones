<?php
//  [company bu] project goal perspective stakeholder

require 'CONNECT_TO_DB.php';
//$row is the row of person for this user
//$admin is "admin" if the person works for CMS, otherwise ""
if($admin!="admin"){
  die('["ERROR", "not permitted"]');
}
$coid=getcompany();
$buid=getbu();
$pjid=getproject();

if(array_key_exists ("goal",$_REQUEST)){
  $goal=slashquote($_REQUEST["goal"]);
}else{
  missing("goal");
}
if(array_key_exists ("perspective",$_REQUEST)){
  $perspective=slashquote($_REQUEST["perspective"]);
}else{
  missing("perspective");
}
if(array_key_exists ("stakeholder",$_REQUEST)){
  $stakeholder=slashquote($_REQUEST["stakeholder"]);
}else{
  missing("stakeholder");
}

$q="select * from project where coid=$coid and buid=$buid and pjid=$pjid";
$result=obtain_query_result($q);
if(!mysqli_fetch_assoc($result)) {
  die('["ERROR", "Project does not exist!"]');
}
foreach($goal as $key => $value) {
  if($value === '') continue;
  $q="insert into project_goal set coid=$coid, buid=$buid, pjid='$pjid',
  creationtime=now(), goal='$value', perspective='$perspective',
  stakeholder='$stakeholder'";
  $result=obtain_query_result($q);  
}

echo '["",""]';

?>
