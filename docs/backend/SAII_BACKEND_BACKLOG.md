# SAII_BACKEND_BACKLOG.md — Plan de Fases Backend y Base de Datos

Este archivo define el mapa general de fases de desarrollo para la etapa del backend en PHP y la base de datos MySQL, así como la bitácora donde los agentes de IA deben registrar el resumen de su ejecución.

---

## Estado General de Fases Backend

| Fase | Nombre | Estado | Fuente Operativa |
|---|---|---|---|
| **Fase B0** | Auditoría y estabilización previa del frontend | **Completada** | `SAII_BACKEND_ESTADO_Y_PROMPTS.md` |
| **Fase B1** | Diseño de base de datos | **Completada** | `SAII_BACKEND_ESTADO_Y_PROMPTS.md` |
| **Fase B2** | Estructura PHP MVC | **Completada** | `SAII_BACKEND_ESTADO_Y_PROMPTS.md` |
| **Fase B3** | Autenticación, sesiones, usuarios y roles | **Completada** | `SAII_BACKEND_ESTADO_Y_PROMPTS.md` |
| **Fase B4** | CRUD académico base | **Completada** | `SAII_BACKEND_ESTADO_Y_PROMPTS.md` |
| **Fase B5** | Grupos académicos y matrículas | **Completada** | `SAII_BACKEND_ESTADO_Y_PROMPTS.md` |
| **Fase B6** | Asistencia de alumnos | **Completada** | `SAII_BACKEND_ESTADO_Y_PROMPTS.md` |
| **Fase B7** | Notas, actas y certificados | **Completada** | `SAII_BACKEND_ESTADO_Y_PROMPTS.md` |
| **Fase B8** | Reportes, gráficos y exportaciones | **Completada** | `SAII_BACKEND_ESTADO_Y_PROMPTS.md` |
| **Fase B9** | Integración frontend-backend | **Completada** | `SAII_BACKEND_ESTADO_Y_PROMPTS.md` |
| **Fase B10**| Seguridad, pruebas y despliegue | **Completada** | `SAII_BACKEND_ESTADO_Y_PROMPTS.md` |

---

## Fase B0: Auditoría y estabilización previa del frontend

Estado: **En Ejecución**.

### Objetivos
* Auditar el código HTML, CSS y JS existente en `public/` para detectar errores de referencia a funciones inexistentes.
* Identificar y limpiar o marcar el código muerto relacionado con la asistencia docente antigua para dar paso a la asistencia de alumnos de forma unificada.
* Mapear las colecciones de `mockData` vigentes en `data.js` que se migrarán a la base de datos relacional.

### Tareas
- [x] Auditar `index.html` en busca de `onclick` rotos.
- [x] Auditar `app.js` en busca de dependencias hacia métodos que no existen en `data.js`.
- [x] Elaborar un informe de compatibilidad y riesgos de integración antes de modificar código o crear la base de datos.
- [ ] Corregir las referencias de impresión de certificados y descarga de reportes rotas en HTML.
- [ ] Marcar/limpiar los métodos obsoletos de asistencia de horas docente en `app.js`.

### Criterios de Aceptación
* El frontend actual sigue operativo y no se ha roto el login simulado.
* Se entrega un reporte detallado con las funciones inexistentes mapeadas y el estado de la asistencia docente obsoleta.

---

## Fase B1: Diseño de base de datos

Estado: **Completada**.

### Objetivos
* Diseñar un modelo de base de datos relacional MySQL normalizado que abarque la totalidad de los datos mock del sistema.
* Garantizar la integridad de datos mediante constraints de llaves primarias y foráneas.

### Tareas
- [x] Diseñar el modelo relacional (ER) textual y detallado.
- [x] Definir los tipos de datos óptimos para cada columna (DNI de 8, código de 10, contraseñas hash, estados, etc.).
- [x] Crear el script SQL `schema.sql` con la definición DDL de las 17 tablas.
- [x] Crear el script SQL `seeds.sql` con datos representativos basados en `public/js/data.js`.


