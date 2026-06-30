# SAII_ASISTENCIA_DOCENTE.md — Módulo de Control de Asistencia Docente y Horas Dictadas

## Proyecto

**SAII** — Sistema Administrativo del Instituto de Informática  
**Universidad Nacional de Piura — Facultad de Ingeniería Industrial**

---

## 1. Objetivo del módulo

Digitalizar el formato físico **"CONTROL DE ASISTENCIA DOCENTE"** que actualmente los docentes llenan a mano, tanto para cursos regulares como para exámenes de suficiencia.

El módulo permite que el docente registre digitalmente:
- Sus sesiones realizadas (fecha, hora de entrada, hora de salida).
- Las horas dictadas por sesión (calculadas automáticamente).
- El enlace Meet de la sesión (cuando aplique).
- Observaciones por sesión.

El administrador puede consultar, validar, imprimir o exportar las planillas registradas por los docentes, sin necesidad del papel físico.

---

## 2. Diferencia entre Curso regular y Examen de suficiencia

| Aspecto | Curso regular | Examen de suficiencia |
|---------|--------------|----------------------|
| **Duración** | Múltiples sesiones a lo largo de semanas | Una sola sesión (el día del examen) |
| **Planilla** | Varias filas de sesiones | Generalmente una sola fila |
| **Docente** | Instructor del curso | Docente evaluador |
| **Horas programadas** | Duración total del curso (ej. 120h) | Duración del examen (ej. 2h) |
| **Encabezado** | Muestra "Fecha inicio" y "Fecha final" | Muestra solo "Fecha del examen" |
| **Etiqueta docente** | "Docente" | "Docente / Evaluador" |

---

## 3. Campos del encabezado del formato

### 3.1 Encabezado — Curso regular

| Campo | Descripción | Origen |
|-------|-------------|--------|
| Universidad Nacional de Piura | Texto fijo institucional | Constante |
| Facultad de Ingeniería Industrial | Texto fijo institucional | Constante |
| Instituto de Informática | Texto fijo institucional | Constante |
| Control de Asistencia Docente | Título del formato | Constante |
| Modalidad | "Curso regular" | `group.modality` |
| Curso | Nombre del curso | `group.courseName` |
| Horario | Días y horas de clase (ej. "Lun-Mié 08:00–10:00") | `group.schedule` _(campo nuevo)_ |
| Fecha inicio | Fecha de inicio del grupo | `group.startDate` |
| Fecha final | Fecha de fin del grupo | `group.endDate` |
| Duración total programada | Total de horas del curso (ej. "120 horas") | `group.hours` |
| Docente | Nombre completo del docente | `group.teacherName` |

### 3.2 Encabezado — Examen de suficiencia

| Campo | Descripción | Origen |
|-------|-------------|--------|
| Universidad Nacional de Piura | Texto fijo institucional | Constante |
| Facultad de Ingeniería Industrial | Texto fijo institucional | Constante |
| Instituto de Informática | Texto fijo institucional | Constante |
| Control de Asistencia Docente | Título del formato | Constante |
| Modalidad | "Examen de suficiencia" | `group.modality` |
| Curso evaluado | Nombre del curso | `group.courseName` |
| Horario | Hora de inicio del examen (ej. "10:00") | `group.schedule` _(campo nuevo)_ |
| Fecha del examen | Fecha única del examen | `group.startDate` |
| Duración | Duración prevista del examen (ej. "2 horas") | `group.hours` |
| Docente / Evaluador | Nombre del docente evaluador | `group.teacherName` |

---

## 4. Campos de la tabla de asistencia docente

Los campos son idénticos para ambas modalidades:

| # | Campo | Tipo | Obligatorio | Reglas |
|---|-------|------|-------------|--------|
| 1 | **Fecha** | Date | ✅ Sí | Debe estar dentro del rango del grupo; no duplicada |
| 2 | **Hora entrada** | Time (HH:MM) | ✅ Sí | — |
| 3 | **Hora salida** | Time (HH:MM) | ✅ Sí | Debe ser mayor que hora entrada |
| 4 | **Total horas** | Número decimal | Calculado | Calculado automáticamente: `(salida - entrada)` en horas |
| 5 | **Enlace Meet** | URL (texto) | ❌ Opcional | Si se ingresa, debe tener formato válido de URL |
| 6 | **Observación** | Texto libre | ❌ Opcional | Máx. 255 caracteres |
| 7 | **Acciones** | Botones | — | Editar, Eliminar (solo si sesión no está validada) |

