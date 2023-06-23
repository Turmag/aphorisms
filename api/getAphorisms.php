<?php
	require_once "sql-functions-lib.php";

	// Получаем список афоризмов
	$aphorisms = myAphorisms();
	
	echo(json_encode($aphorisms));
?>