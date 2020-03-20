<?php
// obj name address assets units url telephone supplierp
require 'CONNECT_TO_DB.php';
//$row is the row of person for this user
//$admin is "admin" if the person works for CMS, otherwise ""
if($admin!="admin"){
  die('["ERROR", "not permitted"]');
}
if(array_key_exists ("obj",$_REQUEST)){
  $coid=slashquote($_REQUEST["obj"]);
}else{
  missing("obj");
}
if(is_numeric($coid)){
  $coid=intval($coid);
} else{
  die('["ERROR", "non-numeric value for obj"]');
}
$q="select * from company where coid=$coid";
$result=obtain_query_result($q);
if(!mysqli_fetch_assoc($result)) {
  die('["ERROR", "Company does not exist"]');
}

$set="";
if(array_key_exists ("name",$_REQUEST)){
  $name=slashquote($_REQUEST["name"]);
  if($name!=""){
    $set="co_name='$name'";
  }
}
if(array_key_exists ("address",$_REQUEST)){
  $address=slashquote($_REQUEST["address"]);
  if($set!=""){$set.=', ';}
  $set.="co_address='$address'";
}
if(array_key_exists ("assets",$_REQUEST) && is_numeric($_REQUEST["assets"])){
  $assets=floatval($_REQUEST["assets"]);
  if($set!=""){$set.=', ';}
  $set.="co_assets='$assets'";
}
if(array_key_exists ("units",$_REQUEST)){
  $units=slashquote($_REQUEST["units"]);
  if($set!=""){$set.=', ';}
  $set.="co_assets_unit='$units'";
}
if(array_key_exists ("url",$_REQUEST)){
  $url=slashquote($_REQUEST["url"]);
  if($set!=""){$set.=', ';}
  $set.="co_website='$url'";
}
if(array_key_exists ("telephone",$_REQUEST)){
  $telephone=slashquote($_REQUEST["telephone"]);
  if($set!=""){$set.=', ';}
  $set.="co_phone='$telephone'";
}
if(array_key_exists("supplierp",$_REQUEST) &&
   ($_REQUEST["supplierp"]=="1" || $_REQUEST["supplierp"]=="0")){
  if($set!=""){$set.=', ';}
  $set.="co_supplier=".$_REQUEST["supplierp"];
}
$q="update company set $set where coid=$coid";
if($set!=""){
  $result=obtain_query_result($q);
}
echo '["",""]';
?>
