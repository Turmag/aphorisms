<?php
require 'vendor/autoload.php';
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class JwtAuth {
    private $config;

    public function __construct($config) {
        $this->config = $config;
    }

    // INFO: Генерация access-токена
    public function createAccessToken(array $userData = []) {
        $payload = [
            'iss' => 'aphorisms-app',
            'sub' => 'aphorisms',
            'iat' => time(),
            'exp' => time() + $this->config['access_token_ttl'],
            'data' => $userData
        ];

        return JWT::encode($payload, $this->config['jwt_secret'], 'HS256');
    }

    // INFO: Генерация refresh-токена
    public function createRefreshToken(array $userData = []) {
        $payload = [
            'sub' => 'aphorisms',
            'iat' => time(),
            'exp' => time() + $this->config['refresh_token_ttl'],
            'data' => $userData
        ];

        return JWT::encode($payload, $this->config['jwt_refresh_secret'], 'HS256');
    }

    // INFO: Проверка access-токена
    public function validateAccessToken(string $token) {
        try {
            $decoded = JWT::decode($token, new Key($this->config['jwt_secret'], 'HS256'));
            return (array)$decoded;
        } catch (\Exception $e) {
            return false;
        }
    }

    // INFO: Проверка refresh-токена
    public function validateRefreshToken(string $token) {
        try {
            $decoded = JWT::decode($token, new Key($this->config['jwt_refresh_secret'], 'HS256'));
            return (array)$decoded;
        } catch (\Exception $e) {
            return false;
        }
    }

    // INFO: Обновление токенов
    public function refreshTokens(string $refreshToken) {
        $valid = $this->validateRefreshToken($refreshToken);
        if (!$valid) {
            return null;
        }

        $userData = $valid['data'];
        return [
            'access_token' => $this->createAccessToken($userData),
            'refresh_token' => $this->createRefreshToken($userData)
        ];
    }
}
