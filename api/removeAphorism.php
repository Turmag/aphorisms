<?php
require "functions.php";

checkAuthorizedUser();

$id = $_POST["id"];

removeAphorism($id);
echo 'success';