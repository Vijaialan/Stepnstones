<?php
// should really be called delete-cost-element
//  [company bu] project ce
// (ad::delete-critical-cost-element project ce)

require 'CONNECT_TO_DB.php';
//$row is the row of person for this user
//$admin is "admin" if the person works for CMS, otherwise ""
if($admin!="admin"){
  die('["ERROR", "You are not permitted to do this operation!"]');
}
$coid=getcompany();
$buid=getbu();
$pjid=getproject();
$ceid=getce();

if(array_key_exists ("ce",$_REQUEST)){
  $ceid=slashquote($_REQUEST["ce"]);
}else{
  missing("ce");
}
if(is_numeric($ceid)){
  $ceid=intval($ceid);
} else{
  die('["ERROR", "non-numeric value for ce"]');
}

$q="select * from cost_element where coid=$coid and buid=$buid and pjid=$pjid
  and ceid=$ceid";
$result=obtain_query_result($q);
if(! $row=mysqli_fetch_assoc($result)) {
  die('["ERROR", "Cost element not found!"]');
}
$ord=$row['ordering'];
$lev=$row['level'];
/*
The node to be deleted has some order n and level m

2017-08 new design has no remainder/other nodes

x if there is no node with order n+1:
  error you must be trying to delete the last one, a remainder/other node
- if node n+1 has level > m:
  error you're trying to delete a node with children
x if node n+1 has level < m:
  error - you're trying to delete a remainder node
x otherwise node n+1 has level m, so you can delete node n
otherwise there might not be a node n+1, if there is one it has
level m or less and node n can be deleted

  Now the question is whether to also delete node n+1
we now never delete more than the specified node
 - if there is a node n+2 and its level is >= m, then n+1 is not a
   remainder/other node, so should not be deleted
 - otherwise (there is no n+2 or it has level < m) we have
   to check whether n and n+1 are the only children of their parent
   which is true if either
   - n=1 (these are the only two nodes for the project)
   - node n-1 (which must exist if n!=1) has level < m (better be m-1)
*/

$q="select ordering,level from cost_element where
 coid=$coid and buid=$buid and pjid=$pjid and
 ordering >=" . ($ord-1) . " and ordering <= " . ($ord+2);
$result=obtain_query_result($q);
$prevlev=0;$nextlev2=0;$nextlev=0;
while($row=mysqli_fetch_assoc($result)) {
  if($row['ordering']==$ord-1){
    $prevlev=$row['level'];
  } else if($row['ordering']==$ord+1){
    $nextlev=$row['level'];
  } else if($row['ordering']==$ord+2){
    $nextlev2=$row['level'];
  }
}

// if($nextlev==0){
//  die('["ERROR", "trying to delete last cost element"]');
// }
if($nextlev>$lev){
  die('["ERROR", "trying to delete a cost element with children"]');
}
// if($nextlev<$lev){
//  die('["ERROR", "trying to delete a remainder/other cost element"]');
// }
$ndel=1;
// if($nextlev2<$lev &&
//   ($ord==1 || $prevlev==$lev-1)){
// $ndel=2;
// }
$q="delete from cost_element where
 coid=$coid and buid=$buid and pjid=$pjid and
 ordering >=" . $ord . " and ordering <= " . ($ord+$ndel-1);
$result=obtain_query_result($q);
$q="update cost_element set ordering=ordering-$ndel where
 coid=$coid and buid=$buid and pjid=$pjid and ordering >= $ord";
$result=obtain_query_result($q);

echo '["",""]';
?>
