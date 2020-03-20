<?php
require 'CONNECT_TO_DB.php';
$coid=getcompany();
$buid=getbu();
$pjid=getproject();
$ssid=getss();

if($admin!="admin"){
  // logged in user must be on team of project
  $q="select * from project_team where
  coid=$coid and buid=$buid and pjid=$pjid and personid=" . $row['pnid'];
  $result=obtain_query_result($q);
  if(!mysqli_fetch_assoc($result)) {
    die('["ERROR", "You are not permitted to do this operation!"]');
  }
}

if(array_key_exists ("comment",$_REQUEST)){
  $comment=slashquote($_REQUEST["comment"]);
}else{
  $comment= "";
}

if(array_key_exists ("date",$_REQUEST)){
  $date = str_replace('/', '-', $_REQUEST["date"]);
  $date = date('Y-m-d H:i:s', strtotime($date));
  
}else{
  $date= now();
}
if(array_key_exists ("value",$_REQUEST)){
  if(is_numeric($_REQUEST["value"])){
    $val=intval($_REQUEST["value"]);
  } else {
  die('["ERROR", "value not numeric"]');
  }
} else{
  missing("value");
}
if(array_key_exists ("savingstype",$_REQUEST)){
  $savingstype=slashquote($_REQUEST["savingstype"]);
  if($savingstype == '') $savingstype= "Cost Improvement";
}

if(array_key_exists ("savingsId",$_REQUEST)){
  $savingsId=slashquote($_REQUEST["savingsId"]);
}else{
  $savingsId= "";
}
// $ssidExists = false;
// $q = "SELECT * FROM strategy_statement_savings WHERE ssid = $ssid LIMIT 1";
// $result = obtain_query_result($q);
// while($rowSucks= mysqli_fetch_assoc($result)) {
//   $ssidExists = true;
// }

// if($ssidExists) {
//   $q = "UPDATE strategy_statement_savings set comment= '$comment', savingsdate='$date', value='$val' WHERE ssid = $ssid";
//   $result=obtain_query_result($q);
//  }else {

//  }
if($savingsId === '') {
  $q="insert into strategy_statement_savings set savingstype='$savingstype',
 coid=$coid, buid=$buid, pjid=$pjid, ssid=$ssid,
 comment='$comment', savingsdate='$date', value=$val, person="
 . $row['pnid'];
  $result=obtain_query_result($q);
}else {
    $q = "UPDATE strategy_statement_savings set comment= '$comment', savingsdate='$date', value='$val', savingstype='$savingstype'  WHERE savingsid = $savingsId";
  $result=obtain_query_result($q);
}
 
echo '["",""]';

?>
