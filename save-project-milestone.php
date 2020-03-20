<?php
//  required: company bu project milestone (all id's)
// optional: label date

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
$set="";
if(array_key_exists ("label",$_REQUEST)){
  $label=slashquote($_REQUEST["label"]);
  if($set!=""){$set.=', ';}
  $set.="ms_label='$label'";
}
if(array_key_exists ("date",$_REQUEST)){
  $dt = str_replace('/', '-', $_REQUEST["date"]);
  $dt = date('Y-m-d H:i:s', strtotime($dt));
  if($set!=""){$set.=', ';}
  $set.="ms_date='$dt'";
}
$q="update project_milestone set $set
  where coid=$coid and buid=$buid and pjid=$pjid and pjmsid=$milestone";
if($set!=""){
  $result=obtain_query_result($q);
}
echo '["",""]';

?>
