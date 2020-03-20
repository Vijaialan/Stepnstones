<?php
include 'dbUtils.php';
$personData = json_decode($_REQUEST['data']);
$query = "SELECT * FROM person WHERE email_address = '$personData->username' AND loginid = '$personData->token'";
$loginData = obtain_query_result($query, $con);
if($loginData === NULL) {
    die(json_encode(array("ERROR", "invalid token: Please refresh the page to login ")));
}
if($loginData['employer'] !== "1" && $loginData['role'] !== "1" ) {
    die(json_encode(array("ERROR", "You are not an admin ")));
}
if($personData->type === 'participant') {
    $participant_sql = "SELECT ap.* FROM action_participants ap JOIN action a ON ap.action_id = a.actionid WHERE ap.person_id = $personData->participant AND a.pjid = $personData->project";
    // echo $participant_sql;
    $participantActionData = obtain_query_result($participant_sql, $con);
    if($participantActionData !== NULL) {
        die(json_encode(array("ERROR", "This participant has action items assigned to her/him. Kindly re-assign these action items and then remove the participant from this project.")));
    }else {
        $q = "DELETE FROM project_team WHERE personid = $personData->participant AND pjid = $personData->project";
        // echo $q;
        deleteByQuery($q, $con);
        //deleteData('project_team', 'personid', $personData->participant , $con);
    }
}
if($personData->type === 'person') {
    $team_member_sql = "SELECT * FROM project_team WHERE personid  = $personData->participant";
    $team_member_data = obtain_query_result($team_member_sql, $con);
    if($team_member_data !== NULL) {
        $participant_sql = "SELECT * FROM action_participants WHERE person_id = $personData->participant";
        $participantActionData = obtain_query_result($participant_sql, $con);
        if($participantActionData !== NULL) {
            die(json_encode(array("ERROR", "This participant has action items assigned to her/him. Kindly re-assign these action items and then remove the participant from this project.")));
        }else {
            deleteByQuery("DELETE FROM project_team WHERE personid = $personData->participant AND pjid = $personData->project", $con);
        }
    }else {
        deleteData('person', 'pnid', $personData->participant , $con);
    }
}
echo '["",""]';

?>
