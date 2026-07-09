<?php

namespace Config;

use PDO;
use PDOException;
use Exception;

class Database {
    private static $instance = null;
    private $conn;

    private function __construct() {
        $host = getenv('DB_HOST') ?: '127.0.0.1';
        $port = getenv('DB_PORT') ?: '3306';
        $db   = getenv('DB_NAME') ?: 'saii_db';
        $user = getenv('DB_USER') ?: 'root';
        $pass = getenv('DB_PASS') ?: '';
        $charset = 'utf8mb4';

        $dsn = "mysql:host=$host;port=$port;dbname=$db;charset=$charset";
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];

        // Habilitar SSL para bases de datos en la nube (como Aiven) si DB_SSL es true
        if (getenv('DB_SSL') === 'true') {
            // PHP 8.5+ usa Pdo\Mysql::ATTR_SSL_VERIFY_SERVER_CERT
            // PHP 8.4 y menor usa PDO::MYSQL_ATTR_SSL_VERIFY_SERVER_CERT
            $sslAttr = defined('Pdo\Mysql::ATTR_SSL_VERIFY_SERVER_CERT')
                ? \Pdo\Mysql::ATTR_SSL_VERIFY_SERVER_CERT
                : PDO::MYSQL_ATTR_SSL_VERIFY_SERVER_CERT;
            $options[$sslAttr] = false;
        }

        try {
            $this->conn = new PDO($dsn, $user, $pass, $options);
            $this->conn->exec("SET time_zone = '-05:00'");
            $this->runMigrations();
        } catch (PDOException $e) {
            // Registrar error de manera segura en log interno
            error_log("Connection failed: " . $e->getMessage());
            // Lanzar excepción incluyendo el mensaje real temporalmente para depuración
            throw new Exception("Error de conexión a la base de datos: " . $e->getMessage());
        }
    }

    private function runMigrations() {
        try {
            // 1. Verificar si la columna session_id existe en la tabla users
            $stmt = $this->conn->query("SHOW COLUMNS FROM users LIKE 'session_id'");
            $column = $stmt->fetch();
            if (!$column) {
                $this->conn->exec("ALTER TABLE users ADD COLUMN session_id VARCHAR(255) NULL");
                $this->conn->exec("ALTER TABLE users ADD COLUMN last_activity DATETIME NULL");
            }

            // 1.5. Verificar columna student_type y cycle en la tabla students
            $stmt = $this->conn->query("SHOW COLUMNS FROM students LIKE 'student_type'");
            $column = $stmt->fetch();
            if (!$column) {
                $this->conn->exec("ALTER TABLE students ADD COLUMN student_type ENUM('pregrado','egresado','posgrado','externo') NOT NULL DEFAULT 'pregrado'");
            }
            $stmt = $this->conn->query("SHOW COLUMNS FROM students LIKE 'cycle'");
            $column = $stmt->fetch();
            if ($column) {
                $this->conn->exec("ALTER TABLE students DROP COLUMN cycle");
            }

            // 2. Verificar columnas de backup en la tabla settings
            $stmt = $this->conn->query("SHOW COLUMNS FROM settings LIKE 'backup_frequency'");
            $column = $stmt->fetch();
            if (!$column) {
                $this->conn->exec("ALTER TABLE settings ADD COLUMN backup_frequency VARCHAR(20) NOT NULL DEFAULT 'daily'");
                $this->conn->exec("ALTER TABLE settings ADD COLUMN backup_tables TEXT NULL");
            }

            // 2.5. Asegurar que el rol admin tiene permiso para 'backups' en base de datos
            $stmt = $this->conn->query("SELECT permissions FROM roles WHERE key_name = 'admin'");
            $role = $stmt->fetch();
            if ($role) {
                $perms = json_decode($role['permissions'], true) ?: [];
                if (!in_array('backups', $perms)) {
                    $perms[] = 'backups';
                    $newPermsJson = json_encode($perms);
                    $stmtUpdate = $this->conn->prepare("UPDATE roles SET permissions = :perms WHERE key_name = 'admin'");
                    $stmtUpdate->execute(['perms' => $newPermsJson]);
                }
            }

            // 3. Crear tabla backups si no existe
            $this->conn->exec("
                CREATE TABLE IF NOT EXISTS backups (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    backup_code VARCHAR(20) NOT NULL UNIQUE,
                    file_name VARCHAR(255) NOT NULL,
                    file_size VARCHAR(50) NULL,
                    format VARCHAR(10) NOT NULL DEFAULT 'sql',
                    status ENUM('pending', 'success', 'failed', 'inactive') NOT NULL DEFAULT 'pending',
                    type ENUM('manual', 'automatic') NOT NULL DEFAULT 'manual',
                    created_at DATETIME NOT NULL,
                    tables_included TEXT NULL
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
            ");

            // 3.5. Asegurar columna status ENUM con 'inactive' para bases de datos existentes
            try {
                $this->conn->exec("ALTER TABLE backups MODIFY COLUMN status ENUM('pending', 'success', 'failed', 'inactive') NOT NULL DEFAULT 'pending'");
            } catch (\PDOException $ex) {
                // Ignorar si falla por alguna razón
            }

            // 4. Intentar habilitar el Event Scheduler global de MySQL
            try {
                $this->conn->exec("SET GLOBAL event_scheduler = ON");
            } catch (PDOException $ex) {
                // Puede fallar si no se tienen privilegios de SUPER, se ignora de forma segura
            }

            // 5. Crear el evento programado de respaldo automático si no existe
            $this->conn->exec("
                CREATE EVENT IF NOT EXISTS automatic_backup_trigger
                ON SCHEDULE EVERY 1 DAY
                STARTS CURRENT_TIMESTAMP
                DO
                  INSERT INTO backups (backup_code, file_name, format, status, type, created_at)
                  VALUES (
                    CONCAT('BK', DATE_FORMAT(NOW(), '%Y%m%d%H%i%s')), 
                    CONCAT('backup_', DATE_FORMAT(NOW(), '%Y%m%d_%H%i%s'), '.sql'),
                    'sql', 
                    'pending', 
                    'automatic', 
                    NOW()
                  );
            ");
        } catch (PDOException $e) {
            error_log("Error running auto-migrations: " . $e->getMessage());
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
