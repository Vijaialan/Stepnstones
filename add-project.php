<?php
// pn bu company savings curr desc
// 2017-07 allow also scope, comment (default to empty)

require 'CONNECT_TO_DB.php';
//$row is the row of person for this user
//$admin is "admin" if the person works for CMS, otherwise ""
if($admin!="admin"){
  die('["ERROR", "You are not permitted to do this operation!"]');
}

$coid=getcompany();
$buid=getbu();

if(array_key_exists ("pn",$_REQUEST)){
  $pn=slashquote($_REQUEST["pn"]);
}else{
  missing("pn");
}
if($pn==""){
  die('["ERROR", "empty pn not permitted"]');
}
if(array_key_exists ("desc",$_REQUEST)){
  $desc=slashquote($_REQUEST["desc"]);
}else{
  $desc="";
}

if(array_key_exists ("savings",$_REQUEST) && is_numeric($_REQUEST["savings"])){
  $savings=floatval($_REQUEST["savings"]);
}else{
  missing("savings");
}
if(array_key_exists ("curr",$_REQUEST)){
  $curr=slashquote($_REQUEST["curr"]);
}else{
  missing("curr");
}
if(array_key_exists ("scope",$_REQUEST)){
  $scope=slashquote($_REQUEST["scope"]);
}else{
  $scope="";
}
if(array_key_exists ("comment",$_REQUEST)){
  $comment=slashquote($_REQUEST["comment"]);
}else{
  $comment="";
}

/* (ad::add-project pn bu company savings curr desc)
*/
$q="select * from busunit where buid=$buid and coid=$coid";
$result=obtain_query_result($q);
if(!mysqli_fetch_assoc($result)) {
  die('["ERROR", "No such company/busunit!"]');
}

/*
$q="select * from project where coid=$coid and buid=$buid and pj_name='$pn'";
$result=obtain_query_result($q);
if(mysqli_fetch_assoc($result)) {
  die('["ERROR", "Project already exists!"]');
}
*/

//      (set-primary-cost obj sn savings curr desc 0)
// (++ primary-cost project cost val curr leveragable acq usage eol)
// = (++ primary-cost obj sn(=pn) savings curr 0 0 0 0)
$q="insert into project set coid=$coid, buid=$buid, pj_name='$pn',
  pj_desc='$desc', pj_creationtime=now(), pj_lastmodtime=now(),
  pj_primarycostrationale='',pj_primarycost='$pn',
  pj_primarycostamt=$savings, pj_costunit='$curr',
  pj_primarycostleveragable=0, pj_primarycostacquisition=0,
  pj_primarycostusage=0,pj_primarycosteol=0,
  pj_potentialsaving=$savings, pj_scope='$scope', pj_comment='$comment'";
$result=obtain_query_result($q);
$q="select last_insert_id() newid";
$result=obtain_query_result($q);
if($row=mysqli_fetch_assoc($result)) {
  die(json_encode(array("",$row['newid']))); // this is success
}else{
  die('["ERROR", "insert did not return a new row!"]');
}
?>
