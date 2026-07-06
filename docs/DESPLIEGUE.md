# Manual de Despliegue — Sistema Administrativo SAII

Este documento detalla los requisitos, pasos y configuraciones necesarias para desplegar el sistema **SAII** (Sistema Administrativo del Instituto de Informática) tanto en un entorno local de desarrollo (XAMPP) como en un servidor de hosting o producción.

---

## 1. Requisitos de Sistema

Para ejecutar el backend y frontend de SAII de manera óptima, el servidor debe cumplir con:

* **Servidor Web:** Apache 2.4+ (con `mod_rewrite` habilitado) o Nginx.
* **Intérprete:** PHP 8.0 o superior.
* **Extensiones PHP Requeridas:**
  * `pdo_mysql` (Acceso a base de datos relacional)
  * `session` (Gestión de sesiones)
  * `json` (Intercambio de datos API REST)
  * `openssl` o `random` (Generación de tokens criptográficos CSRF)
* **Base de Datos:** MySQL 5.7+ o MariaDB 10.4+.

---

## 2. Estructura de Directorios para Despliegue

La estructura en producción debe mantener la separación de responsabilidades por capas:

```text
saii-frontend-development/
├── app/                  # Clases del Patrón MVC (Controllers, Models, Core)
├── config/               # Archivos de configuración (Database)
├── database/             # Scripts SQL (schema.sql, seeds.sql)
├── logs/                 # Archivos de log de errores en producción (php_errors.log)
├── public/               # Raíz del Servidor Web (index.php, router, CSS, JS, HTML)
│   ├── css/
│   ├── js/
│   ├── favicon.ico
│   ├── index.html
│   └── index.php         # Front Controller / Enrutador
├── .env                  # Variables de entorno seguras (no subir a control de versiones)
└── .htaccess             # Redirecciones de Apache hacia el Front Controller
```

---

## 3. Instalación Local en Desarrollo (XAMPP)

1. **Copiar Archivos:** Mueve el directorio del proyecto dentro de la carpeta `htdocs/` de tu instalación de XAMPP (por ejemplo: `C:\xampp\htdocs\saii\`).
2. **Iniciar Servicios:** Abre el **XAMPP Control Panel** e inicia **Apache** y **MySQL**.
3. **Importar la Base de Datos:**
   * Abre [http://localhost/phpmyadmin](http://localhost/phpmyadmin).
   * Crea una base de datos llamada `proy_nima` con cotejamiento `utf8mb4_unicode_ci`.
   * Ve a la pestaña **Importar** y selecciona el archivo `database/schema.sql` para crear las tablas.
   * Luego, importa `database/seeds.sql` para poblar el sistema con los datos y credenciales de prueba.
4. **Configurar el Archivo `.env`:**
   * Duplica o renombra `.env.example` a `.env` en la raíz del proyecto.
   * Modifica los valores según tus credenciales de base de datos locales:
     ```ini
     DB_HOST=127.0.0.1
     DB_PORT=3306
     DB_NAME=proy_nima
     DB_USER=root
     DB_PASS=
     SESSION_SECURE=false
     ```
5. **Configuración del Servidor PHP:**
   * Si utilizas el servidor de desarrollo CLI de PHP (puerto 8000), corre:
     ```powershell
     & D:\xampp\php\php.exe -S 127.0.0.1:8000 public/index.php
     ```
   * En el frontend de Next.js (`http://127.0.0.1:3000`), el cliente `APIClient` redirigirá automáticamente a `http://127.0.0.1:8000/api` y compartirá cookies de sesión de forma segura.

---

## 4. Despliegue en Hosting Compartido o VPS (Producción)

### A. Subida de Archivos y Raíz Web
1. Sube todos los directorios del proyecto al directorio principal de tu hosting (fuera de la carpeta pública `public_html` o `www` para proteger el código PHP del acceso directo, si es posible).
2. Coloca únicamente el contenido de la carpeta `/public` dentro de tu directorio público `public_html`.
3. Si separas las carpetas, actualiza las rutas en `public/index.php` para apuntar correctamente a `../app/` y `../config/`.

### B. Configuración de Base de Datos
1. Accede al phpMyAdmin o panel de control (cPanel/DirectAdmin) de tu proveedor de hosting.
2. Crea una base de datos MySQL y un usuario con permisos completos.
3. Importa secuencialmente `database/schema.sql` y `database/seeds.sql`.
4. Edita el archivo `.env` en el servidor con los datos reales de producción:
   ```ini
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=nombre_bd_produccion
   DB_USER=usuario_bd_produccion
   DB_PASS=contrasena_segura
   SESSION_SECURE=true
   ```

### C. Directivas de Apache (`.htaccess`)
Para que el enrutador reciba todas las peticiones a la API REST, asegúrate de que el archivo `.htaccess` esté configurado en la raíz pública:
```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^(.*)$ index.php [QSA,L]
</IfModule>
```

---

## 5. Parámetros de Aseguramiento en Producción

### A. Desactivación de Errores en Pantalla
Para evitar la fuga de información técnica a usuarios finales, se configuran las siguientes opciones en `public/index.php` (gestionadas por el controlador global):
```php
ini_set('display_errors', 0); // Oculta advertencias y errores en la interfaz
ini_set('log_errors', 1);     // Habilita el registro en logs
```
Todos los errores se redirigen en producción al archivo `/logs/php_errors.log`, el cual debe contar con permisos de escritura para el usuario del servidor web (`www-data` o similar) pero estar protegido de accesos públicos mediante un archivo `.htaccess` o por encontrarse fuera de la raíz web.

### B. Cookies de Sesión Seguras
El parámetro `SESSION_SECURE` en el archivo `.env` debe configurarse en `true` si el sitio cuenta con certificado SSL (HTTPS). Esto fuerza al navegador a transmitir la cookie de sesión únicamente sobre canales cifrados.

### C. Tokens CSRF
Todas las peticiones asíncronas de modificación (`POST`, `PUT`, `DELETE`) en el frontend son interceptadas por `APIClient` y enviadas con el token CSRF `X-CSRF-TOKEN` proporcionado por el endpoint `GET /api/auth/csrf`. Esto evita ataques de falsificación de petición en sitios cruzados.
