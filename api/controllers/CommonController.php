<?php
class CommonController {
    public static function getAphorisms(): void {
        $aphorisms = myAphorisms();

        foreach ($aphorisms as $i => &$aphorism) {
            $aphorism['numb'] = $i + 1;
        }

        echo(json_encode($aphorisms));
    }

    public static function addAphorism(string $text, string $author): void {
        checkAdminPossibility();
        addAphorism($text, $author);
        echo 'success';
    }

    public static function removeAphorism(string $id): void {
        checkAdminPossibility();
        removeAphorism($id);
        echo 'success';
    }

    public static function saveAphorism(string $id, string $text, string $author): void {
        checkAdminPossibility();
        saveAphorism($id, $text, $author);
        echo 'success';
    }
}