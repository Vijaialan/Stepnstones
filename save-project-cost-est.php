<?php
//  required: company bu project costest (all id's)
// optional: description value

require 'CONNECT_TO_DB.php';
//$row is the row of person for this user
//$admin is "admin" if the person works for CMS, otherwise ""
if($admin!="admin"){
  die('["ERROR", "You are not permitted to do this operation!"]');
}

$coid=getcompany();
$buid=getbu();
$pjid=getproject();

$q="select * from project where coid=$coid and buid=$buid and pjid=$pjid";
$result=obtain_query_result($q);
if(!mysqli_fetch_assoc($result)) {
  die('["ERROR", "Project does not exist!"]');
}

if(array_key_exists ("costest",$_REQUEST) && is_numeric($_REQUEST["costest"])){
  $costest=intval($_REQUEST["costest"]);
}else{
  missing("costest");
}
$set="";
if(array_key_exists ("description",$_REQUEST)){
  $desc=slashquote($_REQUEST["description"]);
  $set="description='$desc'";
}
if(array_key_exists ("value",$_REQUEST) && is_numeric($_REQUEST["value"])){
  $value=floatval($_REQUEST["value"]);
  if($set!=""){$set.=', ';}
  $set.="value=$value";
}

$q="update project_cost_estimate set $set
  where coid=$coid and buid=$buid and pjid='$pjid' and pjceid='$costest'";
if($set!=""){
  $result=obtain_query_result($q);
}
echo '["",""]';

?>
