<?php
// [company bu project] ss value [ce cd] option
// (ad::set-ss-option ss option value) -- value is 0/1
/*  (if (= val 1)
      (++ ss-so ss option)
    (-- ss-so ss option))
*/
require 'CONNECT_TO_DB.php';
//$row is the row of person for this user
//$admin is "admin" if the person works for CMS, otherwise ""
if($admin!="admin"){
  die('["ERROR", "not permitted"]');
}
$pjid=getproject();
if(array_key_exists ("ss",$_REQUEST)){
    $ssid=slashquote($_REQUEST["ss"]);
  }else{
    missing("strtegy statement");
  }

$q="select * from strategy_statement where
 pjid=$pjid and ssid=$ssid";
$result=obtain_query_result($q);
if(! $row=mysqli_fetch_assoc($result)) {
  die('["ERROR", "ss does not exist"]');
}
if(array_key_exists ("so",$_REQUEST)){
  $option=slashquote($_REQUEST["so"]);
}else{
  missing("option");
}

$q="delete from ss_so where pjid=$pjid and ssid=$ssid and soid='$option'";
$result=obtain_query_result($q);

echo '["",""]';

?>
