<?php
// obj company name desc budget units division division-desc loc
require 'CONNECT_TO_DB.php';
//$row is the row of person for this user
//$admin is "admin" if the person works for CMS, otherwise ""
if($admin!="admin"){
  die('["ERROR", "not permitted"]');
}

if(array_key_exists ("obj",$_REQUEST)){
  $buid=slashquote($_REQUEST["obj"]);
}else{
  missing("obj");
}
if(is_numeric($buid)){
  $buid=intval($buid);
} else{
  die('["ERROR", "non-numeric value for obj"]');
}

if(array_key_exists ("company",$_REQUEST)){
  $company=slashquote($_REQUEST["company"]);
}else{
  missing("company");
}
if(is_numeric($company)){
  $company=intval($company);
} else{
  die('["ERROR", "non-numeric value for company"]');
}
$set="";
if(array_key_exists ("name",$_REQUEST)){
  $name=slashquote($_REQUEST["name"]);
  if($name!=""){
    $set="bu_name='$name'";
  }
}
if(array_key_exists ("desc",$_REQUEST)){
  $desc=slashquote($_REQUEST["desc"]);
  if($set!=""){$set.=', ';}
  $set.="bu_description='$desc'";
}
if(array_key_exists ("budget",$_REQUEST) && is_numeric($_REQUEST["budget"])){
  $budget=floatval($_REQUEST["budget"]);
  if($set!=""){$set.=', ';}
  $set.="bu_budget='$budget'";
}
if(array_key_exists ("units",$_REQUEST)){
  $units=slashquote($_REQUEST["units"]);
  if($set!=""){$set.=', ';}
  $set.="bu_budget_unit='$units'";
}
if(array_key_exists ("division",$_REQUEST)){
  $division=slashquote($_REQUEST["division"]);
  if($set!=""){$set.=', ';}
  $set.="bu_divname='$division'";
}
if(array_key_exists ("division-desc",$_REQUEST)){
  $divisiondesc=slashquote($_REQUEST["division-desc"]);
  if($set!=""){$set.=', ';}
  $set.="bu_divdesc='$divisiondesc'";
}
if(array_key_exists ("loc",$_REQUEST)){
  $loc=slashquote($_REQUEST["loc"]);
  if($set!=""){$set.=', ';}
  $set.="bu_divloc='$loc'";
}
$q="select * from busunit where coid=$company and buid=$buid";
$result=obtain_query_result($q);
if(!mysqli_fetch_assoc($result)) {
  die('["ERROR", "BU does not exist"]');
}
$q="update busunit set $set where coid=$company and buid=$buid";
if($set!=""){
  $result=obtain_query_result($q);
}
echo '["",""]';
?>
