<?php 
include 'dbconfig.php';
ob_start();
session_start();
date_default_timezone_set("Europe/London");


function obtain_query_result($q, $con){
    if(!($result = mysqli_query($con,$q))){
      //header("HTTP/1.0 500 server error");
      // json parse problems?
      // die('["ERROR", "query_failed: ' . slashquote(mysqli_error($con)) . '"]');
      die(json_encode(array("ERROR", "query_failed: " . mysqli_error($con))));
    }
    return mysqli_fetch_assoc($result);
  }

function insertData($q, $con) {
    if(!($result = mysqli_query($con,$q))){
        //header("HTTP/1.0 500 server error");
        // json parse problems?
        // die('["ERROR", "query_failed: ' . slashquote(mysqli_error($con)) . '"]');
        die(json_encode(array("ERROR", "query_failed: " . mysqli_error($con))));
      }
    return mysqli_insert_id($con);
}

function updateData($q, $con) {
    if(!($result = mysqli_query($con,$q))){
        //header("HTTP/1.0 500 server error");
        // json parse problems?
        // die('["ERROR", "query_failed: ' . slashquote(mysqli_error($con)) . '"]');
        die(json_encode(array("ERROR", "query_failed: " . mysqli_error($con))));
      }
}

function getData($q, $con) {
  if(!($result = mysqli_query($con,$q))){
    //header("HTTP/1.0 500 server error");
    // json parse problems?
    // die('["ERROR", "query_failed: ' . slashquote(mysqli_error($con)) . '"]');
    die(json_encode(array("ERROR", "query_failed: " . mysqli_error($con))));
  }
  return mysqli_fetch_all($result,MYSQLI_ASSOC);;
}

function deleteData($table, $column, $value, $con) {
  $sql = "DELETE FROM $table WHERE $column = $value";
  // echo $sql;
  mysqli_query($con, $sql);
  return true;
}

function deleteByQuery($q, $con) {
  mysqli_query($con, $q);
  return true;
}

/* Send email */
function sendEmail($email_data) {
  require("./sendgrid/sendgrid-php.php");
  $email = new \SendGrid\Mail\Mail(); 
  $email->setFrom("info@sidabs.com", "Sidabs Labs");
  $email->setSubject($email_data['subject']);
  $email->addTo($email_data['to'], $email_data['to_name']);
  $email->addContent("text/plain", $email_data['message']);
  $email->addContent(
      "text/html", $email_data['message']
  );
  $sendgrid = new \SendGrid("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");
  try {
      $response = $sendgrid->send($email);
      return $response;
  } catch (Exception $e) {
      return $e->getMessage();
  }
}

function authenticate($username, $token, $con){
  $q = "select * from person where email_address = '$username' " .
    "and loginid='$token' and lastused> date_add(now(),interval -1 hour)";
  $data = obtain_query_result($q, $con);
  if($data === NULL) {
    die ('["ERROR","Invalid username/token to login"]');
  }
  return true;
}


?>