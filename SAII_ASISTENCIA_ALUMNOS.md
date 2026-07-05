# SAII_ASISTENCIA_ALUMNOS.md — Módulo de Control de Asistencia de Alumnos

## Proyecto

**SAII** — Sistema Administrativo del Instituto de Informática  
**Universidad Nacional de Piura — Facultad de Ingeniería Industrial**

---

## Uso obligatorio de este documento por agentes

Este documento es la fuente de verdad para la **Fase 5: Control de Asistencia de Alumnos**.

Cuando el usuario diga:

```text
Haz la Fase 5
```

el agente debe leer este archivo completo y aplicar su contenido sin pedir una nueva explicación.

Reglas clave:

- Este módulo **sí es asistencia de alumnos**.
- La asistencia la registra el **docente**.
- El docente solo registra asistencia de los grupos que tiene asignados.
- La tabla de asistencia se genera a partir de los alumnos matriculados en el grupo.
- No registrar horas dictadas del docente en esta fase.
- No implementar backend real en esta fase; usar datos mock en `public/js/data.js`.
- No tocar Registro de Notas ni Certificados durante Fase 5, salvo preparar relaciones futuras sin romper nada.

---

## Nomenclatura técnica canónica

Para evitar que el agente cree estructuras duplicadas, usar esta nomenclatura en `public/js/data.js`:

| Elemento | Nombre recomendado |
|---|---|
| Colección principal de listas de asistencia | `studentAttendance[]` |
| Registros por alumno dentro de una lista | `records[]` |
| ID de lista de asistencia | `ATT001`, `ATT002`, etc. |
| Grupo académico | `groupId` |
| Docente responsable | `teacherId` |
| Fecha de asistencia | `date` |
| Estado de lista | `status` |
| Observación administrativa | `adminObservation` |
| Alumno dentro del registro | `studentId` |
| Estado por alumno | `attendanceStatus` |
| Observación por alumno | `observation` |
| Hora de llegada opcional | `arrivalTime` |

Estados internos recomendados para la lista:

```js
'borrador' | 'registrada' | 'observada' | 'cerrada'
```

Estados visibles en interfaz:

```text
Borrador | Registrada | Observada | Cerrada
```

Estados internos por alumno:

```js
'presente' | 'tarde' | 'falta' | 'justificado'
```

Estados visibles por alumno:

```text
Presente | Tarde | Falta | Justificado
```

> [!IMPORTANT]
> No crear estructuras paralelas como `asistenciasAlumnos`, `attendanceStudents` o `studentAttendanceSessions` si ya existe `studentAttendance[]`. Usar una sola estructura canónica.

---

## 1. Objetivo del módulo

Digitalizar el control de asistencia de los alumnos matriculados en cursos regulares o exámenes de suficiencia del Instituto de Informática.

El módulo permite que el docente registre digitalmente:

- La asistencia de alumnos por grupo.
- La asistencia por fecha o sesión.
- El estado de cada alumno: Presente, Tarde, Falta o Justificado.
- Observaciones por alumno.
- Resumen de presentes, tardanzas, faltas y justificados.

El administrador puede consultar, observar, cerrar, imprimir o exportar las asistencias registradas por los docentes.

---

## 2. Diferencia entre Curso regular y Examen de suficiencia

| Aspecto | Curso regular | Examen de suficiencia |
|---|---|---|
| **Frecuencia** | Varias sesiones durante el período | Una sesión principal, el día del examen |
| **Lista de asistencia** | Una lista por fecha de clase | Una lista para la fecha del examen |
| **Docente** | Docente/instructor del grupo | Docente evaluador |
| **Alumnos** | Alumnos matriculados en el grupo regular | Alumnos inscritos para el examen |
| **Fecha** | Puede repetirse en varias fechas distintas | Generalmente una única fecha |
| **Uso futuro** | Cálculo de porcentaje de asistencia | Confirmación de asistencia al examen |

---

## 3. Campos del encabezado

### 3.1 Encabezado — Curso regular

