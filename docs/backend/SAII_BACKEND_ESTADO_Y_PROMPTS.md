# SAII_BACKEND_ESTADO_Y_PROMPTS.md — Prompts Operativos por Fase Backend

Este archivo concentra las instrucciones precisas y directrices operacionales para ejecutar cada una de las fases de backend del sistema SAII.

Cuando el usuario escriba:

```text
Lee README.md y haz la Fase Bx
```

El agente debe ubicar la Fase Bx en este archivo, leer sus tareas, restricciones, archivos permitidos y seguir al pie de la letra sus indicaciones.

---

## Reglas Generales para Agentes en la Etapa Backend

1. **Patrón MVC Estricto:** Los modelos solo realizan consultas a la base de datos (PDO) y retornan arreglos u objetos PHP. Los controladores manejan las peticiones, instancian modelos y retornan JSON mediante la clase helper de respuestas. No debe haber HTML mezclado en los controladores ni SQL directo en los controladores.
2. **Consultas Preparadas con PDO:** Prohibida la concatenación de variables en las consultas de SQL. Utilizar `prepare` y `bindValue` o arreglos asociativos en `execute`.
3. **Manejo Seguro de Contraseñas:** Usar siempre `password_hash($pass, PASSWORD_DEFAULT)` para guardar contraseñas y `password_verify($pass, $hash)` para validarlas.
4. **Respuestas API Compatibles:** Los endpoints deben retornar la misma estructura y claves que tenían los objetos mock del frontend en `data.js` para evitar romper las plantillas de visualización en `app.js`.
5. **No Mezclar Fases:** Desarrollar única y exclusivamente la fase solicitada.

---

## Fase B0 — Auditoría y estabilización previa del frontend

### Objetivo
Estabilizar el frontend, corrigiendo referencias rotas a nivel de eventos de botón y limpiando el código obsoleto ("asistencia docente" / planillas) para permitir una integración limpia.

### Archivos Permitidos
* `public/index.html` (Modificar)
* `public/js/app.js` (Modificar)
* `SAII_BACKEND_BACKLOG.md` (Modificar)

### Archivos Protegidos
* No modificar `public/js/data.js` (salvo que sea para comentarios).
* No crear carpetas de backend todavía.

### Tareas
1. **Corregir botones de impresión y exportación en Certificados (`public/index.html`):**
   * Reemplazar `onclick="printCertificate()"` por `onclick="app.printCertificateSimulated(document.getElementById('certificatePreview').dataset.certId || 'CRT001')"` (o pasar el ID correspondiente).
   * Reemplazar `onclick="downloadCertificatePDF()"` por `onclick="app.downloadCertificatePDFSimulated(document.getElementById('certificatePreview').dataset.certId || 'CRT001')"`
2. **Corregir botones en Reportes (`public/index.html`):**
   * Cambiar `onclick="app.exportReportSimulated('pdf')"` por `onclick="app.printCurrentReport()"` (o la función de impresión real de reportes de `app.js`).
   * Cambiar `onclick="app.exportReportSimulated('excel')"` por `onclick="app.exportCurrentReportToExcel()"`.
3. **Resolver métodos inexistentes en la vista docente de asistencia:**
   * En `public/index.html`, en el botón `btnBackToAttendanceAdmin`, cambiar `onclick="app.showAdminAttendanceList()"` por una llamada que limpie el selector y oculte la vista docente.
   * Eliminar o comentar en `public/js/app.js` las funciones obsoletas de la asistencia docente original (`setupAdminAttendanceDocenteView`, `renderAdminAttendanceDocenteTable`, `setupTeacherAttendanceDocenteView`, `loadTeacherPlanilla`, `renderPlanillaHeader`, `renderAttStatusBar`, `renderSessionsTable`, `renderPlanillaActions`).
4. **Actualizar la bitácora:** Registrar la culminación de la Fase B0 en `SAII_BACKEND_BACKLOG.md`.

### Pruebas Manuales
1. Iniciar sesión como Administrador, ir a Certificados, previsualizar un certificado y dar clic a "Imprimir" y "Descargar PDF". Verificar en consola que no se arroje ningún error de tipo `ReferenceError`.
2. Ir a Reportes, filtrar, previsualizar un reporte y hacer clic en descargar. Verificar que funcione.

