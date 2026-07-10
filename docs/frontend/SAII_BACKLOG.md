# SAII_BACKLOG.md — Plan de fases del proyecto

## Proyecto

**SAII** — Sistema Administrativo del Instituto de Informática.

Institución: **Universidad Nacional de Piura — Facultad de Ingeniería Industrial**.

---

## Uso de este backlog con agentes de IA

Este archivo define el mapa general de fases del proyecto y la bitácora donde el agente debe registrar el resumen de lo ejecutado al terminar cada fase.

El usuario debe poder indicar únicamente:

```text
Lee README.md y haz la Fase X.
```

Cuando el agente llegue a este backlog por la instrucción del `README.md`, debe:

1. Confirmar qué fase solicitó el usuario.
2. Revisar el estado de esa fase en este backlog.
3. Leer el detalle operativo de la fase en `SAII_ESTADO_Y_PROMPTS.md`.
4. Si la fase tiene documento específico, leerlo también. Para Fase 5, leer `SAII_ASISTENCIA_ALUMNOS.md`.
5. Ejecutar únicamente la fase indicada.
6. No avanzar a otra fase.
7. Probar en `http://localhost:3000/index.html`.
8. Revisar consola del navegador.
9. Al finalizar, actualizar este backlog en la sección **Bitácora de ejecución de fases** con el resumen que el propio agente elabore.

El detalle operativo completo de cada fase está en `SAII_ESTADO_Y_PROMPTS.md`.

---

## Estado general de fases

