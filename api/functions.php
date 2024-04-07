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

function replaceChar(){
    $mysqli = mysqli_connect(DB_HOST, DB_LOGIN, DB_PASSWORD, DB_NAME);
	mysqli_set_charset($mysqli, 'utf8');
	
    $sql = "UPDATE
                aphorisms
            SET text = REPLACE(`text`, ' – ', ' — ')
			WHERE 
                text LIKE '% - %'
            OR
                text LIKE '% – %'
            ";
    mysqli_query($mysqli, $sql) or die(mysqli_connect_error());
}

function authorizeUser() {
	$_SESSION["isAphorismsAuthorized"] = true;
}

function unAuthorizeUser() {
    $_SESSION["isAphorismsAuthorized"] = false;
}

function isAuthorizedUser(){
	return $_SESSION["isAphorismsAuthorized"];
}

function setCookies(){
	$cookiesFile = 'cookies.json';
	if(!file_exists($cookiesFile)){
		file_put_contents($cookiesFile, '[]');
	}

	$handle = fopen($cookiesFile, "r");
	$cookies = json_decode(fread($handle, filesize($cookiesFile)));
	fclose($handle);

	$cookieHash = md5('aphorisms' . rand(5, 150));

	$cookies[] = (object)[
		'hash' => $cookieHash
	];

	file_put_contents($cookiesFile, json_encode($cookies));
	setcookie('aphorismsAuthorizeHash', $cookieHash, strtotime('+30 days'));
}

function unsetCookie(){
	$cookiesFile = 'cookies.json';
	if(!file_exists($cookiesFile)){
		file_put_contents($cookiesFile, '[]');
	}

	$handle = fopen($cookiesFile, "r");
	$cookies = json_decode(fread($handle, filesize($cookiesFile)));
	fclose($handle);

	$cookieHash = $_COOKIE['aphorismsAuthorizeHash'];
	$newItems = [];
	foreach($cookies as $cookie){
		if($cookie->hash !== $cookieHash){
			$newItems[] = $cookie;
		}
	}

	file_put_contents($cookiesFile, json_encode($newItems));
}

function checkCookie(){
	$cookiesFile = 'cookies.json';
	if(!file_exists($cookiesFile)){
		file_put_contents($cookiesFile, '[]');
	}
	$handle = fopen($cookiesFile, "r");
	$cookies = json_decode(fread($handle, filesize($cookiesFile)));
	fclose($handle);

	foreach($cookies as $cookie){
		if($cookie->hash === $_COOKIE['aphorismsAuthorizeHash']){
			authorizeUser();
		}
	}
}