### Criterios de Aceptación
* El script SQL se ejecuta sin errores en phpMyAdmin.
* Todas las tablas cuentan con llaves primarias y las relaciones (FK) están correctamente configuradas en cascada o restricción según convenga.

---

## Fase B2: Estructura PHP MVC

Estado: **Completada**.

### Objetivos
* Crear la estructura básica del proyecto en capas bajo el patrón Modelo-Vista-Controlador en PHP 8.
* Implementar un sistema de enrutamiento básico para responder solicitudes JSON de forma organizada.

### Tareas
- [x] Estructurar los directorios del proyecto: `app/` (Models, Controllers), `config/` (DB connection), `public/` (index.php, router, assets).
- [x] Crear el Front Controller `public/index.php` que reciba todas las solicitudes.
- [x] Crear la clase `Router` que mapee rutas HTTP (GET/POST/PUT/DELETE) a métodos de controladores.
- [x] Configurar la conexión PDO en `config/database.php` leyendo credenciales desde un archivo `.env`.
- [x] Definir las clases base `BaseModel` y `BaseController`.
- [x] Crear una clase helper para estandarizar las respuestas JSON de la API.

### Criterios de Aceptación
* Acceder a `http://localhost/saii-backend/public/api/test` retorna una respuesta JSON de prueba exitosa.
* La base de datos se conecta a través de PDO usando variables de configuración seguras.

---

## Fase B3: Autenticación, sesiones, usuarios y roles

Estado: **Completada**.

### Objetivos
* Reemplazar el login simulado del frontend por un flujo de autenticación real en el servidor.
* Administrar los accesos y los menús según el rol del usuario de forma segura.

### Tareas
- [x] Crear la tabla `users` con hashes seguros en BD.
- [x] Implementar el endpoint `/api/auth/login` que valide credenciales con `password_verify` e inicie la sesión de PHP (`$_SESSION`).
- [x] Implementar el endpoint `/api/auth/logout` que destruya la sesión.
- [x] Implementar el endpoint `/api/auth/me` para retornar el perfil del usuario autenticado en la sesión.
- [x] Crear Middlewares o filtros de autenticación y de roles para proteger las rutas de la API.
- [x] Implementar el CRUD completo de administración de usuarios y la gestión de permisos de roles.

### Criterios de Aceptación
* No es posible acceder a endpoints protegidos de la API sin una sesión activa (retorna HTTP 401).
* El intento de login con credenciales inválidas es rechazado y no se crea sesión de PHP.

---

## Fase B4: CRUD académico base

Estado: **Completada**.

### Objetivos
* Desarrollar los controladores y modelos para gestionar las entidades académicas fundamentales del Instituto.

### Tareas
- [x] Implementar el CRUD completo de Alumnos (`/api/students`) con validaciones del DNI (8 dígitos), código (10 dígitos) y correo.
- [x] Implementar el CRUD completo de Docentes (`/api/teachers`).
- [x] Implementar el CRUD completo de Cursos (`/api/courses`) y sus Módulos asociados, asegurando que la suma de porcentajes de los módulos de un curso sume exactamente 100% en el servidor.

### Criterios de Aceptación
* Es posible crear, listar, actualizar y desactivar alumnos, docentes y cursos desde endpoints REST JSON.
* La API retorna errores con código HTTP 400 y mensajes detallados si fallan las validaciones.

---

## Fase B5: Grupos académicos y matrículas

Estado: **Completada**.

### Objetivos
* Crear la lógica para abrir periodos, horarios, asignar docentes a cursos y gestionar los cupos de alumnos.

### Tareas
- [x] Implementar el CRUD de Grupos Académicos (`/api/groups`), permitiendo diferenciar modalidad regular y examen de suficiencia.
- [x] Validar que un docente asignado a un grupo esté activo.
- [x] Implementar el CRUD de Matrículas (`/api/enrollments`).
- [x] Validar en el servidor que no se exceda el cupo máximo del grupo al matricular un alumno.
- [x] Evitar que un alumno se matricule dos veces en el mismo grupo.