| Campo | Descripción | Origen |
|---|---|---|
| Universidad Nacional de Piura | Texto fijo institucional | Constante |
| Facultad de Ingeniería Industrial | Texto fijo institucional | Constante |
| Instituto de Informática | Texto fijo institucional | Constante |
| Control de Asistencia de Alumnos | Título del formato | Constante |
| Modalidad | Curso regular | `group.modality` |
| Grupo | Código o nombre del grupo | `group.code` / `group.name` |
| Curso | Nombre del curso | `group.courseName` |
| Docente | Nombre completo del docente | `group.teacherName` |
| Horario | Días y horas de clase | `group.schedule` |
| Aula o laboratorio | Lugar asignado | `group.classroom` / `group.room` |
| Fecha de inicio | Inicio del grupo | `group.startDate` |
| Fecha final | Fin del grupo | `group.endDate` |
| Fecha de asistencia | Fecha de la lista | `studentAttendance.date` |
| Estado de lista | Estado actual | `studentAttendance.status` |

### 3.2 Encabezado — Examen de suficiencia

| Campo | Descripción | Origen |
|---|---|---|
| Universidad Nacional de Piura | Texto fijo institucional | Constante |
| Facultad de Ingeniería Industrial | Texto fijo institucional | Constante |
| Instituto de Informática | Texto fijo institucional | Constante |
| Control de Asistencia de Alumnos | Título del formato | Constante |
| Modalidad | Examen de suficiencia | `group.modality` |
| Curso evaluado | Nombre del curso | `group.courseName` |
| Docente / Evaluador | Nombre del docente evaluador | `group.teacherName` |
| Fecha del examen | Fecha única del examen | `group.startDate` o `studentAttendance.date` |
| Hora | Hora del examen | `group.schedule` |
| Aula o laboratorio | Lugar asignado | `group.classroom` / `group.room` |
| Estado de lista | Estado actual | `studentAttendance.status` |

---

## 4. Campos de la tabla de asistencia de alumnos

| # | Campo | Tipo | Obligatorio | Reglas |
|---|---|---|---|---|
| 1 | Código | Texto | Sí | Viene del alumno |
| 2 | Alumno | Texto | Sí | Nombre completo del alumno |
| 3 | DNI | Texto | Sí | Viene del alumno |
| 4 | Estado de asistencia | Select / botones | Sí | Presente, Tarde, Falta, Justificado |
| 5 | Hora de llegada | Time | Opcional | Recomendado si el estado es Tarde |
| 6 | Observación | Texto | Opcional | Máx. 255 caracteres |
| 7 | Acciones | Iconos | Según estado | Ver, editar observación, limpiar |

---

## 5. Vista del docente

### Pantalla principal del docente

- La pantalla debe llamarse **Control de Asistencia de Alumnos**.
- El docente ve solo sus grupos asignados.
- Debe seleccionar un grupo.
- Luego debe seleccionar o crear la fecha de asistencia.
- El encabezado se autocompleta con datos del grupo.
- La tabla carga automáticamente los alumnos matriculados en ese grupo.

### Acciones disponibles para el docente

| Acción | Descripción |
|---|---|
| Seleccionar grupo | Muestra solo grupos asignados al docente |
| Crear asistencia por fecha | Crea una lista para una fecha válida |
| Marcar todos presentes | Cambia todos los alumnos a Presente |
| Marcar asistencia individual | Permite Presente, Tarde, Falta o Justificado por alumno |
| Agregar observación | Guarda comentario por alumno |
| Guardar borrador | Guarda sin cerrar la lista |
| Registrar asistencia | Cambia estado a Registrada |
| Editar asistencia | Solo si está en Borrador u Observada |
| Imprimir lista | Simulación de impresión |
| Exportar | Simulación PDF/CSV |

### Indicadores visibles al docente

- Total de alumnos matriculados.
- Presentes.
- Tardanzas.
- Faltas.
- Justificados.
- Porcentaje de asistencia del día.
- Estado de la lista.
- Advertencia si hay alumnos sin marcar.

---

## 6. Vista del administrador

### Pantalla principal del administrador

