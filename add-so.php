<?php
// [company bu project ce] driver desc
// I consider all to be required args
// all but desc are integers
// (ad::add-driver-so driver so)
require 'CONNECT_TO_DB.php';
//$row is the row of person for this user
//$admin is "admin" if the person works for CMS, otherwise ""
if($admin!="admin"){
  die('["ERROR", "not permitted"]');
}
$coid=getcompany();
$buid=getbu();
$pjid=getproject();
$ceid=getce();
$cdid=getdriver();

if(array_key_exists ("desc",$_REQUEST)){
  $desc=slashquote($_REQUEST["desc"]);
}else{
  missing("desc");
}

$q="select * from cost_driver where
 coid=$coid and buid=$buid and pjid=$pjid and ceid=$ceid and cdid=$cdid";
$result=obtain_query_result($q);
if(!mysqli_fetch_assoc($result)) {
  die('["ERROR", "Cost driver does not exist!"]');
}

$q="insert into cost_driver_so set
 coid=$coid, buid=$buid, pjid=$pjid, ceid=$ceid, cdid=$cdid, so_desc='$desc'";
$result=obtain_query_result($q);
$q="select last_insert_id() newid";
$result=obtain_query_result($q);
if($row=mysqli_fetch_assoc($result)) {
  die(json_encode(array("",$row['newid']))); // this is success
}else{
  die('["ERROR", "insert did not return a new row!"]');
}
?>
