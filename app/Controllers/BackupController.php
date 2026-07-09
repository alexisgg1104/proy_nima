<?php

namespace App\Controllers;

use App\Core\BaseController;
use Exception;
use PDO;

class BackupController extends BaseController {

    // Listar backups (GET /api/backups) - Protegido: Solo Admin
    public function index() {
        $this->requireAuth(['admin']);
        $db = \Config\Database::getInstance()->getConnection();

        // 1. Procesar respaldos automáticos que el MySQL Event Scheduler haya dejado pendientes
        try {
            $stmt = $db->query("SELECT * FROM backups WHERE status = 'pending' ORDER BY id ASC");
            $pendingBackups = $stmt->fetchAll();

            if (!empty($pendingBackups)) {
                // Obtener tablas configuradas por defecto
                $settingsStmt = $db->query("SELECT backup_tables FROM settings LIMIT 1");
                $settings = $settingsStmt->fetch();
                $configuredTables = !empty($settings['backup_tables']) ? explode(',', $settings['backup_tables']) : [];

                foreach ($pendingBackups as $backup) {
                    $this->generateBackupFile($backup['id'], $backup['file_name'], $configuredTables);
                }
            }
        } catch (Exception $e) {
            error_log("Error processing pending database backups: " . $e->getMessage());
        }

        // 2. Retornar todos los respaldos registrados
        $stmt = $db->query("SELECT * FROM backups ORDER BY id DESC");
        $backups = $stmt->fetchAll();

        $this->json($backups);
    }

