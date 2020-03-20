<?php
// [company bu project] ss desc priority constraints leveragable amount comment
// 2016-11 - add status, 2017-07 add handle
// (ad::save-ss ss ...)
require 'CONNECT_TO_DB.php';
//$row is the row of person for this user
//$admin is "admin" if the person works for CMS, otherwise ""
if($admin!="admin"){
  die('["ERROR", "You are not permitted to do this operation!"]');
}

$coid=getcompany();
$buid=getbu();
$pjid=getproject();
$ssid=getss();

$q="select * from strategy_statement where
 coid=$coid and buid=$buid and pjid=$pjid and ssid=$ssid";
$result=obtain_query_result($q);
if(!mysqli_fetch_assoc($result)) {
  die('["ERROR", "ss does not exist"]');
}
$set="";
if(array_key_exists ("desc",$_REQUEST)){
  $desc=slashquote($_REQUEST["desc"]);
  if($set!=""){$set.=', ';}
  $set.="ss_desc='$desc'";
}
if(array_key_exists ("priority",$_REQUEST)){
  $priority=slashquote($_REQUEST["priority"]);
  if($set!=""){$set.=', ';}
  $set.="priority='$priority'";
}
if(array_key_exists ("constraints",$_REQUEST)){
  $constraints=slashquote($_REQUEST["constraints"]);
  if($set!=""){$set.=', ';}
  $set.="ss_constraint='$constraints'";
}
if(array_key_exists ("startdate",$_REQUEST)){
  $startdate=slashquote($_REQUEST["startdate"]);
  if($startdate != '') {
    $edtemp = strtotime($startdate);
    $startdate = date('Y-m-d H:i:s', $edtemp);
    if($set!=""){$set.=', ';}
    $set.="ss_startdate='$startdate'";
  }
}
if(array_key_exists ("enddate",$_REQUEST)){
  $enddate=slashquote($_REQUEST["enddate"]);
  if($enddate != '') {
    $edtemp = strtotime($enddate);
    $enddate = date('Y-m-d H:i:s', $edtemp);
    if($set!=""){$set.=', ';}
    $set.="ss_enddate='$enddate'";
  }
}
if(array_key_exists ("ssowner",$_REQUEST)){
  $ssowner=slashquote($_REQUEST["ssowner"]);
  if($ssowner != '') {
    if($set!=""){$set.=', ';}
  $set.="ss_owner='$ssowner'";
  }
  // $ssowner = 1;
  
}
if(array_key_exists ("leveragable",$_REQUEST)
   && is_numeric($_REQUEST["leveragable"])){
  $leveragable=intval($_REQUEST["leveragable"]);
  if($set!=""){$set.=', ';}
  $set.="leveragable=$leveragable";
}
if(array_key_exists ("amount",$_REQUEST)
   && is_numeric($_REQUEST["amount"])){
  $leveragableamount=floatval($_REQUEST["amount"]);
  if($set!=""){$set.=', ';}
  $set.="leveragableamount=$leveragableamount";
}
if(array_key_exists ("comment",$_REQUEST)){
  $comment=slashquote($_REQUEST["comment"]);
  if($set!=""){$set.=', ';}
  $set.="leveragablecomment='$comment'";
}
if(array_key_exists ("status",$_REQUEST)){
  $status=slashquote($_REQUEST["status"]);
  if($set!=""){$set.=', ';}
  $set.="ss_status='$status'";
}
if(array_key_exists ("handle",$_REQUEST)){
  $handle=slashquote($_REQUEST["handle"]);
  if($set!=""){$set.=', ';}
  $set.="ss_handle='$handle'";
}

$q="update strategy_statement set $set where
 coid=$coid and buid=$buid and pjid=$pjid and ssid=$ssid";
if($set!=""){
  $result=obtain_query_result($q);
}
echo '["",""]';

?>
