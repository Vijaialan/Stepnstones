<?php
// [company bu project]  ss  action who when
// (ad::add-ss-action ss action who when)

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

$q="select * from strategy_statement where
 coid=$coid and buid=$buid and pjid=$pjid and ssid=$ssid";
$result=obtain_query_result($q);
if(!mysqli_fetch_assoc($result)) {
  die('["ERROR", "ss does not exist!"]');
}

if(array_key_exists ("who",$_REQUEST)){
  $who=slashquote($_REQUEST["who"]);
}else{
  // missing("who");
  $who="null"; // 2017-09-24
}

if(is_numeric($who)){
    $who=intval($who);
  } else{
  if ($who == "")     // 2017-9-28 -- Swamy -- this is easier for me to pass in ""
     { $who = "null"; }
  else
    {
      die('["ERROR", "Invalid performer specification for action"]');
    }

  }

if(array_key_exists ("action",$_REQUEST)){
  $action=slashquote($_REQUEST["action"]);
}else{
  missing("action");
}

if(array_key_exists ("when",$_REQUEST)){
  $when=slashquote($_REQUEST["when"]);
  if ($when == "")
     $when = "null";
}else{
  //missing("when");
  $when="null"; // 2017-09-24
} // should be a legal timestamp

$q="select count(*) c from action where
 coid=$coid and buid=$buid and pjid=$pjid and ssid=$ssid";
$result=obtain_query_result($q);
if($row=mysqli_fetch_assoc($result)) {
  $ord=$row['c']+1;
}else{
  die('["ERROR", "select count(*) did not return a row!"]');
}
$q="insert into action set
 coid=$coid, buid=$buid, pjid=$pjid, ssid=$ssid,
 description='$action', responsible="
 . ($who=='null'? "null" : "'$who'") .
 ", deadline="
 . ($when=='null'? "null" : "'$when'") .
 ", ordering=$ord, creationtime=now()";
$result=obtain_query_result($q);
$q="select last_insert_id() newid";
$result=obtain_query_result($q);
if($row=mysqli_fetch_assoc($result)) {
  die(json_encode(array("",$row['newid']))); // success
}else{
  die('["ERROR", "insert did not return a new row!"]');
}

?>
