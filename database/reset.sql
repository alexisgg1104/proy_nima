-- SAII - Base de Datos - Script de Reinicio Seguro para Desarrollo
-- Universidad Nacional de Piura - Facultad de Ingeniería Industrial

-- 1. Eliminar base de datos si existe
DROP DATABASE IF EXISTS saii_db;

-- 2. Crear base de datos limpia con codificación utf8mb4
CREATE DATABASE saii_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE saii_db;

-- 3. Importar estructura de tablas
SOURCE schema.sql;

-- 4. Importar datos semilla iniciales
SOURCE seeds.sql;

-- 5. Mensaje de confirmación
SELECT 'Base de datos saii_db reiniciada e inicializada correctamente' AS mensaje;
