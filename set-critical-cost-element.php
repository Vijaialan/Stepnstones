<?php
//  [company bu] project ce criticalp comment
// all but comment are numeric (criticalp 0/1)
// (ad::set-critical-cost-selection project ce criticalp comment)
// just updates cost_element(criticalp tinyint, comment varchar(1024))

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

$q="select * from cost_element where coid=$coid and buid=$buid and pjid=$pjid
  and ceid=$ceid";
$result=obtain_query_result($q);
if(! $row=mysqli_fetch_assoc($result)) {
  die('["ERROR", "Cost element not found!"]');
}

// just updates cost_element(criticalp tinyint, comment varchar(1024))
$set="";

if(array_key_exists ("criticalp",$_REQUEST) && 
   is_numeric($_REQUEST["criticalp"])){
  $criticalp=intval($_REQUEST["criticalp"]);
  if($set!=""){$set.=', ';}
  $set.="criticalp=$criticalp";
}
if(array_key_exists ("comment",$_REQUEST)){
  $comment=slashquote($_REQUEST["comment"]);
  if($set!=""){$set.=', ';}
  $set.="comment='$comment'";
}

$q="update cost_element set $set where coid=$coid and buid=$buid 
 and pjid=$pjid and ceid=$ceid";
if($set!=""){
  $result=obtain_query_result($q);
}
echo '["",""]';
?>
