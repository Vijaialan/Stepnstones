<?php
// should really be called modify-cost-element
// should REALLY be called save-cost-element
// [company bu]  project ce cename dollars impactable future comment units
// 2017-07 add status
// company bu project ce are ids, dollars also read as number
// (ad::modify-critical-cost ce cename  dollars impactable future comment units)

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

$q="select * from cost_element where coid=$coid and buid=$buid and pjid=$pjid
  and ceid=$ceid";
$result=obtain_query_result($q);
if(!mysqli_fetch_assoc($result)) {
  die('["ERROR", "Cost element not found!"]');
}

$set="";

if(array_key_exists ("cename",$_REQUEST)){
  $cename=slashquote($_REQUEST["cename"]);
  if($set!=""){$set.=', ';}
  $set.="name='$cename'";
}
if(array_key_exists ("dollars",$_REQUEST) && is_numeric($_REQUEST["dollars"])){
  $dollars=floatval($_REQUEST["dollars"]);
  if($set!=""){$set.=', ';}
  $set.="costamt=$dollars";
}
if(array_key_exists ("impactable",$_REQUEST)){
  $impactable=slashquote($_REQUEST["impactable"]);
  if($set!=""){$set.=', ';}
  $set.="impactable='$impactable'";
}
if(array_key_exists ("future",$_REQUEST)){
  $future=slashquote($_REQUEST["future"]);
  if($set!=""){$set.=', ';}
  $set.="future_cash_flow='$future'";
}
if(array_key_exists ("comment",$_REQUEST)){
  $comment=slashquote($_REQUEST["comment"]);
  if($set!=""){$set.=', ';}
  $set.="comment='$comment'";
}
if(array_key_exists ("units",$_REQUEST)){
  $units=slashquote($_REQUEST["units"]);
  if($set!=""){$set.=', ';}
  $set.="costunit='$units'";
}
if(array_key_exists ("status",$_REQUEST)){
  $stat=slashquote($_REQUEST["status"]);
  if($set!=""){$set.=', ';}
  $set.="ce_status='$stat'";
}
$q="update cost_element set $set where coid=$coid and buid=$buid 
 and pjid=$pjid and ceid=$ceid";
if($set!=""){
  $result=obtain_query_result($q);
}
echo '["",""]';
?>