> **Cálculo automático de Total horas:**  
> `totalHours = (horaSalida - horaEntrada)` expresado en horas decimales.  
> Ejemplo: entrada 08:00, salida 10:30 → Total = 2.5 horas.

---

## 5. Vista del docente

### Pantalla principal del docente
- Al ingresar al módulo, el docente ve **solo sus grupos asignados** (filtrado por `teacherId`).
- Selecciona un grupo/instancia de una lista desplegable.
- El encabezado del formato se autocompleta con los datos del grupo seleccionado.

### Acciones disponibles para el docente

| Acción | Descripción |
|--------|-------------|
| **Agregar sesión** | Abre formulario inline o modal para ingresar fecha, hora entrada/salida, enlace Meet y observación |
| **Editar sesión** | Solo disponible si la planilla está en estado **Borrador** |
| **Eliminar sesión** | Solo disponible si fue registrada por error y la planilla está en **Borrador** |
| **Calcular total** | El sistema suma automáticamente todas las horas de las sesiones |
| **Guardar borrador** | Guarda la planilla en estado **Borrador** (puede seguir editando) |
| **Enviar planilla** | Cambia estado a **Enviado** y bloquea la edición (solo admin puede desbloquear) |

### Indicadores visibles al docente
- **Horas dictadas acumuladas** vs. **Horas programadas totales**.
- Estado actual de la planilla (Borrador / Enviado / Validado / Observado / Cerrado).
- Advertencia si la sesión a agregar supera el total de horas del curso.

---

## 6. Vista del administrador

### Pantalla principal del administrador
- No registra sesiones directamente.
- Ve un **listado de planillas** registradas por todos los docentes.
- Puede filtrar por:
  - Docente
  - Curso
  - Modalidad (Curso regular / Examen de suficiencia)
  - Fecha (rango)
  - Estado (Borrador / Enviado / Validado / Observado / Cerrado)

### Acciones disponibles para el administrador

| Acción | Descripción |
|--------|-------------|
| **Ver detalle** | Abre la planilla completa con encabezado y tabla de sesiones |
| **Validar** | Cambia estado a **Validado** — confirma que el docente efectivamente dictó |
| **Observar** | Cambia estado a **Observado** — devuelve al docente con comentario |
| **Imprimir** | Genera vista de impresión del formato con encabezado institucional |
| **Exportar** | Exporta la planilla a PDF o CSV |
| **Cerrar** | Cambia estado a **Cerrado** — planilla archivada, ya no editable |
| **Desbloquear** | Permite al docente volver a editar (solo desde estado Observado) |

### Dashboard de horas dictadas (vista administrador)
- Total de horas dictadas por docente en el período.
- Porcentaje de avance por grupo (horas dictadas vs. horas programadas).
- Planillas pendientes de validar.

---

## 7. Reglas de validación

### Validaciones de sesión

| Regla | Mensaje de error |
|-------|-----------------|
| Curso o examen obligatorio | "Seleccione un curso o examen" |
| Docente obligatorio | "El docente es obligatorio" |
| Fecha obligatoria | "La fecha es obligatoria" |
| Hora entrada obligatoria | "La hora de entrada es obligatoria" |
| Hora salida obligatoria | "La hora de salida es obligatoria" |
| Hora salida > Hora entrada | "La hora de salida debe ser mayor que la hora de entrada" |
| No sesiones duplicadas (misma fecha + hora solapada) | "Ya existe una sesión registrada en esa fecha y horario" |
| URL Meet válida (si se ingresa) | "El enlace Meet debe tener formato de URL válida (https://...)" |
| Total horas calculado automáticamente | _(no editable manualmente)_ |

### Validaciones de planilla

