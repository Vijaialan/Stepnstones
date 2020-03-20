<?php
require 'CONNECT_TO_DB.php';
//$row is the row of person for this user
$pid=$row['pnid'];
if ($admin=="admin") {
  $q="select s.stid,s.coid,s.pjid,pj_division,co_name,pj_name,str_name," .
     "str_desc,str_potentialsaving,str_potentialsaving_unit " .
     " from strategy s, project p, company c where c.coid=s.coid " .
     "and p.pjid=s.pjid";
 } else {
  $q="select s.stid,s.coid,s.pjid,pj_division,co_name,pj_name,str_name," .
     "str_desc,str_potentialsaving,str_potentialsaving_unit " .
     " from strategy_team st, strategy s, project p, company c " .
     "where c.coid=s.coid and p.pjid=s.pjid " .
     "and st.stid=s.stid and st.personid=$pid";
 }
$result=obtain_query_result($q);
$output=array();
while($row3= mysqli_fetch_assoc($result)) {
 // immitate assemble-strategies-data
 $output[]=array($row3['stid'],
                 array($row3['coid'],$row3['co_name']),
                 $row3['pj_division'],
                 array($row3['pjid'],$row3['pj_name']),
                 $row3['str_name'],
                 $row3['str_desc'],
                 array($row3['str_potentialsaving'],
                       $row3['str_potentialsaving_unit']));
}
foreach($output as $k => $value){
  // (listof (sup supname) s.t. (and (participating-supplier s sup)
  //                                 (company-name sup supname)))
 $q="select supplier_coid,co_name from strategy_supplies s,company c " .
     "where s.coid=" . $value[1][0] . " and pjid=" . $value[3][0] .
     " and stid=" . $value[0] . " and s.coid=c.coid";
 $result=obtain_query_result($q); 
 $sup=array();
 while($row4= mysqli_fetch_assoc($result)) {
  $sup[]=array($row4[supplier_coid],$row4[co_name]);
 }
 $value[]=$sup;
  // (listof (pers role) s.t. (team-role s pers role))
 $q="select personid,role from strategy_team s where s.coid=" . $value[1][0] .
  " and pjid=" . $value[3][0] . " and stid=" . $value[0];
 $result=obtain_query_result($q); 
 $tm=array();
 while($row4= mysqli_fetch_assoc($result)) {
  $tm[]=array($row4[personid],$row4[role]);
 }
 $value[]=$tm;
 $output[$k]=$value;
}

echo json_encode(array("",$output));
?>
