<?php
function clean($string) {
  $string = str_replace(' ', '_', $string); // Replaces all spaces with hyphens.

  return preg_replace('/[^A-Za-z0-9\-]/', '', $string); // Removes special chars.
}
  $postData = json_decode($_POST['data']);
  
  $b64 = $postData->base64String;
  $title = $postData->title;
  $file_name = clean($title).'_close_out_report.pdf';
  $ppt_file_name = clean($title).'_close_out_report.ppt';

  $b64 = str_replace("data:application/pdf;base64,","",$b64);

  # Decode the Base64 string, making sure that it contains only valid characters
$bin = base64_decode($b64, true);

# Perform a basic validation to make sure that the result is a valid PDF file
# Be aware! The magic number (file signature) is not 100% reliable solution to validate PDF files
# Moreover, if you get Base64 from an untrusted source, you must sanitize the PDF contents
if (strpos($bin, '%PDF') !== 0) {
  throw new Exception('Missing the PDF file signature');
}

# Write the PDF contents to a local file


// $ppt_file_name = 'close_out_report.ppt';
file_put_contents('reports/'.$file_name, $bin);
// $output = shell_exec('php pdf-to-ppt.php > /dev/null 2>/dev/null &');
exec("php -f pdf-to-php.php {$file_name} {$ppt_file_name} &", $output,$return);

//    $file = $var_1;

$dir = "reports/"; // trailing slash is important
$file = $dir . $ppt_file_name;

// if (file_exists($file))
//     {
//     header('Content-Description: File Transfer');
//     header('Content-Type: application/octet-stream');
//     header('Content-Disposition: attachment; filename='.basename($file));
//     header('Expires: 0');
//     header('Cache-Control: must-revalidate');
//     header('Pragma: public');
//     header('Content-Length: ' . filesize($file));
//     ob_clean();
//     flush();
//     readfile($file);
//     exit;
//     }

// var_dump($return);
echo json_encode(['success' => $return,'output' => $output, 'file' => $ppt_file_name]);


