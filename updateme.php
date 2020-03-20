<?php
// like save-person but done by the user
// obj = caller
// uemail not allowed (only admin changes it), same for employer
// leaving: upwd ufirst ulast telephone job
require 'CONNECT_TO_DB.php';
//$row is the row of person for this user
//$admin is "admin" if the person works for CMS, otherwise ""
$pnid=$row['pnid'];

$set="";
if(array_key_exists ("upwd",$_REQUEST)){
  $upwd=slashquote($_REQUEST["upwd"]);
  if($set!=""){$set.=', ';}
  $set.="password='$upwd'";
}
if(array_key_exists ("ufirst",$_REQUEST)){
  $ufirst=slashquote($_REQUEST["ufirst"]);
  if($set!=""){$set.=', ';}
  $set.="firstname='$ufirst'";
}
if(array_key_exists ("ulast",$_REQUEST)){
  $ulast=slashquote($_REQUEST["ulast"]);
  if($set!=""){$set.=', ';}
  $set.="lastname='$ulast'";
}
if(array_key_exists ("telephone",$_REQUEST)){
  $telephone=slashquote($_REQUEST["telephone"]);
  if($set!=""){$set.=', ';}
  $set.="phone_number='$telephone'";
}
if(array_key_exists ("job",$_REQUEST)){
  $job=slashquote($_REQUEST["job"]);
  if($set!=""){$set.=', ';}
  $set.="job_title='$job'";
}

$q="update person set $set where pnid=$pnid";
if($set!=""){
  $result=obtain_query_result($q);
}

echo '["",""]';
?>