### Resultado Esperado
* Consola del navegador limpia de `ReferenceError` al interactuar con el módulo de certificados y reportes.
* Código de `app.js` limpio de funciones muertas de asistencia docente.

### Commit Sugerido
```powershell
git commit -m "fix: fase B0 corregir referencias rotas en html y limpiar codigo muerto"
```

---

## Fase B1 — Diseño de base de datos

### Objetivo
Diseñar el esquema de base de datos e implementar el script de base de datos MySQL con sus tablas y datos de prueba.

### Archivos Permitidos
* `SAII_BACKEND_DB_SCHEMA.md` (Modificar si se agregan detalles)
* `database/schema.sql` (Crear)
* `database/seeds.sql` (Crear)
* `SAII_BACKEND_BACKLOG.md` (Modificar)

### Archivos Protegidos
* No modificar ningún archivo en `public/`.

### Tareas
1. **Crear script `database/schema.sql`:**
   * Crear las 17 tablas estructuradas con llaves primarias autoincrementales e índices.
   * Configurar llaves foráneas con restricciones adecuadas (`ON DELETE RESTRICT` / `ON UPDATE CASCADE`).
2. **Crear script `database/seeds.sql`:**
   * Insertar registros semilla equivalentes a los objetos mock vigentes en `public/js/data.js` (usuarios, alumnos, docentes, cursos, grupos, matrículas, notas, asistencia, configuraciones).
   * Encriptar las contraseñas de los usuarios de prueba con el algoritmo compatible con PHP (`$2y$10$...`).
3. **Importar y verificar:** Ejecutar los archivos en phpMyAdmin.

### Pruebas Manuales
1. Ejecutar el script SQL en phpMyAdmin y validar que se creen todas las tablas sin advertencias.
2. Hacer un SELECT a la tabla `student_attendance_records` y `enrollments` para verificar que la integridad referencial funcione.

### Resultado Esperado
* Estructura de base de datos y registros iniciales cargados en MySQL local.

### Commit Sugerido
```powershell
git commit -m "db: fase B1 crear esquema sql y datos seed para mysql"
```

---

## Fase B2 — Estructura PHP MVC

### Objetivo
Crear la arquitectura de carpetas, enrutamiento, conexión a base de datos y clases base del backend en PHP.

### Archivos Permitidos
* `/app/Core/Router.php` (Crear)
* `/app/Core/BaseModel.php` (Crear)
* `/app/Core/BaseController.php` (Crear)
* `/config/database.php` (Crear)
* `/.env.example` (Crear)
* `/public/index.php` (Crear)
* `/README_BACKEND_SETUP.md` (Modificar)
* `SAII_BACKEND_BACKLOG.md` (Modificar)

### Archivos Protegidos
* No modificar código frontend.

### Tareas
1. **Crear estructura de carpetas:** `/app/Models`, `/app/Controllers`, `/app/Core`, `/config`, `/public`.
2. **Configurar Front Controller (`public/index.php`):**
   * Inicializar cabeceras CORS (si aplica) y enrutar las peticiones.
3. **Crear Enrutador (`app/Core/Router.php`):**
   * Manejar parámetros dinámicos en URL (ej: `/api/students/{id}`).
4. **Configurar Conexión PDO (`config/database.php`):**
   * Implementar Singleton para la conexión a la base de datos MySQL.
5. **Crear helper JSON:** Clase o función utilitaria en `BaseController` para retornar respuestas estructuradas (`status`, `data`, `error`).

### Pruebas Manuales
1. Acceder desde el navegador a `http://localhost/saii-backend/public/index.php` (o la URL configurada) y validar la respuesta JSON por defecto de ruta no encontrada (404) o ruta base (200).

### Resultado Esperado
* Servidor backend estructurado, respondiendo peticiones API y conectándose a MySQL de forma segura.

### Commit Sugerido
```powershell
git commit -m "feat: fase B2 estructurar arquitectura mvc php y enrutamiento api"
```

---

## Fase B3 — Autenticación, sesiones, usuarios y roles

### Objetivo
Implementar el login real, control de sesiones persistentes en PHP, encriptación de claves y middleware de autorización.

