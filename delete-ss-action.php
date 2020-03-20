<?php
// [company bu project] ss action
// (ad::delete-ss-action ss action)
require 'CONNECT_TO_DB.php';
//$row is the row of person for this user
//$admin is "admin" if the person works for CMS, otherwise ""
if($admin!="admin"){
  die('["ERROR", "not permitted"]');
}

$coid=getcompany();
$buid=getbu();
$pjid=getproject();
$ssid=getss();
$actionid=getaction();

$q="select * from action where
 coid=$coid and buid=$buid and pjid=$pjid and ssid=$ssid and actionid=$actionid";
$result=obtain_query_result($q);
if(!$row2=mysqli_fetch_assoc($result)) {
  die('["ERROR", "action not found"]');
}

$ord=$row2['ordering'];
$q="update action set ordering=ordering-1 where
 coid=$coid and buid=$buid and pjid=$pjid and ssid=$ssid and ordering>$ord";
$result=obtain_query_result($q);

$q="delete from action where
 coid=$coid and buid=$buid and pjid=$pjid and ssid=$ssid and actionid=$actionid";
$result=obtain_query_result($q);
echo '["",""]';

?>
