<?php
// company bu project ss source destination
// all ints
// (ad::move-driver project ce source destination)
require 'CONNECT_TO_DB.php';
//$row is the row of person for this user
//$admin is "admin" if the person works for CMS, otherwise ""
if($admin!="admin"){
  die('["ERROR", "not permitted"]');
}
$coid=getcompany();
$buid=getbu();
$pjid=getproject();
$ssid=getss();

if(array_key_exists ("source",$_REQUEST)){
  $source=slashquote($_REQUEST["source"]);
}else{
  missing("source");
}
if(is_numeric($source)){
  $source=intval($source);
} else{
  die('["ERROR", "non-numeric value for source"]');
}

if(array_key_exists ("destination",$_REQUEST)){
  $destination=slashquote($_REQUEST["destination"]);
}else{
  missing("destination");
}
if(is_numeric($destination)){
  $destination=intval($destination);
} else{
  die('["ERROR", "non-numeric value for destination"]');
}

$q="select * from action where
 coid=$coid and buid=$buid and pjid=$pjid and ssid=$ssid and ordering=$source";
$result=obtain_query_result($q);
if(!mysqli_fetch_assoc($result)) {
  die('["ERROR", "no ss at source position"]');
}
$q="select * from action where
 coid=$coid and buid=$buid and pjid=$pjid and ssid=$ssid and ordering=$destination";
$result=obtain_query_result($q);
if(!mysqli_fetch_assoc($result)) {
  die('["ERROR", "no ss at destination position"]');
}
// assume there is nothing at -1
$q="update action set ordering=-1 where ordering=$source
  and coid=$coid and buid=$buid and pjid=$pjid and ssid=$ssid";
$result=obtain_query_result($q);

$q="update action set ordering=$source where ordering=$destination
   and coid=$coid and buid=$buid and pjid=$pjid and ssid=$ssid";
$result=obtain_query_result($q);
$q="update action set ordering=$destination where ordering=-1
  and coid=$coid and buid=$buid and pjid=$pjid and ssid=$ssid";
$result=obtain_query_result($q);

echo '["",""]';
?>
