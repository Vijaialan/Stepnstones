<?php 
include 'dbUtils.php'; 
if(!isset($_POST['email'])) {
    $_SESSION['message'] = 'You sure you forgot your password?';
    header('Location: index.php');
    exit;
}
$email = mysqli_real_escape_string($con, $_POST['email']);
$query = 'SELECT * FROM person WHERE email_address = "'.$email.'"';
$user_data = getData($query, $con);
// var_dump($query);
if($user_data === NULL || count($user_data) == 0) {
    $_SESSION['message'] = 'User with '.$email.' does not exist';
    header('Location: index.php');
    exit;
}
$new_password = substr(md5(rand()), 0, 10);

$query = "UPDATE person SET password = '$new_password' WHERE email_address = '$email'";
updateData($query, $con);
$email_data = array(
    'to' => $user_data[0]['email_address'],
    'subject' => 'New password generated to login into aimdrive portal',
    'to_name' => $user_data[0]['firstname'].' '.$user_data[0]['lastname'],
    'message' => 'Hello '.$user_data[0]['firstname'].' '.$user_data[0]['lastname'].', we have generated a new password to login into aimdrive portal. Your new password is '.$new_password,
);
$email_response = sendEmail($email_data);
$_SESSION['message'] = 'We have sent you a new password to your registered email id';
header('Location: index.php');
exit;

// GRANT ALL ON *.* to root@'139.59.28.80' IDENTIFIED BY 'podilapu';
// GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' IDENTIFIED BY 'podilapu' WITH GRANT OPTION;
// FLUSH PRIVILEGES;



?>