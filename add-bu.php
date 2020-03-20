<?php
//  name company desc budget units division division-desc loc
require 'CONNECT_TO_DB.php';
//$row is the row of person for this user
//$admin is "admin" if the person works for CMS, otherwise ""
if($admin!="admin"){
  die('["ERROR", "not permitted"]');
}

$coid=getcompany();

if(array_key_exists ("name",$_REQUEST)){
  $name=slashquote($_REQUEST["name"]);
}else{
  missing("name");
}
if($name==""){
  die('["ERROR", "empty name not permitted"]');
}
if(array_key_exists ("desc",$_REQUEST)){
  $desc=slashquote($_REQUEST["desc"]);
}else{
  missing("desc");
}
if(array_key_exists ("budget",$_REQUEST) && is_numeric($_REQUEST["budget"])){
  $budget=floatval($_REQUEST["budget"]);
}else{
  $budget=0;
}
if(array_key_exists ("units",$_REQUEST)){
  $units=slashquote($_REQUEST["units"]);
}else{
  $units="";
}
if(array_key_exists ("division",$_REQUEST)){
  $division=slashquote($_REQUEST["division"]);
}else{
  $division="";
}
if(array_key_exists ("division-desc",$_REQUEST)){
  $divisiondesc=slashquote($_REQUEST["division-desc"]);
}else{
  $divisiondesc="";
}
if(array_key_exists ("loc",$_REQUEST)){
  $loc=slashquote($_REQUEST["loc"]);
}else{
  $loc="";
}

/* (setf output (ad::create-bu name 
		  (if (stringp company)
		      (read-from-string company nil nil)
		    company)
		  desc 
		  :budget budget :units units
		  :division division :div-desc division-desc
		  :loc loc))
*/
$q="select * from company where coid=$coid";
$result=obtain_query_result($q);
if(!mysqli_fetch_assoc($result)) {
  die('["ERROR", "No such company!"]');
}
$q="select * from busunit where coid=$coid and bu_name='$name'";
$result=obtain_query_result($q);
if(mysqli_fetch_assoc($result)) {
  die('["ERROR", "BU already exists!"]');
}
$q="insert into busunit set coid=$coid, bu_name='$name', bu_description='$desc',
  bu_budget=$budget, bu_budget_unit='$units', bu_divname='$division',
  bu_divdesc='$divisiondesc', bu_divloc='$loc'";
$result=obtain_query_result($q);
$q="select last_insert_id() newid";
$result=obtain_query_result($q);
if($row=mysqli_fetch_assoc($result)) {
  die(json_encode(array("",$row['newid']))); // this is success
}else{
  die('["ERROR", "insert did not return a new row!"]');
}
?>
