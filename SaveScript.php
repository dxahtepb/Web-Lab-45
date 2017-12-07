<?php
/**
 * Created by PhpStorm.
 * User: Andrey
 * Date: 07.12.2017
 * Time: 23:27
 */

$img = $_POST['imgBase64'];
$img = str_replace('data:image/png;base64,', '', $img);
$img = str_replace(' ', '+', $img);
$data = base64_decode($img);
$uid = uniqid();
$file = 'uploaded/'.$uid.'.png';
file_put_contents($file, $data);
echo $uid;
?>