### Criterios de Aceptación
* Registrar una matrícula descuenta automáticamente los cupos disponibles en el grupo correspondiente.
* Intentar matricular a un estudiante en un grupo lleno retorna un error HTTP 400.

---

## Fase B6: Asistencia de alumnos

Estado: **Completada**.

### Objetivos
* Desarrollar el control y registro diario de asistencia por parte de los docentes.

### Tareas
- [x] Crear endpoints para listar los alumnos matriculados en un grupo específico a fin de inicializar la lista de asistencia del día.
- [x] Implementar el guardado de listas de asistencia (`/api/attendance`) con estados: `borrador`, `registrada`, `observada`, `cerrada`.
- [x] Lógica de validación: solo los docentes asignados al grupo pueden registrar asistencia del mismo.
- [x] Implementar que el administrador pueda observar, reabrir o cerrar de forma definitiva las listas de asistencia.

### Criterios de Aceptación
* El docente puede guardar borradores de asistencia y posteriormente marcarlos como "Registrada".
* Una lista con estado "Cerrada" no puede ser modificada por el docente bajo ninguna circunstancia.

---

## Fase B7: Notas, actas y certificados

Estado: **Completada**.

### Objetivos
* Administrar las calificaciones académicas de los módulos de cada curso, el cálculo automático de los promedios ponderados y la expedición de acreditaciones.

### Tareas
- [x] Desarrollar la sábana de notas (`/api/grades`) por grupo para registrar calificaciones de 0 a 20 por módulo.
- [x] Calcular promedios ponderados en el servidor basándose en los porcentajes de los módulos del curso.
- [x] Implementar el flujo de actas: borrador y actas cerradas.
- [x] Desarrollar el módulo de certificados (`/api/certificates`).
- [x] Validar que un alumno esté apto para recibir certificado (promedio >= 11 y asistencia acumulada >= asistencia mínima, si la configuración lo exige).
- [x] Implementar el flujo de firmas (Director y Decano) y control de estados de certificados (`toBeSigned`, `pending`, `generated`).

### Criterios de Aceptación
* Las calificaciones se promedian según los pesos definidos en los módulos.
* Intentar emitir un certificado para un alumno con promedio desaprobatorio o inasistencias es rechazado por el servidor.

---

## Fase B8: Reportes, gráficos y exportaciones

Estado: **Pendiente**.

### Objetivos
* Generar KPIs, reportes estadísticos y descargas en formatos imprimibles y de hoja de cálculo con datos reales.

### Tareas
- [ ] Crear endpoints para KPIs del dashboard (alumnos activos, docentes activos, grupos abiertos, aprobados vs desaprobados, etc.).
- [ ] Implementar la generación y CRUD de consultas/reportes personalizados guardados.
- [ ] Desarrollar la exportación real de reportes y actas a formato CSV/Excel estructurado.
- [ ] Desarrollar la generación de certificados y reportes en PDF utilizando una librería ligera nativa en PHP (como FPDF o Dompdf) o mediante formato de impresión optimizado del navegador.

### Criterios de Aceptación
* Los KPIs cambian reactivamente de acuerdo con las inserciones reales en la base de datos.
* Los archivos exportados se descargan con la codificación y estructura correctas.

---

## Fase B9: Integración frontend-backend

Estado: **Pendiente**.

### Objetivos
* Conectar la interfaz de usuario existente con los endpoints de la API de PHP, reemplazando la carga de datos mock.

### Tareas
- [ ] Crear la librería cliente `public/js/api.js` que centralice todas las peticiones `fetch`.
- [ ] Integrar progresivamente los módulos en el siguiente orden recomendado:
  1. Login y autenticación de sesión de inicio.
  2. Módulos base (Alumnos, Docentes, Cursos).
  3. Matrículas y Grupos.
  4. Asistencia y Notas.
  5. Certificados, Configuración y Reportes.
