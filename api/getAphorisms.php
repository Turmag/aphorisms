<?php
require_once "functions.php";

// Получаем список афоризмов
$aphorisms = myAphorisms();

foreach ($aphorisms as $i => &$aphorism) {
    $aphorism['numb'] = $i + 1;
}

echo(json_encode($aphorisms));