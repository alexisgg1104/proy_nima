# Guía de Instalación del Backend y Base de Datos (Local)

Esta guía detalla los pasos para configurar la base de datos MySQL, inicializar el servidor local en PHP y conectar el frontend interactivo con la base de datos real.

---

## 1. Requisitos Previos

1. **XAMPP** (Versión con PHP 8.0 o superior instalada).
2. Servidor de Base de Datos **MySQL/MariaDB** y Servidor Web **Apache** activos en el Panel de Control de XAMPP.
3. Un navegador web moderno (Chrome, Edge o Firefox).

---

## 2. Configuración de la Base de Datos

1. Abra el panel de control de XAMPP e inicie los módulos **Apache** y **MySQL**.
2. Abra su navegador e ingrese a **phpMyAdmin**: `http://localhost/phpmyadmin/`
3. En la barra lateral izquierda, haga clic en **Nueva**.
4. Configure los parámetros de creación:
   * **Nombre de la base de datos:** `saii_db`
   * **Cotejamiento (Collation):** `utf8mb4_unicode_ci` (para soportar eñes, tildes y caracteres especiales de forma nativa).
5. Haga clic en **Crear**.
6. Seleccione la base de datos `saii_db` recién creada y diríjase a la pestaña **Importar**.
7. Suba e importe los scripts SQL en este orden estricto:
   * Primero: [schema.sql](file:///c:/Users/manue/Downloads/saii-frontend-development%20%282%29/database/schema.sql) (estructura de tablas).
   * Segundo: [seeds.sql](file:///c:/Users/manue/Downloads/saii-frontend-development%20%282%29/database/seeds.sql) (datos de prueba e inicialización).
8. Presione **Importar** (o Continuar) en el pie de página. Compruebe que las 17 tablas se crearon correctamente.

---

## 3. Configuración del Servidor Backend (Dos Métodos)

### Método A: Servidor Incorporado de PHP (Recomendado por agilidad)
Este método permite ejecutar el servidor de desarrollo sin necesidad de copiar o mover los archivos del proyecto fuera de su carpeta actual de descarga.

1. Abra una terminal (PowerShell o Git Bash) en la raíz del proyecto:
   ```powershell
   cd "C:\Users\manue\Downloads\saii-frontend-development (2)"
   ```
2. Ejecute el servidor de desarrollo apuntando al directorio raíz del backend:
   ```bash
   php -S localhost:8000 -t public/
   ```
3. El backend ahora está disponible en `http://localhost:8000/`.

---

### Método B: Carpeta `htdocs` de XAMPP (Apache Tradicional)
1. Copie todo el proyecto al directorio de publicación de XAMPP:
   * Ruta sugerida: `C:\xampp\htdocs\saii-backend\`
2. El backend estará disponible en `http://localhost/saii-backend/public/`.

---

## 4. Configuración del Archivo de Entorno (`.env`)

1. En la carpeta raíz del backend, copie el archivo de plantilla:
   * Origen: `.env.example`
   * Destino: `.env`
2. Configure las variables de conexión de acuerdo con su entorno local:
   ```env
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_NAME=saii_db
   DB_USER=root
   DB_PASS=
   
   # Configuración de Seguridad
   CSRF_ENABLED=true
   SESSION_SECURE=false # Colocar en true solo si cuenta con certificado SSL (HTTPS)
   ```

---

## 5. Pruebas de Funcionamiento de la API

Antes de habilitar la conexión, pruebe los endpoints REST con un cliente HTTP (como Postman o curl) o ingresando directamente desde el navegador:

* **Prueba de Enrutamiento:** `GET http://localhost:8000/api/test` (debe retornar un JSON con estado de éxito).
* **Perfil de usuario (Sin autenticar):** `GET http://localhost:8000/api/auth/me` (debe retornar HTTP 401 Unauthorized y un JSON con mensaje de error).
* **Login de Prueba:** Enviar una solicitud `POST` a `http://localhost:8000/api/auth/login` con cuerpo JSON:
  ```json
  {
    "username": "admin",
    "password": "admin123",
    "role": "admin"
  }
  ```
  Debe retornar un JSON con los datos del administrador y una cookie de sesión en los headers.

---

## 6. Conexión del Frontend

Una vez validado el backend:
1. Abra el archivo [app.js](file:///c:/Users/manue/Downloads/saii-frontend-development%20%282%29/public/js/app.js).
2. Ubique la constante global de habilitación (si fue creada en la Fase B9) o la configuración del cliente:
   ```javascript
   const USE_MOCK = false; // Cambiar de true a false para deshabilitar data.js
   const API_BASE_URL = 'http://localhost:8000/api';
   ```
3. Abra `public/index.html` en el navegador y pruebe el flujo de login real ingresando las credenciales de la base de datos (por ejemplo, `admin` / `admin123`).
