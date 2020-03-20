<?php
// company bu project  supplier
require 'CONNECT_TO_DB.php';
//$row is the row of person for this user
//$admin is "admin" if the person works for CMS, otherwise ""
if($admin!="admin"){
  die('["ERROR", "not permitted"]');
}
if(array_key_exists ("supplier",$_REQUEST)){
  $supcoid=slashquote($_REQUEST["supplier"]);
}else{
  missing("supplier");
}
if(is_numeric($supcoid)){
  $supcoid=intval($supcoid);
} else{
  die('["ERROR", "non-numeric value for supplier"]');
}
$coid=getcompany();
$buid=getbu();
$pjid=getproject();


$q="select * from project where coid=$coid and buid=$buid and pjid=$pjid";
$result=obtain_query_result($q);
if(!mysqli_fetch_assoc($result)) {
  die('["ERROR", "No such project!"]');
}
$q="select * from company where coid=$supcoid";
$result=obtain_query_result($q);
if(!mysqli_fetch_assoc($result)) {
  die('["ERROR", "No such supplier company!"]');
}

$q="insert into project_supplies set coid=$coid, buid='$buid',
  pjid='$pjid', supplier_coid=$supcoid";
$result=obtain_query_result($q);
//new_supplier code goes below
$supplier = '';
if(array_key_exists ("new_supplier",$_REQUEST)){
  $new_supplier=slashquote($_REQUEST["new_supplier"]);
  $addsup=1;
  $q="insert into company set co_name='$new_supplier', co_address='',
   co_assets=0, co_assets_unit='', co_website='',
   co_phone='',co_supplier=1";
  $result=obtain_query_result($q);
  $q="select last_insert_id() newid";
  $result=obtain_query_result($q);
  if($row=mysqli_fetch_assoc($result)) {
    $supplier=$row['newid'];
    }else{
    die('["ERROR", "insert supplier company did not return a new row!"]');
    }
  } else if($supplier!=""){
    $q="select * from company where coid=$supplier";
    $result=obtain_query_result($q);
    if(!mysqli_fetch_assoc($result)) {
     die('["ERROR", "No such supplier company!"]');
    }
  }
if($supplier!=""){
  $q="insert into project_supplies set coid=$coid, buid='$buid',
   pjid='$pjid', supplier_coid=$supplier";
   $result=obtain_query_result($q);
  }
$q="commit";
$result=obtain_query_result($q);
$result=array($pjid,(isset($addco))?$coid:"",(isset($addbu))?$buid:"",(isset($addsup))?$supplier:"");
echo(json_encode(array("",$result)));

?>