### Archivos Permitidos
* `/app/Controllers/AuthController.php` (Crear)
* `/app/Controllers/UserController.php` (Crear)
* `/app/Models/User.php` (Crear)
* `/app/Models/Role.php` (Crear)
* `SAII_BACKEND_BACKLOG.md` (Modificar)

### Tareas
1. **Endpoint `/api/auth/login`:**
   * Recibir POST con JSON (`username`, `password`, `role`).
   * Validar contra la base de datos usando `password_verify()`.
   * Almacenar datos básicos del usuario en `$_SESSION['user']`.
2. **Endpoint `/api/auth/logout`:**
   * Destruir la sesión actual.
3. **Endpoint `/api/auth/me`:**
   * Retornar los datos del usuario en sesión actual (o 401 si no está autenticado).
4. **Middleware de sesión:**
   * Crear función en `BaseController` para validar si el usuario está autenticado y si cuenta con el rol requerido.
5. **CRUD Usuarios:** Endpoints para crear/editar/eliminar usuarios y roles.

### Pruebas Manuales
1. Utilizar un cliente HTTP (como Postman o curl) para simular el envío de credenciales a `/api/auth/login`. Verificar la cookie `PHPSESSID` devuelta.
2. Intentar consumir `/api/auth/me` sin autenticarse y comprobar el código HTTP 401.

### Resultado Esperado
* Rutas de login, logout y perfil de usuario funcionando de forma segura con sesiones nativas PHP.

### Commit Sugerido
```powershell
git commit -m "feat: fase B3 implementar autenticacion real y control de sesiones por rol"
```

---

## Fase B4 — CRUD académico base

### Objetivo
Desarrollar los endpoints API y lógica de modelos para Alumnos, Docentes y Cursos con sus respectivos módulos.

### Archivos Permitidos
* `/app/Models/Student.php` (Crear)
* `/app/Models/Teacher.php` (Crear)
* `/app/Models/Course.php` (Crear)
* `/app/Controllers/StudentController.php` (Crear)
* `/app/Controllers/TeacherController.php` (Crear)
* `/app/Controllers/CourseController.php` (Crear)
* `SAII_BACKEND_BACKLOG.md` (Modificar)

### Tareas
1. **CRUD Alumnos (`GET/POST/PUT/DELETE /api/students`):**
   * Validar que el DNI tenga 8 dígitos y no esté duplicado.
   * Validar que el código tenga 10 dígitos.
2. **CRUD Docentes (`GET/POST/PUT/DELETE /api/teachers`):**
   * Gestionar datos básicos y especialidades.
3. **CRUD Cursos y Módulos (`GET/POST/PUT/DELETE /api/courses`):**
   * Permitir la edición de módulos de un curso.
   * Validar estrictamente en el backend que la suma de porcentajes de los módulos de un curso sea exactamente 100%.

### Pruebas Manuales
1. Enviar una petición POST a `/api/courses` con módulos cuya suma de porcentaje sea 95% o 105%. Validar que el backend retorne un error HTTP 400 y no guarde en la BD.

### Resultado Esperado
* Lógica CRUD base académica funcionando e impidiendo el ingreso de datos inválidos en el servidor.

### Commit Sugerido
```powershell
git commit -m "feat: fase B4 crud de alumnos docentes y cursos con validacion backend"
```

---

## Fase B5 — Grupos académicos y matrículas

### Objetivo
Implementar la administración de grupos y el control de matrículas, restringiendo duplicados y cupos máximos.

### Archivos Permitidos
* `/app/Models/Group.php` (Crear)
* `/app/Models/Enrollment.php` (Crear)
* `/app/Controllers/GroupController.php` (Crear)
* `/app/Controllers/EnrollmentController.php` (Crear)
* `SAII_BACKEND_BACKLOG.md` (Modificar)

### Tareas
1. **CRUD de Grupos (`/api/groups`):**
   * Gestionar aulas, horarios, periodos y modalidades (regular vs examen suficiencia).
2. **CRUD de Matrículas (`/api/enrollments`):**
   * Al registrar una matrícula, validar que el alumno no se encuentre ya matriculado en ese mismo grupo.
   * Validar que existan cupos libres en el grupo (contador matriculados < `maxQuota`).
   * Actualizar el contador de cupos del grupo.

