<?php
include 'dbutils.php';
$straegystatement = json_decode($_REQUEST['data']);
$query = "SELECT * FROM person WHERE email_address = '$projectData->username' AND loginid = '$projectData->token'";
$loginData = obtain_query_result($query, $con);
if($loginData === NULL) {
    die(json_encode(array("ERROR", "invalid token: Please refresh the page to login ")));
}
if($loginData['employer'] !== "1" && $loginData['role'] !== "1" ) {
    die(json_encode(array("ERROR", "You are not an admin ")));
}


?>