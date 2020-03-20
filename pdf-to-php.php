<?php

require_once 'convertio/autoload.php';                     
  use \Convertio\Convertio;
  use \Convertio\Exceptions\APIException;
  use \Convertio\Exceptions\CURLException;


  $API = new Convertio("29bae7d2084cfc1db7288bfcefcb5c07");  
  $file_name = $argv[2];
  $pdf_file_name = $argv[1];
  // print_r($argv);
  // echo $file_name;
  // echo $pdf_file_name;
  try {
    // $API = new Convertio("29bae7d2084cfc1db7288bfcefcb5c07");
    $API->start('reports/'.$pdf_file_name, 'ppt')->wait()->download('reports/'.$file_name)->delete();
    // echo json_encode([1,"File is converted successfully"]);
} catch (APIException $e) {
    echo "ERROR: API Exception: " . $e->getMessage() . " [Code: ".$e->getCode()."]" . "\n";
    // echo 'Failed';
} catch (CURLException $e) {
  echo "ERROR: HTTP Connection Exception: " . $e->getMessage() . " [Code: ".$e->getCode()."]" . "\n";
    // echo 'Failed';
} catch (Exception $e) {
  echo "ERROR: Other Critical Exception: " . $e->getMessage() . "\n";
    // echo 'Failed';
}
  
?>