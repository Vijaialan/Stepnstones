<?php
// name address assets units url telephone supplierp
require 'CONNECT_TO_DB.php';
//$row is the row of person for this user
//$admin is "admin" if the person works for CMS, otherwise ""
if($admin!="admin"){
  die('["ERROR", "not permitted"]');
}
if(array_key_exists ("name",$_REQUEST)){
  $name=slashquote($_REQUEST["name"]);
}else{
  missing("name");
}
if($name==""){
  die('["ERROR", "empty name not permitted"]');
}
if(array_key_exists ("address",$_REQUEST)){
  $address=slashquote($_REQUEST["address"]);
}else{
  $address="";
}
if(array_key_exists ("assets",$_REQUEST) && is_numeric($_REQUEST["assets"])){
  $assets=floatval($_REQUEST["assets"]);
}else{
  $assets=0;
}
if(array_key_exists ("units",$_REQUEST)){
  $units=slashquote($_REQUEST["units"]);
}else{
  $units="";
}
if(array_key_exists ("url",$_REQUEST)){
  $url=slashquote($_REQUEST["url"]);
}else{
  $url="";
}
if(array_key_exists ("telephone",$_REQUEST)){
  $telephone=slashquote($_REQUEST["telephone"]);
}else{
  $telephone="";
}
if(array_key_exists ("supplierp",$_REQUEST)){
  $supplierp=1;
}else{
  $supplierp=0;
}

/* (setf output
    (ad::add-company name (or address "") 
		     (or (if (stringp assets)
		     (read-from-string assets nil nil)) 0)
		     (or units "")
		     (or url "")
		     (or telephone "") supplierp))
*/
$q="select * from company where co_name='$name'";
$result=obtain_query_result($q);
if(mysqli_fetch_assoc($result)) {
  die('["ERROR", "Company already exists!"]');
}
$q="insert into company set co_name='$name', co_address='$address',
  co_assets=$assets, co_assets_unit='$units', co_website='$url',
  co_phone='$telephone', co_supplier=$supplierp";
$result=obtain_query_result($q);
$q="select last_insert_id() newid";
$result=obtain_query_result($q);
if($row=mysqli_fetch_assoc($result)) {
  die(json_encode(array("",$row['newid']))); // this is success
}else{
  die('["ERROR", "insert did not return a new row!"]');
}
?>
