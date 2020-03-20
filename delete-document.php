<?php
// [company bu] project document
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

$q="select * from document where coid=$coid and buid=$buid and pjid=$pjid
    and docid=$docid";
$result=obtain_query_result($q);
if(!($drow=mysqli_fetch_assoc($result))) {
  die('["ERROR", "Document not found"]');
}
if($admin!="admin"){
  if($row['pnid'] != $drow['author']) {
    die('["ERROR", "You are not permitted to do this operation!"]');
  }
}

$q="delete from document where
   coid=$coid and buid=$buid and pjid=$pjid and docid=$docid";
$result=obtain_query_result($q);
if($drow['filename']!=""){
/*  die("./uploads/$coid-$buid-$pjid-$docid");
*/  unlink("./uploads/$coid-$buid-$pjid-$docid");
}
echo '["",""]';

?>