- La pantalla debe llamarse **Asistencias de Alumnos Registradas**.
- No debe mostrar como pantalla principal la tabla editable del docente.
- Debe mostrar un listado general de asistencias.

### Filtros del administrador

- Docente.
- Curso.
- Grupo.
- Modalidad.
- Fecha.
- Estado.

### Tabla del administrador

| Columna | Descripción |
|---|---|
| Fecha | Fecha de asistencia |
| Grupo | Código/nombre del grupo |
| Curso | Nombre del curso |
| Docente | Docente responsable |
| Modalidad | Curso regular o examen de suficiencia |
| Matriculados | Total de alumnos |
| Presentes | Conteo de presentes |
| Tardes | Conteo de tardanzas |
| Faltas | Conteo de faltas |
| Justificados | Conteo de justificados |
| Estado | Borrador, Registrada, Observada o Cerrada |
| Acciones | Ver detalle, observar, cerrar, imprimir, exportar |

### Acciones del administrador

| Acción | Descripción |
|---|---|
| Ver detalle | Abre modal con encabezado y tabla de alumnos |
| Observar | Devuelve la asistencia con comentario administrativo |
| Reabrir | Permite que el docente corrija una lista observada o cerrada, si aplica |
| Cerrar | Bloquea la lista como final |
| Imprimir | Genera vista de impresión simulada |
| Exportar | Exporta PDF/CSV simulado |

---

## 7. Vista Secretaria / Coordinador

- Puede consultar listas de asistencia según permisos.
- Puede filtrar por grupo, curso, docente, fecha y estado.
- Puede ver detalle.
- Puede imprimir o exportar si se permite.
- No registra asistencia como docente.
- No modifica estados salvo permiso administrativo explícito.

---

## 8. Reglas de validación

### Validaciones de lista

| Regla | Mensaje sugerido |
|---|---|
| Grupo obligatorio | Seleccione un grupo |
| Fecha obligatoria | Seleccione la fecha de asistencia |
| Fecha dentro del rango del grupo | La fecha debe pertenecer al período del grupo |
| No duplicar lista por grupo y fecha | Ya existe asistencia registrada para este grupo en esa fecha |
| Deben existir alumnos matriculados | No hay alumnos matriculados en este grupo |
| No cerrar si hay alumnos sin marcar | Complete la asistencia de todos los alumnos |
| Lista cerrada no editable por docente | La asistencia cerrada no puede editarse |

### Validaciones por alumno

| Regla | Mensaje sugerido |
|---|---|
| Estado obligatorio | Seleccione estado de asistencia |
| Si estado es Justificado, observación recomendada | Agregue observación o sustento de justificación |
| Si estado es Tarde, hora de llegada opcional recomendada | Puede registrar la hora de llegada |
| Observación máximo 255 caracteres | La observación no debe superar 255 caracteres |

---

## 9. Estados de la lista de asistencia

```text
[Borrador] ──→ [Registrada] ──→ [Cerrada]
      ▲              │
      └── [Observada]◄┘
```

| Estado | Quién actúa | Puede editar docente | Puede editar admin |
|---|---|---|---|
| Borrador | Docente | Sí | Sí |
| Registrada | Docente | No, salvo reabrir/observar | Sí |
| Observada | Administrador | Sí, hasta volver a registrar | Sí |
| Cerrada | Administrador | No | No, salvo reabrir explícitamente |

---

## 10. Datos mock necesarios en `data.js`

### 10.1 Colección `studentAttendance[]`

```js
studentAttendance: [
    {
        id: 'ATT001',
        groupId: 'GRP001',
        teacherId: 'TCH001',
        date: '2024-01-22',
        status: 'registrada', // borrador | registrada | observada | cerrada
        adminObservation: '',
        records: [
            {
                studentId: 'STU001',
                attendanceStatus: 'presente', // presente | tarde | falta | justificado
                arrivalTime: '',
                observation: ''
            },
            {
                studentId: 'STU002',
                attendanceStatus: 'tarde',
                arrivalTime: '08:15',
                observation: 'Llegó 15 minutos tarde'
            },
            {
                studentId: 'STU003',
                attendanceStatus: 'justificado',
                arrivalTime: '',
                observation: 'Justificación presentada'
            }
        ],
        createdAt: '2024-01-22',
        updatedAt: '2024-01-22'
    }
]
```

