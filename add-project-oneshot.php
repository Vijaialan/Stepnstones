<?php
//  pn desc savings curr buname bu compname company suppname supplier)
require 'CONNECT_TO_DB.php';
//$row is the row of person for this user
//$admin is "admin" if the person works for CMS, otherwise ""
if($admin!="admin"){
  die('["ERROR", "You are not permitted to do this operation!"]');
}
//echo '<pre>',var_dump($_REQUEST); exit;
if(array_key_exists ("pn",$_REQUEST)){
  $pn=slashquote($_REQUEST["pn"]);
}else{
  missing("pn");
}

if($pn==""){
  die('["ERROR", "empty pn not permitted"]');
}
if(array_key_exists ("desc",$_REQUEST)){
  $desc=slashquote($_REQUEST["desc"]);
}else{
  $desc="";
}

if(array_key_exists ("savings",$_REQUEST) && is_numeric($_REQUEST["savings"])){
  $savings=floatval($_REQUEST["savings"]);
}else{
  missing("savings");
}
if(array_key_exists ("curr",$_REQUEST)){
  $curr=slashquote($_REQUEST["curr"]);
}else{
  missing("curr");
}

// exactly one of company (int) or compname (string) to be supplied
$compname="";$company=""; // one not supplied will be ""
$coid="";
if(array_key_exists ("compname",$_REQUEST)){
  $compname=slashquote($_REQUEST["compname"]);
  if($compname==""){
    die('["ERROR", "empty company name not permitted"]');
  }
}else{
  $coid=getcompany();
}

// exactly one of bu (int) or buname (string) to be supplied
$buname="";$bu=""; // one not supplied will be ""
if(array_key_exists ("buname",$_REQUEST)){
  $buname=slashquote($_REQUEST["buname"]);
  if($buname==""){
    die('["ERROR", "empty bu name not permitted"]');
  }
}else{
  $buid=getbu();
}
$addco=$addbu=$addsup=0;
$q="start transaction";
$result=obtain_query_result($q);

if($coid!=""){
  $q="select * from company where coid=$coid";
  $result=obtain_query_result($q);
  if(!mysqli_fetch_assoc($result)) {
    die('["ERROR", "No such company"]');
    }
  } else {
  $addco=1;
  $q="insert into company set co_name='$compname', co_address='',
   co_assets=0, co_assets_unit='', co_website='',
   co_phone=''";
  $result=obtain_query_result($q);
  $q="select last_insert_id() newid";
  $result=obtain_query_result($q);
  if($row=mysqli_fetch_assoc($result)) {
    $coid=$row['newid'];
    }else{
    die('["ERROR", "insert company did not return a new row!"]');
    }
  }
if(isset($buid) && $buid!=""){
  $q="select * from busunit where buid=$buid and coid=$coid";
  $result=obtain_query_result($q);
  if(!mysqli_fetch_assoc($result)) {
    die('["ERROR", "No such company/busunit!"]');
    }
  } else {
  $addbu=1;
  $q="insert into busunit set coid=$coid, bu_name='$buname',
   bu_description='', bu_budget=0, bu_budget_unit='', bu_divname='',
   bu_divdesc='', bu_divloc=''";
  $result=obtain_query_result($q);
  $q="select last_insert_id() newid";
  $result=obtain_query_result($q);
  if($row=mysqli_fetch_assoc($result)) {
    $buid=$row['newid'];
  }else{
    die('["ERROR", "insert busunit did not return a new row!"]');
    }
  }
/*
$q="select * from project where coid=$coid and buid=$buid and pj_name='$pn'";
$result=obtain_query_result($q);
if(mysqli_fetch_assoc($result)) {
  die('["ERROR", "Project already exists!"]');
}
*/

$q="insert into project set coid=$coid, buid=$buid, pj_name='$pn',
  pj_desc='$desc', pj_creationtime=now(), pj_lastmodtime=now(),
  pj_primarycostrationale='$desc',pj_primarycost='$pn',
  pj_primarycostamt=$savings, pj_costunit='$curr',
  pj_primarycostleveragable=0, pj_primarycostacquisition=0,
  pj_primarycostusage=0,pj_primarycosteol=0,
  pj_potentialsaving=$savings, pj_scope='', pj_comment=''";
$result=obtain_query_result($q);
$q="select last_insert_id() newid";
$result=obtain_query_result($q);
if($row=mysqli_fetch_assoc($result)) {
  $pjid=$row['newid'];
}else{
  die('["ERROR", "insert project did not return a new row!"]');
}
$supplier="";

if(array_key_exists ("suppliers",$_REQUEST) || array_key_exists("suppname",$_REQUEST))
{
  if(array_key_exists ("suppliers",$_REQUEST))
  {
      $suppliers=slashquote($_REQUEST["suppliers"]);
      $suppliers_array = explode(',', $suppliers);
      foreach ($suppliers_array as $key => $newsupplier) {
      # code...
      $q="insert into project_supplies set coid=$coid, buid='$buid',
      pjid='$pjid', supplier_coid=$newsupplier";
      $result=obtain_query_result($q);
      }
  }
}

else if(!array_key_exists ("suppliers",$_REQUEST) && !array_key_exists("suppname",$_REQUEST))
{
      missing("suppliers");
}
else{
  $suppname=slashquote($_REQUEST["suppname"]);
}

//if existing suppliers exists
/*foreach ($suppliers_array as $key => $newsupplier) {
  # code...
  $q="insert into project_supplies set coid=$coid, buid='$buid',
  pjid='$pjid', supplier_coid=$newsupplier";
$result=obtain_query_result($q);
}*/

if(array_key_exists ("suppname",$_REQUEST)){
  $suppname=slashquote($_REQUEST["suppname"]);
  $addsup=1;
  $q="insert into company set co_name='$suppname', co_address='',
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
$result=array($pjid,($addco)?$coid:"",($addbu)?$buid:"",($addsup)?$supplier:"");
echo(json_encode(array("",$result)));

/*if($new_supplier!=""){
  $q= "insert into project_supplies (supplier_coid) VALUES ($new_supplier)";
}*/
?>
