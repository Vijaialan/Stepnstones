<?php
require 'dbUtils.php';
setlocale(LC_MONETARY,"en_US.utf8");
$employer = $_POST['employer'];
$filter = $_POST['filter'];
// authenticate($_REQUEST['username'],$_REQUEST['token'], $con);
$y = [];
$projects_sql  = "SELECT * from project";
$ce_sql  = "SELECT * from cost_element";
$cd_sql  = "SELECT * from cost_driver";
$so_sql  = "SELECT * from cost_driver_so";
$ce_cost_sql  = "SELECT costamt, pjid FROM cost_element WHERE level = 1";
if($employer !== "1") {
    $projects_sql .= ' WHERE coid = '. $employer;
    $ce_sql .= ' WHERE coid = '. $employer;
    $cd_sql .= ' WHERE coid = '. $employer;
    $so_sql .= ' WHERE coid = '. $employer;
    $ce_cost_sql  = "SELECT SUM(costamt) costamt, pjid FROM cost_element WHERE coid = $employer GROUP BY pjid";
}
// echo $ce_cost_sql;

$projects_data = getData($projects_sql, $con);
$ce_data = getData($ce_sql, $con);
$cd_data = getData($cd_sql, $con);
$so_data = getData($so_sql, $con);
$ce_cost_data = getData($ce_cost_sql, $con);

$ptemp = [];
$pcosttemp = [];
foreach($projects_data as $pd) {
    
    $ptemp[$pd['pjid']] =$pd['pj_name'];
    $pcosttemp[$pd['pjid']] = $pd['pj_primarycostamt'];
}

$cetemp = [];
$ceamttemp = [];
foreach($ce_data as $ced) {
    
    $selected = $ced['criticalp']? 'success' : '';
    $cetemp[$ced['ceid']] = '<span class="'.$selected.'">'.$ced['name'] . '</span>';
    $ceamttemp[$ced['ceid']] = $ced['costamt'];
}

$cdtemp = [];
foreach($cd_data as $cdd) {
    $selected = $cdd['keyp']? 'success' : '';
    $cdtemp[$cdd['cdid']] = '<span class="'.$selected.'">'.$cdd['name'] . '</span>';
}
$sotemp = [];
foreach($so_data as $sod) {
    $selected = $sod['selected']? 'success' : '';
    $sotemp[$sod['soid']] = '<span class="'.$selected.'">'.$sod['so_desc'] . '</span>';
}

$primarycost_ce = [];
foreach($ce_cost_data as $sod) {
    if(isset($primarycost_ce[$sod['pjid']]))
    $primarycost_ce[$sod['pjid']] += $sod['costamt'];
    else
    $primarycost_ce[$sod['pjid']] = $sod['costamt'];
}

$ss_with_so_sql = "SELECT ss.ss_desc strategy_statement, ss_so.ssid, cds.*, cds.so_desc strategic_option, ss.selected ss_selected, cds.selected so_selected FROM ss_so RIGHT JOIN cost_driver_so cds ON ss_so.soid = cds.soid JOIN strategy_statement ss ON ss_so.ssid = ss.ssid WHERE ss_so.soid IS NOT NULL";
$so_without_ss_sql = "SELECT cds.*, cds.so_desc strategic_option, '' as strategy_statement, cds.selected so_selected, 0 ss_selected FROM ss_so RIGHT JOIN cost_driver_so cds ON ss_so.soid = cds.soid WHERE ss_so.ssid IS NULL";
//SELECT cds.*, cds.so_desc strategic_option, '' as strategy_statement, cds.selected so_selected, 0 ss_selected FROM ss_so RIGHT JOIN cost_driver_so cds ON ss_so.soid = cds.soid WHERE ss_so.ssid IS NULL
$cd_without_so_sql = "SELECT cd.*, cd.name cost_driver, '' strategic_option, '' strategy_statement, 0 so_selected, 0 ss_selected FROM cost_driver_so cds RIGHT JOIN cost_driver cd ON cds.cdid = cd.cdid WHERE cds.cdid IS NULL";
$ce_without_cd_sql = "SELECT ce.*, ce.name cost_element, '' cost_driver, '' strategic_option, '' strategy_statement FROM cost_driver cd RIGHT JOIN cost_element ce ON cd.ceid = ce.ceid WHERE cd.ceid IS NULL";
$ss_without_so_sql = "SELECT ss.*, ss.ss_desc strategy_statement, '' cost_element, '' cost_driver, '' strategic_option, ss.selected ss_selected FROM ss_so RIGHT JOIN strategy_statement ss ON ss_so.ssid = ss.ssid WHERE ss_so.ssid IS NULL";
if($employer !== "1") {
    $ss_with_so_sql .= ' AND ss_so.coid = '. $employer;
    $so_without_ss_sql .= ' AND cds.coid = '. $employer;
    $cd_without_so_sql .= ' AND cd.coid = '. $employer;
    $ce_without_cd_sql .= ' AND ce.coid = '. $employer;
    $ss_without_so_sql .= ' AND ss.coid = '. $employer;
}
// echo $ce_without_cd_sql;
$ss_with_so_data =  getData($ss_with_so_sql, $con);
$so_without_ss_data =  getData($so_without_ss_sql, $con);
$cd_without_so_data =  getData($cd_without_so_sql, $con);
$ce_without_cd_data =  getData($ce_without_cd_sql, $con);
$ss_without_so_data =  getData($ss_without_so_sql, $con);