- [ ] Implementar animaciones de carga (spinners) para mejorar la UX durante las peticiones asíncronas.
- [ ] Asegurar que el toggle de modo claro/oscuro y el simulador de roles funcionen de manera integrada.

### Criterios de Aceptación
* El frontend realiza peticiones de red reales al servidor local.
* La interfaz no parpadea ni rompe los estilos CSS durante la carga asíncrona de las tablas.

---

## Fase B10: Seguridad, pruebas y despliegue

Estado: **Pendiente**.

### Objetivos
* Asegurar el sistema ante vulnerabilidades comunes y preparar los archivos para el despliegue final en producción.

### Tareas
- [ ] Realizar una auditoría de seguridad completa (XSS, CSRF, Session Hijacking, SQLi).
- [ ] Configurar cabeceras de seguridad HTTP en PHP.
- [ ] Ofuscar y sanitizar salidas de datos en el cliente.
- [ ] Escribir documentación de instalación rápida en servidores Apache de producción.
- [ ] Realizar pruebas de estrés manuales con múltiples usuarios concurrentes.

### Criterios de Aceptación
* El sistema pasa los tests de seguridad y control de accesos por roles.
* El archivo .zip del proyecto contiene la base de datos limpia y la guía de instalación detallada.

---

## Bitácora de ejecución de fases de backend

*Esta sección será actualizada al finalizar cada una de las fases de backend.*

### Fase B0 — Auditoría y Planificación Inicial
- **Fecha:** 2026-07-05
- **Rama:** `alexis/backend-planificacion-mvc-db`
- **Commit o mensaje sugerido:** `docs: planificar etapa backend php mvc mysql para saii`
- **Estado final:** Completado (Planificación)
- **Archivos creados:**
  * `SAII_BACKEND_CONTEXTO.md`
  * `SAII_BACKEND_BACKLOG.md`
  * `SAII_BACKEND_ESTADO_Y_PROMPTS.md`
  * `SAII_BACKEND_DB_SCHEMA.md`
  * `SAII_BACKEND_API_CONTRATO.md`
  * `SAII_BACKEND_SEGURIDAD.md`
  * `SAII_BACKEND_MIGRACION_MOCK.md`
  * `README_BACKEND_SETUP.md`
- **Cambios principales:**
  * Se diseñó el plan técnico completo y detallado para el desarrollo backend.
  * Se identificaron 6 llamadas a funciones inexistentes en el frontend que deben corregirse (Fase B0).
  * Se constató la presencia de código obsoleto ("asistencia docente" / planillas) en `app.js` que no es compatible con el flujo de asistencia de alumnos y debe limpiarse.
- **Siguiente fase sugerida:** Fase B2 — Estructura PHP MVC.

### Fase B1 — Diseño de Base de Datos
- **Fecha:** 2026-07-05
- **Rama:** `main` (o la rama actual de trabajo de backend)
- **Commit o mensaje sugerido:** `database: validar esquema mysql inicial para saii`
- **Estado final:** Completado
- **Archivos creados:**
  * `database/reset.sql`
  * `database/README.md`
- **Archivos modificados:**
  * `database/schema.sql`
  * `database/seeds.sql`
  * `SAII_BACKEND_DB_SCHEMA.md`
  * `SAII_BACKEND_BACKLOG.md`
- **Cambios principales:**
  * Se validó e importó exitosamente la estructura SQL de 17 tablas con codificación utf8mb4 y motor InnoDB.
  * Se optimizaron las tablas agregando columnas de auditoría `created_at` y `updated_at`.
  * Se verificó la consistencia e integridad referencial de los datos semilla (seeds.sql).
  * Se creó un script de reinicio local rápido (`reset.sql`) y la documentación de configuración e importación (`database/README.md`).
- **Siguiente fase sugerida:** Fase B2 — Estructura PHP MVC.

