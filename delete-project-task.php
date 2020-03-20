<?php
// 2017-07 modeled on delete-goal
// [company bu] project task

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
$q="delete from project_task where coid=$coid and buid=$buid and pjid='$pjid'
 and pjtaskid='$task'";
$result=obtain_query_result($q);

echo '["",""]';

?>
