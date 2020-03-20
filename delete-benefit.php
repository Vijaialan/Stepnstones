<?php
// [company bu project]  ss benefit
// (ad::delete-ss-benefit ss benefit)

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

if(array_key_exists ("benefit",$_REQUEST)){
  $benefit=slashquote($_REQUEST["benefit"]);
}else{
  missing("benefit");
}

$q="select * from ss_benefit where
 coid=$coid and buid=$buid and pjid=$pjid and ssid=$ssid and description='$benefit'";
$result=obtain_query_result($q);
if(!mysqli_fetch_assoc($result)) {
  die('["ERROR", "ss benefit not found"]');
}

$q="delete from ss_benefit where
 coid=$coid and buid=$buid and pjid=$pjid and ssid=$ssid and description='$benefit'";
$result=obtain_query_result($q);

echo '["",""]';

?>
