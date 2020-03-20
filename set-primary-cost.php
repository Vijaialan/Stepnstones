<?php
//  [company bu] project pc cost curr rationale leveragable acquisition usage eol
require 'CONNECT_TO_DB.php';
//$row is the row of person for this user
//$admin is "admin" if the person works for CMS, otherwise ""
if($admin!="admin"){
  die('["ERROR", "not permitted"]');
}
$coid=getcompany();
$buid=getbu();
$pjid=getproject();

$q="select * from project where coid=$coid and buid=$buid and pjid=$pjid";
$result=obtain_query_result($q);
if(!mysqli_fetch_assoc($result)) {
  die('["ERROR", "Project does not exist!"]');
}
$set="";

// is this required?
if(array_key_exists ("pc",$_REQUEST)){
  $pc=slashquote($_REQUEST["pc"]);
  $set="pj_primarycost='$pc'";
}

// also read numbers from cost leveragable acquisition usage eol
// cost is required? others default to 0

if(array_key_exists ("cost",$_REQUEST)
   && is_numeric($_REQUEST["cost"])){
  $cost=floatval($_REQUEST["cost"]);
  if($set!=""){$set.=', ';}
  $set.="pj_primarycostamt=$cost";
}
if(array_key_exists ("eol",$_REQUEST)
   && is_numeric($_REQUEST["eol"])){
  $eol=floatval($_REQUEST["eol"]);
  if($set!=""){$set.=', ';}
  $set.="pj_primarycosteol=$eol";
}

if(array_key_exists ("usage",$_REQUEST)
   && is_numeric($_REQUEST["usage"])){
  $usage=floatval($_REQUEST["usage"]);
  if($set!=""){$set.=', ';}
  $set.="pj_primarycostusage=$usage";
}
if(array_key_exists ("acquisition",$_REQUEST)
   && is_numeric($_REQUEST["acquisition"])){
  $acquisition=floatval($_REQUEST["acquisition"]);
  if($set!=""){$set.=', ';}
  $set.="pj_primarycostacquisition=$acquisition";
}
if(array_key_exists ("leveragable",$_REQUEST)
   && is_numeric($_REQUEST["leveragable"])){
  $leveragable=floatval($_REQUEST["leveragable"]);
  if($set!=""){$set.=', ';}
  $set.="pj_primarycostleveragable=$leveragable";
}
if(array_key_exists ("rationale",$_REQUEST)){
  $rationale=slashquote($_REQUEST["rationale"]);
  if($set!=""){$set.=', ';}
  $set.="pj_primarycostrationale='$rationale'";  
}


if(array_key_exists ("currency",$_REQUEST)){
  $currency=slashquote($_REQUEST["currency"]);
  if($set!=""){$set.=', ';}
  $set.="pj_costunit='$currency'";  
}


// project pc cost curr rationale leveragable acquisition usage eol
// (project cost val curr rationale &optional leveragable acq usage eol)
// (++ primary-cost project cost val curr leveragable acq usage eol))
$q="update project set $set
 where coid=$coid and buid=$buid and pjid=$pjid";
 // echo $q;
 //update project set pj_primarycost='Reduction of IOT Project Deployment Costs', pj_primarycostamt=280000000, pj_costunit='CLP'
 // where coid=49 and buid=40 and pjid=1
if($set!=""){
  $result=obtain_query_result($q);
}
echo '["",""]';
?>