$prepare_data = [];
$data_index = 0;
// print_r($ss_without_so_data);
foreach($ss_without_so_data as $ss) {
    // print_r($filter);
    
    if(in_array("sss", $filter)) {
        if($ss['ss_selected'] === "0") {
            continue;
        }
    }
    if(in_array("sso", $filter)) {
        if($ss['strategic_option'] === "") {
            continue;
        }
    }
    // var_dump($cetemp[$ss['ceid']]);
    if(in_array("cce", $filter)) {
        if($ss['cost_element'] === "") {
            continue;
        }
    }
    if(in_array("kcd", $filter)) {
        if($ss['cost_driver'] === "") {
            continue;
        }
    }
    
    $selected = $ss['ss_selected']? 'success':'';
    $prepare_data[$data_index] = $ss;
    $prepare_data[$data_index]['strategy_statement'] = '<span class="'.$selected.'">'.$ss['strategy_statement'] . '</span>';
    $prepare_data[$data_index]['project'] = $ptemp[$ss['pjid']];
    $prepare_data[$data_index]['sss'] = $ss['ss_selected'];
    
    $data_index++;
    // print_r($prepare_data);    
}
// var_dump($ce_without_cd_data);
foreach($ce_without_cd_data as $ss) {
    // var_dump($ss);
    if(in_array("sss", $filter)) {
        if($ss['strategy_statement'] === "") {
            continue;
        }
    }
    if(in_array("sso", $filter)) {
        if($ss['strategic_option'] === "") {
            continue;
        }
    }
    if(in_array("cce", $filter)) {
        if($ss['criticalp'] === "0") {
            continue;
        }
    }
    
    if(in_array("kcd", $filter)) {
        
        if($ss['cost_driver'] === "") {
            continue;
        }
    }
    // var_dump($ss);
    $cost_percentage = $ceamttemp[$ss['ceid']]/$primarycost_ce[$ss['pjid']];
    $prepare_data[$data_index] = $ss;
    $prepare_data[$data_index]['project'] = $ptemp[$ss['pjid']];
    $prepare_data[$data_index]['cost_element'] = $cetemp[$ss['ceid']].'('.(round($cost_percentage, 4)*100).'%)';
    $data_index++;
    // print_r($prepare_data);    
}
foreach($cd_without_so_data as $ss) {
    
    if(in_array("sss", $filter)) {
        if($ss['strategy_statement'] === "") {
            continue;
        }
    }
    if(in_array("sso", $filter)) {
        if($ss['strategic_option'] === "") {
            continue;
        }
    }
    if(in_array("kcd", $filter)) {
        
        if(strpos($cdtemp[$ss['cdid']], 'class=""') !== false) {
            continue;
        }
    }
    if(in_array("cce", $filter)) {
        if(strpos($cetemp[$ss['ceid']], 'class=""') !== false) {
            continue;
        }
    }
    
    $cost_percentage = $ceamttemp[$ss['ceid']]/$primarycost_ce[$ss['pjid']];
    $prepare_data[$data_index] = $ss;
    $prepare_data[$data_index]['project'] = $ptemp[$ss['pjid']];
    $prepare_data[$data_index]['cost_element'] = $cetemp[$ss['ceid']].'('.(round($cost_percentage, 4)*100).'%)';
    $prepare_data[$data_index]['cost_driver'] = $cdtemp[$ss['cdid']];
    $data_index++;
    // print_r($prepare_data);    
}
foreach($ss_with_so_data as $ss) {
    // var_dump($cetemp[$ss['ceid']]);
    if(in_array("sss", $filter)) {
        if($ss['ss_selected'] === "0") {
            continue;
        }
    }
    if(in_array("sso", $filter)) {
        if($ss['so_selected'] === "0") {
            continue;
        }
    }
    if(in_array("kcd", $filter)) {
        // var_dump($ss['keyp']);
        
        if(strpos($cdtemp[$ss['cdid']], 'class=""') !== false) {
            continue;
        }
    }
    if(in_array("cce", $filter)) {
        if(strpos($cetemp[$ss['ceid']], 'class=""') !== false) {
            continue;
        }
    }
    // var_dump($cetemp[$ss['ceid']]);
    $selected = $ss['ss_selected']? 'success':'';
    $cost_percentage = $ceamttemp[$ss['ceid']]/$primarycost_ce[$ss['pjid']];
    $prepare_data[$data_index] = $ss;
    $prepare_data[$data_index]['project'] = $ptemp[$ss['pjid']];
    $prepare_data[$data_index]['strategy_statement'] = '<span class="'.$selected.'">'.$ss['strategy_statement'] . '</span>';
    $prepare_data[$data_index]['cost_element'] = $cetemp[$ss['ceid']].'('.(round($cost_percentage, 4)*100).'%)';
    $prepare_data[$data_index]['cost_driver'] = $cdtemp[$ss['cdid']];
    $prepare_data[$data_index]['strategic_option'] = $sotemp[$ss['soid']];
    $data_index++;
    // print_r($prepare_data);    
}
// var_dump($so_without_ss_data);
foreach($so_without_ss_data as $ss) {
    // var_dump($filter);
    if(in_array("sss", $filter)) {
        if($ss['strategy_statement'] === "") {
            continue;
        }
    }
    if(in_array("sso", $filter)) {
        if($ss['so_selected'] === "0") {
            continue;
        }
    }
    if(in_array("kcd", $filter)) {
        
        if(strpos($cdtemp[$ss['cdid']], 'class=""') !== false) {
            continue;
        }
    }
    if(in_array("cce", $filter)) {
        if(strpos($cetemp[$ss['ceid']], 'class=""') !== false) {
            continue;
        }
    }
    $cost_percentage = $ceamttemp[$ss['ceid']]/$primarycost_ce[$ss['pjid']];
    $prepare_data[$data_index] = $ss;
    $prepare_data[$data_index]['strategic_option'] = $sotemp[$ss['soid']];
    $prepare_data[$data_index]['project'] = $ptemp[$ss['pjid']];
    $prepare_data[$data_index]['cost_element'] = $cetemp[$ss['ceid']].'('.(round($cost_percentage, 4)*100).'%)';
    $prepare_data[$data_index]['cost_driver'] = $cdtemp[$ss['cdid']];
    $data_index++;
    // print_r($prepare_data);    
}
$data = [];
// print_r($pd);
foreach($prepare_data as $index => $pd) {
    // print_r($pd);
    $pcost = money_format("%.2n", $primarycost_ce[$pd['pjid']]);
    $data[$index] = array(
        'pjid' => $pd['pjid'],
        'project' => utf8_encode($pd['project']),
        'primary_cost' => utf8_encode($pcost),
        'cost_element' => utf8_encode($pd['cost_element']),
        'cost_driver' => utf8_encode($pd['cost_driver']),
        'strategic_option' => utf8_encode($pd['strategic_option']),
        'strategy_statement' => utf8_encode($pd['strategy_statement']),
    );
}

