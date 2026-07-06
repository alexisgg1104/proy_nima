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
   > [!WARNING]
   > El archivo `.env` contiene credenciales locales y de correo. Está excluido en el archivo `.gitignore` para evitar filtraciones en el repositorio de GitHub. **Nunca comitas ni subas este archivo al repositorio**.
2. Abre el archivo `.env` en tu editor y asegúrate de que las credenciales coincidan con las de tu MySQL local. Asimismo, configura las credenciales de correo (SMTP) si deseas habilitar la recuperación de contraseña por email:
   ```ini
   ; Configuración de Base de Datos
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_NAME=proy_nima
   DB_USER=root
   DB_PASS=
   
   ; Configuración de Seguridad
   CSRF_ENABLED=true
   SESSION_SECURE=false

   ; Configuración de Correo Electrónico (SMTP para recuperación de contraseña)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=tu_correo@gmail.com
   SMTP_PASS=tu_app_password
   SMTP_FROM=tu_correo@gmail.com
   SMTP_FROM_NAME="SAII - Instituto de Informática"
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
saii-frontend-development/
├── .agents/                # Configuración y reglas locales para agentes de IA
├── app/                    # Backend: Capa lógica de Controladores y Modelos (MVC)
├── config/                 # Backend: Configuración de conexión de base de datos
├── database/               # Base de Datos: Scripts SQL de Tablas (schema) y Semillas (seeds)
├── docs/                   # Documentación organizada de desarrollo
│   ├── frontend/           # Bitácoras y especificaciones de la etapa de interfaz (Fases 1-7)
│   ├── backend/            # Contratos de API, seguridad de base de datos y backlog de PHP
│   ├── rules/              # Reglas y restricciones de desarrollo (AGENTS.md)
│   ├── misc/               # Auditorías y correcciones de soporte general
│   └── DESPLIEGUE.md       # Guía detallada de instalación y producción (XAMPP / VPS)
├── logs/                   # Backend: Registro seguro de errores técnicos PHP en producción
├── public/                 # Frontend y Servidor Web (Servido públicamente)
│   ├── css/styles.css      # Vista: Diseño responsivo institucional y estilos CSS
│   ├── images/             # Activos: Logotipos oficiales y recursos gráficos del sistema
│   ├── js/api.js           # Cliente HTTP: Cliente REST asíncrono (APIClient)
│   ├── js/data.js          # Modelo local: Manejo de datos y sincronización de caché en memoria
│   ├── js/app.js           # Controlador local: Interacción del DOM y pintado de vistas
│   ├── index.html          # Vista principal: Estructura HTML de una sola página (SPA)
│   └── index.php           # Front Controller: Enrutador del servidor de backend PHP
├── .env                    # Configuración de variables de entorno locales
├── .htaccess               # Configuración de redirecciones URL en servidores Apache
└── README.md               # Portada explicativa del proyecto en el repositorio
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

---

## 📈 Historial y Fases de Desarrollo

El desarrollo del sistema SAII se llevó a cabo en dos etapas consecutivas de manera planificada e incremental:

### 🎨 Etapa 1: Frontend Interactivo (Fases 1 a 7)
El objetivo fue consolidar toda la interfaz de usuario en una arquitectura Single Page Application (SPA) con interactividad dinámica y validaciones en el cliente:
* **Fase 1 (Diseño y Sidebar):** Creación del Layout responsivo institucional y el sidebar de navegación contextual adaptativo por roles.
* **Fase 2 (CRUDs Base):** Construcción de los paneles y listas interactivas para Alumnos, Docentes, Cursos y Módulos.
* **Fase 3 (Grupos Académicos):** Panel de programación de horarios, vacantes, modalidad y vinculación docente-curso.
* **Fase 4 (Módulo de Matrículas):** Rediseño interactivo del flujo de matrículas con control de vacantes.
* **Fase 5 (Control de Asistencia):** Interfaz para docentes que permite registrar y firmar asistencias de alumnos por fecha y sesión.
* **Fase 6 (Registro de Calificaciones):** Diseño interactivo para el ingreso de notas modulares y cálculo automático de promedios.
* **Fase 7 (Acreditación, Reportes y Localización):** Generación visual de certificados con firmas del director, dashboard analítico interactivo con Chart.js, panel de administración de usuarios y localización idiomática (traducción universal i18n por DOM).

### ⚙ Etapa 2: Backend y Base de Datos (Fases B0 a B10)
En esta fase se implementó el motor de persistencia relacional en MySQL y la API REST en PHP con arquitectura MVC nativa, conectándolos al frontend de forma segura:
* **Fase B0 (Estabilización):** Auditoría y limpieza de referencias huérfanas en el frontend.
* **Fase B1 (Modelado de Datos):** Diseño DDL y DML (seeds) de las 17 tablas relacionales en MySQL con restricciones de llaves foráneas.
* **Fase B2 (Estructura MVC):** Configuración del Front Controller `public/index.php`, autoloader de clases PSR-4 y router dinámico.
* **Fase B3 (Autenticación y Seguridad):** Gestión de inicio y cierre de sesión seguro en el servidor y CRUD de usuarios administradores.
* **Fases B4 a B7 (Migración de Controladores):** Implementación de la lógica de negocio y consultas preparadas PDO en los controladores correspondientes para la gestión CRUD y persistencia de Alumnos, Docentes, Cursos, Grupos, Matrículas, Asistencia y Notas.
* **Fase B8 (Dashboard, Plantillas y Reportes):** Desarrollo de agregaciones SQL para los KPIs del Dashboard, guardado de filtros dinámicos de reportes en base de datos, exportación real a CSV y emisión de constancias en PDF.
* **Fase B9 (Integración Cliente-Servidor):** Desactivación completa de los datos de prueba (`USE_MOCK = false`), creación del cliente HTTP asíncrono `APIClient` y sistema de caché relacional en memoria en el cliente para eliminar latencias de red y mantener síncrono el pintado de tablas del frontend.
* **Fase B10 (Aseguramiento y Despliegue):** Integración de tokens CSRF automáticos por sesión, desinfección XSS recursiva en las salidas JSON de `BaseController`, encapsulamiento seguro de excepciones técnicas PHP en `logs/php_errors.log` y manuales de despliegue.

