<?php
require 'dbUtils.php';
$sql = "SELECT actionid, responsible from action";
$data = getData($sql, $con);
// var_dump($data);
foreach($data as $d) {
    $action_id = $d['actionid'];
    $responsible = $d['responsible'];
    $action_participants = explode(",",$responsible);
    // var_dump($action_participants);
    for($i=0; $i<count($action_participants); $i++) {
        $person_id = $action_participants[$i] !== ''? $action_participants[$i]:false;
        if($person_id === false) continue;
         $sql = "INSERT INTO action_participants (action_id, person_id) VALUES ($action_id, $person_id)";
        // echo $sql, '<br/>';
        insertData($sql, $con);
      }
}

?>
