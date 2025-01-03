<?php
require "functions.php";

checkAuthorizedUser();

$params = json_decode(file_get_contents("php://input"), true);

$id = $params["id"];
$text = $params["text"];
$author = $params["author"];

saveAphorism($id, $text, $author);
echo 'success';