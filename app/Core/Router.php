<?php

namespace App\Core;

class Router {
    private array $routes = [];

    /**
     * Registrar una ruta con su método HTTP, path y handler.
     */
    public function addRoute(string $method, string $path, callable $handler): void {
        $this->routes[] = [
            'method'  => strtoupper($method),
            'path'    => $path,
            'handler' => $handler,
        ];
    }

    /**
     * Despachar la petición entrante al handler correspondiente.
     *
     * @param string $method   HTTP method (GET, POST, PUT, DELETE…)
     * @param string $uri      Request URI incluyendo query string
     */
    public function dispatch(string $method, string $uri): void {
        $method = strtoupper($method);

        // Limpiar la query string del URI
        $path = parse_url($uri, PHP_URL_PATH);
        $path = '/' . trim($path, '/');

        foreach ($this->routes as $route) {
            if ($route['method'] !== $method) {
                continue;
            }

            // Convertir parámetros dinámicos {param} a regex
            $pattern = preg_replace('/\{([a-zA-Z0-9_]+)\}/', '([^/]+)', $route['path']);
            $pattern = '#^' . $pattern . '$#';

            if (preg_match($pattern, $path, $matches)) {
                // $matches[0] es la cadena completa; $matches[1..n] son los parámetros
                array_shift($matches);
                call_user_func_array($route['handler'], $matches);
                return;
            }
        }

        // No se encontró ninguna ruta
        http_response_code(404);
        header('Content-Type: application/json');
        echo json_encode([
            'status'  => 'error',
            'message' => "Ruta no encontrada: {$method} {$path}",
        ], JSON_UNESCAPED_UNICODE);
    }
}