### Fase B2 — Estructura PHP MVC
- **Fecha:** 2026-07-05
- **Rama:** `alexis/backend-b2-mvc-router`
- **Commit o mensaje sugerido:** `feat: fase B2 estructurar arquitectura mvc php y enrutamiento api`
- **Estado final:** Completado
- **Archivos creados:**
  * `config/Database.php`
  * `app/Core/Router.php`
  * `app/Core/BaseModel.php`
  * `app/Core/BaseController.php`
  * `.htaccess`
  * `.env.example`
- **Archivos modificados:**
  * `public/index.php`
- **Cambios principales:**
  * Configuración del ruteador nativo en PHP con expresiones regulares y soporte de subdirectorios de XAMPP.
  * Implementación de la autocarga PSR-4 y la conexión a MySQL usando PDO Singleton.

### Fase B3 — Autenticación, Sesiones, Usuarios y Roles
- **Fecha:** 2026-07-05
- **Rama:** `alexis/backend-b3-auth-sessions`
- **Commit o mensaje sugerido:** `feat: fase B3 implementar autenticacion real y control de sesiones por rol`
- **Estado final:** Completado
- **Archivos creados:**
  * `app/Models/User.php`
  * `app/Models/Role.php`
  * `app/Controllers/AuthController.php`
  * `app/Controllers/UserController.php`
- **Archivos modificados:**
  * `app/Core/BaseController.php`
  * `public/index.php`
  * `database/seeds.sql`
- **Cambios principales:**
  * Flujo de inicio de sesión real validado mediante `password_verify` en MySQL.
  * Middleware de protección de rutas `requireAuth` con soporte para verificación de privilegios por roles de usuario.
  * Implementación del CRUD administrativo completo de usuarios (`/api/users`).
- **Siguiente fase sugerida:** Fase B4 — CRUD académico base.

### Fase B4 — CRUD Académico Base
- **Fecha:** 2026-07-05
- **Rama:** `alexis/backend-b4-crud-academico`
- **Commit o mensaje sugerido:** `feat: fase B4 implementar crud para alumnos docentes y cursos`
- **Estado final:** Completado
- **Archivos creados:**
  * `app/Models/Student.php`
  * `app/Models/Teacher.php`
  * `app/Models/Course.php`
  * `app/Controllers/StudentController.php`
  * `app/Controllers/TeacherController.php`
  * `app/Controllers/CourseController.php`
- **Archivos modificados:**
  * `public/index.php`
  * `SAII_BACKEND_BACKLOG.md`
- **Cambios principales:**
  * CRUD completo para Alumnos (`/api/students`) y Docentes (`/api/teachers`) con validaciones de longitud y formato de DNI (8 dígitos) y código (10 dígitos).
  * CRUD completo para Cursos y Módulos asociados (`/api/courses`) de forma transaccional (Begin/Commit/Rollback).
  * Validación estricta para asegurar que los módulos del curso sumen exactamente el 100% en total.
- **Siguiente fase sugerida:** Fase B5 — Grupos académicos y matrículas.

### Fase B5 — Grupos Académicos y Matrículas
- **Fecha:** 2026-07-05
- **Rama:** `alexis/backend-b5-groups-matriculas`
- **Commit o mensaje sugerido:** `feat: fase B5 gestion de grupos y matriculas con limites de cupo`
- **Estado final:** Completado
- **Archivos creados:**
  * `app/Models/Group.php`
  * `app/Models/Enrollment.php`
  * `app/Controllers/GroupController.php`
  * `app/Controllers/EnrollmentController.php`
- **Archivos modificados:**
  * `public/index.php`
  * `SAII_BACKEND_BACKLOG.md`
- **Cambios principales:**
  * CRUD completo para Grupos Académicos (`/api/groups`) que calcula dinámicamente los inscritos y valida el estado activo del Docente y del Curso al crearlo.
  * CRUD completo para Matrículas (`/api/enrollments`) con control estricto de cupos disponibles (`max_quota`) en tiempo real.
  * Validación que impide la matriculación de alumnos duplicados en un mismo grupo académico.
