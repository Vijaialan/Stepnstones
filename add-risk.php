<?php
// [company bu project]  ss risk value type
// (ad::add-ss-risk ss risk value type)
//  (++ ss-risk ss rname rval rtype)
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

if(array_key_exists ("value",$_REQUEST)){
  $value=slashquote($_REQUEST["value"]);
}else{
  missing("value");
}
if(is_numeric($value)){
  $value=floatval($value);
} else{
  die('["ERROR", "non-numeric value for value"]');
}

if(array_key_exists ("risk",$_REQUEST)){
  $risk=slashquote($_REQUEST["risk"]);
}else{
  missing("risk");
}

if(array_key_exists ("type",$_REQUEST)){
  $type=slashquote($_REQUEST["type"]);
}else{
  missing("type");
}

$q="select * from strategy_statement where
 coid=$coid and buid=$buid and pjid=$pjid and ssid=$ssid";
$result=obtain_query_result($q);
if(!mysqli_fetch_assoc($result)) {
  die('["ERROR", "ss does not exist!"]');
}

$q="insert into ss_risk set
 coid=$coid, buid=$buid, pjid=$pjid, ssid=$ssid,
 description='$risk', expected_value=$value, risk_benefit_type='$type',
 max_value=$value, min_value=0";
$result=obtain_query_result($q);

echo '["",""]';

?>
