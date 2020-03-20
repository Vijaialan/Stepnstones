<?php
// 2017-07 used add-ss as template
// [company bu] project label date
require 'CONNECT_TO_DB.php';
//$row is the row of person for this user
//$admin is "admin" if the person works for CMS, otherwise ""
if($admin!="admin"){
  die('["ERROR", "You are not permitted to do this operation!"]');
}

$coid=getcompany();
$buid=getbu();
$pjid=getproject();

if(array_key_exists ("label",$_REQUEST)){
  $label=slashquote($_REQUEST["label"]);
}else{
  missing("label");
}
if(array_key_exists ("date",$_REQUEST)){
  $dt = str_replace('/', '-', $_REQUEST["date"]);
  $dt = date('Y-m-d H:i:s', strtotime($dt));
}else{
  missing("date");
}
$q="insert into project_milestone set
 coid=$coid, buid=$buid, pjid=$pjid, ms_label='$label',ms_date='$dt'";
$result=obtain_query_result($q);

$q="select last_insert_id() newid";
$result=obtain_query_result($q);
if($row=mysqli_fetch_assoc($result)) {
  die(json_encode(array("",$row['newid']))); // success
}else{
  die('["ERROR", "insert did not return a new row!"]');
}

?>