    // Generar backup manual (POST /api/backups) - Protegido: Solo Admin
    public function create() {
        $this->requireAuth(['admin']);
        $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;

        $tables = $input['tables'] ?? [];
        $format = $input['format'] ?? 'sql';

        if ($format !== 'sql') {
            $this->error('Formato no soportado en esta versión. Use SQL.', 400);
        }

        $db = \Config\Database::getInstance()->getConnection();
        $backupCode = 'BK' . date('YmdHis');
        $fileName = 'backup_' . date('Ymd_His') . '.sql';

        try {
            $stmt = $db->prepare("
                INSERT INTO backups (backup_code, file_name, format, status, type, created_at)
                VALUES (:code, :file, :format, 'pending', 'manual', NOW())
            ");
            $stmt->execute([
                'code' => $backupCode,
                'file' => $fileName,
                'format' => $format
            ]);
            $backupId = $db->lastInsertId();

            // Generar el archivo real en disco
            $success = $this->generateBackupFile($backupId, $fileName, $tables);

            if (!$success) {
                $this->error('No se pudo compilar el archivo SQL del respaldo.', 500);
            }

            // Obtener el registro finalizado
            $stmt = $db->prepare("SELECT * FROM backups WHERE id = :id");
            $stmt->execute(['id' => $backupId]);
            $backup = $stmt->fetch();

            $this->json($backup);
        } catch (Exception $e) {
            $this->error('Error al iniciar el respaldo: ' . $e->getMessage(), 500);
        }
    }

    // Descargar un archivo de respaldo (GET /api/backups/download/{id}) - Protegido: Solo Admin
    public function download($id) {
        $this->requireAuth(['admin']);
        $db = \Config\Database::getInstance()->getConnection();

        $stmt = $db->prepare("SELECT * FROM backups WHERE id = :id");
        $stmt->execute(['id' => (int)$id]);
        $backup = $stmt->fetch();

        if (!$backup || $backup['status'] !== 'success') {
            $this->error('Archivo de respaldo no encontrado o fallido.', 404);
        }

        $filePath = __DIR__ . '/../../public/backups/' . $backup['file_name'];

        if (!file_exists($filePath)) {
            $this->error('El archivo de respaldo físico no existe en el servidor.', 404);
        }

        // Transmitir archivo al cliente para descarga forzada segura
        header('Content-Description: File Transfer');
        header('Content-Type: application/octet-stream');
        header('Content-Disposition: attachment; filename="' . basename($filePath) . '"');
        header('Expires: 0');
        header('Cache-Control: must-revalidate');
        header('Pragma: public');
        header('Content-Length: ' . filesize($filePath));
        
        readfile($filePath);
        exit;
    }

    // Eliminar un respaldo (DELETE /api/backups/{id}) - Protegido: Solo Admin
    public function delete($id) {
        $this->requireAuth(['admin']);
        $db = \Config\Database::getInstance()->getConnection();

        $stmt = $db->prepare("SELECT * FROM backups WHERE id = :id");
        $stmt->execute(['id' => (int)$id]);
        $backup = $stmt->fetch();

        if (!$backup) {
            $this->error('El registro de respaldo no existe.', 404);
        }

        $filePath = __DIR__ . '/../../public/backups/' . $backup['file_name'];
        if (file_exists($filePath)) {
            unlink($filePath);
        }

        $stmt = $db->prepare("DELETE FROM backups WHERE id = :id");
        $stmt->execute(['id' => (int)$id]);

        $this->json(['message' => 'Respaldo eliminado correctamente.']);
    }

    // Obtener la configuración actual y lista de tablas (GET /api/backups/settings) - Protegido: Solo Admin
    public function getSettings() {
        $this->requireAuth(['admin']);
        $db = \Config\Database::getInstance()->getConnection();

        // Obtener configuración actual de la tabla settings
        $stmt = $db->query("SELECT backup_frequency, backup_tables FROM settings LIMIT 1");
        $settings = $stmt->fetch() ?: [
            'backup_frequency' => 'daily',
            'backup_tables' => ''
        ];

        // Obtener la lista completa de tablas en la base de datos
        $tablesStmt = $db->query("SHOW TABLES");
        $tables = [];
        while ($row = $tablesStmt->fetch(PDO::FETCH_NUM)) {
            $tables[] = $row[0];
        }

        $this->json([
            'settings' => [
                'frequency' => $settings['backup_frequency'],
                'tables' => !empty($settings['backup_tables']) ? explode(',', $settings['backup_tables']) : []
            ],
            'tables' => $tables
        ]);
    }

    // Guardar configuraciones de respaldo (POST /api/backups/settings) - Protegido: Solo Admin
    public function saveSettings() {
        $this->requireAuth(['admin']);
        $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;

        $frequency = trim($input['frequency'] ?? 'daily');
        $tables = $input['tables'] ?? []; // Array de tablas

        if (!in_array($frequency, ['daily', 'weekly', 'monthly'])) {
            $this->error('Frecuencia no válida.', 400);
        }

        $db = \Config\Database::getInstance()->getConnection();
        $tablesStr = implode(',', $tables);

        try {
            // 1. Guardar en la tabla de configuraciones
            $stmt = $db->prepare("
                UPDATE settings 
                SET backup_frequency = :freq, backup_tables = :tables
                ORDER BY id ASC LIMIT 1
            ");
            $stmt->execute([
                'freq' => $frequency,
                'tables' => $tablesStr
            ]);

            // 2. Modificar el Evento Programado en MySQL
            $intervalMap = [
                'daily' => '1 DAY',
                'weekly' => '7 DAY',
                'monthly' => '30 DAY'
            ];
            $interval = $intervalMap[$frequency];

            try {
                $db->exec("
                    ALTER EVENT automatic_backup_trigger
                    ON SCHEDULE EVERY $interval
                    STARTS CURRENT_TIMESTAMP + INTERVAL $interval;
                ");
            } catch (Exception $evEx) {
                // Registrar advertencia si el host restringe ALTER EVENT, pero no bloquear la operación
                error_log("Warning: Could not alter MySQL Event trigger: " . $evEx->getMessage());
            }

            $this->json(['message' => 'Configuración de copias de seguridad guardada exitosamente.']);
        } catch (Exception $e) {
            $this->error('Error al guardar configuración: ' . $e->getMessage(), 500);
        }
    }

    // Función auxiliar para compilar y guardar el volcado SQL
    private function generateBackupFile($id, $fileName, $tablesToBackup = []) {
        $db = \Config\Database::getInstance()->getConnection();
        $backupDir = __DIR__ . '/../../public/backups';

        if (!is_dir($backupDir)) {
            mkdir($backupDir, 0755, true);
            file_put_contents($backupDir . '/.htaccess', "Order Deny,Allow\nDeny from all\n");
        }

        $filePath = $backupDir . '/' . $fileName;

        try {
            // Si no se especifica ninguna tabla, respaldar todas
            if (empty($tablesToBackup)) {
                $tablesStmt = $db->query("SHOW TABLES");
                while ($row = $tablesStmt->fetch(PDO::FETCH_NUM)) {
                    $tablesToBackup[] = $row[0];
                }
            }

            // Excluir la tabla backups de su propia copia para no sobrecargar el archivo
            $tablesToBackup = array_diff($tablesToBackup, ['backups']);

            $sqlContent = "-- ==================================================\n";
            $sqlContent .= "-- SAII DATABASE BACKUP\n";
            $sqlContent .= "-- Generated: " . date('Y-m-d H:i:s') . "\n";
            $sqlContent .= "-- Code: BK" . date('YmdHis') . "\n";
            $sqlContent .= "-- ==================================================\n\n";
            $sqlContent .= "SET FOREIGN_KEY_CHECKS = 0;\n\n";

            foreach ($tablesToBackup as $table) {
                // Sanitizar nombre de tabla por seguridad
                $tableClean = preg_replace('/[^a-zA-Z0-9_]/', '', $table);

                // 1. Obtener estructura DDL
                $ddlStmt = $db->query("SHOW CREATE TABLE `$tableClean`");
                $ddlRow = $ddlStmt->fetch();
                if ($ddlRow) {
                    $sqlContent .= "-- --------------------------------------------------\n";
                    $sqlContent .= "-- Table structure for `$tableClean`\n";
                    $sqlContent .= "-- --------------------------------------------------\n";
                    $sqlContent .= "DROP TABLE IF EXISTS `$tableClean`;\n";
                    $sqlContent .= $ddlRow['Create Table'] . ";\n\n";
                }

                // 2. Obtener filas DML
                $dataStmt = $db->query("SELECT * FROM `$tableClean`");
                $rows = $dataStmt->fetchAll(PDO::FETCH_ASSOC);

                if (!empty($rows)) {
                    $sqlContent .= "-- Dumping data for table `$tableClean`\n";
                    foreach ($rows as $row) {
                        $keys = array_keys($row);
                        $escapedKeys = array_map(function($k) { return "`$k`"; }, $keys);

                        $escapedValues = [];
                        foreach ($row as $val) {
                            if ($val === null) {
                                $escapedValues[] = 'NULL';
                            } else {
                                $escapedValues[] = $db->quote($val);
                            }
                        }

                        $sqlContent .= "INSERT INTO `$tableClean` (" . implode(', ', $escapedKeys) . ") VALUES (" . implode(', ', $escapedValues) . ");\n";
                    }
                    $sqlContent .= "\n";
                }
            }

            $sqlContent .= "SET FOREIGN_KEY_CHECKS = 1;\n";

            // Escribir archivo en el disco
            file_put_contents($filePath, $sqlContent);

            // Medir tamaño en disco
            $bytes = filesize($filePath);
            $sizeStr = $this->formatBytes($bytes);

            // Registrar éxito en BD
            $updateStmt = $db->prepare("
                UPDATE backups 
                SET file_size = :file_size, status = 'success', tables_included = :tables
                WHERE id = :id
            ");
            $updateStmt->execute([
                'file_size' => $sizeStr,
                'tables' => implode(',', $tablesToBackup),
                'id' => $id
            ]);

            return true;
        } catch (Exception $e) {
            error_log("Auto backup failed for ID $id: " . $e->getMessage());

            // Registrar fallo en BD
            $updateStmt = $db->prepare("UPDATE backups SET status = 'failed' WHERE id = :id");
            $updateStmt->execute(['id' => $id]);

            return false;
        }
    }

    // Formatear bytes en cadenas legibles
    private function formatBytes($bytes, $precision = 2) {
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];
        $bytes = max($bytes, 0);
        $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
        $pow = min($pow, count($units) - 1);
        $bytes /= pow(1024, $pow);
        return round($bytes, $precision) . ' ' . $units[$pow];
    }
}
