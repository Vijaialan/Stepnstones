<?php
include 'dbUtils.php';
$projectData = json_decode($_REQUEST['data']);
$query = "SELECT * FROM person WHERE email_address = '$projectData->username' AND loginid = '$projectData->token'";
$loginData = obtain_query_result($query, $con);
if($loginData === NULL) {
    die(json_encode(array("ERROR", "invalid token: Please refresh the page to login ")));
}
if($loginData['employer'] !== "1" && $loginData['role'] !== "1" ) {
    die(json_encode(array("ERROR", "You are not an admin ")));
}
$query = "SELECT * FROM project WHERE pjid = '$projectData->pid'";
$companyData = obtain_query_result($query, $con);
if($companyData !== NULL) {
    
        $pid=$projectData->pid;
        $query="update project set pj_status = 'INACTIVE' WHERE pjid = $pid";
        updateData($query, $con);
     
}else {
    die(json_encode(array("ERROR", "Project you are trying to drop does not exists")));
}



echo(json_encode(array("")));

?>
