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
if(array_key_exists ("handle",$_REQUEST)){
  $handle=slashquote($_REQUEST["handle"]);
  if($set!=""){$set.=', ';}
  $set.="ss_handle='$handle'";
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

$q="update strategy_statement set $set where
 coid=$coid and buid=$buid and pjid=$pjid and ssid=$ssid";
if($set!=""){
  $result=obtain_query_result($q);
}
$q="delete from ss_so where ssid=$ssid";
   $result=obtain_query_result($q);
if(count($each_ss_so)){
    foreach($each_ss_so as $essso) {
      $ceid = $essso['ce'];
      $cdid = $essso['cd'];
      $soid = $essso['so'];
      $ss_so_sql = "insert into ss_so set
     coid=$coid, buid=$buid, pjid=$pjid, ceid=$ceid, cdid=$cdid, 
     ssid=$ssid, soid='$soid'";
     $result=obtain_query_result($ss_so_sql);
    }
  }
echo '["",""]';

?>
