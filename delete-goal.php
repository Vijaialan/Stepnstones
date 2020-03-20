<?php
//  [company bu] project goal

require 'CONNECT_TO_DB.php';
//$row is the row of person for this user
//$admin is "admin" if the person works for CMS, otherwise ""
if($admin!="admin"){
  die('["ERROR", "not permitted"]');
}

$coid=getcompany();
$buid=getbu();
$pjid=getproject();

$q="select * from project where coid=$coid and buid=$buid and pjid=$pjid";
$result=obtain_query_result($q);
if(!mysqli_fetch_assoc($result)) {
  die('["ERROR", "Project does not exist!"]');
}

// goal perspective stakeholder
if(array_key_exists ("goal",$_REQUEST)){
  $goal=slashquote($_REQUEST["goal"]);
}else{
  missing("goal");
}
$q="delete from project_goal where coid=$coid and buid=$buid and pjid='$pjid'
 and goal='$goal'";
$result=obtain_query_result($q);

echo '["",""]';

?>