### 10.2 Datos de grupo necesarios

Cada grupo debe tener, idealmente:

```js
{
    id: 'GRP001',
    code: 'CB-2024-I-A',
    courseId: 'CUR001',
    courseName: 'Computación Básica',
    modality: 'regular', // regular | exam
    teacherId: 'TCH001',
    teacherName: 'Nombre del Docente',
    startDate: '2024-01-15',
    endDate: '2024-03-30',
    schedule: 'Lun-Mié 08:00–10:00',
    classroom: 'Laboratorio 1',
    maxCapacity: 30,
    status: 'en_curso'
}
```

### 10.3 Relación con matrículas

La asistencia debe tomar los alumnos desde la matrícula del grupo. Si existe una colección de matrículas, usarla como fuente:

```js
enrollments[] // o la estructura equivalente ya existente
```

Regla:

```text
Solo alumnos matriculados en el grupo seleccionado aparecen en la lista de asistencia.
```

---

## 11. Funciones sugeridas en `DataManager`

```js
// Obtener asistencias por grupo
getStudentAttendanceByGroup: function(groupId) {
    return mockData.studentAttendance.filter(att => att.groupId === groupId);
},

// Obtener asistencia por grupo y fecha
getStudentAttendanceByGroupAndDate: function(groupId, date) {
    return mockData.studentAttendance.find(att => att.groupId === groupId && att.date === date) || null;
},

// Obtener asistencias por docente
getStudentAttendanceByTeacher: function(teacherId) {
    return mockData.studentAttendance.filter(att => att.teacherId === teacherId);
},

// Crear lista de asistencia
createStudentAttendance: function(groupId, teacherId, date) {
    const existing = this.getStudentAttendanceByGroupAndDate(groupId, date);
    if (existing) return existing;

    const students = this.getEnrolledStudentsByGroup
        ? this.getEnrolledStudentsByGroup(groupId)
        : [];

    const newAttendance = {
        id: 'ATT' + String(mockData.studentAttendance.length + 1).padStart(3, '0'),
        groupId,
        teacherId,
        date,
        status: 'borrador',
        adminObservation: '',
        records: students.map(student => ({
            studentId: student.id,
            attendanceStatus: '',
            arrivalTime: '',
            observation: ''
        })),
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
    };

    mockData.studentAttendance.push(newAttendance);
    return newAttendance;
},

// Actualizar estado de alumno dentro de una lista
updateStudentAttendanceRecord: function(attendanceId, studentId, data) {
    const attendance = mockData.studentAttendance.find(att => att.id === attendanceId);
    if (!attendance || attendance.status === 'cerrada') return null;

    const record = attendance.records.find(r => r.studentId === studentId);
    if (!record) return null;

    Object.assign(record, data);
    attendance.updatedAt = new Date().toISOString().split('T')[0];
    return record;
},

// Actualizar estado general de lista
updateStudentAttendanceStatus: function(attendanceId, newStatus, adminObservation = '') {
    const attendance = mockData.studentAttendance.find(att => att.id === attendanceId);
    if (!attendance) return null;

    attendance.status = newStatus;
    if (adminObservation) attendance.adminObservation = adminObservation;
    attendance.updatedAt = new Date().toISOString().split('T')[0];
    return attendance;
},

// Resumen de una lista
getStudentAttendanceSummary: function(attendanceId) {
    const attendance = mockData.studentAttendance.find(att => att.id === attendanceId);
    if (!attendance) return null;

    const summary = {
        total: attendance.records.length,
        presente: 0,
        tarde: 0,
        falta: 0,
        justificado: 0
    };

    attendance.records.forEach(record => {
        if (summary[record.attendanceStatus] !== undefined) {
            summary[record.attendanceStatus] += 1;
        }
    });

    summary.asistenciaEfectiva = summary.presente + summary.tarde + summary.justificado;
    summary.porcentaje = summary.total > 0
        ? Math.round((summary.asistenciaEfectiva / summary.total) * 100)
        : 0;

    return summary;
}
```

