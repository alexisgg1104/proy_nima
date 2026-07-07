<?php

namespace Config;

use PDO;
use PDOException;
use Exception;

class Database {
    private static $instance = null;
    private $conn;

    private function __construct() {
        $host = $_ENV['DB_HOST'] ?? '127.0.0.1';
        $port = $_ENV['DB_PORT'] ?? '3306';
        $db   = $_ENV['DB_NAME'] ?? 'saii_db';
        $user = $_ENV['DB_USER'] ?? 'root';
        $pass = $_ENV['DB_PASS'] ?? '';
        $charset = 'utf8mb4';

        $dsn = "mysql:host=$host;port=$port;dbname=$db;charset=$charset";
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];

        // Habilitar SSL para bases de datos en la nube (como Aiven) si DB_SSL es true
        if (isset($_ENV['DB_SSL']) && $_ENV['DB_SSL'] === 'true') {
            // PHP 8.5+ usa Pdo\Mysql::ATTR_SSL_VERIFY_SERVER_CERT
            // PHP 8.4 y menor usa PDO::MYSQL_ATTR_SSL_VERIFY_SERVER_CERT
            $sslAttr = defined('Pdo\Mysql::ATTR_SSL_VERIFY_SERVER_CERT')
                ? \Pdo\Mysql::ATTR_SSL_VERIFY_SERVER_CERT
                : PDO::MYSQL_ATTR_SSL_VERIFY_SERVER_CERT;
            $options[$sslAttr] = false;
        }

        try {
            $this->conn = new PDO($dsn, $user, $pass, $options);
        } catch (PDOException $e) {
            // Registrar error de manera segura en log interno
            error_log("Connection failed: " . $e->getMessage());
            // Lanzar excepción genérica para el usuario
            throw new Exception("Error de conexión a la base de datos.");
        }
    }

    public static function getInstance() {
        if (!self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function getConnection() {
        return $this->conn;
    }
}
