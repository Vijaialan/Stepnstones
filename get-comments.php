<?php
// project company bu
require 'CONNECT_TO_DB.php';
//$row is the row of person for this user
//$admin is "admin" if the person works for CMS, otherwise ""

$coid=getcompany();
$buid=getbu();
$pjid=getproject();
$q="select * from project where pjid=$pjid and coid=$coid and buid=$buid";
$result=obtain_query_result($q);

if(!$row= mysqli_fetch_assoc($result)) {
  die('["ERROR", "not a project"]');
}
$statuswords=array("Preview","Agree","Identify","Measure","Define",
                   "Reduce","Implement","Verify","Eternal");
$com=array();
foreach($statuswords as $step){
  $qcom="select * from project_step_comment where coid=$coid and
   buid=$buid and pjid=$pjid and step = '$step'
   order by creationtime"; 
  $resultcom=obtain_query_result($qcom);
  $scom=array();
  while($rowcom= mysqli_fetch_assoc($resultcom)) {
     $scom[]= array($rowcom['comment'],
                    $rowcom['author'],
                    $rowcom['creationtime']);
  }
 $com[]=array($step,$scom);            
}

echo json_encode(array("",$com));
?>
