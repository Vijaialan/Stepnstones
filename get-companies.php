<?php
require 'CONNECT_TO_DB.php';
//$row is the row of person for this user
//$admin is "admin" if the person works for CMS, otherwise ""
$q="select * from company c";
// var_dump($employer);
if($employer == 1){
    $q="select * from company c";
}else{
    $q="select * from company c WHERE c.coid = $employer";
}
// $q="select * from company c";    
$result=obtain_query_result($q);
$output=array();
while($row= mysqli_fetch_assoc($result)) {
  $suppliers = [];
  $company_id = $row['coid'];
 $entry=array($row['coid'],
              $row['co_name'],
              $row['co_address'],
              array($row['co_assets'],$row['co_assets_unit']),
              $row['co_website'],
              $row['co_phone']);
 
   $entry[]='yes';
   $q3="SELECT DISTINCT c.coid, c.co_name FROM project_supplies ps JOIN company c ON ps.supplier_coid = c.coid where ps.coid = $company_id";
   
 
    //  echo $q3;
     // echo $q3;
 // and coid = the employer of the logged in user
 // (or that employer is anklesaria) ??
 $quant=array();$cost=array();
 // really ought to combine these into one record containing both cost and quant
 $result3=obtain_query_result($q3);
 while($row3= mysqli_fetch_assoc($result3)) {
  //  var_dump($row3);  
   $suppliers[]=array($row3["co_name"],
                  $row3['coid']);

   
   }
 $entry[]=array($suppliers);
 
 
 $output[]=$entry;
}

echo json_encode(array("",$output));
?>
