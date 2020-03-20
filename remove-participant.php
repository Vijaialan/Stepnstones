<?php
// company bu project  person 
// (ad::remove-participant project person)

require 'CONNECT_TO_DB.php';
//$row is the row of person for this user
//$admin is "admin" if the person works for CMS, otherwise ""
if($admin!="admin"){
  die('["ERROR", "not permitted"]');
}
if(array_key_exists ("person",$_REQUEST)){
  $pnid=slashquote($_REQUEST["person"]);
}else{
  missing("person");
}
if(is_numeric($pnid)){
  $pnid=intval($pnid);
} else{
  die('["ERROR", "non-numeric value for person"]');
}

if(array_key_exists ("company",$_REQUEST)){
  $coid=slashquote($_REQUEST["company"]);
}else{
  missing("company");
}
if(is_numeric($coid)){
  $coid=intval($coid);
} else{
  die('["ERROR", "non-numeric value for company"]');
}

if(array_key_exists ("bu",$_REQUEST)){
  $buid=slashquote($_REQUEST["bu"]);
}else{
  missing("bu");
}
if(is_numeric($buid)){
  $buid=intval($buid);
} else{
  die('["ERROR", "non-numeric value for bu"]');
}

if(array_key_exists ("project",$_REQUEST)){
  $pjid=slashquote($_REQUEST["project"]);
}else{
  missing("project");
}
if(is_numeric($pjid)){
  $pjid=intval($pjid);
} else{
  die('["ERROR", "non-numeric value for project"]');
}

$q="select * from project where coid=$coid and buid=$buid and pjid=$pjid";
$result=obtain_query_result($q);
if(!mysqli_fetch_assoc($result)) {
  die('["ERROR", "No such project!"]');
}
$q="select * from person where pnid=$pnid";
$result=obtain_query_result($q);
if(! $personrow=mysqli_fetch_assoc($result)) {
  die('["ERROR", "No such person!"]');
}

$q="delete from project_team where coid=$coid and buid='$buid'
  and pjid='$pjid' and personid=$pnid";
$result=obtain_query_result($q);

echo '["", ""]';
?>
