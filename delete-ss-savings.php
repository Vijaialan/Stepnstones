<?php
// [company bu project ss] oldperson olddate
// assume company bu project ss + person,date is a key
// you can have more than one but you edit or delete all together

require 'CONNECT_TO_DB.php';
//$row is the row of person for this user
//$admin is "admin" if the person works for CMS, otherwise ""
// if($admin!="admin"){
//   die('["ERROR", "You are not permitted to do this operation!"]');
// }

$savingsId = $_REQUEST['savingsId'];
$q="delete from strategy_statement_savings where savingsid = $savingsId";
$result=obtain_query_result($q);

echo '["",""]';

?>
