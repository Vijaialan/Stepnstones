<?php
// complicated variant of move-driver
// company bu project source destination
// all ints

require 'CONNECT_TO_DB.php';
//$row is the row of person for this user
//$admin is "admin" if the person works for CMS, otherwise ""
if($admin!="admin"){
  die('["ERROR", "You are not permitted to do this operation"]');
}
$coid=getcompany();
$buid=getbu();
$pjid=getproject();

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

$q="select * from cost_element where
 coid=$coid and buid=$buid and pjid=$pjid and ordering=$source";
$result=obtain_query_result($q);
if(!($srow=mysqli_fetch_assoc($result))) {
  die('["ERROR", "no ce at source position"]');
}
$q="select * from cost_element where
 coid=$coid and buid=$buid and pjid=$pjid and ordering=$destination";
$result=obtain_query_result($q);
if(!($drow=mysqli_fetch_assoc($result))) {
  die('["ERROR", "no ce at destination position"]');
}
$slevel=$srow['level'];
$dlevel=$drow['level'];

if($slevel!=$dlevel){
  die('["ERROR", "source level ('.$slevel.') differs from dest level ('.$dlevel.')"]');
}

$q="select * from cost_element where
 coid=$coid and buid=$buid and pjid=$pjid and 
 ordering>$source and ordering<$destination and level < $slevel";
$result=obtain_query_result($q);
if(mysqli_fetch_assoc($result)) {
  die('["ERROR", "source and destination are not siblings"]');
}

$q="select max(ordering) maxord from cost_element where
 coid=$coid and buid=$buid and pjid=$pjid";
$result=obtain_query_result($q);
$maxrow=mysqli_fetch_assoc($result);
$last=$maxrow['maxord'];

$q="select min(ordering) ord from cost_element where
 coid=$coid and buid=$buid and pjid=$pjid and ordering>$source 
 and level <= $slevel";
$result=obtain_query_result($q);
$endsource=$last;
if($nextsib=mysqli_fetch_assoc($result)) {
  $ord=$nextsib['ord'];
  if(!is_null($ord)){
    $endsource=$ord-1;
    }
}
$q="select min(ordering) ord from cost_element where
 coid=$coid and buid=$buid and pjid=$pjid and ordering>$destination 
 and level <= $slevel";
$result=obtain_query_result($q);
$enddest=$last;
if($nextsib=mysqli_fetch_assoc($result)) {
  $ord=$nextsib['ord'];
  if(!is_null($ord)){
    $enddest=$ord-1;
    }
}

$q="update cost_element set ordering=-ordering where
    coid=$coid and buid=$buid and pjid=$pjid
    and ordering>=$source and ordering<=$endsource";
$result=obtain_query_result($q);

if($source<$destination){
  $q="update cost_element set ordering=ordering - (1+$endsource-$source) where 
   ordering>$endsource and ordering<=$enddest
   and coid=$coid and buid=$buid and pjid=$pjid";
$result=obtain_query_result($q);
}else if($source>$destination){
  $q="update cost_element set ordering=ordering+ (1+$endsource-$source) where 
   ordering>=$destination and ordering<$source
   and coid=$coid and buid=$buid and pjid=$pjid";
$result=obtain_query_result($q);
}
if($source<$destination){ // endsource moves to enddest
 $q="update cost_element set ordering=(-ordering)+$enddest-$endsource
    where ordering<0 and coid=$coid and buid=$buid and pjid=$pjid";
}else if($source>$destination){ // source moves to dest
 $q="update cost_element set ordering=(-ordering)+$destination-$source
    where ordering<0 and coid=$coid and buid=$buid and pjid=$pjid";
}
$result=obtain_query_result($q);

echo '["",""]';
?>
