<?php
// [company bu project]  ss benefit  newbenefit newval newtype
// 2016-10-29 add newmin, newmax
// (ad::save-ss-benefit ss benefit newbenefit newval newtype)

require 'CONNECT_TO_DB.php';
//$row is the row of person for this user
//$admin is "admin" if the person works for CMS, otherwise ""
if($admin!="admin"){
  die('["ERROR", "not permitted"]');
}

$coid=getcompany();
$buid=getbu();
$pjid=getproject();
$ssid=getss();

if(array_key_exists ("benefit",$_REQUEST)){
  $benefit=slashquote($_REQUEST["benefit"]);
}else{
  missing("benefit");
}

$q="select * from ss_benefit where
 coid=$coid and buid=$buid and pjid=$pjid and ssid=$ssid and description='$benefit'";
$result=obtain_query_result($q);
if(!mysqli_fetch_assoc($result)) {
  die('["ERROR", "benefit not found"]');
}

$set="";
if(array_key_exists ("newval",$_REQUEST) && is_numeric($_REQUEST["newval"])){
  $newval=floatval($_REQUEST["newval"]);
  if($set!=""){$set.=', ';}
  $set.="expected_value=$newval";
}
if(array_key_exists ("newmin",$_REQUEST) && is_numeric($_REQUEST["newmin"])){
  $newmin=floatval($_REQUEST["newmin"]);
  if($set!=""){$set.=', ';}
  $set.="min_value=$newmin";
}
if(array_key_exists ("newmax",$_REQUEST) && is_numeric($_REQUEST["newmax"])){
  $newmax=floatval($_REQUEST["newmax"]);
  if($set!=""){$set.=', ';}
  $set.="max_value=$newmax";
}

if(array_key_exists ("newbenefit",$_REQUEST)){
  $newbenefit=slashquote($_REQUEST["newbenefit"]);
  if($set!=""){$set.=', ';}
  $set.="description='$newbenefit'";
}

if(array_key_exists ("newtype",$_REQUEST)){
  $newtype=slashquote($_REQUEST["newtype"]);
  if($set!=""){$set.=', ';}
  $set.="risk_benefit_type='$newtype'";
}

$q="update ss_benefit set $set where
 coid=$coid and buid=$buid and pjid=$pjid and ssid=$ssid and description='$benefit'";
if($set!=""){
  $result=obtain_query_result($q);
}

echo '["",""]';

?>
