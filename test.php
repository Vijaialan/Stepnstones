<?php
echo count($_POST);
  $f=fopen("../log/postlog","a");
  fwrite($f,gmdate('c').' '.$_SERVER['REMOTE_ADDR'].' '.
         print_r($_POST,true)."\n");
 ?>
