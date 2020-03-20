<?php
//  required: company bu project task (all id's)
// optional: description step duedate status

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
$set="";
if(array_key_exists ("description",$_REQUEST)){
  $desc=slashquote($_REQUEST["description"]);
  if($set!=""){$set.=', ';}
  $set.="description='$desc'";
}
if(array_key_exists ("step",$_REQUEST)){
  $step=slashquote($_REQUEST["step"]);
  if($set!=""){$set.=', ';}
  $set.="step='$step'";
}
if(array_key_exists ("duedate",$_REQUEST)){
  $rawdue=slashquote($_REQUEST["duedate"]);
  if($rawdue === '') 
    $duedate = null;
  else {
    $rawdue = str_replace('/', '-', $rawdue);
    $duedate = date('Y-m-d H:i:s', strtotime($rawdue));
  }
  if($set!=""){$set.=', ';}
  $set.="due_date='$duedate'";
}
if(array_key_exists ("status",$_REQUEST)){
  $status=slashquote($_REQUEST["status"]);
  if($set!=""){$set.=', ';}
  $set.="status='$status'";
}
$q="update project_task set $set
  where coid=$coid and buid=$buid and pjid=$pjid and pjtaskid=$task";
if($set!=""){
  $result=obtain_query_result($q);
}
echo '["",""]';

?>
