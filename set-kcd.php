<?php
// [company bu project ce] driver val
// (ad::set-kcd driver val)
// in addition to setting keyp to val (0/1)
// [if there is no current cost driver detail tuple this
//  sets currentval and target to 0 but I'll ignore that
//  since in this model that stuff must exist
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

if(array_key_exists ("val",$_REQUEST)){
  $val=slashquote($_REQUEST["val"]);
}else{
  missing("val");
}
if(is_numeric($val)){
  $val=intval($val); // should be 0/1
} else{
  die('["ERROR", "non-numeric value for val"]');
}

$q="select * from cost_driver where
 coid=$coid and buid=$buid and pjid=$pjid and ceid=$ceid and cdid=$cdid";
$result=obtain_query_result($q);
if(!mysqli_fetch_assoc($result)) {
  die('["ERROR", "Cost driver does not exist"]');
}
$q="update cost_driver set keyp=$val where
 coid=$coid and buid=$buid and pjid=$pjid and ceid=$ceid and cdid=$cdid";
$result=obtain_query_result($q);
echo '["",""]';

?>
