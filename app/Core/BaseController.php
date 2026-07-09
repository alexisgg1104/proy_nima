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

        // --- VALIDAR CONCURRENCIA Y ACTUALIZAR ACTIVIDAD ---
        $userId = $_SESSION['user']['id'];
        $userModel = new \App\Models\User();
        $dbUser = $userModel->getById($userId);

        if (!$dbUser || empty($dbUser['session_id']) || $dbUser['session_id'] !== session_id()) {
            // Limpiar la sesión nativa si es inválida o expiró por concurrencia
            $_SESSION = [];
            if (ini_get("session.use_cookies")) {
                $params = session_get_cookie_params();
                setcookie(session_name(), '', time() - 42000,
                    $params["path"], $params["domain"],
                    $params["secure"], $params["httponly"]
                );
            }
            session_destroy();
            $this->error('Sesión cerrada o iniciada en otro dispositivo.', 401);
        }

        // Actualizar la última fecha de actividad del usuario en la base de datos
        $userModel->updateLastActivity($userId);

        if (!empty($allowedRoles)) {
            $userRole = $_SESSION['user']['role'] ?? '';
            if (!in_array($userRole, $allowedRoles)) {
                $this->error('Acceso denegado. Permisos insuficientes.', 403);
            }
        }

        return $_SESSION['user'];
    }
}
