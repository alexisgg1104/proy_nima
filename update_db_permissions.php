<?php
// update_db_permissions.php
// Script temporal para agregar e inicializar el campo de permisos en Aiven

require_once __DIR__ . '/config/Database.php';

// Cargar variables de entorno si existe .env local para pruebas locales
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
    echo "Conectando a la base de datos remota...\n";
    $db = Database::getInstance()->getConnection();
    
    // 1. Agregar columna 'permissions' si no existe
    echo "Verificando columna 'permissions' en tabla 'roles'...\n";
    $columns = $db->query("SHOW COLUMNS FROM roles LIKE 'permissions'")->fetchAll();
    if (empty($columns)) {
        echo "Agregando columna 'permissions' a la tabla 'roles'...\n";
        $db->exec("ALTER TABLE roles ADD COLUMN permissions TEXT NULL");
        echo "Columna agregada exitosamente.\n";
    } else {
        echo "La columna 'permissions' ya existe.\n";
    }
    
    // 2. Actualizar los permisos por defecto
    echo "Actualizando permisos por defecto de los roles...\n";
    $rolePermissions = [
        'admin' => ["dashboard", "students", "courses", "teachers", "groups", "enrollments", "attendance", "grades", "certificates", "reports", "users", "settings"],
        'secretary' => ["dashboard", "students", "enrollments", "certificates", "reports"],
        'teacher' => ["dashboard", "grades", "attendance", "reports"],
        'coordinator' => ["dashboard", "courses", "groups", "reports", "students"],
        'dean' => ["dashboard", "certificates"]
    ];
    
    $stmt = $db->prepare("UPDATE roles SET permissions = :permissions WHERE key_name = :key_name");
    foreach ($rolePermissions as $key => $perms) {
        $stmt->execute([
            'permissions' => json_encode($perms),
            'key_name' => $key
        ]);
        echo "Permisos actualizados para el rol '$key'.\n";
    }
    
    echo "¡Migración de permisos completada con éxito!\n";
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}