- **Siguiente fase sugerida:** Fase B6 — Asistencia de alumnos.

### Fase B6 — Asistencia de Alumnos
- **Fecha:** 2026-07-05
- **Rama:** `alexis/backend-b6-student-attendance`
- **Commit o mensaje sugerido:** `feat: fase B6 endpoints de asistencia de alumnos y restricciones de rol`
- **Estado final:** Completado
- **Archivos creados:**
  * `app/Models/Attendance.php`
  * `app/Controllers/AttendanceController.php`
- **Archivos modificados:**
  * `app/Models/Teacher.php`
  * `public/index.php`
  * `SAII_BACKEND_BACKLOG.md`
- **Cambios principales:**
  * Endpoint de plantilla de alumnos matriculados (`/api/attendance/group/{groupId}/students`) para facilitar al docente el pase de lista inicial.
  * CRUD completo de Asistencia de Alumnos (`/api/attendance`) con soporte transaccional para la cabecera y el detalle de alumnos.
  * Lógica de autorización que restringe a los docentes para registrar asistencia únicamente en sus grupos asignados y editar solo en estados editables (`borrador` y `observada`).
  * Endpoint administrativo para cambio de estados (`/api/attendance/{id}/status`) permitiendo a administradores y secretarias observar u oficializar (cerrar) las listas de asistencia con observaciones pertinentes.
- **Siguiente fase sugerida:** Fase B7 — Notas, actas y certificados.

### Fase B7 — Notas, Actas y Certificados
- **Fecha:** 2026-07-05
- **Rama:** `alexis/backend-b7-grades-certificates`
- **Commit o mensaje sugerido:** `feat: fase B7 registro de calificaciones y generacion de certificados validados`
- **Estado final:** Completado
- **Archivos creados:**
  * `app/Models/Grade.php`
  * `app/Models/Certificate.php`
  * `app/Controllers/GradeController.php`
  * `app/Controllers/CertificateController.php`
- **Archivos modificados:**
  * `public/index.php`
  * `SAII_BACKEND_BACKLOG.md`
- **Cambios principales:**
  * CRUD y sábana de calificaciones transaccional (`/api/grades/group/{groupId}`) con restricciones estrictas de notas de 0 a 20.
  * Lógica académica en el servidor para calcular el promedio ponderado del alumno según la ponderación de los módulos del curso.
  * Bloqueo de ediciones una vez que el acta de calificaciones cambia al estado `cerrada`.
  * Generación y firma de certificados y constancias (`/api/certificates`) validando automáticamente la nota final (>= 11) y asistencia efectiva (>= 70%) desde la configuración.
  * Flujo de doble firma (Director y Decano) que transiciona el estado del certificado a `generated` solo cuando ambas firmas son registradas.
- **Siguiente fase sugerida:** Fase B8 — Reportes, gráficos y exportaciones.

### Fase B8 — Reportes, Gráficos y Exportaciones
- **Fecha:** 2026-07-05
- **Rama:** `alexis/backend-b8-reports`
- **Commit o mensaje sugerido:** `feat: fase B8 endpoints de reportes y plantillas guardadas`
- **Estado final:** Completado
- **Archivos creados:**
  * `app/Models/Report.php`
  * `app/Controllers/ReportController.php`
- **Archivos modificados:**
  * `public/index.php`
  * `SAII_BACKEND_BACKLOG.md`
- **Cambios principales:**
  * Endpoint de consulta y agregación del dashboard con KPIs en tiempo real (`/api/reports/dashboard`).
  * CRUD completo de reportes/consultas personalizadas guardadas (`/api/reports/saved`) utilizando formato JSON para su configuración en MySQL.
- **Siguiente fase sugerida:** Fase B9 — Integración frontend-backend.

