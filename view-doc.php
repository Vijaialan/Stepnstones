<?php
// [company bu project] doc
// (setf output (ad::modify-doc document (ad::theperson who) title desc))
require 'CONNECT_TO_DB.php';
//$row is the row of person for this user
//$admin is "admin" if the person works for CMS, otherwise ""
$row1 = $row; // save it for later
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
$q="select * from document where coid=$coid and buid=$buid and pjid=$pjid
  and docid=$docid";
$result=obtain_query_result($q);
if(! $row=mysqli_fetch_assoc($result)) {
  die('["ERROR", "Document not found"]');
}
if($admin!="admin"){
  // logged in user must be on team of project
  $q="select * from project_team where
  coid=$coid and buid=$buid and pjid=$pjid and personid=" . $row1['pnid'];
  $result=obtain_query_result($q);
  if(!mysqli_fetch_assoc($result)) {
    die('["ERROR", "not permitted"]');
  }
}
$ctype=exec("file -i -b uploads/$coid-$buid-$pjid-$docid");
header("Content-Type: $ctype");
$fn=$row['filename'];
// $type=$row['contenttype'];
header('Content-Disposition: attachment; filename="' . $fn . '"');
// if there's a " in filename, too bad for you, doesn't hurt ME
//echo file_get_contents("uploads/$coid-$buid-$pjid-$docid");
readfile("uploads/$coid-$buid-$pjid-$docid");
?>
