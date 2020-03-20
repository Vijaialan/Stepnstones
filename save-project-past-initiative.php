<?php
//  required: company bu project initiative (all id's)
// optional: description startyear identifiedval deliveredval status

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

if(array_key_exists ("initiative",$_REQUEST) && is_numeric($_REQUEST["initiative"])){
  $init=intval($_REQUEST["initiative"]);
}else{
  missing("initiative");
}
$set="";
if(array_key_exists ("description",$_REQUEST)){
  $desc=slashquote($_REQUEST["description"]);
  if($set!=""){$set.=', ';}
  $set.="description='$desc'";
}
if(array_key_exists ("startyear",$_REQUEST)){
  $startyear=slashquote($_REQUEST["startyear"]);
  if($set!=""){$set.=', ';}
  $set.="start_year='$startyear'";
}
if(array_key_exists ("identifiedval",$_REQUEST)
   && is_numeric($_REQUEST["identifiedval"])){
  $identval=floatval($_REQUEST["identifiedval"]);
  if($set!=""){$set.=', ';}
  $set.="identified_value=$identval";
}
if(array_key_exists ("deliveredval",$_REQUEST)
   && is_numeric($_REQUEST["deliveredval"])){
  $delivval=floatval($_REQUEST["deliveredval"]);
  if($set!=""){$set.=', ';}
  $set.="delivered_value=$delivval";
}
if(array_key_exists ("status",$_REQUEST)){
  $status=slashquote($_REQUEST["status"]);
  if($set!=""){$set.=', ';}
  $set.="status='$status'";
}
$q="update project_past_initiative set $set
  where coid=$coid and buid=$buid and pjid='$pjid' and pjpiid='$init'";
if($set!=""){
  $result=obtain_query_result($q);
}
echo '["",""]';

?>
