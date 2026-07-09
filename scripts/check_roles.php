<?php
// check_roles.php
// Diagnóstico de tablas y columnas en la base de datos

require_once __DIR__ . '/../config/Database.php';

// Cargar variables de entorno si existe .env local
if (file_exists(__DIR__ . '/.env')) {
    $lines = file(__DIR__ . '/.env', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) continue;
        if (strpos($line, '=') === false) continue;
        list($name, $value) = explode('=', $line, 2);
        putenv(trim($name) . "=" . trim($value));
    }
}

use Config\Database;

try {
    $db = Database::getInstance()->getConnection();
    
    echo "=== TABLAS ===\n";
    $tables = $db->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN);
    foreach ($tables as $t) {
        echo "- $t\n";
    }
    
    echo "\n=== COLUMNAS EN roles ===\n";
    $columns = $db->query("SHOW COLUMNS FROM roles")->fetchAll(PDO::FETCH_ASSOC);
    foreach ($columns as $c) {
        echo "- {$c['Field']} ({$c['Type']})\n";
    }
    
    echo "\n=== REGISTROS EN roles ===\n";
    $rows = $db->query("SELECT * FROM roles")->fetchAll(PDO::FETCH_ASSOC);
    foreach ($rows as $r) {
        echo "ID: {$r['id']} | Name: {$r['name']} | Key: {$r['key_name']}\n";
        if (isset($r['permissions'])) {
            echo "  Permissions: {$r['permissions']}\n";
        }
    }
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}