### Fase B9 — Integración Frontend-Backend
- **Fecha:** 2026-07-05
- **Rama:** `alexis/backend-b9-integration`
- **Commit o mensaje sugerido:** `feat: fase B9 conectar frontend interactivo con api rest y desactivar mock`
- **Estado final:** Completado
- **Archivos creados:**
  * `public/js/api.js`
- **Archivos modificados:**
  * `public/index.html`
  * `public/index.php`
  * `public/js/data.js`
  * `public/js/app.js`
  * `SAII_BACKEND_BACKLOG.md`
- **Cambios principales:**
  * Creación del cliente HTTP REST `APIClient` con persistencia de credenciales de sesión en peticiones.
  * Modificación de `DataManager` en `data.js` para usar llamadas asíncronas con mappers bidireccionales (`snake_case` de BD y `camelCase` de UI).
  * Adaptación de todos los cargadores de interfaz en `app.js` a flujos asíncronos (`async/await`) con inyección dinámica de estilos y spinners de carga visuales.
  * Implementación de endpoints de soporte rápido `/api/users`, `/api/certificates/{id}` y `/api/settings` en la base de datos relacional.
  * Creación de endpoints de consulta global `/api/grades` y `/api/attendance/records` para optimizar el cálculo de promedios e inasistencias en la sábana de notas y la emisión de constancias en un solo HTTP request.
- **Siguiente fase sugerida:** Fase B10 — Seguridad, pruebas y despliegue.

### Fase B10 — Seguridad, Pruebas y Despliegue
- **Fecha:** 2026-07-05
- **Rama:** `alexis/backend-b10-security`
- **Commit o mensaje sugerido:** `security: fase B10 aseguramiento de la api php y preparacion de despliegue`
- **Estado final:** Completado
- **Archivos creados:**
  * `DESPLIEGUE.md`
  * `logs/.gitkeep`
- **Archivos modificados:**
  * `public/index.php`
  * `public/js/api.js`
  * `app/Core/BaseController.php`
  * `SAII_BACKEND_BACKLOG.md`
- **Cambios principales:**
  * Centralización y sanitización recursiva automática contra XSS (`htmlspecialchars` y `strip_tags`) para todas las salidas JSON y de error a nivel de `BaseController`.
  * Middleware de protección global contra ataques CSRF (`X-CSRF-TOKEN`) para todas las solicitudes modificadoras (`POST`, `PUT`, `DELETE`).
  * Integración transparente del token CSRF en `APIClient` mediante consultas dinámicas al endpoint `/api/auth/csrf`.
  * Redirección segura de excepciones y errores técnicos PHP a archivo seguro `/logs/php_errors.log` y ocultación de errores detallados (`display_errors = 0`) para producción.
  * Elaboración de guía detallada de despliegue local y VPS `DESPLIEGUE.md`.
- **Siguiente fase sugerida:** Ninguna (Etapa de Backend de SAII completada exitosamente).

### Ajustes de Estabilidad e Integración
- **Fecha:** 2026-07-06
- **Rama:** `main`
- **Commit o mensaje sugerido:** `fix: estabilizacion de usuarios y roles y rutas de servidor cli`
- **Estado final:** Completado
- **Archivos modificados:**
  * `public/index.php`
  * `public/js/data.js`
  * `public/js/app.js`
  * `app/Models/Role.php`
  * `app/Controllers/UserController.php`
  * `docs/backend/SAII_BACKEND_BACKLOG.md`
- **Cambios principales:**
  * Servido de recursos estáticos en PHP CLI-server robustecido con mapeo de extensiones para evitar 404 al correr sin `-t public`.
  * Persistencia de permisos de rol añadida a base de datos real (MySQL) en la tabla `roles` (columna `permissions`).
  * Enrutador y controladores depurados de rutas anónimas redundantes que causaban fallos en la estructura de base de datos.
  * Formulario de usuarios y permisos completamente asincronizados y mapeados a `full_name` y `role_id` para evitar fallos de almacenamiento en base de datos.

