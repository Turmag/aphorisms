<?php
header("Content-Type: text/html; charset=utf-8");
require "db_connect.php";

function myAphorisms(){
	$mysqli = mysqli_connect(DB_HOST, DB_LOGIN, DB_PASSWORD, DB_NAME);
	mysqli_set_charset($mysqli, 'utf8');
	
    $sql = "SELECT
                *
            FROM aphorisms
			ORDER BY id";
    $result = mysqli_query($mysqli, $sql) or die(mysqli_connect_error());
    return dataBaseToArray($result);
}

function dataBaseToArray($result){
    $array = array();
    while($row = mysqli_fetch_assoc($result)){
        $array[] = $row;
    }
    return $array;
}
?>