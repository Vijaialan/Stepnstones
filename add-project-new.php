<?php
include 'dbUtils.php';
// var_dump($_REQUEST['data']);
$projectData = json_decode($_REQUEST['data']);
$query = "SELECT * FROM person WHERE email_address = '$projectData->username' AND loginid = '$projectData->token'";
$loginData = obtain_query_result($query, $con);
if($loginData === NULL) {
    die(json_encode(array("ERROR", "invalid token: Please refresh the page to login ")));
}
if($loginData['employer'] !== "1" && $loginData['role'] !== "1" ) {
    die(json_encode(array("ERROR", "You are not an admin ")));
}
$query = "SELECT * FROM company WHERE co_name = '$projectData->compname'";
$companyData = obtain_query_result($query, $con);
if($companyData !== NULL) {
    $coid = $companyData['coid'];
    if($loginData['employer'] !== "1" && $coid !== $loginData['employer']) {
        die(json_encode(array("ERROR", "You cannot add other companies projects")));   
    }
}else {
    if($loginData['employer'] === "1") {
        $query="insert into company set co_name='$projectData->compname', co_address='',
        co_assets=0, co_assets_unit='', co_website='',
        co_phone=''";
        $coid = insertData($query, $con);
    }else {
        die(json_encode(array("ERROR", "You cannot add other companies projects")));
    }
}
$query = "SELECT * FROM busunit WHERE coid = $coid AND bu_name = '$projectData->deptname'";
$buData = obtain_query_result($query, $con);
if($buData !== NULL) {
    $buid = $buData['buid'];
}else {
    $query="insert into busunit set bu_name='$projectData->deptname', coid=$coid, bu_description='', bu_budget=0 ";
   $buid = insertData($query, $con);
}
$start_date = str_replace('/', '-',$projectData->start_date);
$start_date = date('Y-m-d',strtotime($start_date));
if($projectData->prjid === -1) {
    $query="insert into project set coid=$coid, buid=$buid, pj_name='$projectData->pj_name',
    pj_desc='$projectData->pj_desc', pj_creationtime=now(), pj_lastmodtime=now(),pj_primarycost='$projectData->pj_name',
    pj_primarycostamt=$projectData->pj_value, pj_costunit='$projectData->pj_costunit',
    pj_primarycostleveragable=0, pj_primarycostacquisition=0,
    pj_primarycostusage=0,pj_primarycosteol=0,
    pj_potentialsaving=$projectData->pj_value, pj_scope='', pj_comment='', pj_startdate='$start_date', pj_region='$projectData->region'";
    $pjid=insertData($query, $con);    
}else {
    $pjid=$projectData->prjid;
    $query="update project set coid=$coid, buid=$buid, pj_name='$projectData->pj_name',
  pj_desc='$projectData->pj_desc', pj_creationtime=now(), pj_lastmodtime=now(),pj_primarycost='$projectData->pj_name',
  pj_primarycostamt=$projectData->pj_value, pj_costunit='$projectData->pj_costunit',
  pj_primarycostleveragable=0, pj_primarycostacquisition=0,
  pj_primarycostusage=0,pj_primarycosteol=0,
  pj_potentialsaving=$projectData->pj_value, pj_scope='', pj_comment='',  pj_startdate='$start_date', pj_region='$projectData->region' WHERE pjid = $pjid";
  updateData($query, $con);

}
$all_suppiers = [];
$query = "DELETE FROM project_supplies WHERE pjid = '$pjid'";
updateData($query, $con);
if(count($projectData->suppliers) !== 0) {
    foreach($projectData->suppliers as $supplier) {
        array_push($all_suppiers,$supplier);
        $q="insert into project_supplies set coid=$coid, buid='$buid',
          pjid='$pjid', supplier_coid=$supplier";
          $result=insertData($q, $con);
    }
}
if($projectData->new_supplier !== '') {
    $query = "SELECT * FROM company WHERE co_name = '$projectData->new_supplier'";
    $companyData = obtain_query_result($query, $con);
    if($companyData !== NULL) {
        $new_supplier_id = $companyData['coid'];
    }else {
        $query="insert into company set co_name='$projectData->new_supplier', co_address='',
    co_assets=0, co_assets_unit='', co_website='',
    co_phone=''";
    $new_supplier_id = insertData($query, $con);
    }
    $q="insert into project_supplies set coid=$coid, buid='$buid',
      pjid='$pjid', supplier_coid=$new_supplier_id";
      $result=insertData($q, $con);
    array_push($all_suppiers, $new_supplier_id);
}
$result=array($pjid,$coid,$buid,$all_suppiers);
echo(json_encode(array("",$result)));

?>
