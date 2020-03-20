<?php
// [company bu project ce] driver so
// I consider all to be required args
// all are integers
// (ad::delete-driver-so driver so)
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
$soid=getso();

$q="select * from cost_driver_so where
 coid=$coid and buid=$buid and pjid=$pjid and ceid=$ceid and cdid=$cdid
 and soid=$soid";
$result=obtain_query_result($q);
if(!$row2=mysqli_fetch_assoc($result)) {
  die('["ERROR", "Cost driver so does not exist!"]');
}
// adapted from delete-ss-action
$ord=$row2['ordering'];
$q="update cost_driver_so set ordering=ordering-1 where
 coid=$coid and buid=$buid and pjid=$pjid and ceid=$ceid and cdid=$cdid
 and ordering>$ord";
$result=obtain_query_result($q);

$q="delete from cost_driver_so where
 coid=$coid and buid=$buid and pjid=$pjid and ceid=$ceid and cdid=$cdid
 and soid='$soid'";
$result=obtain_query_result($q);
echo '["",""]';

?>
