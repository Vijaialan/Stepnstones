<?php
//  required: company bu project task person (all id's)

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

if(array_key_exists ("task",$_REQUEST) && is_numeric($_REQUEST["task"])){
  $task=intval($_REQUEST["task"]);
}else{
  missing("task");
}
if(array_key_exists ("person",$_REQUEST) && is_numeric($_REQUEST["person"])){
  $person=intval($_REQUEST["person"]);
}else{
  missing("person");
}
$q="insert into project_task_participant set
 coid=$coid, buid=$buid, pjid=$pjid, pjtaskid=$task,participant=$person";
$result=obtain_query_result($q);

echo '["",""]';

?>