echo json_encode(['data' =>  $data]);


/* 
SELECT ss.ss_desc strategic_statement, ss_so.ssid, cds.*, cds.so_desc strategic_option FROM ss_so RIGHT JOIN cost_driver_so cds ON ss_so.soid = cds.soid JOIN strategy_statement ss ON ss_so.ssid = ss.ssid WHERE ss_so.soid IS NOT NULL
SELECT cds.*, cds.so_desc strategic_option, '' as stratgey_statement FROM ss_so RIGHT JOIN cost_driver_so cds ON ss_so.soid = cds.soid WHERE ss_so.soid IS NULL
SELECT cd.*, cd.name cost_driver, '' strategic_option, '' strategic_statement FROM cost_driver_so cds RIGHT JOIN cost_driver cd ON cds.cdid = cd.cdid WHERE cds.cdid IS NULL
SELECT ce.*, ce.name cost_element, '' cost_driver, '' strategic_option, '' strategic_statement FROM cost_driver cd RIGHT JOIN cost_element ce ON cd.ceid = ce.ceid WHERE cd.ceid IS NULL
SELECT ss.*, ss.ss_desc strategy_statement, '' cost_element, '' cost_driver, '' strategic_option FROM ss_so RIGHT JOIN strategy_statement ss ON ss_so.ssid = ss.ssid WHERE ss_so.ssid IS NULL

cost drivers without so
with
 ////// SELECT cds.soid, cds.so_desc strategic_option, cd.cdid, cd.name, cd.keyp FROM cost_driver_so cds RIGHT JOIN cost_driver cd ON cds.cdid = cd.cdid WHERE cds.cdid IS NOT NULL

cost elements without cost drivers
with
///// SELECT cd.cdid, cd.name cost_driver_name, ce.name, ce.ceid, ce.criticalp FROM cost_driver cd RIGHT JOIN cost_element ce ON cd.ceid = ce.ceid WHERE cd.ceid IS NOT NULL

strategies with so
/////// SELECT ss.ss_desc, ss_so.ssid, cds.soid, cds.so_desc, cds.selected FROM ss_so RIGHT JOIN cost_driver_so cds ON ss_so.soid = cds.soid JOIN strategy_statement ss ON ss_so.ssid = ss.ssid WHERE ss_so.soid IS NOT NULL
*/


