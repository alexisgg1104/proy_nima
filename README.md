# SAII — Sistema Administrativo del Instituto de Informática

**SAII** (Sistema Administrativo del Instituto de Informática) es una solución web integral diseñada para la gestión académica y administrativa del Instituto de Informática de la Facultad de Ingeniería Industrial de la Universidad Nacional de Piura (UNP). 

El sistema implementa una arquitectura cliente-servidor robusta utilizando tecnologías nativas para garantizar un alto rendimiento, seguridad de nivel de producción y una interfaz de usuario fluida e institucional.

---

## 🚀 Guía de Instalación y Ejecución Local

Sigue estos pasos para desplegar, configurar y ejecutar el sistema de manera local en tu máquina de pruebas:

### 1. Requisitos Previos
Asegúrate de tener instalado en tu máquina:
* **Node.js** (versión 18 o superior recomendada)
* **XAMPP** (con PHP 8.0+ y MySQL)
* Un navegador web moderno (Chrome, Edge, Firefox, etc.)

---

### 2. Instalar Dependencias del Frontend (Puerto 3000)
1. Abre una consola de comandos en el directorio raíz del proyecto y ejecuta:
   ```bash
   npm install
   ```
2. Inicia el servidor de desarrollo del frontend con:
   ```bash
   npm run dev
   ```
   *(El frontend interactivo estará disponible en la dirección: **http://127.0.0.1:3000/index.html**)*.

---

### 3. Configurar la Base de Datos (MySQL)
1. Abre el panel de control de **XAMPP** e inicia los servicios de **Apache** y **MySQL**.
2. Ingresa a **phpMyAdmin** en tu navegador: [http://localhost/phpmyadmin](http://localhost/phpmyadmin).
3. Crea una base de datos nueva llamada `proy_nima` (se recomienda usar la colación `utf8mb4_unicode_ci`).
4. Haz clic en la base de datos `proy_nima` recién creada y ve a la pestaña **Importar** en el menú superior.
5. Selecciona el archivo **`database/schema.sql`** ubicado en la carpeta del proyecto e impórtalo para crear las tablas.
6. Repite el procedimiento de importación seleccionando ahora el archivo **`database/seeds.sql`** para poblar las tablas con los usuarios y datos semilla.

---

### 4. Configurar Variables de Entorno (`.env`)
1. En el directorio raíz del proyecto, renombra el archivo **`.env.example`** a **`.env`**.
2. Abre el archivo `.env` en tu editor y asegúrate de que las credenciales coincidan con las de tu MySQL local:
   ```ini
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_NAME=proy_nima
   DB_USER=root
   DB_PASS=
   SESSION_SECURE=false
   ```

---

### 5. Iniciar el Servidor Backend (PHP - Puerto 8000)
1. Abre otra consola de comandos en la raíz del proyecto.
2. Ejecuta el servidor de desarrollo CLI nativo de PHP:
   * **Si tienes XAMPP instalado en el Disco C (ruta estándar):**
     ```powershell
     & C:\xampp\php\php.exe -S 127.0.0.1:8000 public/index.php
     ```
   * **Si tienes XAMPP en el Disco D (o configurado en tu variable de entorno PATH):**
     ```powershell
     php -S 127.0.0.1:8000 public/index.php
     ```
     *(El servidor backend procesará las solicitudes REST API de forma segura en el puerto `8000`).*

---

### 6. Acceder al Sistema
Entra en tu navegador a la ruta del frontend:
👉 **[http://127.0.0.1:3000/index.html](http://127.0.0.1:3000/index.html)**

Inicia sesión utilizando cualquiera de los usuarios preconfigurados en la base de datos:
* **Administrador:** Usuario: `admin` | Contraseña: `admin123`
* **Docente:** Usuario: `docente1` | Contraseña: `docente123`
* **Secretaria:** Usuario: `secretaria1` | Contraseña: `secretaria123`

---

## 🛠 Arquitectura del Sistema

El sistema SAII está construido con una separación limpia de responsabilidades (Arquitectura de Capas) y patrón MVC (Modelo-Vista-Controlador):

```text
public/                     # Raíz pública (Servida en el servidor)
├── css/styles.css          # Vista (Diseño responsivo institucional, variables HSL)
├── js/api.js               # Cliente HTTP (APIClient para llamadas fetch asíncronas)
├── js/data.js              # Modelo local (DataManager, mapeadores e inicializador de caché síncrona)
├── js/app.js               # Controlador del Frontend (Manejadores de eventos y pintado dinámico del DOM)
├── index.html              # Vista principal (Estructura SPA de una sola página)
└── index.php               # Front Controller / Enrutador del Servidor PHP
```

### Tecnologías Utilizadas

* **Frontend (Cliente):** HTML5 Semántico, CSS3 Vanilla (flexbox, grid y transiciones fluidas), JavaScript moderno (ES6 Vanilla JS) y la librería Chart.js para renderizado de estadísticas.
* **Backend (Servidor):** PHP 8+ nativo (sin frameworks) estructurado mediante enrutador de peticiones y controladores especializados.
* **Base de Datos:** MySQL / MariaDB relacional con 17 tablas indexadas y llaves foráneas para garantizar integridad referencial.

---

## 🔑 Módulos y Funcionalidades Principales

1. **Control de Acceso por Roles (RBAC):** Sistema de autenticación con 4 roles (Administrador, Coordinador Académico, Secretaria Académica, Docente) y adaptación dinámica de barras de navegación laterales (Sidebar).
2. **Gestión Académica Completa (CRUDs):** Creación, lectura, actualización y eliminación de Alumnos, Docentes, Cursos y Grupos.
3. **Matrículas y Quotas:** Inscripción de alumnos a grupos académicos específicos con validación de capacidad máxima (vacantes) en el servidor.
4. **Control de Asistencia:** Registro de asistencia por fecha y sesión para los alumnos matriculados en grupos académicos a cargo de cada docente.
5. **Actas de Calificaciones:** Registro de notas por módulos académicos, cálculo automatizado de promedios ponderados y cierre de actas.
6. **Emisión de Certificados:** Generación de constancias con flujo de firmas (Director e Instructor) y validación de promedio aprobatorio y porcentaje mínimo de asistencia.
7. **Reportes y Dashboard:** Dashboard interactivo con indicadores clave de rendimiento (KPIs), filtros avanzados por ciclo y exportación real a Excel/CSV y PDF.

---

## 🛡 Seguridad de Nivel de Producción

El sistema cuenta con un robusto esquema de seguridad implementado en el backend de PHP:

* **Protección contra Inyección SQL:** Todas las consultas a la base de datos se ejecutan a través del Driver PDO utilizando estrictamente sentencias preparadas y placeholders.
* **Cifrado de Contraseñas:** Las credenciales de usuario se almacenan en MySQL utilizando hashes Bcrypt unidireccionales generados con la función nativa `password_hash()`.
* **Protección contra Ataques CSRF (Cross-Site Request Forgery):** Se valida un token criptográfico único por sesión (`X-CSRF-TOKEN`) en todas las solicitudes que modifican el estado de la base de datos (`POST`, `PUT`, `DELETE`).
* **Protección contra Ataques XSS (Cross-Site Scripting):** Centralización de desinfección y sanitización recursiva automática (`htmlspecialchars` y `strip_tags`) para todas las cadenas de texto del payload JSON de salida.
* **Manejo Seguro de Errores:** Excepciones técnicas y errores detallados de MySQL/PHP ocultos al cliente en producción (`display_errors = 0`) y redirigidos al archivo de auditoría interno `logs/php_errors.log`.
