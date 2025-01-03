<?php
require "functions.php";

checkAuthorizedUser();

$params = json_decode(file_get_contents("php://input"), true);

$id = $params["id"];

removeAphorism($id);
echo 'success';