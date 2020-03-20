<?php
require 'CONNECT_TO_DB.php';
//$row is the row of person for this user
//$admin is "admin" if the person works for CMS, otherwise ""
$output=array();
// var_dump($employer);
$q="select * from person p
     left join company c on c.coid=p.employer ORDER BY p.firstname ASC";
// if($admin == 'admin' && $employer == 1) {
  
// }else{
  
//   $q="select * from person p
//      left join company c on c.coid=p.employer WHERE p.employer = $employer ORDER BY p.firstname ASC";
// }
$result=obtain_query_result($q);
$com=array();
while($row= mysqli_fetch_assoc($result)) {
 $com[]= array(
     mb_convert_encoding($row['pnid'],'UTF-8','UTF-8'),
     mb_convert_encoding($row['email_address'],'UTF-8','UTF-8'),
     mb_convert_encoding('password','UTF-8','UTF-8'),
     mb_convert_encoding($row['firstname'],'UTF-8','UTF-8'),
     mb_convert_encoding($row['lastname'],'UTF-8','UTF-8'),
     mb_convert_encoding($row['phone_number'],'UTF-8','UTF-8'),
     mb_convert_encoding($row['job_title'],'UTF-8','UTF-8'),
     mb_convert_encoding($row['co_name'],'UTF-8','UTF-8'),
     mb_convert_encoding($row['coid'],'UTF-8','UTF-8'),
     mb_convert_encoding($row['lastused'],'UTF-8','UTF-8'),
     mb_convert_encoding($row['role'],'UTF-8','UTF-8')
 );
}
$output = $com;
// echo 'high';
// echo '<pre>',var_dump(json_encode($output)), '</pre>';
// echo json_last_error();
echo json_encode(array("",$output));
?>
