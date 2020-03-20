<?php
//  [company bu] project ce driver dname pos numerator
//  denominator current target units impact
// 2017-07 add status to update cd_status
// numeric company bu project ce driver pos current target
/* (ad::save-driver-info
       project ce driver
       :position pos :name dname :numerator numerator :denominator denominator
       :currentval current :targetval target :units units :can-impact impact)
*/
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

$q="select * from cost_driver where
  coid=$coid and buid=$buid and pjid=$pjid and ceid=$ceid and cdid=$cdid";
$result=obtain_query_result($q);
if(!mysqli_fetch_assoc($result)) {
  die('["ERROR", "Cost driver does not exist!"]');
}

$set="";

if(array_key_exists ("pos",$_REQUEST) && is_numeric($_REQUEST["pos"])){
  $pos=intval($_REQUEST["pos"]);
  if($set!=""){$set.=', ';}
  $set.="position=$pos";
}
if(array_key_exists ("current",$_REQUEST)){
  $current=slashquote($_REQUEST["current"]);
  if($set!=""){$set.=', ';}
  $set.="currentval='$current'";
}
if(array_key_exists ("target",$_REQUEST)){
  $target=slashquote($_REQUEST["target"]);
  if($set!=""){$set.=', ';}
  $set.="target='$target'";
}

if(array_key_exists ("dname",$_REQUEST)){
  $dname=slashquote($_REQUEST["dname"]);
  if($set!=""){$set.=', ';}
  $set.="name='$dname'";
}
if(array_key_exists ("numerator",$_REQUEST)){
  $numerator=slashquote($_REQUEST["numerator"]);
  if($set!=""){$set.=', ';}
  $set.="numer='$numerator'";
}
if(array_key_exists ("denominator",$_REQUEST)){
  $denominator=slashquote($_REQUEST["denominator"]);
  if($set!=""){$set.=', ';}
  $set.="denom='$denominator'";
}
if(array_key_exists ("units",$_REQUEST)){
  $units=slashquote($_REQUEST["units"]);
  if($set!=""){$set.=', ';}
  $set.="unit='$units'";
}
if(array_key_exists ("impact",$_REQUEST)){
  $impact=slashquote($_REQUEST["impact"]);
  if($set!=""){$set.=', ';}
  $set.="canimprove='$impact'";
}
if(array_key_exists ("status",$_REQUEST)){
  $stat=slashquote($_REQUEST["status"]);
  if($set!=""){$set.=', ';}
  $set.="cd_status='$stat'";
}

$q="update cost_driver set $set where coid=$coid and buid=$buid and pjid='$pjid'
 and ceid=$ceid and cdid=$cdid";
if($set!=""){
  $result=obtain_query_result($q);
}
echo '["",""]';

?>
