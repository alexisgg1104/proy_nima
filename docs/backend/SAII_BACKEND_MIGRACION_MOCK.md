# SAII_BACKEND_MIGRACION_MOCK.md — Guía de Migración de Datos Mock

Este documento explica el mapeo y la normalización de la estructura de datos simulada en memoria (`public/js/data.js`) hacia el esquema de base de datos relacional de MySQL en el servidor.

---

## 1. Mapeo de Colecciones de Frontend a Tablas SQL

| Colección Mock (JavaScript) | Tabla Destino (MySQL) | Tipo de Cambio | Notas |
|---|---|---|---|
| `mockData.users` | `users` | Estructural | Las contraseñas en texto plano se encriptan. Se asocia mediante `role_id` a la tabla `roles`. |
| `mockData.students` | `students` | Normalización | Se asocia con `users` si existe correspondencia. |
| `mockData.teachers` | `teachers` | Normalización | Se asocia con `users` mediante `user_id` (basado en el correo). |
| `mockData.courses` | `courses` | Dividida | Se separa la cabecera del curso de su arreglo de módulos. |
| `mockData.courses[].modules`| `course_modules` | Nueva tabla | Cada objeto del arreglo anidado de módulos se vuelve una fila en esta tabla con una FK a `courses(id)`. |
| `mockData.groups` | `academic_groups` | Normalización | Reemplaza cadenas de texto (ej. `teacherName` o `courseName`) por llaves foráneas numéricas `teacher_id` y `course_id`. |
| `mockData.enrollments` | `enrollments` | Directo | Mapea las relaciones activas de estudiantes en grupos. |
| `mockData.studentAttendanceByGroup`| `student_attendance_lists` y `student_attendance_records` | **Reestructuración Completa** | El formato matriz en JS se divide en cabeceras y detalles individuales por fecha y alumno. |
| `mockData.grades` | `grade_records` | Reestructuración | El mapa de calificaciones `{MOD001: 16}` se normaliza en registros individuales por alumno y módulo. |
| `mockData.gradeSheets` | `grade_sheets` | Directo | Control de estado de actas académicas por grupo. |
| `mockData.certificates` | `certificates` y `certificate_signatures` | Dividida | Se extrae la firma del Decano y Director a una tabla histórica de firmas. |
| `mockData.settings` | `settings` | Directo | Fila única de configuración en la tabla. |
| `mockData.savedReports` | `saved_reports` | Serialización | Se guarda el objeto `queryConfig` serializado en formato JSON string en la columna `query_config`. |

---

## 2. Normalizaciones Críticas Requeridas

### 2.1 Desacoplamiento de Usuarios y Entidades Académicas
En el frontend mock, un usuario se vincula a un docente únicamente por coincidencia de correo electrónico (`teacher.email === user.email`).
* **En Base de Datos:** Las tablas `students` y `teachers` incluyen un campo `user_id` de llave foránea opcional que apunta a `users(id)`. Al migrar o crear usuarios de docentes y alumnos, se deben poblar de forma explícita estos campos para garantizar búsquedas directas.

### 2.2 Descomposición de la Matriz de Asistencia de Alumnos
En el frontend mock, la colección `studentAttendanceByGroup` tiene este formato:
```json
{
  "id": "AST-CB-2024-01",
  "groupId": "GRP001",
  "teacherId": "TCH001",
  "days": ["2024-01-22", "2024-01-24"],
  "students": [
    {
      "studentId": "ALU001",
      "attendance": { "2024-01-22": "presente", "2024-01-24": "presente" }
    }
  ]
}
```
Este diseño anidado es altamente ineficiente y no relacional.
* **En Base de Datos:**
  1. Por cada fecha en el arreglo `days`, se crea una fila en la tabla `student_attendance_lists` (ej: id: `1`, group_id: `1`, date: `2024-01-22`).
  2. Por cada estudiante en el arreglo `students` y por cada día, se crea una fila en la tabla `student_attendance_records` que apunta a la lista correspondiente (ej: attendance_list_id: `1`, student_id: `1`, status: `presente`).

### 2.3 Normalización de Calificaciones (Grades)
En `data.js`, las calificaciones se estructuran como un mapa de módulos por alumno:
```json
{ "id": "GRD001", "groupId": "GRP001", "studentId": "ALU001", "moduleGrades": { "MOD001": 16, "MOD002": 15 } }
```
* **En Base de Datos:**
  1. Se crea la cabecera `grade_sheets` vinculada al grupo académico.
  2. Cada calificación individual se almacena en la tabla `grade_records` como un registro independiente con columnas: `grade_sheet_id`, `student_id`, `course_module_id`, y `grade`.

---

## 3. Riesgos de Consistencia en la Migración

1. **Huérfanos en Matrículas y Asistencias:** En el mock data, un alumno puede eliminarse de `students` pero seguir listado en las asistencias o actas históricas.
   * *Mitigación:* Los scripts SQL semilla deben generarse usando consultas integradas que validen que todo `student_id` pertenezca a un estudiante real y todo `group_id` a un grupo existente.
2. **Duplicidad de Calificaciones o Asistencias:** El cliente JavaScript puede registrar múltiples veces la misma fecha de asistencia si se evade el control del cliente.
   * *Mitigación:* Se agregaron restricciones de índices únicos (`UNIQUE`) compuestas a nivel de base de datos en las tablas:
     * `enrollments` (estudiante + grupo).
     * `student_attendance_lists` (grupo + fecha).
     * `student_attendance_records` (lista de asistencia + estudiante).
     * `grade_records` (acta de notas + estudiante + módulo).
3. **Pérdida de la Estructura de Módulos al Borrar un Curso:**
   * *Mitigación:* La relación de `course_modules` cuenta con la instrucción `ON DELETE CASCADE` de modo que si un administrador da de baja un curso, sus componentes asociados se remueven de forma segura para evitar registros basura.
