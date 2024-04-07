<?php
require "functions.php";

checkAuthorizedUser();

$id = $_POST["id"];
$text = $_POST["text"];
$author = $_POST["author"];

saveAphorism($id, $text, $author);
echo 'success';