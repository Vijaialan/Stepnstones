<?php
require 'CONNECT_TO_DB.php';
//$row is the row of person for this user
//$admin is "admin" if the person works for CMS, otherwise ""
$output=array();
$q="select * from company";
$result=obtain_query_result($q);
while($row= mysqli_fetch_assoc($result)) {
 $com=array($row['coid'],$row['co_name']);
 $q2="select * from busunit where coid=".$row['coid'];
 $result2=obtain_query_result($q2);
 while($row2= mysqli_fetch_assoc($result2)) {
   $bu=array();
   $bu[]=$row2['buid'];
   $bu[]=(is_null($row2['bu_name']))?"":$row2['bu_name'];
   $bu[]=(is_null($row2['bu_description']))?"":$row2['bu_description'];
   $bu[]=(is_null($row2['bu_budget']))?NULL:
         array($row2['bu_budget'],$row2['bu_budget_unit']);
   if(!is_null($row2['bu_divname'])){
     $bu[]=array($row2['bu_divname'],
                 (is_null($row2['bu_divdesc'])) ? "" : $row2['bu_divdesc'],
                 (is_null($row2['bu_divloc'])) ? "" : $row2['bu_divloc']);
   }
   $com[]=$bu;
 }
 $output[]=$com;
}
echo json_encode(array("",$output));
?>