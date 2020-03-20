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
  die('["ERROR", "No such company!"]');
}
$q="select * from company where coid=$supcoid";
$result=obtain_query_result($q);
if(!mysqli_fetch_assoc($result)) {
  die('["ERROR", "No such supplier company!"]');
}

$q="delete from project_supplies where coid=$coid and buid='$buid'
  and pjid='$pjid' and supplier_coid=$supcoid";
$result=obtain_query_result($q);
echo '["", ""]';
?>
