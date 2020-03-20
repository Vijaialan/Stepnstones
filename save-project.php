<?php
//  obj sn savings curr desc [company bu]
// 2016-11 - add status
require 'CONNECT_TO_DB.php';
//$row is the row of person for this user
//$admin is "admin" if the person works for CMS, otherwise ""
if($admin!="admin"){
  die('["ERROR", "You are not permitted to do this operation!"]');
}
$coid=getcompany();
$buid=getbu();

if(array_key_exists ("obj",$_REQUEST)){
  $pjid=slashquote($_REQUEST["obj"]);
}else{
  missing("obj");
}
if(is_numeric($pjid)){
  $pjid=intval($pjid);
} else{
  die('["ERROR", "non-numeric value for obj"]');
}
$q="select * from project where pjid=$pjid";
$result=obtain_query_result($q);
if(!mysqli_fetch_assoc($result)) {
  die('["ERROR", "Project does not exist!"]');
}
$set="";

if(array_key_exists ("sn",$_REQUEST)){
  $sn=slashquote($_REQUEST["sn"]);
  if($sn!=""){
    $set="pj_name='$sn'";
  }
}
if(array_key_exists ("desc",$_REQUEST)){
  $desc=slashquote($_REQUEST["desc"]);
  if($set!=""){$set.=', ';}
  $set.="pj_desc='$desc'";
}

if(array_key_exists ("savings",$_REQUEST) && is_numeric($_REQUEST["savings"])){
  $savings=floatval($_REQUEST["savings"]);
  if($set!=""){$set.=', ';}
  $set.="pj_potentialsaving=$savings";
}
if(array_key_exists ("curr",$_REQUEST)){
  $curr=slashquote($_REQUEST["curr"]);
  if($set!=""){$set.=', ';}
  $set.="pj_costunit='$curr'";
}
if(array_key_exists ("status",$_REQUEST)){
  $status=slashquote($_REQUEST["status"]);
  if($set!=""){$set.=', ';}
  $set.="pj_status='$status'";
}
if(array_key_exists ("scope",$_REQUEST)){
  // print_r($_REQUEST["scope"]);
  $scope=slashquote($_REQUEST["scope"]);
  if($set!=""){$set.=', ';}
  $set.="pj_scope='$scope'";
}
if(array_key_exists ("comment",$_REQUEST)){
  $comment=slashquote($_REQUEST["comment"]);
  if($set!=""){$set.=', ';}
  $set.="pj_comment='$comment'";
}


/* (ad::add-project pn bu company savings curr desc)
*/
$q="select * from busunit where buid=$buid and coid=$coid";
$result=obtain_query_result($q);
if(!mysqli_fetch_assoc($result)) {
  die('["ERROR", "No such company/busunit!"]');
}
if($set!=""){$set.=', ';}
$set.="coid='$coid'";
if($set!=""){$set.=', ';}
$set.="buid='$buid'";
$q="update project set $set where pjid=$pjid";
// echo $q;
if($set!=""){
  $result=obtain_query_result($q);
}
echo '["",""]';
?>
