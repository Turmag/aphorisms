<?php
require __DIR__ . '/JwtAuth.php';
require "db_connect.php";

session_start();

$tokensConfig = [
    'jwt_secret' => 'my-awesome-secret-key-for-aphorisms-project',
    'jwt_refresh_secret' => 'my-awesome-secret-key-for-aphorisms-project-for-refresh',
    'access_token_ttl' => 3600,
    'refresh_token_ttl' => 1209600,
];

$savedPassword = 'b1f4f9a523e36fd969f4573e25af4540';

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

function dataBaseToArray(mysqli_result $result){
    $array = array();
    while($row = mysqli_fetch_assoc($result)){
        $array[] = $row;
    }
    return $array;
}

function saveAphorism(int $id, string $text, string $author){
	$mysqli = mysqli_connect(DB_HOST, DB_LOGIN, DB_PASSWORD, DB_NAME);
	mysqli_set_charset($mysqli, "utf8");
	$text = mysqli_real_escape_string($mysqli, $text);
	$author = mysqli_real_escape_string($mysqli, $author);
	$sql = "UPDATE aphorisms SET 
			text = '$text',
			author = '$author'
			WHERE id = $id";
	mysqli_query($mysqli, $sql) or die(mysqli_connect_error());
}

function addAphorism(string $text, string $author){
	$mysqli = mysqli_connect(DB_HOST, DB_LOGIN, DB_PASSWORD, DB_NAME);
	mysqli_set_charset($mysqli, "utf8");
	$sql = "INSERT INTO aphorisms(
								text,
								author
								)
							VALUES(                      
								'$text',
								'$author'
								)";
	mysqli_query($mysqli, $sql) or die(mysqli_connect_error());
}

function removeAphorism(int $id){
	$mysqli = mysqli_connect(DB_HOST, DB_LOGIN, DB_PASSWORD, DB_NAME);
	mysqli_set_charset($mysqli, "utf8");
	$sql = "DELETE from aphorisms
			WHERE id = $id";
	mysqli_query($mysqli, $sql) or die(mysqli_connect_error());
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

function getBearerToken(): ?string {
    // INFO: Пытаемся получить через apache_request_headers
    if (function_exists('apache_request_headers')) {
        $headers = apache_request_headers();
        if (isset($headers['Authorization'])) {
            $authHeader = $headers['Authorization'];
        }
    } 
    // INFO:Для FPM
    elseif (isset($_SERVER['HTTP_AUTHORIZATION'])) {
        $authHeader = $_SERVER['HTTP_AUTHORIZATION'];
    }
    // INFO: Последний шанс — getallheaders
    else {
        $headers = getallheaders() ?? [];
        if (isset($headers['Authorization'])) {
            $authHeader = $headers['Authorization'];
        }
    }

    // INFO: Извлекаем токен
    if (!empty($authHeader) && preg_match('/^Bearer\s+(.*)$/i', $authHeader, $matches)) {
        return $matches[1];
    }

    return null;
}

function checkBearerToken(): array {
    $token = getBearerToken();

    if (!$token) {
        http_response_code(401);
        echo json_encode(['success' => false, 'title' => 'Access token не указан']);
        exit;
    }

    global $tokensConfig;

    $jwtAuth = new JwtAuth($tokensConfig);

    $validToken = $jwtAuth->validateAccessToken($token);
    if (!$validToken) {
        http_response_code(401);
        echo json_encode(['success' => false, 'title' => 'Неправильный или истёкший токен']);
        exit;
    }

    return $validToken;
}

function checkAdminPossibility(): void {
    $token = checkBearerToken();
    $role = $token['data']->role;
    if ($role !== 'admin') {
        http_response_code(401);
        echo json_encode(['success' => false, 'title' => 'Для этого действия нужна роль администратора']);
        exit;
    }
}