<?php
// [company bu]  project ce source destination
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
$ceid=getce();

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
  $destination=intval($destination); // should be 0/1
} else{
  die('["ERROR", "non-numeric destinationue for destination"]');
}

$q="select * from cost_driver where
 coid=$coid and buid=$buid and pjid=$pjid and ceid=$ceid and position=$source";
$result=obtain_query_result($q);
if(!mysqli_fetch_assoc($result)) {
  die('["ERROR", "no driver at source position"]');
}
$q="select * from cost_driver where
 coid=$coid and buid=$buid and pjid=$pjid and ceid=$ceid and position=$destination";
$result=obtain_query_result($q);
if(!mysqli_fetch_assoc($result)) {
  die('["ERROR", "no driver at destination position"]');
}
// assume there is no driver with position -1
$q="update cost_driver set position=-1 where position=$source
  and coid=$coid and buid=$buid and pjid=$pjid and ceid=$ceid";
$result=obtain_query_result($q);

$q="update cost_driver set position=$source where position=$destination
   and coid=$coid and buid=$buid and pjid=$pjid and ceid=$ceid";
$result=obtain_query_result($q);
$q="update cost_driver set position=$destination where position=-1
  and coid=$coid and buid=$buid and pjid=$pjid and ceid=$ceid";
$result=obtain_query_result($q);

echo '["",""]';
?>
