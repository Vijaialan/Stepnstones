<?php
// obj uemail upwd ufirst ulast telephone job employer
require 'CONNECT_TO_DB.php';
//$row is the row of person for this user
//$admin is "admin" if the person works for CMS, otherwise ""
if($admin!="admin"){
  die('["ERROR", "not permitted"]');
}
if(array_key_exists ("obj",$_REQUEST)){
  $pnid=slashquote($_REQUEST["obj"]);
}else{
  missing("obj");
}
if(is_numeric($pnid)){
  $coid=intval($pnid);
} else{
  die('["ERROR", "non-numeric value for obj"]');
}
$q="select * from person where pnid=$pnid";
$result=obtain_query_result($q);
if(!mysqli_fetch_assoc($result)) {
  die('["ERROR", "Person does not exist"]');
}

$set="";
if(array_key_exists ("uemail",$_REQUEST)){
  $uemail=slashquote($_REQUEST["uemail"]);
  if($uemail!=""){
    $set="email_address='$uemail'";
  }
}
if(array_key_exists ("ufirst",$_REQUEST)){
  $ufirst=slashquote($_REQUEST["ufirst"]);
  if($set!=""){$set.=', ';}
  $set.="firstname='$ufirst'";
}
if(array_key_exists ("admin_role",$_REQUEST)){
  $admin_role=slashquote($_REQUEST["admin_role"]);
  if($set!=""){$set.=', ';}
  $set.="role='$admin_role'";
}
if(array_key_exists ("ulast",$_REQUEST)){
  $ulast=slashquote($_REQUEST["ulast"]);
  if($set!=""){$set.=', ';}
  $set.="lastname='$ulast'";
}

if(array_key_exists ("job",$_REQUEST)){
  $job=slashquote($_REQUEST["job"]);
  if($set!=""){$set.=', ';}
  $set.="job_title='$job'";
}

if(array_key_exists ("employer",$_REQUEST)){
  $employer=slashquote($_REQUEST["employer"]);
  if(is_numeric($employer)){
    $employer=intval($employer);
  } else{
    die('["ERROR", "non-numeric value for employer"]');
  }
  $q="select * from company where coid=$employer";
  $result=obtain_query_result($q);
  if(!mysqli_fetch_assoc($result)) {
    die('["ERROR", "employer does not exist"]');
  }
  if($set!=""){$set.=', ';}
  $set.="employer=$employer";
}
$q="update person set $set where pnid=$pnid";
if($set!=""){
  $result=obtain_query_result($q);
}

echo '["",""]';
?>
