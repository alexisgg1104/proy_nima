<?php

namespace App\Core;

use Config\Database;
use Exception;

class BaseModel {
    protected $db;

    public function __construct() {
        try {
            // Obtener la instancia única de conexión PDO
            $this->db = Database::getInstance()->getConnection();
        } catch (Exception $e) {
            http_response_code(500);
            header('Content-Type: application/json');
            echo json_encode([
                'status' => 'error',
                'message' => $e->getMessage()
            ]);
            exit;
        }
    }
}
