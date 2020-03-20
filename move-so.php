<?php
// combination of swap-so and move-driver
// company bu project ce driver source destination
// all ints

require 'CONNECT_TO_DB.php';
//$row is the row of person for this user
//$admin is "admin" if the person works for CMS, otherwise ""
if($admin!="admin"){
  die('["ERROR", "You are not permitted to do this operation!"]');
}
$coid=getcompany();
$buid=getbu();
$pjid=getproject();
$ceid=getce();
$cdid=getdriver();

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

$q="select * from cost_driver_so where
 coid=$coid and buid=$buid and pjid=$pjid and
 ceid=$ceid and cdid=$cdid and ordering=$source";
$result=obtain_query_result($q);
if(!mysqli_fetch_assoc($result)) {
  die('["ERROR", "no so at source position"]');
}
$q="select * from cost_driver_so where
 coid=$coid and buid=$buid and pjid=$pjid and
 ceid=$ceid and cdid=$cdid and ordering=$destination";
$result=obtain_query_result($q);
if(!mysqli_fetch_assoc($result)) {
  die('["ERROR", "no so at destination position"]');
}
// assume there is nothing at -1
$q="update cost_driver_so set ordering=-1 where ordering=$source
  and coid=$coid and buid=$buid and pjid=$pjid and ceid=$ceid and cdid=$cdid";
$result=obtain_query_result($q);

if($source<$destination){
  $q="update cost_driver_so set ordering=ordering-1 where 
   ordering>$source and ordering<=$destination
   and coid=$coid and buid=$buid and pjid=$pjid and ceid=$ceid and cdid=$cdid";
  $result=obtain_query_result($q);
}else if($source>$destination){
  $q="update cost_driver_so set ordering=ordering+1 where 
   ordering>=$destination and ordering<$source
   and coid=$coid and buid=$buid and pjid=$pjid and ceid=$ceid and cdid=$cdid";
  $result=obtain_query_result($q);
}
$q="update cost_driver_so set ordering=$destination where ordering=-1
   and coid=$coid and buid=$buid and pjid=$pjid and ceid=$ceid and cdid=$cdid";
$result=obtain_query_result($q);

echo '["",""]';
?>
