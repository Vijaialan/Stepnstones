<?php
// [company bu project] ss value [ce cd] option
// (ad::set-ss-option ss option value) -- value is 0/1
/*  (if (= val 1)
      (++ ss-so ss option)
    (-- ss-so ss option))
*/
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

$q="select * from strategy_statement where
 coid=$coid and buid=$buid and pjid=$pjid and ssid=$ssid";
$result=obtain_query_result($q);
if(! $row=mysqli_fetch_assoc($result)) {
  die('["ERROR", "ss does not exist"]');
}

$ceid=getce();
$cdid=getdriver();

if(array_key_exists ("value",$_REQUEST)){
  $value=slashquote($_REQUEST["value"]);
}else{
  missing("value");
}
if(is_numeric($value)){
  $value=intval($value);
} else{
  die('["ERROR", "non-numeric value for value"]');
}

if(array_key_exists ("option",$_REQUEST)){
  $option=slashquote($_REQUEST["option"]);
}else{
  missing("option");
}

$q="select * from cost_driver_so where
 coid=$coid and buid=$buid and pjid=$pjid and ceid=$ceid and cdid=$cdid 
 and soid='$option'";
$result=obtain_query_result($q);
if(! $row=mysqli_fetch_assoc($result)) {
  die('["ERROR", "cost driver so not found"]');
}

$q="select * from ss_so where
 coid=$coid and buid=$buid and pjid=$pjid and ceid=$ceid and cdid=$cdid 
 and ssid=$ssid and soid='$option'";
$result=obtain_query_result($q);
if(! $row=mysqli_fetch_assoc($result)) {
  if($value==0){
    die('["ERROR", "ss option to be removed is already not there"]');
  } else {
  $q="insert into ss_so set
   coid=$coid, buid=$buid, pjid=$pjid, ceid=$ceid, cdid=$cdid, 
   ssid=$ssid, soid='$option'";
   $result=obtain_query_result($q);
  }
} else{ // the tuple is there
  if($value>0){
    die('["ERROR", "ss option to be added is already there"]');
  } else {
  $q="delete from ss_so where
   coid=$coid and buid=$buid and pjid=$pjid and ceid=$ceid and cdid=$cdid 
   and ssid=$ssid and soid='$option'";
   $result=obtain_query_result($q);
  }
}

echo '["",""]';

?>
