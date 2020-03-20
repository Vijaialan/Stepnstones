<?php
// company bu project  person role
// (ad::add-participant project person role)

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

$coid=getcompany();
$buid=getbu();
$pjid=getproject();

if(array_key_exists ("role",$_REQUEST)){
  $role=slashquote($_REQUEST["role"]);
}else{
  missing("role");
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
$q="insert into project_team set coid=$coid, buid=$buid,
  pjid=$pjid, personid=$pnid, role='$role', add_date=now(),
  emp_coid=" . $personrow['employer'] . ", job_title='" .
  $personrow['job_title'] . "'";
$result=obtain_query_result($q);

echo '["", ""]';
?>
