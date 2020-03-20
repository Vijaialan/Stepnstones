<?php
// [company bu project]  ss risk
// (ad::delete-ss-risk ss risk)
//  (++ ss-risk ss rname rval rtype)
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

if(array_key_exists ("risk",$_REQUEST)){
  $risk=slashquote($_REQUEST["risk"]);
}else{
  missing("risk");
}

$q="select * from ss_risk where
 coid=$coid and buid=$buid and pjid=$pjid and ssid=$ssid and description='$risk'";
$result=obtain_query_result($q);
if(!mysqli_fetch_assoc($result)) {
  die('["ERROR", "ss risk not found"]');
}

$q="delete from ss_risk where
 coid=$coid and buid=$buid and pjid=$pjid and ssid=$ssid and description='$risk'";
$result=obtain_query_result($q);

echo '["",""]';

?>
