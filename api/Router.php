<?php
class Router {
    private array $routes = [];

    public function add(string $method, string $path, callable|array $handler, array|null $params = []): void {
        $this->routes[] = compact('method', 'path', 'handler', 'params');
    }

    public function dispatch(string $requestUri, string $requestMethod): void {
        $prefix = '/api';

        foreach ($this->routes as $route) {
            $params = $route['params'];
            if ($route['method'] === strtoupper($requestMethod) && $this->match($prefix . $route['path'], $requestUri)) {
                call_user_func_array($route['handler'], $params);
                return;
            }
        }
        
        // INFO: Обработка 404
        http_response_code(404);
        echo "404 Нет такого запроса";
    }

    private function match(string $routePath, string $requestUri): bool {
        $routePattern = preg_replace('/\{([\w]+)\}/', '(?P<$1>[^/]+)', $routePath);
        $routePattern = '#' . $routePattern . '$#';

        if (preg_match($routePattern, $requestUri, $matches)) {
            return true;
        }
        return false;
    }
}