| Fase | Nombre | Estado | Fuente operativa |
|---|---|---|---|
| Fase 1 | Ajustes globales | Completada | `SAII_ESTADO_Y_PROMPTS.md` |
| Fase 2 | Alumnos, Docentes, Cursos y Módulos | Completada | `SAII_ESTADO_Y_PROMPTS.md` |
| Fase 3 | Grupos Académicos | Completada | `SAII_ESTADO_Y_PROMPTS.md` |
| Fase 4 | Rediseño de Matrículas | Completada | `SAII_ESTADO_Y_PROMPTS.md` |
| Fase 5 | Control de Asistencia de Alumnos | **Completada (corregida)** | `SAII_ESTADO_Y_PROMPTS.md` + `SAII_ASISTENCIA_ALUMNOS.md` |
| Fase 6 | Registro de Notas | **Completada** | `SAII_ESTADO_Y_PROMPTS.md` |
| Fase 7 | Certificados, Reportes, Usuarios, Roles y Configuración | **Completada** | `SAII_ESTADO_Y_PROMPTS.md` |
| Etapa Backend | Backend PHP MVC + MySQL (Fases B0 a B10) | **Completada** | [SAII_BACKEND_BACKLOG.md](file:///c:/Users/manue/Downloads/saii-frontend-development%20(2)/SAII_BACKEND_BACKLOG.md) |


---

## Fase 1: Ajustes globales

Estado: **Completada**.

- [x] Header — revisión y ajustes de layout.
- [x] Sidebar — revisión y ajustes de navegación.
- [x] Iconos CRUD — reemplazar botones de texto por iconos compactos.
- [x] Estados en español — asegurar que todos los estados se muestren en español.
- [x] Ajustes globales de estilos y consistencia visual.

Referencia operativa: ver `SAII_ESTADO_Y_PROMPTS.md`.

---

## Fase 2: Alumnos, Docentes, Cursos y Módulos

Estado: **Completada**.

- [x] Módulo de Alumnos — CRUD completo con tabla, modal y validaciones.
- [x] Módulo de Docentes — CRUD completo con tabla, modal y validaciones.
- [x] Módulo de Cursos — CRUD completo con tabla, modal y validaciones.
- [x] Módulo de Módulos — CRUD completo con tabla, modal y validaciones.

Referencia operativa: ver `SAII_ESTADO_Y_PROMPTS.md`.

---

## Fase 3: Grupos Académicos

Estado: **Pendiente**.

- [ ] Vista de Grupos Académicos — listado y tabla.
- [ ] Modal **Abrir Nuevo Grupo** — formulario de creación de grupo académico.
- [ ] Acciones con iconos compactos: ver, editar, cerrar, desactivar/eliminar.
- [ ] Diferenciar modalidad **Curso regular** y **Examen de suficiencia**.
- [ ] Validar código, curso, docente, fechas, cupo y estado.
- [ ] Guardar en datos mock y refrescar la tabla.
- [ ] Mantener diseño institucional y responsive.
- [ ] Dejar los datos del grupo compatibles con Matrículas, Asistencia de Alumnos y Registro de Notas.

Referencia operativa: ver sección **Fase 3 pendiente — Grupos Académicos** en `SAII_ESTADO_Y_PROMPTS.md`.

---

## Fase 4: Rediseño de Matrículas

Estado: **Pendiente**.

- [ ] Rediseño completo del módulo de Matrículas.
- [ ] Card resumen del grupo/curso con cupos y estado.
- [ ] Búsqueda compacta de alumnos disponibles.
- [ ] Resultados de búsqueda limitados a 3–5 alumnos.
- [ ] Tabla de alumnos matriculados a ancho completo.
- [ ] Acciones con iconos: ver matrícula, editar matrícula, retirar alumno.
- [ ] Evitar alumnos duplicados en el mismo grupo.
- [ ] Actualizar contador de cupos.
- [ ] Mantener diseño limpio, académico y responsive.
- [ ] Dejar la matrícula como fuente para la Fase 5: solo alumnos matriculados deben aparecer en asistencia.

Referencia operativa: ver sección **Fase 4 pendiente — Matrículas** en `SAII_ESTADO_Y_PROMPTS.md`.

---

## Fase 5: Control de Asistencia de Alumnos

Estado: **Pendiente**.

> La asistencia la registra el **docente** para los alumnos matriculados en sus grupos asignados.  
> Ver especificación completa en `SAII_ASISTENCIA_ALUMNOS.md`.

### Vista Docente

- [ ] El docente solo ve los grupos/cursos asignados a él.
- [ ] Puede seleccionar un grupo académico.
- [ ] Puede seleccionar o crear una lista de asistencia por fecha.
- [ ] El encabezado se autocompleta con datos del grupo, curso, docente, modalidad, aula/laboratorio y horario.
- [ ] La tabla muestra solo los alumnos matriculados en el grupo seleccionado.
- [ ] Puede marcar cada alumno como:
  - Presente.
  - Tarde.
  - Falta.
  - Justificado.
- [ ] Puede agregar observación por alumno.
- [ ] Puede marcar todos como presentes para agilizar el registro.
- [ ] Puede guardar la asistencia como Borrador.
- [ ] Puede registrar/cerrar asistencia cuando esté completa.
- [ ] Puede editar mientras la lista esté en Borrador u Observada, según reglas.
- [ ] No puede editar una asistencia Cerrada salvo que un administrador la reabra.

### Vista Administrador

- [ ] Consulta asistencias registradas por todos los docentes.
- [ ] Filtra por docente, curso, grupo, modalidad, fecha y estado.
- [ ] Ve el detalle de cada lista de asistencia.
- [ ] Puede observar o reabrir una asistencia si hay errores.
- [ ] Puede cerrar o validar asistencia según flujo definido.
- [ ] Puede imprimir o exportar listado de asistencia de alumnos.
- [ ] Visualiza resumen de asistencia por grupo y porcentajes.

### Vista Secretaria / Coordinador

- [ ] Puede consultar asistencias según permisos asignados.
- [ ] Puede revisar reportes de asistencia.
- [ ] Sin capacidad de registrar asistencia como docente.
- [ ] Sin capacidad de modificar datos salvo permiso administrativo explícito.

### Estados de lista de asistencia

- [ ] Implementar flujo de estados:

```text
Borrador → Registrada → Cerrada
          ↘ Observada → Borrador/Registrada
```

### Datos mock

- [ ] Agregar colección `studentAttendance[]` en `data.js`.
- [ ] Cada lista debe tener `groupId`, `teacherId`, `date`, `status`, `records[]`, `createdAt`, `updatedAt`.
- [ ] Cada registro en `records[]` debe tener `studentId`, `status`, `observation` y opcionalmente `arrivalTime`.
- [ ] Agregar funciones utilitarias en `DataManager` según `SAII_ASISTENCIA_ALUMNOS.md`.
- [ ] Usar matrículas existentes para obtener alumnos del grupo.

Referencia operativa: ver sección **Fase 5 pendiente — Control de Asistencia de Alumnos** en `SAII_ESTADO_Y_PROMPTS.md` y todo `SAII_ASISTENCIA_ALUMNOS.md`.

---

## Fase 6: Registro de Notas

Estado: **Completada**.

- [x] Registro de notas diferenciado por rol.
- [x] Vista Docente para registrar notas solo de grupos asignados.
- [x] Vista Administrador para consultar actas registradas.
- [x] Tabla de notas correcta y funcional.
- [x] Cada módulo debe ser una columna.
- [x] Cada alumno debe ser una fila.
- [x] No poner módulos como filas.
- [x] Calcular promedio ponderado usando los porcentajes de módulos.
- [x] Validar notas entre 0 y 20.
- [x] No cerrar acta si faltan notas.
- [x] Dejar los datos de notas listos para Certificados y Reportes.

Referencia operativa: ver sección **Fase 6 — Registro de Notas** en `SAII_ESTADO_Y_PROMPTS.md`.

---

## Fase 7: Certificados, Reportes, Usuarios, Roles y Configuración

Estado: **Completada**.

- [x] Módulo de Certificados.
- [x] Generación de certificados pendientes.
- [x] Vista previa formal de certificado.
- [x] Considerar nota final y requisitos académicos.
- [x] Considerar asistencia mínima de alumnos si aplica por configuración.
- [x] Módulo de Reportes.
- [x] Reportes guardados y CRUD simulado.
- [x] Reportes de asistencia de alumnos.
- [x] Módulo de Usuarios.
- [x] Módulo de Roles.
- [x] Selector de rol simulado para probar vistas.
- [x] Módulo de Configuración.
- [x] Configuración editable de parámetros académicos.

Referencia operativa: ver sección **Fase 7 pendiente — Certificados, Reportes, Usuarios, Roles y Configuración** en `SAII_ESTADO_Y_PROMPTS.md`.

---

## Etapa posterior: Backend PHP MVC + MySQL

Estado: **Planificado / Iniciando**.

Esta etapa se ha estructurado formalmente en 11 fases de backend (Fase B0 a Fase B10). Toda la especificación detallada de objetivos, tareas, diccionarios de datos, APIs de conexión, políticas de seguridad y guías de configuración se encuentran distribuidas en los archivos de planificación técnica creados:

- [SAII_BACKEND_CONTEXTO.md](file:///c:/Users/manue/Downloads/saii-frontend-development%20(2)/SAII_BACKEND_CONTEXTO.md)
- [SAII_BACKEND_BACKLOG.md](file:///c:/Users/manue/Downloads/saii-frontend-development%20(2)/SAII_BACKEND_BACKLOG.md)
- [SAII_BACKEND_ESTADO_Y_PROMPTS.md](file:///c:/Users/manue/Downloads/saii-frontend-development%20(2)/SAII_BACKEND_ESTADO_Y_PROMPTS.md)
- [SAII_BACKEND_DB_SCHEMA.md](file:///c:/Users/manue/Downloads/saii-frontend-development%20(2)/SAII_BACKEND_DB_SCHEMA.md)
- [SAII_BACKEND_API_CONTRATO.md](file:///c:/Users/manue/Downloads/saii-frontend-development%20(2)/SAII_BACKEND_API_CONTRATO.md)
- [SAII_BACKEND_SEGURIDAD.md](file:///c:/Users/manue/Downloads/saii-frontend-development%20(2)/SAII_BACKEND_SEGURIDAD.md)
- [SAII_BACKEND_MIGRACION_MOCK.md](file:///c:/Users/manue/Downloads/saii-frontend-development%20(2)/SAII_BACKEND_MIGRACION_MOCK.md)
- [README_BACKEND_SETUP.md](file:///c:/Users/manue/Downloads/saii-frontend-development%20(2)/README_BACKEND_SETUP.md)

El trabajo de backend debe realizarse en orden correlativo y por fases pequeñas e independientes, comenzando por la Fase B0 (Auditoría del frontend y corrección de referencias) e integrando progresivamente cada módulo.


---

## Bitácora de ejecución de fases

El agente debe actualizar esta sección al terminar cada fase.

### Formato obligatorio para cada resumen

```text
### Fase X — Nombre de la fase

- Fecha:
- Rama:
- Commit o mensaje sugerido:
- Estado final:
- Archivos modificados:
- Funciones creadas o modificadas:
- Cambios principales:
- Pruebas realizadas:
- Resultado de consola:
- Pendientes / riesgos:
- Siguiente fase sugerida:
```

### Resúmenes registrados

#### Fase 1 — Ajustes globales

- Fecha: pendiente de completar con detalle exacto.
- Rama: pendiente.
- Commit o mensaje sugerido: ya existe commit de Fase 1.
- Estado final: Completada.
- Cambios principales:
  - Ajustes globales.
  - Header.
  - Sidebar institucional.
  - Iconos CRUD compactos.
  - Estados en español.
  - Padding y mejoras visuales generales.
- Pruebas realizadas: pendiente de documentar por agente.
- Pendientes / riesgos: ninguno documentado.

#### Fase 2 — Alumnos, Docentes, Cursos y Módulos

- Fecha: pendiente de completar con detalle exacto.
- Rama: pendiente.
- Commit o mensaje sugerido: ya existe commit de Fase 2.
- Estado final: Completada.
- Cambios principales:
  - CRUD completo y modal de detalle para Alumnos.
  - CRUD completo y modal de detalle para Docentes.
  - Visualización y edición dinámica de Cursos y Módulos.
  - Validación de porcentaje acumulado de módulos, que debe sumar exactamente 100%.
  - Acciones con iconos y mejoras visuales.
- Pruebas realizadas: pendiente de documentar por agente.
- Pendientes / riesgos: ninguno documentado.

#### Fase 3 — Grupos Académicos

- Fecha: pendiente.
- Rama: pendiente.
- Commit o mensaje sugerido: `feat: fase 3 grupos academicos`.
- Estado final: Pendiente.
- Resumen del agente: pendiente.

#### Fase 4 — Rediseño de Matrículas

- Fecha: pendiente.
- Rama: pendiente.
- Commit o mensaje sugerido: `feat: fase 4 redisenio matriculas`.
- Estado final: Pendiente.
- Resumen del agente: pendiente.

#### Fase 5 — Control de Asistencia de Alumnos

- Fecha: 2026-07-01 (corrección aplicada 2026-07-02).
- Rama: alexis/fase-5-asistencia-alumnos.
- Commit o mensaje sugerido: `fix: fase 5 corregir asistencia alumnos reemplaza asistencia docente`.
- Estado final: **Completada (corregida)**.
- Archivos modificados:
  - `public/js/data.js`
  - `public/js/app.js`
  - `public/css/styles.css`
  - `public/index.html`
  - `SAII_BACKLOG.md`
- Funciones creadas o modificadas:
  - `DataManager.getStudentAttendanceByGroup()`
  - `DataManager.getStudentAttendanceByGroupAndDate()`
  - `DataManager.getStudentAttendanceByTeacher()`
  - `DataManager.getAllStudentAttendance()`
  - `DataManager.getStudentAttendanceById()`
  - `DataManager.getEnrolledStudentsByGroup()`
  - `DataManager.createStudentAttendance()`
  - `DataManager.updateStudentAttendanceRecord()`
  - `DataManager.updateStudentAttendanceStatus()`
  - `DataManager.markAllStudentsPresent()`
  - `DataManager.getStudentAttendanceSummary()`
  - `SAIIApp.setupAttendance()`
  - `SAIIApp.setupAdminAttendanceView()`
  - `SAIIApp.renderAdminAttendanceTable()`
  - `SAIIApp.viewAttendanceDetail()`
  - `SAIIApp.observeAttendance()`
  - `SAIIApp.closeAttendance()`
  - `SAIIApp.reopenAttendance()`
  - `SAIIApp.printAttendance()`
  - `SAIIApp.setupTeacherAttendanceView()`
  - `SAIIApp.loadGroupForTeacher()`
  - `SAIIApp.loadAttendanceByDate()`
  - `SAIIApp.renderAttendanceHeader()`
  - `SAIIApp.renderAttendanceSummary()`
  - `SAIIApp.renderStudentsAttendanceTable()`
  - `SAIIApp.onAttStatusChange()`
  - `SAIIApp.onArrivalTimeChange()`
  - `SAIIApp.onObsChange()`
  - `SAIIApp.markAllPresent()`
  - `SAIIApp.renderTeacherAttendanceActions()`
  - `SAIIApp.saveAttendanceDraft()`
  - `SAIIApp.registerAttendance()`
  - `SAIIApp.printAttendanceTeacher()`
- Cambios principales:
  - Se eliminó por completo la implementación incorrecta de asistencia docente (horas dictadas/sesiones).
  - Se reemplazó por la implementación correcta de asistencia de alumnos según `SAII_ASISTENCIA_ALUMNOS.md`.
  - Se creó colección `studentAttendance[]` con nomenclatura canónica (ATT001, etc.).
  - Vista Docente: selector de grupo + fecha, tabla de alumnos matriculados con estados (Presente/Tarde/Falta/Justificado), resumen automático, guardar borrador, registrar asistencia.
  - Vista Administrador: tabla de listas con resumen de presentes/tardes/faltas/justificados, acciones ver/observar/cerrar/reabrir/imprimir.
  - Modales corregidos: `attendanceDetailModal`, `adminAttObsModal`.
  - Estilos CSS nuevos: `att-summary-bar`, `att-selector-row`, `att-status-select`, `att-time-input`, `att-obs-input`.
- Pruebas realizadas:
  - Login como Administrador → Asistencia → Listado de listas registradas con datos mock.
  - Login como Docente → Asistencia → Selección de grupo y fecha → Carga de alumnos.
  - Marcar todos presentes.
  - Cambiar estado individual por alumno.
  - Ver detalle desde administrador.
- Pendientes / riesgos: ninguno crítico. Filtro de fecha en vista admin funciona. Fase 3 y 4 siguen pendientes.
- Siguiente fase sugerida: Fase 6 — Registro de Notas.


#### Fase 6 — Registro de Notas

- Fecha: 2026-07-04
- Rama: alexis/fase-6-registro-notas (sugerida)
- Commit o mensaje sugerido: `feat: fase 6 registro de notas`
- Estado final: **Completada**.
- Archivos modificados:
  - `public/js/data.js`
  - `public/index.html`
  - `public/js/app.js`
  - `public/css/styles.css`
  - `SAII_BACKLOG.md`
- Funciones creadas o modificadas:
  - `DataManager.ensureAllGroupsHaveGradeSheet()`
  - `DataManager.getGradeSheetByGroup()`
  - `DataManager.updateGradeSheetStatus()`
  - `DataManager.getTeacherIdForUser()`
  - `DataManager.isGradeSheetComplete()`
  - `SAIIApp.setupGrades()`
  - `SAIIApp.setupAdminGradesView()`
  - `SAIIApp.renderAdminGradesTable()`
  - `SAIIApp.viewGradeSheetDetail()`
  - `SAIIApp.onModalGradeInputChange()`
  - `SAIIApp.saveModalGrades()`
  - `SAIIApp.closeModalGradeSheetFromModal()`
  - `SAIIApp.reopenGradeSheet()`
  - `SAIIApp.setupTeacherGradesView()`
  - `SAIIApp.loadTeacherGradesTable()`
  - `SAIIApp.onGradeInputChange()`
  - `SAIIApp.focusStudentGrades()`
  - `SAIIApp.clearStudentGrades()`
  - `SAIIApp.viewStudentGradesDetail()`
  - `SAIIApp.saveTeacherGrades()`
  - `SAIIApp.closeTeacherGradeSheet()`
- Cambios principales:
  - Se dividió el módulo de notas en dos vistas basadas en roles (Administrador y Docente).
  - Vista Docente: Selección de grupo asignado, tabla horizontal compacta (tipo Excel académico) con cálculo de promedio ponderado automático y estado por alumno en tiempo real.
  - Corrección de bug en el modal "Detalle de Acta de Calificaciones": Ahora la sábana de notas se muestra con inputs editables y botones de acción (Guardar/Cerrar) en el pie del modal cuando el docente visualiza un acta en estado borrador (evaluación insensible a mayúsculas/minúsculas).
  - Integración del promedio de grupo en tiempo real dentro del modal (`#modalGroupAverage`) y la tabla inline (`#inlineGroupAverage`).
  - Habilitación del listado general de actas para docentes, filtrado para mostrar solo sus grupos asignados.
  - Vista Administrador: Listado de todas las actas con filtros avanzados, promedio de grupo, y acciones de ver acta (solo lectura) y reabrir acta cerrada (para volver al estado borrador).
- Pruebas realizadas:
  - Mapeo automático de docente (`roberto.silva` -> `TCH001`).
  - Visualización del listado general de actas para docentes (filtrado exclusivamente para sus grupos).
  - Edición de calificaciones en el modal "Detalle de Acta de Calificaciones" como docente en estado borrador, con límites (0-20) y recálculo automático de promedio de alumno y promedio de grupo en tiempo real.
  - Validación de que el administrador ve la sábana de notas del modal en modo de solo lectura.
  - Guardado y cierre de acta desde el modal del docente, verificando bloqueo de inputs tras el cierre.
  - Reabrir acta cerrada por el administrador, rehabilitando la edición en el modal del docente.
- Pendientes / riesgos: ninguno crítico.
- Siguiente fase sugerida: Fase 7 — Certificados, Reportes, Usuarios, Roles y Configuración.

#### Fase 7 — Certificados, Reportes, Usuarios, Roles y Configuración

- Fecha: 2026-07-04
- Rama: alexis/fase-7-certificados-reportes-usuarios
- Commit o mensaje sugerido: `feat: fase 7 certificados reportes usuarios configuracion`
- Estado final: **Completada**.
- Archivos modificados:
  - `public/js/data.js`
  - `public/js/app.js`
  - `public/css/styles.css`
  - `public/index.html`
  - `SAII_BACKLOG.md`
- Funciones creadas o modificadas:
  - En `public/js/data.js`:
    - `DataManager.calculateAttendancePercentage()`
    - `DataManager.getUsers()`, `DataManager.createUser()`, `DataManager.updateUser()`
    - `DataManager.getRoles()`, `DataManager.updateRolePermissions()`
    - `DataManager.getSettings()`, `DataManager.saveSettings()`, `DataManager.restoreDefaultSettings()`
    - `DataManager.annulCertificate()`, `DataManager.generateBulkCertificates()`
    - `DataManager.getSavedReports()`, `DataManager.createReport()`, `DataManager.updateReport()`, `DataManager.deleteReport()`
  - En `public/js/app.js`:
    - `SAIIApp.simulateRoleChange()`, `SAIIApp.setRolePermissions()`
    - `SAIIApp.loadCertificates()`, `SAIIApp.generateCertificate()`, `SAIIApp.generateBulkCertificates()`, `SAIIApp.annulCertificate()`, `SAIIApp.viewCertificate()`
    - `SAIIApp.loadReports()`, `SAIIApp.updateReportKPIs()`, `SAIIApp.loadSavedReportsTable()`, `SAIIApp.openNewReportModal()`, `SAIIApp.onReportTypeChange()`, `SAIIApp.handleReportSubmit()`, `SAIIApp.editReport()`, `SAIIApp.deleteReport()`, `SAIIApp.viewReportPreview()`, `SAIIApp.exportReportSimulated()`
    - `SAIIApp.switchUsersTab()`, `SAIIApp.loadUsers()`, `SAIIApp.openNewUserModal()`, `SAIIApp.editUser()`, `SAIIApp.handleUserSubmit()`, `SAIIApp.deleteUser()`
    - `SAIIApp.loadRoles()`, `SAIIApp.editRole()`, `SAIIApp.handleRoleSubmit()`
    - `SAIIApp.loadSettings()`, `SAIIApp.saveSystemSettings()`, `SAIIApp.restoreDefaultSettings()`
- Cambios principales:
  - **Simulador de Rol**: Selector dinámico de roles en la cabecera (`#simulatedRoleSelect`) que re-evalúa y activa dinámicamente los permisos de menú de navegación en tiempo real para simular roles sin cerrar sesión.
  - **Módulo de Certificados**: Implementación de elegibilidad académica y de asistencia (asistencia mínima y promedio aprobatorio desde configuración), generación masiva de certificados en lote, visualización de certificado con diseño de diploma institucional premium (bordes dobles dorados, fondo cálido de pergamino, marca de agua y firma autorizada) y anulación/emisión individual.
  - **Módulo de Reportes**: CRUD de reportes personalizados guardados con filtros avanzados de asistencia/notas/certificados y vistas previas tabuladas de datos con descarga simulada en PDF/Excel.
  - **Módulo de Usuarios y Roles**: Sub-pestañas para gestión de base de usuarios CRUD y matriz de edición de permisos modular checkbox por rol que actualiza la visibilidad de forma inmediata.
  - **Configuración**: Formulario de parámetros del sistema reactivo (tema, período académico, notas mínimas y porcentajes de asistencia requerida) con guardado persistente en `localStorage` y botón de restauración por defecto.
- Pruebas realizadas:
  - Selector de roles en cabecera modifica permisos en el menú lateral.
  - Generación individual y bulk de certificados evaluando nota mínima/asistencia mínima desde la configuración.
  - Creación, edición, borrado y previsualización de reportes personalizados.
  - CRUD de usuarios, edición de permisos de rol guardando checkboxes.
  - Configuración guardada y restaurada con persistencia en localStorage.
- Pendientes o riesgos: ninguno.

#### Fase 7 Extensión — Flujo de Firmas y Rol Decano (Certificados y Constancias)

- Fecha: 2026-07-05
- Rama: alexis/fase-7-firmas-y-decano
- Commit o mensaje sugerido: `feat: implementado flujo de firmas y rol decano en certificados`
- Estado final: **Completada**.
- Archivos modificados:
  - `public/js/data.js`
  - `public/js/app.js`
  - `public/css/styles.css`
  - `public/index.html`
  - `SAII_BACKLOG.md`
- Funciones creadas o modificadas:
  - En `public/js/data.js`:
    - `DataManager.createCertificate()` (creada)
    - `DataManager.generateBulkCertificates()` (modificada)
  - En `public/js/app.js`:
    - `SAIIApp.loadCertificates()` (modificada)
    - `SAIIApp.renderDeanCertificatesTable()` (creada)
    - `SAIIApp.finalizeCertificate()` (creada)
    - `SAIIApp.signDocument()` (creada)
    - `SAIIApp.openCertObservationModal()` (creada)
    - `SAIIApp.submitCertObservation()` (creada)
    - `SAIIApp.openCertificateModal()` (modificada)
    - `SAIIApp.handleEmitCertSubmit()` (creada)
    - `SAIIApp.formatDateToSpanish()` (creada)
- Cambios principales:
  - **Firma Oficial**: Director (DR. JONATHAN DAVID NIMA RAMOS) y Decano (DR. FRANCISCO JAVIER CRUZ VILCHEZ) agregados como firmantes oficiales.
  - **Rol Decano**: Creado rol e interfaz para el Decano, permitiéndole ver únicamente documentos con estado "Por firmar" donde falta su firma, firmar de forma interactiva y agregar observaciones.
  - **Flujo de Firmas**: Transición automática de estados: Por firmar (Secretaria emite) -> Pendiente (ambas firmas listas) -> Generado (Secretaria emite/finaliza).
  - **Selección de Fila**: Habilitada la selección de fila por clic para alumnos aptos (disponibles para emitir certificado o constancia).
  - **Formatos de Impresión**: Formato premium formalizado de Certificados y Constancias de acuerdo con las especificaciones de los PDFs.
- Pruebas realizadas:
  - Emisión de certificado/constancia desde filas seleccionadas como Secretaria.
  - Firma del Decano y Director en cascada, verificando transición de estados a "Pendiente".
  - Generación individual y bulk de documentos en estado "Pendiente".
  - Previsualización diferenciada de Certificado y Constancia con firmas manuscritas cursivas y sellos.
- Pendientes o riesgos: ninguno.

#### Fase 7 Ajustes — Corrección del Botón de Emisión y Logos Oficiales (Certificados y Constancias)

- Fecha: 2026-07-05
- Rama: alexis/fase-7-firmas-y-decano
- Commit o mensaje sugerido: `feat: corregido boton de emision y agregados logos y sellos oficiales`
- Estado final: **Completada**.
- Archivos modificados:
  - `public/js/app.js`
  - `public/css/styles.css`
  - `public/index.html`
  - `SAII_BACKLOG.md`
- Funciones creadas o modificadas:
  - En `public/js/app.js`:
    - `SAIIApp.setupEventListeners()` (modificada: agregado click handler directo para `#emitCertBtn`)
    - `SAIIApp.viewCertificate()` (modificada: agregada carga de escudo UNP, logotipo FII en SVG y sellos de firma circulares de fondo)
- Cambios principales:
  - **Apertura de Modal Garantizada**: Solucionado el problema con el botón "Emitir Documento" que no respondía al desvincularlo del selector general e implementar un listener directo.
  - **Exposición de closeModal**: Mapeado `window.closeModal` para evitar ReferenceErrors en los handlers inline de HTML.
  - **Modal Widescreen**: Asignada clase `modal-cert` al contenedor exterior del modal de certificados con ancho de `1050px` (`95vw`) para previsualizar los certificados apaisados correctamente.
  - **Escudo UNP**: Implementado el Escudo oficial transparente en PNG de la Universidad Nacional de Piura (`logo-unp-transparent.png`).
  - **Logotipo de la Facultad**: Cargado el Escudo oficial de la Facultad de Ingeniería Industrial (`logo-fii.png`) con modo de mezcla `multiply` para una transparencia impecable.
  - **Agrandado y Simetría**: Escalados ambos logotipos a un tamaño prominente y simétrico de `110px` con `object-fit: contain`.
  - **Sellos en Firma**: Añadidos sellos administrativos circulares del Decanato y del Instituto de Informática detrás de las firmas del Decano y Director respectivamente.
- Pruebas realizadas:
  - Clic e inicialización del modal de emisión desde la tabla de aptos.
  - Carga y escalamiento correcto del modal widescreen en pantallas grandes.
  - Renderizado de los dos escudos en la cabecera y sellos con opacidad en el área de firmas.
- Pendientes o riesgos: ninguno.

#### Fase 7 Ajustes — Módulo de Reportes Interactivo (Dashboard y Plantillas)

- Fecha: 2026-07-05
- Rama: `alexis/fase-7-certificados`
- Commit o mensaje sugerido: `feat: reestructurado modulo de reportes con filtros avanzados y visualizacion detallada/general`
- Estado final: **Completada**.
- Archivos modificados:
  - `public/js/app.js`
  - `public/index.html`
  - `SAII_BACKLOG.md`
- Funciones creadas o modificadas:
  - En `public/js/app.js`:
    - `loadReports()` (modificada: agregados listeners de cambio para actualización en vivo y carga dinámica de cursos)
    - `updateReportStatusFilterOptions()` (creada: popula opciones de estado según el tipo de reporte)
    - `filterReportResults()` (creada: filtra colecciones mock y calcula KPIs reactivos y renderiza columnas dinámicas en Vista Detallada o Vista General por Grupo/Curso)
    - `loadSavedReportsTable()` (creada: dibuja la tabla inferior de plantillas guardadas con botones de emoji compactos)
    - `loadSavedReport()` (creada: precarga los filtros de una plantilla guardada y ejecuta la búsqueda)
    - `openSaveQueryModal()` y `handleSaveQuerySubmit()` (creadas: abre modal y añade consultas personalizadas a `savedReports`)
    - `printCurrentReport()` y `exportCurrentReportToExcel()` (creadas: impresión nativa y descarga de archivos CSV/Excel real)
- Cambios principales:
  - **Filtros Avanzados y En Vivo**: Agregados filtros por Curso, Ciclo, Promoción, Mes, Estado y Modo de Visualización (Vista Detallada por alumno vs Vista General agrupada por curso/grupo) que actualizan el listado y los KPIs inmediatamente al cambiar su valor.
  - **Corrección de Overlap en Acciones**: Eliminados los textos largos "Cargar" y "Eliminar" de las acciones de reportes guardados, dejando iconos emoji compactos de 30px que ya no se superponen.
- Pruebas realizadas:
  - Filtro por curso de notas y asistencia detallada.
  - Cambio a Vista General y constancia de agregación de aprobados/desaprobados/promedio del grupo.
  - Exportación real de archivos CSV codificados con BOM UTF-8 y visualización de impresión.
- Pendientes o riesgos: ninguno.

#### Fase 7 Ajustes — Módulo de Usuarios y Roles (Permisos de Dashboard e IDs Numéricos)

- Fecha: 2026-07-05
- Rama: `alexis/fase-7-certificados`
- Commit o mensaje sugerido: `feat: corregido ID de rol numerico y seguridad en dashboard sin permisos`
- Estado final: **Completada**.
- Archivos modificados:
  - `public/js/app.js`
  - `public/index.html`
  - `SAII_BACKLOG.md`
- Funciones creadas o modificadas:
  - En `public/js/app.js`:
    - `loadView()` (modificada: agregada verificación de permisos para el Dashboard; oculta elementos normales y muestra plantilla de Acceso Restringido en vivo)
    - `loadUsers()` (modificada: añadido mapeo de etiqueta en español de "Decano")
    - `loadRoles()` (modificada: mapeados los strings de IDs a números enteros correlativos del 1 al 5 en el listado visual)
- Cambios principales:
  - **IDs de Rol Numéricos**: Mapeados los identificadores en la columna "Rol ID" de la pestaña Roles y Permisos para mostrar `1`, `2`, `3`, `4`, `5` correspondientes a admin, secretaria, docente, coordinador y decano.
  - **Acceso Restringido en Dashboard**: Corregido el bug donde deshabilitar el permiso del "Dashboard" a un rol seguía mostrando la información general del panel. Ahora el panel oculta todo su contenido de métricas y gráficos, sustituyéndolo con una elegante tarjeta con candado de acceso restringido si el rol no tiene dicho permiso concedido.
  - **Opciones de Decano**: Añadida la opción "Decano" en el desplegable de roles del formulario de creación y edición de usuarios.
- Pruebas realizadas:
  - Desactivar permiso "dashboard" al rol Decano, simular rol Decano y corroborar que el panel del Dashboard se muestra vacío con el aviso de candado.
  - Comprobar que en Roles y Permisos los IDs se muestran numéricamente (`1` a `5`).
  - Crear un nuevo usuario y verificar la opción "Decano" en la lista de selección.
- Pendientes o riesgos: ninguno.

#### Fase 7 Ajustes — Módulo de Configuración (Traducción Dinámica Inglés/Español en Todo el DOM)

- Fecha: 2026-07-05
- Rama: `alexis/fase-7-certificados`
- Commit o mensaje sugerido: `feat: implementado motor i18n dinamico completo con MutationObserver para todo el DOM`
- Estado final: **Completada**.
- Archivos modificados:
  - `public/js/app.js`
  - `SAII_BACKLOG.md`
- Funciones creadas o modificadas:
  - En `public/js/app.js`:
    - `init()` (modificada: inicializa el `setupTranslationObserver()`)
    - `setupTranslationObserver()` (creada: configura un `MutationObserver` sobre `#appContainer` para interceptar dinámicamente cualquier renderizado o cambio en el DOM y aplicar traducciones)
    - `applyLanguage()` (modificada: ampliada con un mapeo simétrico bidireccional masivo que traduce tarjetas, cabeceras de tablas, placeholders de búsqueda, selectores de grupo/docente/curso, meses del año y modales de todos los módulos del sistema)
- Cambios principales:
  - **Traducción Universal en Tiempo Real**: Resuelto el problema donde componentes cargados de forma asíncrona o reactiva (como el selector de grupos, subcabeceras, inputs de búsqueda y modales) permanecían en español. Mediante un MutationObserver y un diccionario extendido, todo el texto en el DOM se traduce dinámicamente a inglés o español sin importar en qué momento sea renderizado.
- Pruebas realizadas:
  - Alternar idioma a "Inglés" y verificar la traducción inmediata de tarjetas, subcabeceras de asistencia/notas/certificados, modales de detalle, selectores de meses, botones con iconos y filtros en todos los módulos.
  - Comprobar la reversión instantánea al español al restaurar valores de configuración.
- Pendientes o riesgos: ninguno.

#### Fase 7 Ajustes — Diseño Visual y Distribución de Configuración (CSS Grid)

- Fecha: 2026-07-05
- Rama: `alexis/fase-7-certificados`
- Commit o mensaje sugerido: `style: redisenada la distribucion del modulo de configuracion a un diseño CSS grid responsivo`
- Estado final: **Completada**.
- Archivos modificados:
  - `public/index.html`
  - `public/css/styles.css`
  - `SAII_BACKLOG.md`
- Funciones creadas o modificadas:
  - Ninguna (cambios de estructura HTML y estilos CSS puros para distribución).
- Cambios principales:
  - **Redistribución en CSS Grid**: Corregido el diseño tosco de la sección de Configuración que ordenaba todos los campos en una lista vertical muy estrecha en la izquierda. Ahora, en pantallas de escritorio, los paneles "Datos del Instituto" (2 columnas de inputs) y "Preferencias del Sistema" se sitúan lado a lado (diseño 8 y 4 columnas), y la sección "Configuración Académica" abarca el ancho completo distribuida en 4 columnas.
  - **Diseño Responsivo**: Se adaptan automáticamente los grids a 1 o 2 columnas en pantallas medianas y móviles para garantizar la usabilidad.
- Pruebas realizadas:
  - Verificar que el módulo de Configuración se visualiza en un formato de rejilla balanceado y ordenado.
  - Comprobar que los campos conservan sus IDs y que las acciones de Guardar y Restaurar por defecto funcionan correctamente.
- Pendientes o riesgos: ninguno.

#### Ajustes de Matrículas y Backend de Registro

- Fecha: 2026-07-06
- Rama: main
- Commit o mensaje sugerido: `fix: resolver fecha matricula, columnas obsoletas, roles de grupo en curso y persistencia withdrawn en base de datos`
- Estado final: **Completada**.
- Archivos modificados:
  - `app/Models/Enrollment.php`
  - `public/index.html`
  - `public/js/app.js`
  - `public/js/data.js`
  - `docs/frontend/SAII_BACKLOG.md`
- Funciones creadas o modificadas:
  - En `app/Models/Enrollment.php`:
    - `create()` (modificada: inserta `enrollment_date` como `CURRENT_DATE`)
  - En `public/js/data.js`:
    - `updateEnrollment()` (creada: envía petición `PUT /api/enrollments/{id}`)
  - En `public/js/app.js`:
    - `setupEnrollments()` (modificada: filtra grupos para mostrar solo activos o en curso)
    - `renderAvailableStudents()` (modificada: removido el campo ciclo)
    - `renderEnrolledStudents()` (modificada: removido el campo ciclo y enlazado botón retirar/reactivar a base de datos)
    - `viewEnrollmentDetail()` (modificada: arreglado matching `==` de ID y removido ciclo)
    - `toggleEnrollmentStatus()` (creada: cambia estado a `withdrawn` o `active` en la base de datos)
    - `addEnrollment()` (modificada: validación de rol de administrador en grupos en curso)
- Cambios principales:
  - **Fecha de Matrícula**: Se solucionó el problema donde la fecha de matrícula se guardaba como `0000-00-00` en MySQL al insertar la fecha actual mediante `CURRENT_DATE` en el query.
  - **Eliminación de la columna Ciclo**: Removida la columna de Ciclo de las tablas de estudiantes disponibles y estudiantes matriculados en concordancia con la eliminación global del ciclo.
  - **Botón "Ver" de Alumno**: Corregido bug de tipo de dato en la comparación del ID que causaba que el modal de detalle no se abriera.
  - **Botón Retirar Alumno con estado "withdrawn"**: Se quitó el botón de edición y el botón retirar se enlazó para cambiar el estado de matrícula a `'withdrawn'` (valor esperado por la columna `status` ENUM en MySQL) en lugar de `'inactive'`, solucionando el bug del campo vacío en base de datos, y habilitando reactivación directa en UI.
  - **Grupos Cerrados/En curso**: Filtrados los grupos en selección de matrículas para omitir terminados y cerrados. Restringido el alta de alumnos en grupos en curso únicamente a usuarios administradores previa confirmación.
- Pruebas realizadas:
  - Selección de grupos cargando únicamente grupos con estado `open` o `inprogress`.
  - Matricular alumno como secretaria en grupo `inprogress` muestra toast de error.
  - Matricular alumno como administrador en grupo `inprogress` pide confirmación y crea registro con fecha actual.
  - Clic en botón "Ver" de alumno abre el modal correctamente sin ciclo.
  - Clic en botón "Retirar" de alumno actualiza el estado a `withdrawn` en la base de datos MySQL de forma persistente.
- Pendientes o riesgos: ninguno.

#### Ajustes de Asistencia de Alumnos (Fase 5)

- Fecha: 2026-07-06
- Rama: main
- Commit o mensaje sugerido: `fix: rediseñar control de asistencia docente como matriz completa de sesiones con adicion dinamica de columnas y autoguardado`
- Estado final: **Completada**.
- Archivos modificados:
  - `app/Controllers/AttendanceController.php`
  - `public/index.html`
  - `public/index.php`
  - `public/js/app.js`
  - `public/js/data.js`
  - `docs/frontend/SAII_BACKLOG.md`
- Funciones creadas o modificadas:
  - En `app/Controllers/AttendanceController.php`:
    - `updateStatus()` (modificada: autoriza al rol `'teacher'` a realizar llamadas al endpoint de actualización de estado para cerrar las asistencias)
  - En `public/index.php`:
    - `/api/attendance/records` (modificada: remueve el filtro `status != 'borrador'` para que la caché del cliente cargue y persista los borradores de asistencia)
  - En `public/js/data.js`:
    - `getAllStudentAttendance()` (modificada: evalúa dinámicamente si hay listas cerradas en la base de datos para mostrar el estado 'cerrado' en la tabla general)
    - `getStudentAttendanceById()` (modificada: remueve el bucle que generaba dinámicamente 4 fechas ficticias de relleno, cargando única y estrictamente las fechas reales registradas en la base de datos MySQL)
  - En `public/js/app.js`:
    - `simulateRoleChange()` (modificada: corrige la asignación del ID del docente simulado consultando el caché real en vez del mock)
    - `setupAttendance()` (modificada: bifurca el flujo de carga mostrando la vista del docente o del administrador basado en el rol del usuario conectado y oculta el botón "Volver al listado" si el rol es docente)
    - `setupTeacherAttendanceView()` (modificada: inicializa el selector de grupos asignados al docente y expone el botón Cargar al seleccionar un grupo)
    - `loadTeacherAttendanceMatrix()` (creada: carga la cuadrícula de matriz completa del grupo con alumnos y columnas de fechas, deshabilitando selectores y botones de edición si el estado es 'cerrado' o 'cerrada')
    - `onMatrixStatusChange()` (creada: actualiza la celda modificada en la base de datos real asíncronamente con autoguardado en vivo)
    - `saveMatrixAsDraft()` (creada: sincroniza y recarga el estado del borrador de asistencia)
    - `addNewAttendanceDateCol()` (creada: permite ingresar una nueva fecha y registrar una nueva sesión/columna de asistencia de forma interactiva en la matriz)
    - `exportAttendanceToExcel()` (creada: compila y exporta la matriz completa de asistencia del grupo a un archivo CSV/Excel BOM)
    - `viewAttendanceDetail()` (modificada: establece `canEdit = false` para forzar que el botón de inspección "Ver" (lupa) sea estrictamente de solo lectura)
    - `closeAttendance()` (modificada: corrige el validador de cierre para admitir `'tarde'` como estado completo, valida exclusivamente contra fechas realmente registradas en BD, y utiliza await para evitar la condición de carrera al recargar)
    - `printAttendance()` (modificada: redirige la impresión de asistencia del administrador para descargar directamente la matriz de asistencia en Excel)
    - `renderAdminAttendanceTable()` (modificada: corrige la obtención del ID del docente conectado/simulado usando getTeacherIdForUser en lugar del id del usuario, solucionando el filtrado en el listado general administrativo)
- Cambios principales:
  - **Filtro de Asistencias por Docente Conectado:** Se solucionó un error por el cual el listado general de asistencias del administrador mostraba filas incorrectas o vacías al iniciar sesión como docente. Ahora se utiliza el ID de docente (`teacherId`) en lugar del ID de usuario (`userId`) para filtrar las listas cargadas.
  - **Eliminación definitiva de Fechas Mock:** Se removió el código que generaba automáticamente 4 fechas mock al cargar la matriz de un grupo. Ahora el sistema solo lee y despliega las columnas de fechas reales que existan registradas en la base de datos.
  - **Cierre de Asistencia por el Docente:** Se habilitó el botón de "Cerrar Asistencia" en la planilla del docente. Se actualizó el middleware de seguridad en `AttendanceController::updateStatus` para autorizar peticiones del rol `'teacher'`, permitiendo que el docente guarde con éxito el estado de cierre en la base de datos.
  - **Bloqueo estricto de edición:** Una vez que la lista está en estado `'cerrado'` o `'cerrada'`, el sistema bloquea inmediatamente todos los selectores de la cuadrícula de asistencia del docente e impide la adición de nuevas fechas de clase.
  - **Quitar botón de navegación para Docentes:** Se ocultó el botón "Volver al listado" en la vista del docente, puesto que no tiene un listado global al cual retornar.
  - **Rediseño a Vista Matriz de Asistencia:** Se eliminó el selector de fecha individual de la planilla docente. Ahora, al seleccionar el grupo y presionar "Cargar", se pinta la matriz completa de asistencia (idéntica a la vista de detalle del administrador), donde cada fecha registrada es una columna y cada fila un estudiante.
  - **Autoguardado en vivo:** Los cambios en las celdas se guardan en la base de datos real automáticamente al cambiar el selector en la tabla, porporcionando una experiencia rápida sin parpadeo de pantalla.
  - **Adición Dinámica de Sesiones:** Se añadió el botón "➕ Agregar Fecha" en la cuadrícula del docente, permitiendo ingresar una fecha válida del curso para crear de forma automática y asíncrona una nueva columna en la matriz.
  - **Mapeo de Docente Simulado corregido:** Se solucionó el problema por el cual el selector de "Grupo asignado" se mostraba vacío al simular el rol de Docente (como Roberto Silva). Ahora, el simulador busca el ID correspondiente del docente en el listado real de la base de datos (por ejemplo, `1` en vez del ID mockeado `'TCH001'`).
  - **Estado dinámico Cerrado:** El estado de las filas del listado de asistencias de alumnos del administrador se evalúa dinámicamente consultando si hay listas cerradas en la base de datos, en lugar de amarrarse únicamente al estado del grupo académico en sí.
  - **Borradores e integración con Base de Datos:** Los registros se guardan y editan en MySQL. El endpoint de records de PHP fue actualizado para retornar borradores, evitando que la cuadrícula se muestre vacía al recargar.
  - **Inspección de Solo Lectura:** El botón de la lupa ("Ver") deshabilita los controles del modal para garantizar solo lectura.
  - **Validaciones de Cierre:** Corregida la regla de negocio que impedía cerrar planillas si había alumnos en estado "Tarde". Ahora se valida sobre fechas registradas y se permite el cierre.
  - **Exportación real a Excel:** Creadores de CSV de datos estructurados con BOM UTF-8 que permiten abrir plantillas con acentos directamente en Excel, tanto en la vista docente como en el listado del administrador.
- Pruebas realizadas:
  - Simular rol de docente e ingresar al módulo de asistencia para validar la carga de grupos asignados correspondientes al docente activo.
  - Seleccionar grupo, hacer clic en "Cargar" y constatar la visualización de la matriz de alumnos y fechas registradas en MySQL (sin presencia de fechas mock), verificando que el botón "Volver al listado" se encuentre oculto y que el filtro del listado general administrativo restrinja correctamente las asistencias visibles solo a las de su grupo asignado.
  - Cambiar el selector de estado en una celda de la matriz y corroborar que el toast informe el guardado automático persistente en base de datos.
  - Hacer clic en "➕ Agregar Fecha", introducir una fecha dentro del período del grupo y validar que aparezca como nueva columna interactiva en la matriz.
  - Presionar el botón "Cerrar Asistencia" como docente, verificar que se actualice a `'cerrada'` en MySQL, y constatar que los selectores y el botón de adición queden inmediatamente deshabilitados/ocultos.
  - Clic en "Ver" en la vista del administrador abre el modal con selectores deshabilitados.
  - Clic en "Cerrar" en grupo con tardanzas y asistencias completas procesa la petición exitosamente.
  - Clic en "Imprimir" del administrador y "Exportar" del docente descarga el reporte CSV/Excel correctamente.
- Pendientes o riesgos: ninguno.

#### Ajustes de Registro de Calificaciones (Fase 6)

- Fecha: 2026-07-06
- Rama: main
- Commit o mensaje sugerido: `fix: unificar registro, guardado y cierre de calificaciones con base de datos, implementar exportacion a Excel real y segmentar por docente`
- Estado final: **Completada**.
- Archivos modificados:
  - `app/Controllers/GradeController.php`
  - `public/index.php`
  - `public/js/app.js`
  - `public/js/data.js`
  - `docs/frontend/SAII_BACKLOG.md`
- Funciones creadas o modificadas:
  - En `app/Controllers/GradeController.php`:
    - `updateStatus()` (creada: permite actualizar el estado del acta a 'borrador' o 'cerrada' según sea necesario)
  - En `public/index.php`:
    - `GET /api/grades` (creada: retorna los registros reales de notas para la precarga del frontend)
    - `GET /api/grades/sheets` (creada: retorna los estados reales de las actas de notas para sincronización)
    - `POST /api/grades/group/{groupId}/status` (creada: mapea la actualización de estado del acta)
  - En `public/js/data.js`:
    - `preload()` (modificada: incluye las peticiones de actas y notas reales, cacheando las cabeceras)
    - `getGradeSheetByGroup()` (modificada: lee dinámicamente el estado de la base de datos en lugar de forzar 'cerrada')
    - `updateGradeSheetStatus()` (modificada: realiza una llamada real POST al backend para guardar en MySQL)
  - En `public/js/app.js`:
    - `setupAdminGradesView()` (modificada: restringe los grupos en el selector si el usuario es docente y oculta el filtro general de docentes)
    - `renderAdminGradesTable()` (modificada: filtra loose `==` por docente asignado y reemplaza las referencias mock por la caché de MySQL `DataManager.getGrades()`)
    - `viewGradeSheetDetail()` (modificada: actualiza a loose `==` y utiliza las notas de la base de datos real)
    - `saveModalGrades()` y `saveGradesData()` (creadas/modificadas: guarda de forma masiva y asíncrona la lista de notas en formato compatible con el controlador PHP)
    - `closeModalGradeSheetFromModal()` (modificada: cierra el acta enviando las notas con estado 'cerrada' de forma asíncrona)
    - `reopenGradeSheet()` (modificada: reabre el acta actualizando el estado de la base de datos de forma persistente)
    - `exportGradeSheet()` y `printGradeSheet()` (creadas/modificadas: compila y descarga el reporte de acta de calificaciones formateado a CSV con UTF-8 BOM para Excel)
- Cambios principales:
  - **Conexión de notas con MySQL:** Se corrigió el guardado de calificaciones. Se eliminó la función ficticia `saveGrade` que causaba error JS y se conectó con `DataManager.saveGrades` de manera masiva, pre-poblando y guardando borradores persistentes.
  - **Cierre y reapertura reales:** Se implementó el cambio de estado del acta en base de datos. Al cerrar, los inputs del modal se bloquean instantáneamente. Al reabrir como admin, se reactiva la edición.
  - **Segmentación por docente asignado:** El docente solo ve en la tabla principal sus grupos a cargo y solo puede filtrar esos grupos.
  - **Excel/CSV real:** Habilitado el botón de exportación e impresión para descargar el acta en CSV listo para Excel.
- Pruebas realizadas:
  - Iniciar sesión como docente y verificar que solo cargan sus grupos y que el desplegable de grupos está filtrado.
  - Guardar notas parciales como borrador y verificar persistencia en base de datos al recargar la página.
  - Completar notas, presionar "Cerrar Acta" y constatar que se guarda como `cerrada` en MySQL y los campos se bloquean.
  - Entrar como administrador, reabrir el acta y confirmar que el docente vuelve a tener permisos de edición.
  - Descargar acta en Excel y verificar apertura correcta con tildes y promedios correctos.
- Pendientes o riesgos: ninguno.

#### Ajustes de Certificados y Constancias (Fase 7)

- Fecha: 2026-07-06
- Rama: main
- Commit o mensaje sugerido: `fix: conectar modulo de certificados a base de datos, habilitar rol decano y registro de observaciones`
- Estado final: **Completada**.
- Archivos modificados:
  - `app/Controllers/CertificateController.php`
  - `public/index.php`
  - `public/js/app.js`
  - `public/js/data.js`
  - `docs/frontend/SAII_BACKLOG.md`
- Funciones creadas o modificadas:
  - En `app/Controllers/CertificateController.php`:
    - `index()` (modificada: autoriza rol 'dean' y retorna las firmas asociadas a cada certificado)
    - `show()` (modificada: autoriza rol 'dean')
    - `sign()` (modificada: autoriza rol 'dean')
    - `saveObservation()` (creada: permite actualizar la observación del certificado en base de datos)
  - En `public/index.php`:
    - `POST /api/certificates/{id}/observation` (ruta añadida para registrar observaciones)
  - En `public/js/data.js`:
    - `saveCertificateObservation()` (creada: envía POST asíncrono para guardar observaciones en base de datos)
    - `generateBulkCertificates()` (creada: realiza la emisión masiva asíncrona de alumnos aptos y los guarda en base de datos)
  - En `public/js/app.js`:
    - `loadCertificates()` (modificada: guarda `this.certificateRows` para acceso masivo y utiliza comparaciones loose `==`)
    - `handleEmitCertSubmit()` (modificada: espera de forma asíncrona la creación y verifica existencia contra BD)
    - `signDocument()` (modificada: firma asíncronamente y actualiza el estado de las firmas en la base de datos)
    - `openCertObservationModal()` (modificada: carga las observaciones directamente desde la caché de la base de datos)
    - `submitCertObservation()` (modificada: persiste la observación en MySQL de manera asíncrona)
    - `viewCertificate()` y reportes (modificadas: reemplazan las referencias mock con la caché real de base de datos)
- Cambios principales:
  - **Acceso Decano:** Se corrigieron los errores 403 modificando `requireAuth` para incluir el rol `'dean'`. Ahora el Decano puede consultar el listado, ver documentos y firmar sin restricciones.
  - **Firma Real en MySQL:** El botón de firma de Director y Decano ahora conecta con el backend e inserta la firma real en `certificate_signatures`. El estado se actualiza automáticamente a `'generated'` al completarse ambas firmas.
  - **Observación Persistente:** El botón y formulario de observación ahora guardan la observación directamente en la columna `observations` de la tabla `certificates` de MySQL.
  - **Generación Masiva Real:** El botón "Generar Certificados Pendientes" ejecuta la emisión en lote evaluando promedio y asistencia mínima sobre los datos reales de la base de datos.
  - **Ver Documento:** El botón de vista previa (lupa) de certificados ahora carga el certificado desde la base de datos de manera correcta.
- Pruebas realizadas:
  - Generar certificados individuales y en lote asíncronamente.
  - Iniciar sesión como Decano (dean), firmar actas pendientes y verificar firmas guardadas en MySQL.
  - Iniciar sesión como Director/Admin, firmar el mismo certificado y comprobar que pasa automáticamente a estado "Generado".
  - Registrar observación en el botón de chat como Decano y verificar persistencia en base de datos al recargar la página.
- Pendientes o riesgos: ninguno.

#### Ajustes de Cabecera, Ocultamiento de Sidebar y Notificaciones Dinámicas por Rol (Fase 7 Ajustes)

- Fecha: 2026-07-06
- Rama: main
- Commit o mensaje sugerido: `feat: enrutar ocultamiento de sidebar, segmentar notificaciones reales por rol e incorporar toggle en cabecera`
- Estado final: **Completada**.
- Archivos modificados:
  - `public/css/styles.css`
  - `public/index.html`
  - `public/js/app.js`
  - `docs/frontend/SAII_BACKLOG.md`
- Funciones creadas o modificadas:
  - En `public/js/app.js`:
    - `loadNotificationsList()` (modificada: genera notificaciones a partir de los datos reales del caché, las segmenta según el rol del usuario conectado y las persiste como leídas en `localStorage` individualmente)
    - `clearNotifications()` (modificada: marca como leídas todas las notificaciones del rol en el `localStorage`)
    - `loginUser()` y `simulateRoleChange()` (modificadas: gatillan la recarga de notificaciones del rol en el inicio de sesión y la simulación de roles)
- Cambios principales:
  - **Contraer/Ocultar Menú Lateral**: Agregado el botón de menú hamburguesa (☰) en el encabezado izquierdo reemplazando el texto descriptivo del sistema. En desktop, la barra lateral se contrae/expande desplazándose `-280px` hacia la izquierda con transición fluida. En móviles, opera el menú lateral responsivo.
  - **Notificaciones Reales por Rol**: Reemplazadas las notificaciones estáticas por alertas en tiempo real generadas dinámicamente sobre la base de datos MySQL (certificados por firmar, constancias listas para entregar, asistencias y nuevos grupos). Las alertas se filtran en tiempo real para que al Decano solo le aparezcan documentos pendientes de firma, al Docente los de sus grupos y a la Secretaria/Admin los del sistema general.
  - **Persistencia Individual por Rol**: La lectura de notificaciones se guarda por rol en el `localStorage`, logrando que la simulación refleje estados de lectura independientes por cada usuario.
  - **Corrección de undefined en nombres**: Solucionado el error que mostraba nombres `undefined` de alumnos y docentes en la alerta combinando los atributos `firstName` y `lastName`.

#### Fase 7 Ajustes — Mejoras de Diseño Responsivo (Alineación de Botones y Rejillas de Filtros en Mobile)

- Fecha: 2026-07-09
- Rama: main
- Commit o mensaje sugerido: `style: agregar transform none a modal-fullscreen y aumentar altura de header con controles mas grandes`
- Estado final: **Completada**.
- Archivos modificados:
  - `public/index.html`
  - `public/css/styles.css`
  - `public/js/app.js`
  - `docs/frontend/SAII_BACKLOG.md`
- Funciones creadas o modificadas:
  - `closeModal()` (actualizada para restablecer el texto del botón de pantalla completa a "Expandir").
- Cambios principales:
  - **Alineación de Botones de Cabecera en Mobile**: Se introdujo el span `.btn-text-extra` para simplificar dinámicamente los botones de agregar en los módulos Alumnos, Docentes y Grupos a "➕ Nuevo" en pantallas móviles, alineando la barra de búsqueda y el botón en el mismo nivel.
  - **Botones de Certificados**: Alineados a la derecha en pantallas de escritorio. En móviles, se simplificaron las etiquetas a "➕ Emitir" y "⚙️ Generar Pendientes" y se alinearon side-by-side (50% de ancho cada uno) con padding generoso y altura mínima de 44px.
  - **Filtros Alineados en la Misma Fila**: En los módulos Alumnos y Grupos Académicos, los dos selectores se redujeron a la mitad (50% de ancho) y se alinearon en la misma fila en dispositivos móviles.
- **Rejilla de Filtros (2 Columnas)**: Los selectores de Asistencia de Alumnos y Reportes ahora forman una rejilla de 2 columnas de ancho igual (grid con 2 columnas) en móviles. En Reportes, se alineó a la derecha el botón "🔎 Filtrar" y las acciones se alinearon lado a lado.
  - **Alineación de Botón de Nuevo Curso**: En Cursos y Módulos, el botón "➕ Nuevo Curso" se ajustó a 50% de ancho y se alinea a la derecha en dispositivos móviles.
  - **Optimización de Header y Tap Targets**: Se incrementó el tamaño del botón de menú hamburguesa (☰) y todos los botones interactivos derechos de la cabecera (selector de rol, campana de notificaciones, luna de tema y avatar del perfil) a `44px x 44px` con alineación consolidada al extremo derecho en móviles, y se aumentó el alto de la cabecera `.header` a `70px` en escritorio y `64px` en móviles con controles de mayor tamaño.
  - **Corrección de Desbordamiento y Posición de Certificados**: Se corrigió el desajuste de posición al expandir a pantalla completa agregando `transform: none !important;` en `.modal.modal-fullscreen` (evitando la traslación de centrado por defecto de los modales del -50% que los desplazaba fuera de la pantalla). En móviles, el contenedor se alinea a la izquierda para permitir scroll táctil lateral sin recortes.
- Pruebas realizadas:
  - Validar que al pulsar "Expandir" en Certificados, el modal ocupe toda la pantalla de forma simétrica sin cortes ni desplazamientos y con el botón "Minimizar" visible en la cabecera.
  - Verificar la altura mejorada de la barra superior a `70px` en desktop y `64px` en mobile con botones e iconos de mayor tamaño.
  - Verificar la alineación en la misma fila de filtros y botones simplificados en dispositivos móviles.
  - Validar la distribución en rejilla de 2 columnas de los filtros de Asistencias y Reportes.
  - Comprobar que en el módulo Cursos, el botón "➕ Nuevo Curso" se reduce a 50% de ancho y se alinea a la derecha.
  - Comprobar que la barra superior muestra los botones ☰, selector de rol, 🔔, 🌙, 👤 redimensionados a `44px` para fácil selección táctil y alineados a la derecha.
  - Comprobar que al pulsar "Expandir" en el modal de certificados, el diploma se alinea a la izquierda de la ventana permitiendo deslizarse horizontalmente sin recortes de texto.
- Pendientes o riesgos: ninguno.

#### Fase 7 Ajustes Finales — Integración de Tipo de Alumno y Optimización de Certificado Expandido (Fullscreen)

- Fecha: 2026-07-09
- Rama: `alexis/fase-7-ajustes-finales`
- Commit o mensaje sugerido: `feat: integrar tipo de alumno con badges pastel y escala dinamica en certificado expandido`
- Estado final: **Completada**.
- Archivos modificados:
  - `public/index.html`
  - `public/css/styles.css`
  - `public/js/app.js`
  - `docs/frontend/SAII_BACKLOG.md`
  - `docs/frontend/SAII_CSS_GUIDE.md`
  - `docs/frontend/SAII_CONTEXTO_CONTINUIDAD.md`
  - `docs/backend/SAII_BACKEND_DB_SCHEMA.md`
  - `docs/backend/SAII_BACKEND_API_CONTRATO.md`
- Funciones creadas o modificadas:
  - En `public/js/app.js`:
    - `adjustCertificateScale()` (creada: escala proporcionalmente el diploma para ajustarlo al ancho de su contenedor y recalcula la altura del contenedor dinámicamente)
    - `toggleCertFullscreen()` (modificada: invoca `adjustCertificateScale()` tras alternar la clase fullscreen)
    - `viewCertificate()` (modificada: invoca `adjustCertificateScale()` con un retardo tras renderizar el certificado)
    - `setupEventListeners()` (modificada: añade evento `resize` global para re-evaluar la escala del certificado en vivo)
    - `viewGradeSheetDetail()` (modificada: muestra el tipo de alumno y su badge pastel)
    - `viewAttendanceDetail()` (modificada: renderiza el tipo de alumno y su badge en la matriz)
    - `loadCertificates()` (modificada: añade columna `Tipo` y dibuja el badge respectivo)
    - `renderDeanCertificatesTable()` (modificada: añade columna `Tipo` y dibuja el badge respectivo en la vista de Decano)
    - `filterReportResults()` (modificada: filtra estudiantes por `studentType` en lugar de `cycle`, y añade columna `Tipo` al reporte de matrículas detalladas)
    - `loadSavedReport()` y `handleSaveQuerySubmit()` (modificadas: guarda y restaura el filtro `studentType` en lugar de `cycle` en las plantillas)
    - `translatePage()` (modificada: traduce tipos de alumnos y sus opciones)
- Cambios principales:
  - **Tipo de Alumno (studentType)**: Se anuló por completo el campo `cycle` y se reemplazó con `studentType` en todos los listados de Alumnos, Matrículas, Notas, Asistencias, Certificados y Reportes con badges color pastel suaves de alto contraste.
  - **Corrección de Certificado en Fullscreen**: Se solucionó el bug de desborde y recortes a la izquierda en pantallas grandes y móviles de los certificados al expandirse. Se implementó la escala dinámica en JS y CSS, forzando la maquetación a 800px de ancho estable y aplicando un factor de zoom/escala proporcional que encaja exactamente en el ancho del viewport de manera responsiva en todos los navegadores (Firefox, Chrome, Safari).
  - **Actualización Documental**: Se actualizaron todos los manuales y diagramas técnicos del frontend y del backend MVC para reflejar la eliminación del ciclo y la adición del tipo de alumno con sus respectivos badges.
- Pruebas realizadas:
  - Visualización del listado y modal de detalle sin el campo ciclo.
  - Generación de certificados verificando la correcta visualización de la columna Tipo.
  - Simular rol Decano y corroborar la adición de la columna Tipo en la bandeja de firmas.
  - Cargar reporte detallado de Matrículas comprobando el filtro Tipo de Alumno.
  - Abrir previsualización de certificado en modal y pulsar "Expandir" (pantalla completa); verificar que el diploma se escala proporcionalmente cubriendo el ancho, sin cortarse a la izquierda y permitiendo scroll vertical. Redimensionar ventana del navegador y corroborar el auto-escalado dinámico en tiempo real.
- Pendientes o riesgos: ninguno.

#### Fase 7 Ajustes Finales — Traducción a Inglés Completa (i18n de Certificados, Reportes y Copias de Seguridad)

- Fecha: 2026-07-10
- Rama: `alexis/fase-7-mejoras-responsivas`
- Commit o mensaje sugerido: `feat: completar traducciones a ingles de certificados, reportes detallados y modulo de backup`
- Estado final: **Completada**.
- Archivos modificados:
  - `public/js/app.js`
- Funciones creadas o modificadas:
  - En `public/js/app.js`:
    - `applyLanguage()` (modificada: refactorizado el escáner del DOM para operar nodo por nodo de texto (`Node.TEXT_NODE`) resolviendo la traducción de etiquetas con tags o iconos anidados)
    - `loadCertificates()` (modificada: renderiza dinámicamente en inglés los badges de estado, tipo de alumno, modalidad, acciones y motivos de no elegibilidad)
    - `renderDeanCertificatesTable()` (modificada: renderiza dinámicamente en inglés los badges de estado, firmas, modalidad y tooltips de acciones)
    - `filterReportResults()` (modificada: declara la variable `isEn` al inicio y aplica traducción condicional para los badges de modalidad en resumen, estados de calificaciones/asistencia en detalle, tipos de documento en certificados, y mensaje de consulta sin resultados)
    - Diccionario `transMap` (modificado: añadidas claves de traducción segmentadas y completas para cabeceras de tablas de certificados y backups, botones, estados, frecuencias, etiquetas de detalle, y confirmaciones)
    - `runManualBackup()`, `openBackupSettingsModal()`, `deleteBackup()` (modificadas: alertas y mensajes toast de confirmación y estado totalmente traducidos al inglés según idioma del sistema)
- Cambios principales:
  - **i18n de Certificados**: Implementada la traducción total en inglés para los botones de acción ("Emitir Documento" -> "Issue Document", "Generar Certificados Pendientes" -> "Generate Pending Certificates"), los nombres de tipos de documentos ("Proof of Study", "Certificate"), y las columnas de firma, estados ("Generated", "To be signed", "Pending", "Annulled", "Eligible", "Not eligible") y motivos.
  - **i18n de Reportes**: Traducidos los badges y textos en las filas de las tablas detalladas de notas ("APPROVED", "DISAPPROVED"), asistencia ("SATISFACTORY", "AT RISK"), certificados ("TO BE SIGNED", "PENDING", "GENERATED", "ANNULLED") y modalidad ("REGULAR", "EXAM") así como el aviso de sin resultados.
  - **i18n de Backups**: Traducida por completo la interfaz del módulo de copias de seguridad (títulos, botones "Configure", "Generate Backup", cabeceras de tabla, modales de configuración y detalle) y sus interacciones de confirmación y avisos toast de éxito/error.
  - **Refactorización del Motor de Traducción**: Corregido el algoritmo de `applyLanguage` que unificaba y recortaba los text nodes hijos. Ahora recorre recursivamente los nodos de texto individuales y los reemplaza en su lugar, permitiendo que botones que contienen iconos SVG y textos anidados con clases responsivas (como `.btn-text-extra`) se traduzcan perfectamente por partes sin romper el maquetado.
- Pruebas realizadas:
  - Cambiar el idioma del sistema a inglés en Configuración y verificar que el módulo de Certificados traduce dinámicamente todos los estados de los alumnos y botones de firma en cascada.
  - Cargar el panel de Reportes detallado y verificar la correcta traducción de los estados de aprobados/desaprobados, asistencia y constancias.
  - Abrir el módulo de Copias de seguridad (Backups) y constatar que tanto la tabla, los botones, los modales (Configurar/Detalle) y los mensajes toast y de confirmación se muestran completamente en inglés.
- Pendientes o riesgos: ninguno.

---

## Regla final del backlog

Este backlog no reemplaza los prompts detallados. Sirve como mapa general, control de avance y bitácora.

Para implementar una fase, el agente debe usar el prompt detallado de `SAII_ESTADO_Y_PROMPTS.md`, respetar las reglas de `AGENTS.md` y registrar el resumen final en este archivo.
