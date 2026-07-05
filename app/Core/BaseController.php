<?php

namespace App\Core;

class BaseController {
    // Retornar una respuesta JSON estructurada con estado de éxito (HTTP 2xx)
    protected function json($data = null, $statusCode = 200) {
        http_response_code($statusCode);
        header('Content-Type: application/json');
        echo json_encode([
            'status' => 'success',
            'data' => $data
        ], JSON_UNESCAPED_UNICODE | JSON_PRESERVE_ZERO_FRACTION);
        exit;
    }

    // Retornar una respuesta JSON estructurada con mensaje de error (HTTP 4xx / 5xx)
    protected function error($message, $statusCode = 400) {
        http_response_code($statusCode);
        header('Content-Type: application/json');
        echo json_encode([
            'status' => 'error',
            'message' => $message
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }
}
