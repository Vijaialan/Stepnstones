<?php
// [company bu] project ssname
// (ad::add-ss project ssname)
// 2017-09 add handle as another required arg
require 'CONNECT_TO_DB.php';
//$row is the row of person for this user
//$admin is "admin" if the person works for CMS, otherwise ""
if($admin!="admin"){
  die('["ERROR", "You are not permitted to do this operation!"]');
}

$coid=getcompany();
$buid=getbu();
$pjid=getproject();

if(array_key_exists ("ssname",$_REQUEST)){
  $ssname=slashquote($_REQUEST["ssname"]);
}else{
  missing("ssname");
}
if(array_key_exists ("handle",$_REQUEST)){
  $handle=slashquote($_REQUEST["handle"]);
}else{
  missing("handle");
}

if(array_key_exists ("priority",$_REQUEST)){
  $priority=slashquote($_REQUEST["priority"]);
}else{
  missing("priority");
}

if(array_key_exists ("ss_strategic_options",$_REQUEST)){
  $ss_strategic_options=slashquote($_REQUEST["ss_strategic_options"]);
}else{
  missing("ss_strategic_options");
}
$ss_strategic_options_arr = [];
$each_ss_so = [];
if($ss_strategic_options != '') $ss_strategic_options_arr = explode(",", $ss_strategic_options);
if(count($ss_strategic_options_arr)){
foreach($ss_strategic_options_arr as $ssso) {
  $ce_cd_so = explode("-", $ssso);
  $each_ss_so[] = array('ce' => $ce_cd_so[0],'cd' => $ce_cd_so[1],'so' => $ce_cd_so[2]);
}
}

$q="select * from project where
 coid=$coid and buid=$buid and pjid=$pjid";
$result=obtain_query_result($q);
if(!mysqli_fetch_assoc($result)) {
  die('["ERROR", "Project does not exist!"]');
}

$q="insert into strategy_statement set
 coid=$coid, buid=$buid, pjid=$pjid, ss_desc='$ssname',ss_handle='$handle', priority='$priority'";
 
$result=obtain_query_result($q);

$q="select last_insert_id() newid";
$result=obtain_query_result($q);
if($row=mysqli_fetch_assoc($result)) {
  if(count($each_ss_so)){
    foreach($each_ss_so as $essso) {
      $ceid = $essso['ce'];
      $cdid = $essso['cd'];
      $soid = $essso['so'];
      $ssid = $row['newid'];
      $ss_so_sql = "insert into ss_so set
     coid=$coid, buid=$buid, pjid=$pjid, ceid=$ceid, cdid=$cdid, 
     ssid=$ssid, soid='$soid'";
     $result=obtain_query_result($ss_so_sql);
    }
  }
  die(json_encode(array("",$row['newid']))); // success
}else{
  die('["ERROR", "insert did not return a new row!"]');
}

?>
