<?php
// 2017-07 used add-ss as template
// [company bu] project agenda step start end location type
require 'CONNECT_TO_DB.php';
//$row is the row of person for this user
//$admin is "admin" if the person works for CMS, otherwise ""
if($admin!="admin"){
  die('["ERROR", "You are not permitted to do this operation!"]');
}

$coid=getcompany();
$buid=getbu();
$pjid=getproject();

if(array_key_exists ("agenda",$_REQUEST)){
  $agenda=slashquote($_REQUEST["agenda"]);
}else{
  missing("agenda");
}
if(array_key_exists ("step",$_REQUEST)){
  $step=slashquote($_REQUEST["step"]);
}else{
  missing("step");
}
if(array_key_exists ("type",$_REQUEST)){
  $type=slashquote($_REQUEST["type"]);
}else{
  missing("type");
}
if(array_key_exists ("start",$_REQUEST)){
  $start=slashquote($_REQUEST["start"]);
}else{
  missing("start");
}
if(array_key_exists ("end",$_REQUEST)){
  $end=slashquote($_REQUEST["end"]);
}else{
  missing("end");
}
if(array_key_exists ("location",$_REQUEST)){
  $location=slashquote($_REQUEST["location"]);
}else{
  missing("location");
}

$q="select * from project where
 coid=$coid and buid=$buid and pjid=$pjid";
$result=obtain_query_result($q);
if(!mysqli_fetch_assoc($result)) {
  die('["ERROR", "Project does not exist!"]');
}

$q="insert into project_meeting set
 coid=$coid, buid=$buid, pjid=$pjid, agenda='$agenda',starttime='$start',
 endtime='$end',meeting_type='$type',step='$step',location='$location'";
$result=obtain_query_result($q);

$q="select last_insert_id() newid";
$result=obtain_query_result($q);
if($row=mysqli_fetch_assoc($result)) {
  die(json_encode(array("",$row['newid']))); // success
}else{
  die('["ERROR", "insert did not return a new row!"]');
}

?>