---

## 12. Relación con Grupos Académicos y Matrículas

```text
Grupos Académicos
        │
        ├── Matrículas
        │       └── Alumnos matriculados
        │
        └── Asistencia de Alumnos
                └── Lista por fecha con registros por alumno
```

Reglas:

- Cada grupo puede tener muchas listas de asistencia, una por fecha.
- No debe existir más de una lista para el mismo grupo y la misma fecha.
- La lista debe generarse con los alumnos matriculados en el grupo.
- Si se retira un alumno, debe revisarse cómo se muestra en asistencias históricas.
- Si un grupo no tiene alumnos matriculados, no debe permitir registrar asistencia.
- Si un grupo no tiene docente asignado, no debe aparecer al docente para registrar asistencia.

---

## 13. Relación futura con Certificados y Reportes

### Certificados

En una fase posterior, los certificados pueden validar asistencia mínima de alumnos:

- Porcentaje de asistencia del alumno.
- Asistencia mínima configurada, por ejemplo 70%.
- Estado apto/no apto para certificado.

Condición futura sugerida:

```text
Solo emitir certificado si el alumno tiene nota aprobatoria y cumple asistencia mínima, si la configuración lo exige.
```

### Reportes

El módulo de Reportes debe poder incorporar:

| Métrica | Descripción |
|---|---|
| Asistencia por alumno | Porcentaje acumulado del alumno en un grupo |
| Asistencia por grupo | Promedio de asistencia del grupo |
| Faltas por alumno | Total de faltas acumuladas |
| Tardanzas por alumno | Total de tardanzas acumuladas |
| Justificaciones | Total de asistencias justificadas |
| Sesiones registradas | Total de fechas con asistencia registrada |

---

## 14. Reglas de diseño

- Mantener estética institucional.
- Usar cards limpias para resumen de grupo y fecha.
- Usar tabla con `overflow-x: auto`.
- Usar badges de color para Presente, Tarde, Falta y Justificado.
- Usar iconos compactos para acciones.
- Mostrar toasts de éxito, error o advertencia.
- Evitar saturar la pantalla.
- Mantener responsive.

---

## 15. Pruebas manuales obligatorias

### Como Docente

1. Iniciar sesión con rol Docente.
2. Entrar a Asistencia.
3. Ver solo grupos asignados.
4. Seleccionar un grupo.
5. Crear asistencia para una fecha válida.
6. Ver alumnos matriculados.
7. Marcar todos presentes.
8. Cambiar algunos alumnos a Tarde, Falta y Justificado.
9. Agregar observación.
10. Guardar borrador.
11. Registrar asistencia.
12. Confirmar que ya no se edita si el estado lo bloquea.
13. Revisar consola del navegador.

### Como Administrador

1. Iniciar sesión con rol Administrador.
2. Entrar a Asistencia.
3. Ver asistencias registradas por docentes.
4. Filtrar por docente, grupo, curso, fecha y estado.
5. Abrir detalle.
6. Observar una asistencia.
7. Cerrar una asistencia.
8. Probar impresión/exportación simulada.
9. Revisar consola del navegador.

---

## 16. Resultado esperado de Fase 5

Al terminar la Fase 5 debe existir un módulo funcional de asistencia de alumnos donde:

- El docente registra asistencia de sus alumnos.
- La tabla se genera desde matrículas.
- Los estados de asistencia funcionan.
- Se calculan totales y porcentaje.
- El administrador puede consultar y gestionar listas.
- El diseño se mantiene institucional y responsive.
- No se rompe matrícula, notas, certificados ni configuración.
- El agente actualiza `SAII_BACKLOG.md` con el resumen de la fase.

---

*Documento creado/corregido: 2026-07-01*  
*Versión: 2.0*  
*Estado: Fuente vigente para la Fase 5 del SAII_BACKLOG.md*
