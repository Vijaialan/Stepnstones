<?php
// [company bu project ss] oldperson olddate comment date value person
// assume company bu project ss + person,date is a key
// you can have more than one but you edit or delete all together

require 'CONNECT_TO_DB.php';
//$row is the row of person for this user
//$admin is "admin" if the person works for CMS, otherwise ""
if($admin!="admin"){
  die('["ERROR", "You are not permitted to do this operation!"]');
}

$coid=getcompany();
$buid=getbu();
$pjid=getproject();
$ssid=getss();

if(array_key_exists ("olddate",$_REQUEST)){
  $olddate=slashquote($_REQUEST["olddate"]);
}else{
  missing("olddate");
}
if(array_key_exists ("oldperson",$_REQUEST) && 
   is_numeric($_REQUEST["oldperson"])){
  $oldperson=floatval($_REQUEST["oldperson"]);
  }else{
  missing("oldperson");
}

$set="";
if(array_key_exists ("person",$_REQUEST) && is_numeric($_REQUEST["person"])){
  $person=floatval($_REQUEST["person"]);
  if($set!=""){$set.=', ';}
  $set.="person=$person";
}
if(array_key_exists ("value",$_REQUEST) && is_numeric($_REQUEST["value"])){
  $value=floatval($_REQUEST["value"]);
  if($set!=""){$set.=', ';}
  $set.="value=$value";
}
if(array_key_exists ("comment",$_REQUEST)){
  $comment=slashquote($_REQUEST["comment"]);
  if($set!=""){$set.=', ';}
  $set.="comment='$comment'";
}
if(array_key_exists ("date",$_REQUEST)){
  $date = str_replace('/', '-', $_REQUEST["date"]);
  $date = date('Y-m-d H:i:s', strtotime($date));
  if($set!=""){$set.=', ';}
  $set.="savingsdate='$date'";
}

$q="update strategy_statement_savings set $set where
 coid=$coid and buid=$buid and pjid=$pjid and ssid=$ssid
 and person=$oldperson and savingsdate='$olddate'";
if($set!=""){
  $result=obtain_query_result($q);
}

echo '["",""]';

?>
