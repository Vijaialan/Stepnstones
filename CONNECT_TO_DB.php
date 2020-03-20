<?php
include 'dbconfig.php';
date_default_timezone_set("Europe/London");
mysqli_set_charset($con, "utf8");
function obtain_query_result($q){
  global $con;
  if(!($result = mysqli_query($con,$q))){
    //header("HTTP/1.0 500 server error");
    // json parse problems?
    // die('["ERROR", "query_failed: ' . slashquote(mysqli_error($con)) . '"]');
    die(json_encode(array("ERROR", "query_failed: " . mysqli_error($con))));
  }
  return $result;
}

function slashquote($string){
  return str_replace ("'","\\'",str_replace ("\\","\\\\",$string));
}

function missing($param){
  // header("HTTP/1.0 400 $param not supplied");
  die('["ERROR", "missing input ' . $param .'"]');
}

function yo(){
  echo 'yo';
}

function authenticate(){
  global $row;
  global $token;
  global $employer;
  global $pnid;
  // echo 'bitch';
  if(array_key_exists ("username",$_REQUEST)){
    // echo 'bitch';
    $useridentifier=slashquote($_REQUEST["username"]);
  }else{
    missing("username");
  }
  // echo 'bitch';
  if(array_key_exists ("token",$_REQUEST)){
    $token=slashquote($_REQUEST["token"]);
    $q = "select * from person where email_address = '$useridentifier' " .
    "and loginid='$token' and lastused> date_add(now(),interval -1 hour)";

    $result=obtain_query_result($q);
    if(!($row = mysqli_fetch_assoc($result))) {
      //header("HTTP/1.0 400 invalid username or password to login");
      die ('["ERROR","Invalid username/token to login"]');
    }
    $q = "update person set lastused=now() where email_address = '$useridentifier'";
    $result=obtain_query_result($q);
  } else if(array_key_exists ("password",$_REQUEST)){
    $password=slashquote($_REQUEST["password"]);
    $q = "select * from person where email_address = '$useridentifier' " .
    "and password='$password'";
    // echo $q;
    $result=obtain_query_result($q);
    if(!($row = mysqli_fetch_assoc($result))) {
      //header("HTTP/1.0 400 invalid username or password to login");
      die ('["ERROR","Invalid username/password to login"]');
    }
    $token=mt_rand(9,9999914); //9e19 results in numbers with 10 digits
    /*  $token= 9999999999;
    */  // reduced 9e18 to 9e14 so js can read the result
    $q = "update person set lastused=now(),loginid=$token
    where email_address = '$useridentifier'";
    $result=obtain_query_result($q);
  } else{
    missing("password/token");
  }
  $employer = $row['employer'];
  $pnid = $row['pnid'];
  if($row['employer'] == 1)
  {
    return 'admin';
  }elseif($row['role'] == 1){
      return 'admin';
  }else {
    return '';
  }
}

function getcompany(){
  if(array_key_exists ("company",$_REQUEST)){
    $coid=slashquote($_REQUEST["company"]);
  }else{
    missing("company");
  }
  if(is_numeric($coid)){
    $coid=intval($coid);
  } else{
    die('["ERROR", "non-numeric value for company"]');
  }
  return $coid;
}

function getbu(){
  if(array_key_exists ("bu",$_REQUEST)){
    $buid=slashquote($_REQUEST["bu"]);
  }else{
    missing("bu");
  }
  if(is_numeric($buid)){
    $buid=intval($buid);
  } else{
    die('["ERROR", "non-numeric value for bu"]');
  }
  return $buid;
}
function getproject(){
  if(array_key_exists ("project",$_REQUEST)){
    $pjid=slashquote($_REQUEST["project"]);
  }else{
    missing("project");
  }
  if(is_numeric($pjid)){
    $pjid=intval($pjid);
  } else{
    die('["ERROR", "non-numeric value for project"]');
  }
  return $pjid;
}
function getce(){
  if(array_key_exists ("ce",$_REQUEST)){
    $ceid=slashquote($_REQUEST["ce"]);
  }else{
    missing("ce");
  }
  if(is_numeric($ceid)){
    $ceid=intval($ceid);
  } else{
    die('["ERROR", "non-numeric value for ce"]');
  }
  return $ceid;
}
function getdriver(){
  if(array_key_exists ("driver",$_REQUEST)){
    $cdid=slashquote($_REQUEST["driver"]);
  }else{
    missing("driver");
  }
  if(is_numeric($cdid)){
    $cdid=intval($cdid);
  } else{
    die('["ERROR", "non-numeric value for driver"]');
  }
  return $cdid;
}
function getss(){
  if(array_key_exists ("ss",$_REQUEST)){
    $ssid=slashquote($_REQUEST["ss"]);
  }else{
    missing("ss");
  }
  if(is_numeric($ssid)){
    $ssid=intval($ssid);
  } else{
    die('["ERROR", "non-numeric value for ss"]');
  }
  return $ssid;
}
function getso(){
  if(array_key_exists ("so",$_REQUEST)){
    $soid=slashquote($_REQUEST["so"]);
  }else{
    missing("so");
  }
  if(is_numeric($soid)){
    $ssid=intval($soid);
  } else{
    die('["ERROR", "non-numeric value for so"]');
  }
  return $soid;
}
function getaction(){
  if(array_key_exists ("action",$_REQUEST)){
    $actionid=slashquote($_REQUEST["action"]);
  }else{
    missing("action");
  }
  if(is_numeric($actionid)){
    $actionid=intval($actionid);
  } else{
    die('["ERROR", "non-numeric value for action"]');
  }
  return $actionid;
}

$admin = authenticate();
// now if we have not yet died, $admin and $row are set for later use
?>
