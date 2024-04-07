<?php
require "functions.php"; 

if($_POST['password'] === 'smile2'){
    authorizeUser();
    setCookies();
    echo 'success';
}