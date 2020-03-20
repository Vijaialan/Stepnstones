<?php
// [company bu] project (no longer strategy) step file title desc filename docurl
// either file (and filename) or docurl is to be supplied
//  (if (not file)  ;; this is a bookmark
//    (setf output (ad::add-bookmark strategy step person docurl title desc))
//    (setf output (ad::add-doc strategy step person title desc filename file)))
require 'CONNECT_TO_DB.php';
//$row is the row of person for this user
//$admin is "admin" if the person works for CMS, otherwise ""
// var_dump($_REQUEST);
$coid=getcompany();
$buid=getbu();
$pjid=getproject();


if(array_key_exists ("step",$_REQUEST)){
  $step=slashquote($_REQUEST["step"]);
}else{
  missing("step");
}

$q="select * from project where coid=$coid and buid=$buid and pjid=$pjid";
$result=obtain_query_result($q);
if(!mysqli_fetch_assoc($result)) {
  die('["ERROR", "Project not found"]');
}
if($admin!="admin"){
  // logged in user must be on team of project
  $q="select * from project_team where
  coid=$coid and buid=$buid and pjid=$pjid and personid=" . $row['pnid'];
  $result=obtain_query_result($q);
  if(!mysqli_fetch_assoc($result)) {
    die('["ERROR", "not permitted"]');
  }
}

$file="";
$filename="";
$title="";
$desc="";
$docurl="";
$ftype="";

if(array_key_exists ("file",$_FILES)){
  $filedata=$_FILES['file'];
  // var_dump($filedata['size']);
  if($filedata['size'] > 10000000){
    die('["ERROR", "please upload a file less than 10 MB"]');
  }
  if($filedata['error']>0){
    die('["ERROR", "upload error '. $filedata['error'] .'"]');
  }
  // $ftype=$filedata['type'];
  $filename=$filedata['name'];
  $ftype=pathinfo($filename,PATHINFO_EXTENSION);
  $file=$filedata['tmp_name'];
}

if(array_key_exists ("file",$_REQUEST)){
  $file=$_REQUEST["file"];  // NO slashquote here !
}
/*
if(array_key_exists ("filename",$_REQUEST)){
  $filename=slashquote($_REQUEST["filename"]);
}
*/

if(array_key_exists ("title",$_REQUEST)){
  $title=slashquote($_REQUEST["title"]);
}
if(array_key_exists ("desc",$_REQUEST)){
  $desc=slashquote($_REQUEST["desc"]);
}
if(array_key_exists ("docurl",$_REQUEST)){
  $docurl=slashquote($_REQUEST["docurl"]);
}
if($docurl=="" and $file==""){
  die('["ERROR", "neither file nor url supplied"]');
}
if($docurl!="" and $file!=""){
  die('["ERROR", "Both file AND url supplied"]');
}
if(($filename!="") != ($file!="")){
  die('["ERROR","one but not both of file and filename were supplied"]');
}

if($docurl!=""){
  $q="insert into document set
   coid=$coid, buid=$buid, pjid=$pjid, step='$step', docname='$title',
   docdesc='$desc', creationtime=now(), lastmodtime=now(), url='$docurl',
   filename='', author=" . $row['pnid'];
  $result=obtain_query_result($q);
  $q="select last_insert_id() newid";
  $result=obtain_query_result($q);
  if($row=mysqli_fetch_assoc($result)) {
    die(json_encode(array("",$row['newid']))); // this is success
  }else{
    die('["ERROR", "insert did not return a new row!"]');
  }
}
if($file!=""){
  $q="insert into document set
   coid=$coid, buid=$buid, pjid=$pjid, step='$step', docname='$title',
   docdesc='$desc', creationtime=now(), lastmodtime=now(), url='',
   contenttype='$ftype', filename='$filename', author=" . $row['pnid'];
  $result=obtain_query_result($q);
  $q="select last_insert_id() newid";
  $result=obtain_query_result($q);
  if($row=mysqli_fetch_assoc($result)) {
    $newid=$row['newid'];
    if(!move_uploaded_file($file, "uploads/$coid-$buid-$pjid-$newid")) {
      // ouch
      $q="delete from document where
       coid=$coid and buid=$buid and pjid=$pjid and docid=$newid";
      $result=obtain_query_result($q);
      die('["ERROR", "upload failed"]');
    }
    die('["", "successfully uploaded"]');
    // die(json_encode(array("",$newid))); // this is success
  }else{
    die('["ERROR", "insert did not return a new row!"]');
  }
}

?>
