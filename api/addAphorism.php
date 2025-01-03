<?php
require "functions.php";

checkAuthorizedUser();

$params = json_decode(file_get_contents("php://input"), true);

$text = $params["text"];
$author = $params["author"];

addAphorism($text, $author);
echo 'success';