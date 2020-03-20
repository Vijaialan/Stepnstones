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
$doc=array();
foreach($statuswords as $step){
  $qdoc="select * from document where coid=$coid and 
     buid=$buid and pjid=$pjid and step = '$step' 
     order by creationtime";
  $resultdoc=obtain_query_result($qdoc);
  $sdoc=array();
  while($rowdoc= mysqli_fetch_assoc($resultdoc)) {
     // doc creator created modified handle desc url type
     $sdoc[]= array($rowdoc['docid'],
                    $rowdoc['author'],
                    $rowdoc['creationtime'],
                    $rowdoc['lastmodtime'],
                    $rowdoc['docname'],
                    $rowdoc['docdesc'],
                    $rowdoc['url'],
                    $rowdoc['filename'], // non-null means internal
                    $rowdoc['contenttype']);
  }
 $doc[]=array($step,$sdoc);            
}

echo json_encode(array("",$doc));
?>
