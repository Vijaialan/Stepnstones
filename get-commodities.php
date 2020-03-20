<?php
require 'CONNECT_TO_DB.php';
//$row is the row of person for this user
//$admin is "admin" if the person works for CMS, otherwise ""
$output=array();
$q="select * from commodity left join naics 
   on naicsid=cm_naicsid and cm_naicsyr=year";
$result=obtain_query_result($q);
$com=array();
while($row= mysqli_fetch_assoc($result)) {
 $com[]=
      array($row['cmid'],
            $row['cm_name'],
            $row['cm_description'],
            (is_null($row['cm_naicsid']))?"":$row['cm_naicsid'],
            (is_null($row['description']))?"":$row['description'],
            (is_null($row['year']))?"":$row['year']);
}
$output[]=$com;
$q="select * from naics";
$result=obtain_query_result($q);
$naics=array();
while($row= mysqli_fetch_assoc($result)) {
 $naics[]=array($row['naicsid'],$row['description'],$row['year']);
}
$output[]=$naics;
$output[]=
 array("AED","ARS","BGN","BHD","BND","BRL","BWP","CAD",
       "CHF","CLP","CNY","COP","CZK","DKK","EUR","GBP",
       "HKD","HRK","HUF","IDR","ILS","INR","IRR","ISK",
       "JPY","KRW","KWD","KZT","LKR","LTL","LVL","LYD",
       "MUR","MXN","MYR","NOK","NPR","NZD","OMR","PHP",
       "PKR","PLN","QAR","RON","RUB","SAR","SEK","SGD",
       "THB","TRY","TTD","TWD","USD","VEF","ZAR");
echo json_encode(array("",$output));
?>