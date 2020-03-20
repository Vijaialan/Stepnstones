<?php
//  [company bu] project ce driver
// all numeric
// (ad::delete-driver project ce driver)
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

$q="select * from cost_driver where
  coid=$coid and buid=$buid and pjid=$pjid and ceid=$ceid and cdid=$cdid";
$result=obtain_query_result($q);
if(! $row=mysqli_fetch_assoc($result)) {
  die('["ERROR", "Cost driver does not exist!"]');
}
$pos=$row['position'];

$q="delete from cost_driver where coid=$coid and buid=$buid and pjid='$pjid'
 and ceid=$ceid and cdid=$cdid";
$result=obtain_query_result($q);
$q="update cost_driver set position=position-1 
 where coid=$coid and buid=$buid and pjid='$pjid' and ceid=$ceid and
 position>$pos";
$result=obtain_query_result($q);

echo '["",""]';

?>