### Pruebas Manuales
1. Intentar matricular a un estudiante en un grupo que ya alcanzó su cupo máximo. Comprobar que retorne error.

### Resultado Esperado
* Control de matrículas real que impida la sobrematriculación en los grupos académicos.

### Commit Sugerido
```powershell
git commit -m "feat: fase B5 gestion de grupos y matriculas con limites de cupo"
```

---

## Fase B6 — Asistencia de alumnos

### Objetivo
Crear la API para el control de asistencia de alumnos por fecha y grupo, restringido por el rol del docente.

### Archivos Permitidos
* `/app/Models/Attendance.php` (Crear)
* `/app/Controllers/AttendanceController.php` (Crear)
* `SAII_BACKEND_BACKLOG.md` (Modificar)

### Tareas
1. **Creación de Lista de Asistencia:**
   * Generar lista por grupo y fecha a partir de los alumnos matriculados (`enrollments` activos).
   * Validar que no se duplique la asistencia para el mismo grupo y fecha.
2. **Registro de Asistencia:**
   * Permitir al docente guardar como borrador o registrar definitivamente.
   * Validar que el docente que registra sea el asignado a dicho grupo (salvo que sea rol administrador).
3. **Gestión Administrativa:**
   * Endpoints para que el administrador cierre la asistencia (estado `cerrada`) u observe la lista (estado `observada`).

### Pruebas Manuales
1. Como Docente A, intentar modificar la asistencia de un grupo asignado al Docente B. Verificar que la API responda con un error de autorización (403 Forbidden).

### Resultado Esperado
* Control de asistencia persistido en MySQL, respetando el flujo de estados y permisos del docente.

### Commit Sugerido
```powershell
git commit -m "feat: fase B6 endpoints de asistencia de alumnos y restricciones de rol"
```

---

## Fase B7 — Notas, actas y certificados

### Objetivo
Desarrollar los endpoints para registrar calificaciones por módulo, cerrar actas académicas y gestionar certificados aptos.

### Archivos Permitidos
* `/app/Models/Grade.php` (Crear)
* `/app/Models/Certificate.php` (Crear)
* `/app/Controllers/GradeController.php` (Crear)
* `/app/Controllers/CertificateController.php` (Crear)
* `SAII_BACKEND_BACKLOG.md` (Modificar)

### Tareas
1. **Sábana de Calificaciones (`/api/grades`):**
   * Registrar calificaciones por módulo (rango 0-20).
   * Calcular el promedio ponderado del estudiante en el servidor basándose en los pesos de los módulos.
   * Permitir al docente cerrar el acta de calificaciones (bloqueando ediciones posteriores).
2. **Emisión de Certificados/Constancias (`/api/certificates`):**
   * Endpoint de generación individual o bulk.
   * Validar elegibilidad: nota final aprobatoria (>=11) y porcentaje de asistencia del alumno >= asistencia mínima requerida desde la tabla `settings`.
   * Implementar flujo de firmas: Director y Decano.

### Pruebas Manuales
1. Intentar generar un certificado para un alumno con promedio final de 10. Validar que la API lo rechace.
2. Guardar una nota de 21 y verificar que el backend devuelva un error de validación de rango.

### Resultado Esperado
* Lógica académica de calificaciones y emisión de acreditaciones centralizada y protegida en el servidor.

### Commit Sugerido
```powershell
git commit -m "feat: fase B7 registro de calificaciones y generacion de certificados validados"
```

---

## Fase B8 — Reportes, gráficos y exportaciones

### Objetivo
Desarrollar la extracción de estadísticas, almacenamiento de plantillas de consultas y exportación real en formato CSV/Excel y PDF.

### Archivos Permitidos
* `/app/Controllers/ReportController.php` (Crear)
* `/app/Models/Report.php` (Crear)
* `SAII_BACKEND_BACKLOG.md` (Modificar)

### Tareas
1. **KPIs del Dashboard:**
   * Endpoint `/api/reports/dashboard` que retorne promedios de aprobación, cantidad de certificados emitidos y KPI generales.
