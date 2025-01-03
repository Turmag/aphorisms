<?php
require "functions.php"; 

$params = json_decode(file_get_contents("php://input"), true);

if($params["password"] === 'smile2'){
    authorizeUser();
    setCookies();
    echo 'success';
}