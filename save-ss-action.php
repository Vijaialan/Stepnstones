<?php
require 'dbUtils.php';
authenticate($_REQUEST['username'],$_REQUEST['token'], $con);
$data = json_decode($_REQUEST['data']);
$today = date('Y-m-d', strtotime('today'));
$action_participants = array();
if($data->responsible)
  $action_participants = explode(",",$data->responsible);
if($data->actionId !== -1) {
  $action_id = $data->actionId;
  deleteData('action_participants', 'action_id', $action_id , $con);
  $sql = "UPDATE action SET description = '$data->description', responsible = '$data->responsible', lastupdate='$today' WHERE actionid = $data->actionId";
  updateData($sql, $con);
}else {
  $sql = "INSERT INTO action (coid, buid, pjid, ssid, description, responsible, ordering) VALUES ($data->coid, $data->buid, $data->pjid, $data->ssid, '$data->description', '$data->responsible', 1)";
  $action_id = insertData($sql, $con);
}
if(count($action_participants)) {
  for($i=0; $i<count($action_participants); $i++) {
    $sql = "INSERT INTO action_participants (action_id, person_id) VALUES ($action_id, $action_participants[$i])";
    
    insertData($sql, $con);
  }
}
if($data->deadline !== '') {
  $deadline = str_replace('/', '-', $data->deadline);
  $deadline = date('Y-m-d H:i:s', strtotime($deadline));
  $sql = "UPDATE action SET deadline='$deadline' WHERE actionid = $action_id";
  updateData($sql, $con);
}
echo '["",""]';

?>
