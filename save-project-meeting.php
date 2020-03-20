<?php
//  required: company bu project meeting (all id's)
// optional: agenda step start end location type

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
$set="";
if(array_key_exists ("agenda",$_REQUEST)){
  $agenda=slashquote($_REQUEST["agenda"]);
  if($set!=""){$set.=', ';}
  $set.="agenda='$agenda'";
}
if(array_key_exists ("step",$_REQUEST)){
  $step=slashquote($_REQUEST["step"]);
  if($set!=""){$set.=', ';}
  $set.="step='$step'";
}
if(array_key_exists ("type",$_REQUEST)){
  $type=slashquote($_REQUEST["type"]);
  if($set!=""){$set.=', ';}
  $set.="meeting_type='$type'";
}
if(array_key_exists ("start",$_REQUEST)){
  $start=slashquote($_REQUEST["start"]);
  if($set!=""){$set.=', ';}
  $set.="starttime='$start'";
}
if(array_key_exists ("end",$_REQUEST)){
  $end=slashquote($_REQUEST["end"]);
  if($set!=""){$set.=', ';}
  $set.="endtime='$end'";
}
if(array_key_exists ("location",$_REQUEST)){
  $location=slashquote($_REQUEST["location"]);
  if($set!=""){$set.=', ';}
  $set.="location='$location'";
}
$q="update project_meeting set $set
  where coid=$coid and buid=$buid and pjid='$pjid' and pjmeetingid='$meeting'";
if($set!=""){
  $result=obtain_query_result($q);
}
echo '["",""]';

?>
