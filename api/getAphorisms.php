<?php
require_once "functions.php";

// Получаем список афоризмов
$aphorisms = myAphorisms();
echo(json_encode($aphorisms));