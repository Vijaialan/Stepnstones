<?php
// should really be called add-cost-element (to project)
//  [company bu] project ce newcename
// 2016-10-29 - have to add costtype - default to 0
// all but last (name) are ids

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

if(array_key_exists ("newcename",$_REQUEST)){
  $newcename=slashquote($_REQUEST["newcename"]);
}else{
  $newcename="new sub cost";
}

if(array_key_exists ("dollars",$_REQUEST) && is_numeric($_REQUEST["dollars"])){
  $dollars=floatval($_REQUEST["dollars"]);
}else
{
  $dollars = 0;
}


$costtype=0; // default
if(array_key_exists ("costtype",$_REQUEST) && is_numeric($_REQUEST["costtype"])){
  $costtype=intval($_REQUEST["costtype"]);
}

$q="select * from project where coid=$coid and buid=$buid and pjid=$pjid";
$result=obtain_query_result($q);
if(!mysqli_fetch_assoc($result)) {
  die('["ERROR", "Project does not exist!"]');
}
/* (ad::add-last-child project ce newcename)
 ce can be -1 to add to root

prior to 2017-08:
 four cases:
 - ce is not an existing cost element of proj - add to root
   - there are NO ce's for proj - add first ce + remainder ce
   - there are other ce's - new one takes the order,level of
     current last node, which is remainder node for root
     and that remainder node has its order incremented
 - ce is an existing cost element of proj - add as its child
   - it has children already - new one takes order,level of
     its remainder node, ALL nodes with that order or above have
     their order incremented
   - it has no children - new node has order after ce, level one
     more than ce, then a new remainder node, 
     all previously existing nodes with order after ce are 
     incremented by 2

new as of 2017-08:
 we will no longer create or maintain remainder nodes
 - ce is not an existing cost element of proj - add to root
   - there are NO ce's for proj - add first ce (but not remainder ce)
   - there are other ce's - new one takes the order of last + 1 ,level=1
 - ce is an existing cost element of proj - add as its child
   - it has children already - new one takes order,level of
     its remainder node, ALL nodes with that order or above have
     their order incremented
   - it has no children - new node has order after ce, level one
     more than ce, then a new remainder node, 
     all previously existing nodes with order after ce are 
     incremented by 2

*/
// $remainderadded=0; last_insert_id returns the FIRST one
$q="select * from cost_element where coid=$coid and buid=$buid and pjid=$pjid
  and ceid=$ceid and costtype=$costtype";
$result=obtain_query_result($q);
if(!$cerow=mysqli_fetch_assoc($result)) { // ce is not an existing cost element
  $q="select * from cost_element where coid=$coid and buid=$buid and pjid=$pjid
     and costtype=$costtype limit 1";
  $result=obtain_query_result($q);
  if(!mysqli_fetch_assoc($result)) { // proj has NO existing cost element
    $q="insert into cost_element(coid,buid,pjid,name,ordering,level,costtype,costamt) 
       values ($coid,$buid,$pjid,'$newcename',1,1,$costtype,$dollars)";
       // ,($coid,$buid,$pjid,'Unaccounted     -- auto created',2,1,$costtype)";
    $result=obtain_query_result($q); // really even need ids?

  } else {
    $q="select * from cost_element where coid=$coid and buid=$buid and pjid=$pjid 
     and costtype=$costtype order by ordering desc limit 1";
    $result=obtain_query_result($q);
    if(!$row=mysqli_fetch_assoc($result)) {
      die('["ERROR","expected last ce for project not found"]');
    }
    
    //$q="update cost_element set ordering=ordering+1 where
    //    coid=$coid and buid=$buid and pjid=$pjid and costtype=$costtype
    //    and ordering=" . $row["ordering"];
    //$result=obtain_query_result($q);

    $q="insert into cost_element set " .
       "coid=$coid, buid=$buid, pjid=$pjid, costtype=$costtype, " .
       "costamt=$dollars, ordering=" . ($row["ordering"]+1)
        . ", level=1, name='". $newcename . "'";
  die("query: $q");
    $result=obtain_query_result($q);
  }
}else{ // ce is an existing cost element, $cerow has its data
  if($cerow['costtype']!=$costtype) {
    die('["ERROR","costtype disagrees with ce supplied"]');
  }
  $celevel=$cerow['level'];
  $ceord=$cerow['ordering'];
  $q="select * from cost_element where coid=$coid and buid=$buid and pjid=$pjid
      and costtype=$costtype and ordering > $ceord order by ordering asc";
  $result=obtain_query_result($q);
  $lastord=$ceord; $lastlevel=$celevel;
  while($row=mysqli_fetch_assoc($result)
        and $row['level']>$celevel) { // && doesn't work !!
    $lastord=$row['ordering']; $lastlevel=$row['level'];
  }
  if($lastord==$ceord){ // ce had no children - add two => 1
    $q="update cost_element set ordering=ordering+1 where
        coid=$coid and buid=$buid and pjid=$pjid and costtype=$costtype
        and ordering>$ceord";
    $result=obtain_query_result($q);
    $q="insert into cost_element(coid,buid,pjid,name,ordering,level,costtype,costamt)
       values
       ($coid,$buid,$pjid,'$newcename'," . ($ceord+1) . ", " . ($celevel+1) .
       ",$costtype,$dollars)";
       //,($coid,$buid,$pjid,'Unaccounted     -- auto created', " . 
       //($ceord+2) . ", " . ($celevel+1) . ",$costtype)";
    $result=obtain_query_result($q); // really even need ids?
  } else { // ce had children
    die("ll $lastlevel cel $celevel");
    if($lastlevel!=$celevel+1){
      die('["ERROR","last child not at expected level"]');
    }
    $q="update cost_element set ordering=ordering+1 where
        coid=$coid and buid=$buid and pjid=$pjid and costtype=$costtype
        and ordering>$lastord";
    $result=obtain_query_result($q);
    $q="insert into cost_element(coid,buid,pjid,name,ordering,level,costtype,costamt)
     values ($coid,$buid,$pjid,'$newcename',$lastord+1,$lastlevel,$costtype,$dollars)";
    $result=obtain_query_result($q);
  }
}
// on every path we insert either 1 or 2 => 1
$q="select last_insert_id() newid";
$result=obtain_query_result($q);
if($row=mysqli_fetch_assoc($result)) {
  die(json_encode(array("",$row['newid']))); // success
}else{
  die('["ERROR", "insert did not return a new row!"]');
}
?>
