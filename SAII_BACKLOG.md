# SAII_BACKLOG.md — Plan de fases del proyecto

## Proyecto

**SAII** — Sistema Administrativo del Instituto de Informática.

---

## Fase 1: Ajustes globales

- [ ] Header — revisión y ajustes de layout.
- [ ] Sidebar — revisión y ajustes de navegación.
- [ ] Iconos CRUD — reemplazar botones de texto por iconos compactos.
- [ ] Estados en español — asegurar que todos los estados se muestren en español.
- [ ] Ajustes globales de estilos y consistencia visual.

---

## Fase 2: Alumnos, Docentes, Cursos y Módulos

- [ ] Módulo de Alumnos — CRUD completo con tabla, modal y validaciones.
- [ ] Módulo de Docentes — CRUD completo con tabla, modal y validaciones.
- [ ] Módulo de Cursos — CRUD completo con tabla, modal y validaciones.
- [ ] Módulo de Módulos — CRUD completo con tabla, modal y validaciones.

---

## Fase 3: Grupos Académicos

- [ ] Vista de Grupos Académicos — listado y tabla.
- [ ] Modal "Abrir Nuevo Grupo" — formulario de creación de grupo académico.

---

## Fase 4: Rediseño de Matrículas

- [ ] Rediseño completo del módulo de Matrículas.

---

## Fase 5: Control de Asistencia Docente y Horas Dictadas

> Digitalización del formato físico "CONTROL DE ASISTENCIA DOCENTE".
> Ver especificación completa en `SAII_ASISTENCIA_DOCENTE.md`.

### Vista Docente
- [ ] El docente solo ve los grupos/cursos asignados a él.
- [ ] Puede seleccionar un grupo (curso regular o examen de suficiencia).
- [ ] El encabezado del formato se autocompleta con los datos del grupo.
- [ ] Puede agregar sesiones (fecha, hora entrada, hora salida, enlace Meet, observación).
- [ ] El sistema calcula automáticamente el total de horas por sesión y el acumulado.
- [ ] Puede editar o eliminar sesiones mientras la planilla esté en estado Borrador.
- [ ] Puede guardar la planilla como Borrador.
- [ ] Puede enviar/confirmar la planilla (cambia estado a Enviado, bloquea edición).

### Vista Administrador
- [ ] Consulta planillas registradas por todos los docentes.
- [ ] Filtra por docente, curso, modalidad, fecha y estado.
- [ ] Ve el detalle de cada planilla (encabezado + tabla de sesiones).
- [ ] Puede validar, observar (devolver con comentario), cerrar o desbloquear planillas.
- [ ] Puede imprimir o exportar la planilla.
- [ ] Visualiza dashboard de horas dictadas vs. horas programadas por grupo/docente.

### Vista Secretaria / Coordinador
- [ ] Puede consultar planillas según permisos asignados.
- [ ] Sin capacidad de modificar ni validar (solo lectura).

### Estados de planilla
- [ ] Implementar flujo de estados: Borrador → Enviado → Validado → Cerrado (y desviación Observado).

### Datos mock
- [ ] Agregar campo `schedule` a `groups[]` en `data.js`.
- [ ] Agregar colección `teacherAttendance[]` con sesiones de ejemplo en `data.js`.
- [ ] Agregar funciones utilitarias en `DataManager` (ver `SAII_ASISTENCIA_DOCENTE.md`).

---

## Fase 6: Registro de notas

- [ ] Registro de notas diferenciado por rol.
- [ ] Tabla de notas correcta y funcional.

---

## Fase 7: Certificados, Reportes, Usuarios, Roles y Configuración

- [ ] Módulo de Certificados.
- [ ] Módulo de Reportes.
- [ ] Módulo de Usuarios.
- [ ] Módulo de Roles.
- [ ] Módulo de Configuración.
