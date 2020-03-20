<?php
require 'CONNECT_TO_DB.php';
//$row is the row of person for this user
//$admin is "admin" if the person works for CMS, otherwise ""
$pid = $row['pnid'];
if ($admin == "admin" && $employer == 1) {
    $q = "select p.pj_startdate, p.pj_region, p.pjid,p.coid,p.buid,bu_divname,co_name,b.bu_name,pj_name," . "pj_desc,pj_potentialsaving,pj_costunit,pj_creationtime,pj_lastmodtime," . "pj_status " . " from project p,busunit b, company c where c.coid=p.coid " . "and p.buid=b.buid order by pj_creationtime DESC";
} elseif ($admin == "admin") {
    $q = "select p.pj_startdate, p.pj_region, p.pjid,p.coid,p.buid,bu_divname,co_name,b.bu_name,pj_name," . "pj_desc,pj_potentialsaving,pj_costunit,pj_creationtime,pj_lastmodtime," . "pj_status " . " from project p,busunit b, company c where c.coid=p.coid " . "and p.buid=b.buid AND p.coid = $employer order by pj_creationtime DESC";
} else {
    $q = "select p.pj_startdate, p.pj_region, p.pjid,p.coid,p.buid,b.bu_divname,co_name,b.bu_name,pj_name," . "pj_desc,pj_potentialsaving,pj_costunit,pj_creationtime,pj_lastmodtime," . "pj_status " . " from project_team pt, project p,busunit b, company c " . "where c.coid=p.coid and b.buid=p.buid " . "and pt.pjid=p.pjid and pt.coid=p.coid and pt.personid=$pid order by pj_creationtime DESC";
}

$result = obtain_query_result($q);
$output = array();
$start_date = array();
$region = array();
$allProjects = [];
$allSuppliers = [];


while ($row3 = mysqli_fetch_assoc($result)) {
    // immitate assemble-strategies-data
    array_push($allProjects, $row3);
    $output[] = array(
        $row3['pjid'], //0
        array(
            $row3['coid'],
            $row3['co_name']
        ), //1
        $row3['bu_divname'],// 2
        array(
            $row3['buid'],
            $row3['bu_name']
        ), //3
        $row3['pj_name'], //4
        $row3['pj_desc'], //5
        array(
            $row3['pj_potentialsaving'],
            $row3['pj_costunit']
        ), //6
        $row3['pj_lastmodtime'], //7
        $row3['pj_creationtime'], //8
        $row3['pj_status'] //9
    );
    $start_date[] = $row3['pj_startdate'];
    $region[] = $row3['pj_region'];
}
foreach ($output as $k => $value) {
    $pjstat = array_pop($value);
    $q = "select pjid, supplier_coid,co_name from project_supplies s,company c " . "where s.coid=" . $value[1][0] . " and buid=" . $value[3][0] . " and pjid=" . $value[0] . " and s.supplier_coid=c.coid";
    
    $result = obtain_query_result($q);
    $sup    = array();
    while ($row4 = mysqli_fetch_assoc($result)) {
        $sup[] = array(
            $row4['supplier_coid'],
            $row4['co_name']
        );
        array_push($allSuppliers, $row4);
    }
    $value[] = $sup; //9
    // (listof (pers role) s.t. (team-role s pers role))
    $q       = "select personid,role,
  (select count(*) from action where coid=" . $value[1][0] . " and buid=" . $value[3][0] . " and pjid=" . $value[0] . " and personid=responsible) nresp
  from project_team s where s.coid=" . $value[1][0] . " and buid=" . $value[3][0] . " and pjid=" . $value[0];
    
    $result = obtain_query_result($q);
    $tm     = array();
    while ($row4 = mysqli_fetch_assoc($result)) {
        $tm[] = array(
            $row4['personid'],
            $row4['role'],
            $row4['nresp']
        );
    }
    $value[] = $tm; //10
    $value[] = $pjstat; //11
    
    // 2017-09-14 last "step" for project with data
    $coid = $value[1][0];
    $buid = $value[3][0];
    $pjid = $value[0];
    $q    = "select * from strategy_statement_savings where coid=$coid and buid=$buid
     and pjid=$pjid limit 1";
    
    $result = obtain_query_result($q);
    if (mysqli_fetch_assoc($result)) {
        $value[] = "Verify";
    } else {
        $q = "select * from action_progress where coid=$coid and buid=$buid
     and pjid=$pjid limit 1";
        
        $result = obtain_query_result($q);
        if (mysqli_fetch_assoc($result)) {
            $value[] = "Verify";
        } else {
            $q = "select * from action where coid=$coid and buid=$buid
      and pjid=$pjid limit 1";
            
            $result = obtain_query_result($q);
            if (mysqli_fetch_assoc($result)) {
                $value[] = "Implement";
            } else {
                $q = "select * from strategy_statement where coid=$coid and buid=$buid
      and pjid=$pjid limit 1";
                
                $result = obtain_query_result($q);
                if (mysqli_fetch_assoc($result)) {
                    $value[] = "Reduce";
                } else {
                    $q      = "select * from cost_driver_so where coid=$coid and buid=$buid
        and pjid=$pjid limit 1";
                    $result = obtain_query_result($q);
                    if (mysqli_fetch_assoc($result)) {
                        $value[] = "Define";
                    } else {
                        $q = "select * from cost_driver where coid=$coid and buid=$buid
         and pjid=$pjid limit 1";
                        
                        $result = obtain_query_result($q);
                        if (mysqli_fetch_assoc($result)) {
                            $value[] = "Measure";
                        } else {
                            $q = "select * from cost_element where coid=$coid and buid=$buid
          and pjid=$pjid limit 1";
                            
                            $result = obtain_query_result($q);
                            if (mysqli_fetch_assoc($result)) {
                                $value[] = "Identify";
                            } else {
                                $value[] = "Agree";
                            }
                        }
                    }
                }
            }
        }
    }
    $value[] = $start_date[$k];
    $value[] = $region[$k];
    
    $output[$k] = $value; // 12
}

/* 
[{buid: 2, projects: [{}]}]
[{coid: 2, projects: [{}]}]
[{supid: 2, projects: [{}]}]
[{region: APAC, projects: [{}]}]
*/
$departmentProjects = [];
$regionProjects = [];
$supplierProjects = [];
$clientProjects = [];
foreach($allProjects as $ap) {
    if($ap['pj_region'] !== null)
        $regionProjects[$ap['pj_region']][] = $ap['pjid'];
    $departmentProjects[$ap['bu_name']][] = $ap['pjid'];
    $clientProjects[$ap['co_name']][] = $ap['pjid'];
}
foreach($allSuppliers as $as) {
    $supplierProjects[$as['co_name']][] = $as['pjid'];
}
echo json_encode(array(
    "",
    $output,
    $regionProjects,
    $departmentProjects,
    $clientProjects,
    $supplierProjects 
));
?>