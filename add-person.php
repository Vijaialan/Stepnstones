<?php
// uemail upwd ufirst ulast telephone job employer
// include 'dbUtils.php';
require 'CONNECT_TO_DB.php';
//$row is the row of person for this user
//$admin is "admin" if the person works for CMS, otherwise ""
// function sendEmail($email_data) {
//   require("./sendgrid/sendgrid-php.php");
//   $email = new \SendGrid\Mail\Mail(); 
//   $email->setFrom("info@sidabs.com", "Sidabs Labs");
//   $email->setSubject($email_data['subject']);
//   $email->addTo($email_data['to'], $email_data['to_name']);
//   $email->addContent("text/plain", $email_data['message']);
//   $email->addContent(
//       "text/html", $email_data['message']
//   );
//   $sendgrid = new \SendGrid("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");
//   try {
//       $response = $sendgrid->send($email);
//       return $response;
//   } catch (Exception $e) {
//       return $e->getMessage();
//   }
// }
if($admin!="admin"){
  die('["ERROR", "not permitted"]');
}

if(array_key_exists ("employer",$_REQUEST)){
  $employer=slashquote($_REQUEST["employer"]);
}else{
  missing("employer");
}
if(is_numeric($employer)){
  $employer=intval($employer);
} else{
  die('["ERROR", "non-numeric value for employer"]');
}

$q="select * from company where coid=$employer";
$result=obtain_query_result($q);
if(!$companyRow = mysqli_fetch_assoc($result)) {
  die('["ERROR", "employer does not exist"]');
}
$company_name = $companyRow['co_name'];

if(array_key_exists ("uemail",$_REQUEST)){
  $uemail=slashquote($_REQUEST["uemail"]);
}else{
  missing("uemail");
}
if($uemail==""){
  die('["ERROR", "empty uemail not permitted"]');
}



if(array_key_exists ("ufirst",$_REQUEST)){
  $ufirst=ucfirst(slashquote($_REQUEST["ufirst"]));
}else{
  missing("ufirst");
}
if($ufirst==""){
  die('["ERROR", "empty ufirst not permitted"]');
}

if(array_key_exists ("ulast",$_REQUEST)){
  $ulast=ucfirst(slashquote($_REQUEST["ulast"]));
}else{
  missing("ulast");
}
if($ulast==""){
  die('["ERROR", "empty ulast not permitted"]');
}

if(array_key_exists ("telephone",$_REQUEST)){
  $telephone=slashquote($_REQUEST["telephone"]);
}else{
  $telephone="";
}

if(array_key_exists ("job",$_REQUEST)){
  $job=slashquote($_REQUEST["job"]);
}else{
  $job="";
}
$admin_role = 0;
if(array_key_exists ("admin_role",$_REQUEST)){
  $admin_role=slashquote($_REQUEST["admin_role"]);
}
$role_name = $admin_role == 1 ? ' an Admin': ' a Participant';

$sql = "SELECT * FROM person WHERE email_address = '$uemail'";
$result=obtain_query_result($sql);
if(!$personRow=mysqli_fetch_assoc($result)) {
  $q="insert into person set email_address='$uemail',
  password='temp111', lastname='$ulast', firstname='$ufirst',
  phone_number='$telephone', employer=$employer, job_title='$job', role='$admin_role'";
$result=obtain_query_result($q);
$q="select last_insert_id() pnid";
$result=obtain_query_result($q);
if(!$personRow=mysqli_fetch_assoc($result)) {
  die('["ERROR", "insert did not return a new row!"]');
}
//send email
// var_dump($personRow);
$email_data = array(
  'to' => $uemail,
  'subject' => 'You have been added as '.$role_name.' to '.$company_name.' projects.',
  'to_name' => $ufirst.' '.$ulast,
  'message' => 'Hello '.$ufirst.' '.$ulast.', we have generated a new password to login into aimdrive portal. Your username is your email id and password is temp111',
);
// $email_response = sendEmail($email_data);
// var_dump($email_data);
}
// var_dump($companyRow);
$pnid=$personRow['pnid'];
echo json_encode(array("",$pnid));
?>
