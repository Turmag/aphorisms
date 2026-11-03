<?php
class CommonController {
    public static function getAphorisms(int $page = 1, int $limit = 50, string $search = '', string $phraseNumb = ''): void {
        $limit = in_array($limit, [50, 100, 150, 200], true) ? $limit : 50;
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(myAphorisms(max(1, $page), $limit, $search, $phraseNumb));
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
