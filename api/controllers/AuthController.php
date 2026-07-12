<?php
class AuthController {
    public static function authorize($password): void {
        global $tokensConfig;
        global $savedPassword;

        $isSuccessAuthorize = false;
        if (md5($password) === $savedPassword) $isSuccessAuthorize = true;

        if ($isSuccessAuthorize) {
            $jwtAuth = new JwtAuth($tokensConfig);

            $access_token = $jwtAuth->createAccessToken();
            $refresh_token = $jwtAuth->createRefreshToken();

            http_response_code(200);
            echo json_encode([
                'success' => true,
                'access_token' => $access_token,
                'refresh_token' => $refresh_token,
                'token_type' => 'Bearer',
                'expires_in' => $tokensConfig['access_token_ttl']
            ]);
        } else {
            http_response_code(401);
            echo json_encode(['success' => false, 'title' => 'Неверный пароль']);
        }
    }

    public static function refresh($refreshToken): void {
        global $tokensConfig;

        if (empty($refreshToken)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'title' => 'Refresh token не указан']);
            exit;
        }

        $jwtAuth = new JwtAuth($tokensConfig);
        $tokens = $jwtAuth->refreshTokens($refreshToken);

        if ($tokens) {
            http_response_code(200);
            echo json_encode([
                'success' => true,
                'access_token' => $tokens['access_token'],
                'refresh_token' => $tokens['refresh_token'],
                'token_type' => 'Bearer',
                'expires_in' => $tokensConfig['access_token_ttl']
            ]);
        } else {
            http_response_code(401);
            echo json_encode(['success' => false, 'title' => 'Неверный Refresh token']);
        }
    }
}