//SELECT p.pj_name, p.pjid, ce.name, ce.costamt, cd.name, cds.soid, cds.so_desc from project p JOIN cost_element ce ON ce.pjid=p.pjid JOIN cost_driver cd ON cd.ceid = ce.ceid JOIN cost_driver_so cds ON cds.cdid = cd.cdid WHERE ce.criticalp = 1;
//SELECT ss.ss_desc, p.pj_name, p.pjid,pj_primarycost, ce.name cost_element_name, ce.costamt, cd.name cost_driver_name, cds.soid, cds.so_desc from project p JOIN cost_element ce ON ce.pjid=p.pjid JOIN cost_driver cd ON cd.ceid = ce.ceid JOIN cost_driver_so cds ON cds.cdid = cd.cdid JOIN ss_so ssso ON ssso.soid = cds.soid JOIN strategy_statement ss ON ssso.ssid = ss.ssid WHERE ce.criticalp = 1
//SELECT ssso.*, ss.* FROM strategy_statement ss LEFT JOIN ss_so ssso ON ssso.ssid = ss.ssid WHERE ssso.ssid IS NULL;
//SELECT ssso.soid, ss.ssid, ss.ss_desc FROM ss_so ssso JOIN strategy_statement ss ON ss.ssid = ssso.ssid;
//SELECT SUM(costamt), pjid FROM cost_element GROUP BY pjid;
//SELECT distinct(name) FROM cost_driver;
// $ss_sql = "SELECT ss_so.*, ss.ss_desc, ss.selected FROM strategy_statement ss LEFT JOIN ss_so ON ss_so.ssid = ss.ssid"
// SELECT p.pj_name, p.pj_primarycost, p.pjid, p.coid, ce.name cost_element_name, ce.costamt, cd.name cost_driver_name, cds.soid, ce.criticalp, cd.keyp, cds.selected, cds.* from project p JOIN cost_element ce ON ce.pjid=p.pjid JOIN cost_driver cd ON cd.ceid = ce.ceid JOIN cost_driver_so cds ON cds.cdid = cd.cdid
// SELECT p.pj_name, p.pj_primarycost, p.pjid, p.coid, ce.name cost_element_name, ce.costamt, cd.name cost_driver_name, cds.soid, cds.* from project p JOIN cost_element ce ON ce.pjid=p.pjid JOIN cost_driver cd ON cd.ceid = ce.ceid JOIN cost_driver_so cds ON cds.cdid = cd.cdid WHERE ce.criticalp = 1 AND cds.selected = 1

/*
{

    cost_driver_name: "Utilization"
    cost_element_name: "Equipment(12.59%)"
    pj_name: "Fluids Hauling"
    pjid: "1"
    primary_cost: "$65,352,229.00"
    so_desc: "Planning - is the equipment/labor visible across BP?"
    soid: "14"
    ss_desc: "Reduce the number of early call outs to secure supply of the equipment required for a job by increasing visbility and awareness of equipment availability across BP	↵	"
    ssid: "1"
}
*/


/* https://stackoverflow.com/questions/3191664/list-of-all-locales-and-their-short-codes */

?>
