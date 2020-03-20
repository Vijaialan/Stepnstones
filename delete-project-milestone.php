<?php
// 2017-07 modeled on delete-goal
// [company bu] project milestone

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

if(array_key_exists ("milestone",$_REQUEST) && is_numeric($_REQUEST["milestone"])){
  $milestone=intval($_REQUEST["milestone"]);
}else{
  missing("milestone");
}
$q="delete from project_milestone where coid=$coid and buid=$buid and pjid=$pjid
 and pjmsid=$milestone";
$result=obtain_query_result($q);

echo '["",""]';

?>
