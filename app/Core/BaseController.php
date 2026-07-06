<?php

namespace App\Core;

class BaseController {
    // Retornar una respuesta JSON estructurada con estado de éxito (HTTP 2xx)
    protected function json($data = null, $statusCode = 200) {
        self::sendJson($data, $statusCode);
    }

    // Retornar una respuesta JSON estructurada con mensaje de error (HTTP 4xx / 5xx)
    protected function error($message, $statusCode = 400) {
        self::sendError($message, $statusCode);
    }

    // Método estático para enviar JSON sanitizado contra XSS
    public static function sendJson($data = null, $statusCode = 200) {
        http_response_code($statusCode);
        header('Content-Type: application/json');
        
        if ($data !== null) {
            $data = self::sanitizeOutputRecursive($data);
        }

        echo json_encode([
            'status' => 'success',
            'data' => $data
        ], JSON_UNESCAPED_UNICODE | JSON_PRESERVE_ZERO_FRACTION);
        exit;
    }

    // Método estático para enviar errores sanitizados contra XSS
    public static function sendError($message, $statusCode = 400) {
        http_response_code($statusCode);
        header('Content-Type: application/json');
        echo json_encode([
            'status' => 'error',
            'message' => htmlspecialchars($message, ENT_QUOTES, 'UTF-8')
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    // Sanitizar de forma recursiva cadenas de texto en arrays y objetos
    private static function sanitizeOutputRecursive($data) {
        if (is_array($data)) {
            foreach ($data as $key => $value) {
                $data[$key] = self::sanitizeOutputRecursive($value);
            }
        } elseif (is_string($data)) {
            $data = htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
        }
        return $data;
    }

    // Middleware de sesión y autorización por rol
    protected function requireAuth(array $allowedRoles = []) {
        if (!isset($_SESSION['user']) || !isset($_SESSION['user']['username'])) {
            $this->error('No autenticado. Por favor inicie sesión.', 401);
        }

        if (!empty($allowedRoles)) {
            $userRole = $_SESSION['user']['role'] ?? '';
            if (!in_array($userRole, $allowedRoles)) {
                $this->error('Acceso denegado. Permisos insuficientes.', 403);
            }
        }

        return $_SESSION['user'];
    }
}
