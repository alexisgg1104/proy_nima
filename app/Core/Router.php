<?php

namespace App\Core;

class Router {
    private $routes = [];

    public function addRoute($method, $path, $handler) {
        // Convertir parámetros dinámicos como {id} o {code} a regex
        // Ej: /api/students/{id} -> ^/api/students/([^/]+)$
        $pattern = preg_replace('/\{([a-zA-Z0-9_]+)\}/', '([^/]+)', $path);
        $pattern = '#^' . $pattern . '$#';
        
        $this->routes[] = [
            'method' => strtoupper($method),
            'pattern' => $pattern,
            'handler' => $handler
        ];
    }

    public function dispatch($requestMethod, $requestUri) {
        $path = parse_url($requestUri, PHP_URL_PATH);
        
        // Obtener el directorio base de ejecución (para compatibilidad con subcarpetas en XAMPP htdocs)
        $scriptName = $_SERVER['SCRIPT_NAME'];
        $basePath = dirname($scriptName);
        
        // Reemplazar diagonales invertidas en Windows
        $basePath = str_replace('\\', '/', $basePath);
        
        // Quitar el directorio base del path si está presente
        if ($basePath !== '/' && strpos($path, $basePath) === 0) {
            $path = substr($path, strlen($basePath));
        }

        // Asegurar que comience con diagonal
        if (strpos($path, '/') !== 0) {
            $path = '/' . $path;
        }

        // Quitar la diagonal al final si existe (excepto si el path es solo "/")
        if ($path !== '/' && substr($path, -1) === '/') {
            $path = substr($path, 0, -1);
        }

        $method = strtoupper($requestMethod);

        foreach ($this->routes as $route) {
            if ($route['method'] === $method && preg_match($route['pattern'], $path, $matches)) {
                array_shift($matches); // Quitar el primer match que es la cadena completa

                $handler = $route['handler'];

                if (is_array($handler)) {
                    $controllerName = $handler[0];
                    $methodName = $handler[1];

                    if (class_exists($controllerName)) {
                        $controller = new $controllerName();
                        if (method_exists($controller, $methodName)) {
                            return call_user_func_array([$controller, $methodName], $matches);
                        }
                    }
                } elseif (is_callable($handler)) {
                    return call_user_func_array($handler, $matches);
                }
            }
        }

        // Si no coincide ninguna ruta, responder con error 404
        http_response_code(404);
        header('Content-Type: application/json');
        echo json_encode([
            'status' => 'error',
            'message' => 'Ruta no encontrada'
        ]);
        exit;
    }
}
