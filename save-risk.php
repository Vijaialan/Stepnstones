<?php
// [company bu project]  ss risk  newrisk newval newtype
// 2016-10-29 add newmin, newmax
// (ad::add-ss-risk ss risk value type)
//  (ad::save-ss-risk ss risk newrisk newval newtype)
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

if(array_key_exists ("risk",$_REQUEST)){
  $risk=slashquote($_REQUEST["risk"]);
}else{
  missing("risk");
}

$q="select * from ss_risk where
 coid=$coid and buid=$buid and pjid=$pjid and ssid=$ssid and description='$risk'";
$result=obtain_query_result($q);
if(!mysqli_fetch_assoc($result)) {
  die('["ERROR", "risk not found"]');
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

if(array_key_exists ("newrisk",$_REQUEST)){
  $newrisk=slashquote($_REQUEST["newrisk"]);
  if($set!=""){$set.=', ';}
  $set.="description='$newrisk'";
}

if(array_key_exists ("newtype",$_REQUEST)){
  $newtype=slashquote($_REQUEST["newtype"]);
  if($set!=""){$set.=', ';}
  $set.="risk_benefit_type='$newtype'";
}

$q="update ss_risk set $set where
 coid=$coid and buid=$buid and pjid=$pjid and ssid=$ssid and description='$risk'";
if($set!=""){
  $result=obtain_query_result($q);
}

echo '["",""]';

?>