| Regla | Descripción |
|-------|-------------|
| Planilla Validada o Cerrada no editable por docente | Solo el administrador puede modificarla |
| Planilla en estado Borrador editable por docente | Puede agregar, editar y eliminar sesiones |
| Al enviar, estado cambia a Enviado | El docente no puede retroceder por sí solo |
| Solo admin puede cambiar estado de Enviado en adelante | Validar, Observar, Cerrar |
| Al observar, docente puede editar y volver a enviar | Admin desbloquea → Borrador → Enviado nuevamente |

---

## 8. Datos mock necesarios en `data.js`

### 8.1 Campo nuevo en `groups[]`

Agregar el campo `schedule` a cada grupo existente:

```js
// Dentro de cada objeto en mockData.groups[]
schedule: 'Lun-Mié 08:00–10:00',  // Horario de clases
```

### 8.2 Nueva colección `teacherAttendance[]`

```js
teacherAttendance: [
    {
        id: 'TAT001',
        groupId: 'GRP001',             // Referencia al grupo
        teacherId: 'TCH001',           // Referencia al docente
        status: 'enviado',             // borrador | enviado | validado | observado | cerrado
        adminObservation: '',          // Observación del administrador al rechazar
        sessions: [
            {
                id: 'SES001',
                date: '2024-01-22',
                entryTime: '08:00',
                exitTime: '10:00',
                totalHours: 2.0,
                meetLink: 'https://meet.google.com/abc-xyz-123',
                observation: ''
            },
            {
                id: 'SES002',
                date: '2024-01-24',
                entryTime: '08:00',
                exitTime: '10:00',
                totalHours: 2.0,
                meetLink: 'https://meet.google.com/abc-xyz-456',
                observation: 'Sesión de repaso'
            },
            {
                id: 'SES003',
                date: '2024-01-29',
                entryTime: '08:00',
                exitTime: '10:00',
                totalHours: 2.0,
                meetLink: '',
                observation: ''
            }
        ],
        totalHoursDictated: 6.0,      // Suma automática de sesiones
        createdAt: '2024-01-22',
        updatedAt: '2024-02-01'
    },
    {
        id: 'TAT002',
        groupId: 'GRP005',             // Examen de suficiencia CB-2024-SUF
        teacherId: 'TCH004',
        status: 'validado',
        adminObservation: '',
        sessions: [
            {
                id: 'SES004',
                date: '2024-03-20',
                entryTime: '10:00',
                exitTime: '12:00',
                totalHours: 2.0,
                meetLink: '',
                observation: 'Examen de suficiencia realizado'
            }
        ],
        totalHoursDictated: 2.0,
        createdAt: '2024-03-20',
        updatedAt: '2024-03-20'
    }
]
```

### 8.3 Nuevas funciones en `DataManager`

```js
// Dentro del objeto DataManager:

// Obtener planilla de asistencia docente por grupo
getTeacherAttendanceByGroup: function(groupId) {
    return mockData.teacherAttendance.find(ta => ta.groupId === groupId) || null;
},

// Obtener planillas por docente
getTeacherAttendanceByTeacher: function(teacherId) {
    return mockData.teacherAttendance.filter(ta => ta.teacherId === teacherId);
},

// Crear nueva planilla
createTeacherAttendance: function(groupId, teacherId) {
    const newPlanilla = {
        id: 'TAT' + String(mockData.teacherAttendance.length + 1).padStart(3, '0'),
        groupId: groupId,
        teacherId: teacherId,
        status: 'borrador',
        adminObservation: '',
        sessions: [],
        totalHoursDictated: 0,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
    };
    mockData.teacherAttendance.push(newPlanilla);
    return newPlanilla;
},

// Agregar sesión a una planilla
addSessionToAttendance: function(planillaId, sessionData) {
    const planilla = mockData.teacherAttendance.find(ta => ta.id === planillaId);
    if (!planilla || planilla.status === 'validado' || planilla.status === 'cerrado') return null;
    const newSession = {
        id: 'SES' + String(
            mockData.teacherAttendance.reduce((acc, ta) => acc + ta.sessions.length, 0) + 1
        ).padStart(3, '0'),
        ...sessionData
    };
    planilla.sessions.push(newSession);
    planilla.totalHoursDictated = planilla.sessions.reduce((sum, s) => sum + s.totalHours, 0);
    planilla.updatedAt = new Date().toISOString().split('T')[0];
    return newSession;
},

// Actualizar estado de planilla (solo admin)
updateTeacherAttendanceStatus: function(planillaId, newStatus, adminObservation = '') {
    const planilla = mockData.teacherAttendance.find(ta => ta.id === planillaId);
    if (!planilla) return null;
    planilla.status = newStatus;
    if (adminObservation) planilla.adminObservation = adminObservation;
    planilla.updatedAt = new Date().toISOString().split('T')[0];
    return planilla;
},

// Calcular total horas dictadas por docente
getTotalHoursByTeacher: function(teacherId) {
    const planillas = mockData.teacherAttendance.filter(ta => ta.teacherId === teacherId);
    return planillas.reduce((sum, ta) => sum + ta.totalHoursDictated, 0);
}
```

