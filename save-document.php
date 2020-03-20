<?php
// [company bu project]  (who removed) document desc title
// (setf output (ad::modify-doc document (ad::theperson who) title desc))
require 'CONNECT_TO_DB.php';
//$row is the row of person for this user
//$admin is "admin" if the person works for CMS, otherwise ""

$coid=getcompany();
$buid=getbu();
$pjid=getproject();
if(array_key_exists ("document",$_REQUEST)){
  $docid=slashquote($_REQUEST["document"]);
}else{
  missing("document");
}
if(is_numeric($docid)){
  $docid=intval($docid);
} else{
  die('["ERROR", "non-numeric value for document"]');
}
$set="";
if(array_key_exists ("title",$_REQUEST)){
  $title=slashquote($_REQUEST["title"]);
  if($set!=""){$set.=', ';}
  $set.="docname='$title'";
}
if(array_key_exists ("desc",$_REQUEST)){
  $desc=slashquote($_REQUEST["desc"]);
  if($set!=""){$set.=', ';}
  $set.="docdesc='$desc'";
}

$q="select * from project where coid=$coid and buid=$buid and pjid=$pjid";
$result=obtain_query_result($q);
if(!mysqli_fetch_assoc($result)) {
  die('["ERROR", "Project not found"]');
}
if($admin!="admin"){
  // logged in user must be on team of project
  $q="select * from document where
  coid=$coid and buid=$buid and pjid=$pjid and docid=$docid and author="
   . $row['pnid'];
  $result=obtain_query_result($q);
  if(!mysqli_fetch_assoc($result)) {
    die('["ERROR", "You are not permitted to do this operation!"]');
  }
}
$q="update document set $set
 where coid=$coid and buid=$buid and pjid=$pjid and docid=$docid";
if($set!=""){
  $result=obtain_query_result($q);
}
echo '["",""]';
?>
