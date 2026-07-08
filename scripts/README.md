# 🔧 Scripts de Utilidad — SAII

Esta carpeta contiene scripts PHP de uso único o mantenimiento. **No deben ser accesibles desde producción en internet abierto.**

---

## 📄 Archivos

### `import_db.php`
Importa el esquema (`schema.sql`) y los datos semilla (`seeds.sql`) en la base de datos configurada en las variables de entorno.

**Uso:** Ejecutar una sola vez al configurar el entorno por primera vez.
```bash
# Local con XAMPP:
php scripts/import_db.php
```
O mediante la ruta HTTP temporal `/api/import-db` (eliminada por seguridad tras el deploy inicial).

---

### `check_roles.php`
Script de diagnóstico que lista las tablas, columnas y registros actuales de la tabla `roles` con sus permisos.

**Uso:** Diagnóstico y depuración de la base de datos.
```bash
php scripts/check_roles.php
```

---

### `update_db_permissions.php`
Agrega la columna `permissions` a la tabla `roles` si no existe y actualiza los permisos por defecto de cada rol.

**Uso:** Migración ligera si la columna `permissions` no fue incluida en el `schema.sql` inicial.
```bash
php scripts/update_db_permissions.php
```

---

> [!CAUTION]
> **Estos scripts leen las variables de entorno del archivo `.env` en la raíz del proyecto.** Asegúrate de tener el `.env` configurado correctamente antes de ejecutarlos.
> 
> En producción (Railway), estos scripts no se ejecutan automáticamente — son solo para uso manual del administrador del sistema.