---

## 9. Relación con Grupos Académicos

```
Grupos Académicos
        │
        ├── modality: 'regular'    ──→ Planilla de Asistencia Docente (múltiples sesiones)
        │
        └── modality: 'exam'       ──→ Planilla de Asistencia Docente (1 sesión)
```

- Cada grupo (`group`) puede tener **una sola planilla** de asistencia docente (`teacherAttendance`).
- La planilla se crea cuando el docente accede al módulo y abre un grupo por primera vez.
- El campo `group.hours` define el **total de horas programadas** contra las cuales se comparan las horas dictadas.
- El campo `group.teacherId` determina qué docente tiene permiso para registrar en esa planilla.
- La navegación desde Grupos Académicos debe incluir un acceso directo a la planilla del docente.

**Regla de negocio:** Si un grupo no tiene docente asignado, el módulo de asistencia docente no permite crear planilla.

---

## 10. Relación con Certificados y Reportes

### 10.1 Relación con Certificados

El módulo de Certificados puede enriquecerse con los datos de la planilla docente:

- En el **certificado de aprobación de curso regular**, se puede mostrar:
  - Total de horas del curso dictadas por el docente (refuerza la validez del certificado).
  - Período real de clases (primer sesión → última sesión registrada).

- En el **certificado de examen de suficiencia**, se puede mostrar:
  - Fecha del examen (tomada de la sesión de la planilla).
  - Duración del examen (total horas de la sesión).

- **Condición:** Solo se emiten certificados de grupos cuya planilla docente esté en estado **Validado** o **Cerrado**. (Regla futura, validar con el área académica.)

### 10.2 Relación con Reportes

El módulo de Reportes debe incorporar métricas de asistencia docente:

| Métrica | Descripción |
|---------|-------------|
| Horas dictadas por docente | Suma de `totalHoursDictated` por `teacherId` |
| Horas dictadas vs. programadas | `totalHoursDictated / group.hours * 100` % de avance |
| Planillas por estado | Conteo: Borrador, Enviado, Validado, Observado, Cerrado |
| Cumplimiento por curso | Grupos con 100% de horas completadas |
| Docentes con planillas pendientes | Grupos sin planilla o con planilla en Borrador |

**Impacto en reportes existentes:**
- La tabla de "Reporte Detallado" (`reportTable`) debería agregar una columna **"Horas Dictadas"** junto a las columnas actuales.
- El dashboard de KPIs del módulo Reportes debería incluir una tarjeta de **"Horas Dictadas este período"**.

---

## Resumen de estados del módulo

```
[Borrador] ──→ [Enviado] ──→ [Validado] ──→ [Cerrado]
                   │
                   └──→ [Observado] ──→ (docente edita) ──→ [Enviado]
```

| Estado | Quién actúa | Puede editar docente | Puede editar admin |
|--------|-------------|---------------------|-------------------|
| Borrador | Docente | ✅ Sí | ✅ Sí |
| Enviado | Docente (envía) | ❌ No | ✅ Sí |
| Validado | Administrador | ❌ No | ✅ Solo observar/cerrar |
| Observado | Administrador | ✅ Sí (hasta reenviar) | ✅ Sí |
| Cerrado | Administrador | ❌ No | ❌ No |

---

*Documento creado: 2026-06-29*  
*Versión: 1.0*  
*Estado: Pendiente de implementación (Fase 5 del SAII_BACKLOG.md)*
