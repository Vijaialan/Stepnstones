<?php
//  [company bu] project oldgoal goal perspective stakeholder

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

// oldgoal goal perspective stakeholder
if(array_key_exists ("oldgoal",$_REQUEST)){
  $oldgoal=slashquote($_REQUEST["oldgoal"]);
}else{
  missing("oldgoal");
}
$set="";
if(array_key_exists ("goal",$_REQUEST)){
  $goal=slashquote($_REQUEST["goal"]);
  $set="goal='$goal'";
}

if(array_key_exists ("perspective",$_REQUEST)){
  $perspective=slashquote($_REQUEST["perspective"]);
  if($set!=""){$set.=', ';}
  $set.="perspective='$perspective'";
}
if(array_key_exists ("stakeholder",$_REQUEST)){
  $stakeholder=slashquote($_REQUEST["stakeholder"]);
  if($set!=""){$set.=', ';}
  $set.="stakeholder='$stakeholder'";
}

$q="update project_goal set $set where coid=$coid and buid=$buid and pjid='$pjid'
 and goal='$oldgoal'";
if($set!=""){
  $result=obtain_query_result($q);
}
echo '["",""]';

?>
