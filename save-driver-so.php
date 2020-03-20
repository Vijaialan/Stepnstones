<?php
// [company bu project ce] driver soid desc select
// (ad::save-driver-so driver soid desc select)
// 2017-07 add status to update so_status
require 'CONNECT_TO_DB.php';
//$row is the row of person for this user
//$admin is "admin" if the person works for CMS, otherwise ""
if($admin!="admin"){
  die('["ERROR", "You are not permitted to do this operation!"]');
}

$coid=getcompany();
$buid=getbu();
$pjid=getproject();
$ceid=getce();
$cdid=getdriver();
$soid=getso();

$set="";
if(array_key_exists ("desc",$_REQUEST)){
  $desc=slashquote($_REQUEST["desc"]);
  if($set!=""){$set.=', ';}
  $set.="so_desc='$desc'";
}
if(array_key_exists ("select",$_REQUEST) && is_numeric($_REQUEST["select"])){
  $select=intval($_REQUEST["select"]);
  if($set!=""){$set.=', ';}
  $set.="selected=$select";
}
if(array_key_exists ("status",$_REQUEST)){
  $stat=slashquote($_REQUEST["status"]);
  if($set!=""){$set.=', ';}
  $set.="so_status='$stat'";
}
$q="select * from cost_driver_so where
 coid=$coid and buid=$buid and pjid=$pjid and ceid=$ceid and cdid=$cdid
 and soid='$soid'";
$result=obtain_query_result($q);
if(!mysqli_fetch_assoc($result)) {
  die('["ERROR", "cost driver so does not exist"]');
}
$q="update cost_driver_so set $set where
 coid=$coid and buid=$buid and pjid=$pjid and ceid=$ceid and cdid=$cdid
 and soid='$soid'";
if($set!=""){
  $result=obtain_query_result($q);
}

echo '["",""]';

?>
