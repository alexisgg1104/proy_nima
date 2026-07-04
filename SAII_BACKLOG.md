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
| Fase 3 | Grupos Académicos | Pendiente / siguiente fase sugerida | `SAII_ESTADO_Y_PROMPTS.md` |
| Fase 4 | Rediseño de Matrículas | Pendiente | `SAII_ESTADO_Y_PROMPTS.md` |
| Fase 5 | Control de Asistencia de Alumnos | **Completada (corregida)** | `SAII_ESTADO_Y_PROMPTS.md` + `SAII_ASISTENCIA_ALUMNOS.md` |
| Fase 6 | Registro de Notas | Pendiente | `SAII_ESTADO_Y_PROMPTS.md` |
| Fase 7 | Certificados, Reportes, Usuarios, Roles y Configuración | Pendiente | `SAII_ESTADO_Y_PROMPTS.md` |
| Etapa posterior | Backend PHP MVC + MySQL | Pendiente futuro | Documento backend por definir |

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

Estado: **Pendiente**.

- [ ] Registro de notas diferenciado por rol.
- [ ] Vista Docente para registrar notas solo de grupos asignados.
- [ ] Vista Administrador para consultar actas registradas.
- [ ] Tabla de notas correcta y funcional.
- [ ] Cada módulo debe ser una columna.
- [ ] Cada alumno debe ser una fila.
- [ ] No poner módulos como filas.
- [ ] Calcular promedio ponderado usando los porcentajes de módulos.
- [ ] Validar notas entre 0 y 20.
- [ ] No cerrar acta si faltan notas.
- [ ] Dejar los datos de notas listos para Certificados y Reportes.

Referencia operativa: ver sección **Fase 6 pendiente — Registro de Notas** en `SAII_ESTADO_Y_PROMPTS.md`.

---

## Fase 7: Certificados, Reportes, Usuarios, Roles y Configuración

Estado: **Pendiente**.

- [ ] Módulo de Certificados.
- [ ] Generación de certificados pendientes.
- [ ] Vista previa formal de certificado.
- [ ] Considerar nota final y requisitos académicos.
- [ ] Considerar asistencia mínima de alumnos si aplica por configuración.
- [ ] Módulo de Reportes.
- [ ] Reportes guardados y CRUD simulado.
- [ ] Reportes de asistencia de alumnos.
- [ ] Módulo de Usuarios.
- [ ] Módulo de Roles.
- [ ] Selector de rol simulado para probar vistas.
- [ ] Módulo de Configuración.
- [ ] Configuración editable de parámetros académicos.

Referencia operativa: ver sección **Fase 7 pendiente — Certificados, Reportes, Usuarios, Roles y Configuración** en `SAII_ESTADO_Y_PROMPTS.md`.

---

## Etapa posterior: Backend PHP MVC + MySQL

Estado: **Pendiente futuro**.

Esta etapa no forma parte de las fases frontend actuales, pero sí forma parte del alcance final del proyecto.

Cuando el usuario indique iniciar backend, se deberá crear una planificación específica para:

- Estructura MVC en PHP.
- Conexión MySQL.
- Modelos.
- Controladores.
- Vistas o endpoints.
- Autenticación real.
- Roles y permisos.
- Migración de datos mock a tablas.
- Validaciones backend.
- Seguridad básica.
- Integración con el frontend.

> [!NOTE]
> No crear backend durante Fase 3, 4, 5, 6 o 7 salvo que el usuario lo pida de forma explícita.

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

- Fecha: pendiente.
- Rama: pendiente.
- Commit o mensaje sugerido: `feat: fase 6 registro de notas`.
- Estado final: Pendiente.
- Resumen del agente: pendiente.

#### Fase 7 — Certificados, Reportes, Usuarios, Roles y Configuración

- Fecha: pendiente.
- Rama: pendiente.
- Commit o mensaje sugerido: `feat: fase 7 certificados reportes usuarios configuracion`.
- Estado final: Pendiente.
- Resumen del agente: pendiente.

---

## Regla final del backlog

Este backlog no reemplaza los prompts detallados. Sirve como mapa general, control de avance y bitácora.

Para implementar una fase, el agente debe usar el prompt detallado de `SAII_ESTADO_Y_PROMPTS.md`, respetar las reglas de `AGENTS.md` y registrar el resumen final en este archivo.
