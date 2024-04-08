<?php
require "functions.php";

checkAuthorizedUser();

$text = $_POST["text"];
$author = $_POST["author"];

addAphorism($text, $author);
echo 'success';