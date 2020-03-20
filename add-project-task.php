<?php
// 2017-07 used add-ss as template
// [company bu] project description step duedate status
require 'CONNECT_TO_DB.php';
//$row is the row of person for this user
//$admin is "admin" if the person works for CMS, otherwise ""
if($admin!="admin"){
  die('["ERROR", "You are not permitted to do this operation!"]');
}

$coid=getcompany();
$buid=getbu();
$pjid=getproject();

if(array_key_exists ("description",$_REQUEST)){
  $desc=slashquote($_REQUEST["description"]);
  if($desc === '') missing("description");
}else{
  missing("description");
}
if(array_key_exists ("step",$_REQUEST)){
  $step=slashquote($_REQUEST["step"]);
}else{
  missing("step");
}
if(array_key_exists ("duedate",$_REQUEST)){
  $rawdue=slashquote($_REQUEST["duedate"]);
  if($rawdue === '') 
    $due = null;
  else {
    $date = str_replace('/', '-', $rawdue);
    $due = date('Y-m-d', strtotime($date));
  }
}else{
  missing("duedate");
}

if(array_key_exists ("status",$_REQUEST)){
  $status=slashquote($_REQUEST["status"]);
}else{
  missing("status");
}

$q="insert into project_task set
 coid=$coid, buid=$buid, pjid=$pjid, description='$desc',step='$step',
 due_date='$due',status='$status'";
$result=obtain_query_result($q);

$q="select last_insert_id() newid";
$result=obtain_query_result($q);
if($row=mysqli_fetch_assoc($result)) {
  die(json_encode(array("",$row['newid']))); // success
}else{
  die('["ERROR", "insert did not return a new row!"]');
}

?>
