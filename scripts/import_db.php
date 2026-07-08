<?php

// === IMPORTADOR DE BASE DE DATOS SAII ===
// Este script lee el archivo .env local, se conecta a la base de datos (local o remota)
// e importa la estructura (schema.sql) y los datos iniciales (seeds.sql).

// Cargar variables del archivo .env local
if (!file_exists(__DIR__ . '/.env')) {
    die("Error: No se encontró el archivo .env en la raíz del proyecto.\n");
}

$env = parse_ini_file(__DIR__ . '/.env');

$host = $env['DB_HOST'] ?? '127.0.0.1';
$port = $env['DB_PORT'] ?? '3306';
$dbName = $env['DB_NAME'] ?? 'saii_db';
$user = $env['DB_USER'] ?? 'root';
$pass = $env['DB_PASS'] ?? '';

echo "==================================================\n";
echo "=== IMPORTADOR DE BASE DE DATOS SAII ===\n";
echo "==================================================\n";
echo "Conectando a: mysql:host=$host;port=$port;dbname=$dbName con usuario '$user'...\n";

try {
    $dsn = "mysql:host=$host;port=$port;dbname=$dbName;charset=utf8mb4";
    $pdo = new PDO($dsn, $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_EMULATE_PREPARES => false
    ]);
    echo "¡Conexión establecida con éxito!\n\n";
} catch (PDOException $e) {
    die("Error de conexión: " . $e->getMessage() . "\n\nPor favor, verifica los datos en tu archivo .env local.\n");
}

// 1. Ejecutar schema.sql
$schemaFile = __DIR__ . '/database/schema.sql';
if (!file_exists($schemaFile)) {
    die("Error: No se encontró el archivo database/schema.sql.\n");
}

echo "Ejecutando schema.sql...\n";
$schemaSql = file_get_contents($schemaFile);

try {
    $pdo->exec($schemaSql);
    echo "¡Estructura de tablas creada con éxito (schema.sql)!\n\n";
} catch (PDOException $e) {
    die("Error al importar schema.sql: " . $e->getMessage() . "\n");
}

// 2. Ejecutar seeds.sql
$seedsFile = __DIR__ . '/database/seeds.sql';
if (!file_exists($seedsFile)) {
    die("Error: No se encontró el archivo database/seeds.sql.\n");
}

echo "Ejecutando seeds.sql...\n";
$seedsSql = file_get_contents($seedsFile);

try {
    $pdo->exec($seedsSql);
    echo "¡Datos iniciales importados con éxito (seeds.sql)!\n\n";
    echo "==================================================\n";
    echo "¡PROCESO COMPLETADO SATISFACTORIAMENTE!\n";
    echo "==================================================\n";
} catch (PDOException $e) {
    die("Error al importar seeds.sql: " . $e->getMessage() . "\n");
}
