<?php
// [company bu] project ce dname pos
// I consider all to be required args
// all but dname are integers
// (ad::add-driver-to-project project ce dname pos)
require 'CONNECT_TO_DB.php';
//$row is the row of person for this user
//$admin is "admin" if the person works for CMS, otherwise ""
if($admin!="admin"){
  die('["ERROR", "You are not permitted to do this operation!"]');
}
$set="";
$coid=getcompany();
$buid=getbu();
$pjid=getproject();
$ceid=getce();

if(array_key_exists ("pos",$_REQUEST)){
  $pos=slashquote($_REQUEST["pos"]);
}else{
  missing("pos");
}
if(is_numeric($pos)){
  $pos=intval($pos);
} else{
  die('["ERROR", "non-numeric value for pos"]');
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

$q="select * from cost_element where
 coid=$coid and buid=$buid and pjid=$pjid and ceid=$ceid";
$result=obtain_query_result($q);
if(!mysqli_fetch_assoc($result)) {
  die('["ERROR", "Cost element does not exist!"]');
}
$q="update cost_driver set position=position+1, $set where
 coid=$coid and buid=$buid and pjid=$pjid and ceid=$ceid
 and position>=$pos";
$result=obtain_query_result($q);

$q="insert into cost_driver set coid=$coid, buid=$buid, pjid='$pjid',
  ceid=$ceid, position = $pos, $set";

$result=obtain_query_result($q);

$q="select last_insert_id() newid";
$result=obtain_query_result($q);
if($row=mysqli_fetch_assoc($result)) {
  die(json_encode(array("",$row['newid']))); // this is success
}else{
  die('["ERROR", "insert did not return a new row!"]');
}
?>