2. **Plantillas de Consultas:**
   * CRUD para almacenar y recuperar filtros de reportes guardados en la base de datos.
3. **Exportación real a Excel/CSV:**
   * Endpoint para generar un flujo de datos estructurado en formato CSV con codificación UTF-8 BOM.
4. **Generación de PDF:**
   * Endpoint para renderizar el certificado/diploma en PDF.

### Pruebas Manuales
1. Exportar un reporte y abrirlo en Microsoft Excel para comprobar que no existan caracteres especiales corruptos (gracias al BOM de UTF-8) y que las columnas estén ordenadas.

### Resultado Esperado
* Estadísticas del dashboard e impresión de documentos alimentados por datos reales en BD.

### Commit Sugerido
```powershell
git commit -m "feat: fase B8 reportes del dashboard y exportacion real csv y pdf"
```

---

## Fase B9 — Integración frontend-backend

### Objetivo
Conectar el frontend de Vanilla JavaScript con la API PHP, reemplazando la base de datos mock por completo.

### Archivos Permitidos
* `public/js/app.js` (Modificar)
* `public/js/api.js` (Crear)
* `public/index.html` (Modificar para corregir URLs o scripts)
* `SAII_BACKEND_BACKLOG.md` (Modificar)

### Tareas
1. **Crear `public/js/api.js`:**
   * Clase `APIClient` con métodos `fetch` asíncronos para todas las operaciones.
   * Manejar cabeceras de sesión y respuestas de error globales (ej: redirigir a login si expira la sesión / HTTP 401).
2. **Conectar app.js a api.js:**
   * Introducir bandera `const USE_MOCK = false;` para desviar las llamadas de `DataManager` hacia `APIClient`.
   * Integrar progresivamente el login, luego alumnos, docentes, cursos, grupos, matrículas, asistencia, notas, certificados y configuraciones.
3. **Añadir Spinners de Carga:**
   * Mostrar un indicador visual en las tablas mientras `fetch` esté cargando datos.

### Pruebas Manuales
1. Activar `USE_MOCK = false`, ingresar credenciales válidas creadas en base de datos. Validar que la interfaz se cargue correctamente sin errores de red en la consola.
2. Modificar una nota de un alumno, recargar la página y validar que la nota modificada persista (ya que se lee de la BD).

### Resultado Esperado
* Frontend interactivo conectado de manera fluida y responsiva con la base de datos real a través de PHP.

### Commit Sugerido
```powershell
git commit -m "feat: fase B9 conectar frontend javascript con api rest php"
```

---

## Fase B10 — Seguridad, pruebas y despliegue

### Objetivo
Sanitizar entradas/salidas, proteger contraseñas, configurar cookies seguras, realizar pruebas de carga y preparar el paquete final de despliegue.

### Archivos Permitidos
* Todos los archivos del proyecto (Modificaciones finales de aseguramiento)
* `SAII_BACKEND_BACKLOG.md` (Modificar)

### Tareas
1. **Seguridad contra vulnerabilidades:**
   * Sanitizar todas las salidas JSON para prevenir ataques XSS persistentes.
   * Validar tokens CSRF en el backend para peticiones POST/PUT/DELETE que modifican datos.
   * Configurar cookies de sesión seguras (`HttpOnly`, `Secure` e idealmente `SameSite=Strict`).
2. **Manejo de errores:**
   * Impedir la visualización de trazas de errores de base de datos o advertencias PHP en entornos de producción (retornar error HTTP 500 genérico al cliente y guardar log detallado en el servidor).
3. **Documentación de Despliegue:**
   * Crear un manual detallado de despliegue local y en hosting en la raíz.

### Pruebas Manuales
1. Intentar realizar un envío POST simulando un ataque CSRF sin token. Verificar que la API retorne 403 Forbidden.
2. Simular un fallo de conexión SQL y comprobar que el JSON de salida no contenga nombres de tablas o credenciales.

### Resultado Esperado
* Aplicación web SAII 100% segura, probada, y lista para ser entregada e instalada de forma local en XAMPP.

### Commit Sugerido
```powershell
git commit -m "security: fase B10 aseguramiento de la api php y preparacion de despliegue"
```
