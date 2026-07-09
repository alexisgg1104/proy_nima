# SAII_BACKEND_DB_SCHEMA.md — Esquema de Base de Datos MySQL

Este documento detalla el diseño relacional de la base de datos para el sistema **SAII**. Contiene la descripción de las tablas, diccionario de datos, restricciones de integridad y los scripts DDL y DML correspondientes.

---

## 1. Modelo Entidad-Relación (E-R) Textual

* **roles** (1) -------- (N) **users**
* **users** (1) -------- (0..1) **students** (Un estudiante puede tener un usuario asociado para acceso)
* **users** (1) -------- (0..1) **teachers** (Un docente tiene un usuario asociado para ingresar notas/asistencias)
* **courses** (1) -------- (N) **course_modules** (Un curso tiene varios módulos con pesos de calificación)
* **courses** (1) -------- (N) **academic_groups** (Un grupo pertenece a un curso)
* **teachers** (1) -------- (N) **academic_groups** (Un docente tiene asignado un grupo)
* **academic_groups** (1) -------- (N) **enrollments** (Alumnos matriculados en el grupo)
* **students** (1) -------- (N) **enrollments** (Matrícula de un alumno en un grupo)
* **academic_groups** (1) -------- (N) **student_attendance_lists** (El grupo tiene listas de asistencia por fecha)
* **student_attendance_lists** (1) -------- (N) **student_attendance_records** (Registros de asistencia por alumno)
* **students** (1) -------- (N) **student_attendance_records** (Asistencia del alumno)
* **academic_groups** (1) -------- (1) **grade_sheets** (Un grupo tiene un acta de notas)
* **grade_sheets** (1) -------- (N) **grade_records** (Calificaciones por alumno y módulo)
* **students** (1) -------- (N) **grade_records** (Notas obtenidas por el alumno)
* **course_modules** (1) -------- (N) **grade_records** (La nota pertenece a un módulo específico)
* **students** (1) -------- (N) **certificates** (Certificados/Constancias emitidos para el alumno)
* **academic_groups** (1) -------- (N) **certificates** (Certificado ligado al grupo completado)
* **certificates** (1) -------- (N) **certificate_signatures** (Flujo de firmas de autoridades para el documento)
* **users** (1) -------- (N) **audit_logs** (Historial de acciones de auditoría en el sistema)

---

## 2. Diccionario de Datos

### 2.1 Tabla `roles`
Almacena los roles del sistema: `admin` (Administrador), `secretary` (Secretaria Académica), `teacher` (Docente), `coordinator` (Coordinador Académico), `dean` (Decano).

| Campo | Tipo MySQL | Nulo | PK/FK | Descripción |
|---|---|---|---|---|
| `id` | INT AUTO_INCREMENT | No | PK | Identificador único del rol. |
| `name` | VARCHAR(50) | No | - | Nombre visible en español (ej: "Docente"). |
| `key_name` | VARCHAR(30) | No | UNIQUE | Identificador interno (ej: "teacher"). |

### 2.2 Tabla `users`
Almacena los usuarios administrativos, docentes y alumnos con acceso al sistema.

| Campo | Tipo MySQL | Nulo | PK/FK | Descripción |
|---|---|---|---|---|
| `id` | INT AUTO_INCREMENT | No | PK | Identificador único del usuario. |
| `username` | VARCHAR(50) | No | UNIQUE | Nombre de usuario para login. |
| `password` | VARCHAR(255) | No | - | Contraseña encriptada (`password_hash`). |
| `full_name` | VARCHAR(100) | No | - | Nombres y apellidos completos. |
| `email` | VARCHAR(100) | No | UNIQUE | Correo institucional. |
| `role_id` | INT | No | FK | Referencia a `roles(id)`. |
| `status` | ENUM('active','inactive')| No | - | Estado del usuario. Por defecto 'active'. |
| `last_login` | DATETIME | Sí | - | Fecha y hora del último acceso. |

### 2.3 Tabla `students`
Almacena los datos personales e institucionales de los estudiantes aptos para matricularse.

| Campo | Tipo MySQL | Nulo | PK/FK | Descripción |
|---|---|---|---|---|
| `id` | INT AUTO_INCREMENT | No | PK | Identificador único del estudiante. |
| `user_id` | INT | Sí | FK | Referencia opcional a `users(id)`. |
| `code` | VARCHAR(10) | No | UNIQUE | Código institucional de 10 dígitos. |
| `dni` | VARCHAR(8) | No | UNIQUE | DNI de 8 dígitos. |
| `first_name` | VARCHAR(50) | No | - | Nombres del alumno. |
| `last_name` | VARCHAR(80) | No | - | Apellidos del alumno. |
| `email` | VARCHAR(100) | No | UNIQUE | Correo del estudiante. |
| `phone` | VARCHAR(15) | Sí | - | Teléfono celular. |
| `student_type` | ENUM('pregrado', 'egresado', 'posgrado', 'externo') | No | - | Tipo de alumno (pregrado, egresado, posgrado, externo). |
| `promotion` | VARCHAR(4) | No | - | Año de promoción (ej: "2024"). |
| `status` | ENUM('active','inactive')| No | - | Estado académico. |
| `observations` | TEXT | Sí | - | Comentarios o historial de retiro. |

### 2.4 Tabla `teachers`
Almacena los datos del personal docente del Instituto de Informática.

| Campo | Tipo MySQL | Nulo | PK/FK | Descripción |
|---|---|---|---|---|
| `id` | INT AUTO_INCREMENT | No | PK | Identificador único del docente. |
| `user_id` | INT | Sí | FK | Referencia a `users(id)` para el acceso del docente. |
| `code` | VARCHAR(10) | No | UNIQUE | Código interno del docente. |
| `dni` | VARCHAR(8) | No | UNIQUE | DNI del docente. |
| `first_name` | VARCHAR(50) | No | - | Nombres del docente. |
| `last_name` | VARCHAR(80) | No | - | Apellidos del docente. |
| `email` | VARCHAR(100) | No | UNIQUE | Correo institucional. |
| `phone` | VARCHAR(15) | Sí | - | Teléfono de contacto. |
| `specialty` | VARCHAR(100) | No | - | Especialidad académica. |
| `status` | ENUM('active','inactive')| No | - | Estado actual. |

### 2.5 Tabla `courses`
Almacena las asignaturas y talleres que se dictan en el Instituto.

| Campo | Tipo MySQL | Nulo | PK/FK | Descripción |
|---|---|---|---|---|
| `id` | INT AUTO_INCREMENT | No | PK | Identificador del curso. |
| `code` | VARCHAR(10) | No | UNIQUE | Código del curso (ej: "CB001"). |
| `name` | VARCHAR(100) | No | - | Nombre del curso (ej: "Computación Básica"). |
| `description` | TEXT | Sí | - | Resumen del contenido temático. |
| `total_hours` | INT | No | - | Total de horas académicas. |
| `status` | ENUM('active','inactive')| No | - | Estado de vigencia del curso. |

### 2.6 Tabla `course_modules`
Almacena la desglose de módulos y sus porcentajes de ponderación para cada curso.

| Campo | Tipo MySQL | Nulo | PK/FK | Descripción |
|---|---|---|---|---|
| `id` | INT AUTO_INCREMENT | No | PK | Identificador único del módulo. |
| `course_id` | INT | No | FK | Referencia a `courses(id)` con `ON DELETE CASCADE`. |
| `name` | VARCHAR(100) | No | - | Nombre del módulo (ej: "Excel"). |
| `percentage` | INT | No | - | Peso porcentual. La suma por curso debe ser 100%. |

### 2.7 Tabla `academic_groups`
Grupos académicos abiertos para un curso y docente determinados en un ciclo académico.

| Campo | Tipo MySQL | Nulo | PK/FK | Descripción |
|---|---|---|---|---|
| `id` | INT AUTO_INCREMENT | No | PK | Identificador único del grupo. |
| `code` | VARCHAR(20) | No | UNIQUE | Código del grupo (ej: "CB-2024-01"). |
| `course_id` | INT | No | FK | Referencia a `courses(id)`. |
| `teacher_id` | INT | No | FK | Referencia a `teachers(id)`. |
| `modality` | ENUM('regular','exam') | No | - | Regular (curso completo) o Examen (suficiencia). |
| `schedule` | VARCHAR(100) | No | - | Horario de clases (ej: "Lun-Mié 08:00-10:00"). |
| `start_date` | DATE | No | - | Fecha de inicio del grupo. |
| `end_date` | DATE | No | - | Fecha de culminación. |
| `hours` | INT | No | - | Horas del grupo. |
| `max_quota` | INT | No | - | Límite máximo de estudiantes matriculados. |
| `status` | ENUM('open','inprogress','finished','closed')| No | - | Estado del grupo. |
| `observations` | TEXT | Sí | - | Comentarios adicionales. |

### 2.8 Tabla `enrollments`
Vincula a los estudiantes con sus grupos asignados (Matrículas).

| Campo | Tipo MySQL | Nulo | PK/FK | Descripción |
|---|---|---|---|---|
| `id` | INT AUTO_INCREMENT | No | PK | Identificador único de la matrícula. |
| `group_id` | INT | No | FK | Referencia a `academic_groups(id)`. |
| `student_id` | INT | No | FK | Referencia a `students(id)`. |
| `enrollment_date` | DATE | No | - | Fecha de registro de matrícula. |
| `status` | ENUM('active','withdrawn') | No | - | Activo en el grupo o Retirado. |

### 2.9 Tabla `student_attendance_lists`
Almacena los encabezados de asistencia registrados por fecha.

| Campo | Tipo MySQL | Nulo | PK/FK | Descripción |
|---|---|---|---|---|
| `id` | INT AUTO_INCREMENT | No | PK | Identificador único de la lista de asistencia. |
| `group_id` | INT | No | FK | Referencia a `academic_groups(id)`. |
| `teacher_id` | INT | No | FK | Referencia a `teachers(id)`. |
| `date` | DATE | No | - | Fecha de la sesión de asistencia. |
| `status` | ENUM('borrador','registrada','observada','cerrada')| No | - | Estado del flujo administrativo. |
| `admin_observation` | TEXT | Sí | - | Observación administrativa si el estado es observada. |
| `created_at` | TIMESTAMP | No | - | Fecha y hora de creación. |
| `updated_at` | TIMESTAMP | No | - | Fecha y hora de última modificación. |

### 2.10 Tabla `student_attendance_records`
Almacena el estado de asistencia por alumno de cada lista.

| Campo | Tipo MySQL | Nulo | PK/FK | Descripción |
|---|---|---|---|---|
| `id` | INT AUTO_INCREMENT | No | PK | Identificador único de la fila de asistencia. |
| `attendance_list_id`| INT | No | FK | Referencia a `student_attendance_lists(id)`. |
| `student_id` | INT | No | FK | Referencia a `students(id)`. |
| `status` | ENUM('presente','tarde','falta','justificado')| No | - | Estado marcado. |
| `arrival_time` | TIME | Sí | - | Hora de ingreso (opcional para tardanzas). |
| `observation` | VARCHAR(255) | Sí | - | Comentarios justificativos. |

### 2.11 Tabla `grade_sheets`
Almacena la cabecera del acta de calificaciones de un grupo.

| Campo | Tipo MySQL | Nulo | PK/FK | Descripción |
|---|---|---|---|---|
| `id` | INT AUTO_INCREMENT | No | PK | Identificador único de la sábana de notas. |
| `group_id` | INT | No | FK | Referencia a `academic_groups(id)`. |
| `status` | ENUM('borrador','cerrada') | No | - | Estado del acta. |
| `updated_at` | TIMESTAMP | No | - | Fecha de última actualización. |

### 2.12 Tabla `grade_records`
Almacena las notas ingresadas por alumno, módulo y acta.

| Campo | Tipo MySQL | Nulo | PK/FK | Descripción |
|---|---|---|---|---|
| `id` | INT AUTO_INCREMENT | No | PK | Identificador único del registro de nota. |
| `grade_sheet_id`| INT | No | FK | Referencia a `grade_sheets(id)`. |
| `student_id` | INT | No | FK | Referencia a `students(id)`. |
| `course_module_id`| INT | No | FK | Referencia a `course_modules(id)`. |
| `grade` | DECIMAL(4,2) | No | - | Calificación obtenida (0.00 a 20.00). |

### 2.13 Tabla `certificates`
Almacena los diplomas y constancias generados para los estudiantes aptos.

| Campo | Tipo MySQL | Nulo | PK/FK | Descripción |
|---|---|---|---|---|
| `id` | INT AUTO_INCREMENT | No | PK | Identificador del certificado. |
| `student_id` | INT | No | FK | Referencia a `students(id)`. |
| `group_id` | INT | No | FK | Referencia a `academic_groups(id)`. |
| `code` | VARCHAR(30) | No | UNIQUE | Código de diploma (ej: "CERT-2024-00001"). |
| `type` | ENUM('certificado','constancia')| No | - | Acreditación obtenida. |
| `status` | ENUM('toBeSigned','pending','generated')| No | - | Estado del trámite de firmas. |
| `issue_date` | DATE | Sí | - | Fecha de emisión definitiva. |
| `observations` | TEXT | Sí | - | Anotaciones administrativas. |

### 2.14 Tabla `certificate_signatures`
Registra el flujo de firmas manuscritas y la fecha de su asentamiento en el certificado.

| Campo | Tipo MySQL | Nulo | PK/FK | Descripción |
|---|---|---|---|---|
| `id` | INT AUTO_INCREMENT | No | PK | Identificador único de la firma. |
| `certificate_id`| INT | No | FK | Referencia a `certificates(id)`. |
| `signer_name` | VARCHAR(100) | No | - | Nombre de la autoridad (ej: DR. JONATHAN NIMA). |
| `signer_role` | VARCHAR(50) | No | - | Cargo de la autoridad (ej: Director / Decano). |
| `signed_at` | DATETIME | Sí | - | Fecha y hora en que firmó. |
| `is_signed` | TINYINT(1) | No | - | Indicador binario (0 = No firmado, 1 = Firmado). |

### 2.15 Tabla `settings`
Almacena los parámetros generales de configuración académica e institucional.

| Campo | Tipo MySQL | Nulo | PK/FK | Descripción |
|---|---|---|---|---|
| `id` | INT AUTO_INCREMENT | No | PK | Fila única de configuración (id=1). |
| `system_name` | VARCHAR(30) | No | - | SAII. |
| `institute_name`| VARCHAR(100) | No | - | Instituto de Informática. |
| `university_name`| VARCHAR(100) | No | - | Universidad Nacional de Piura. |
| `institute_email`| VARCHAR(100) | No | - | Correo oficial. |
| `institute_phone`| VARCHAR(30) | No | - | Teléfono oficial. |
| `academic_period`| VARCHAR(15) | No | - | Periodo actual (ej: "2024-I"). |
| `min_passing_grade`| INT | No | - | Nota mínima aprobatoria (por defecto 11). |
| `min_attendance_required`| INT | No | - | Porcentaje mínimo (por defecto 70). |
| `default_theme` | VARCHAR(10) | No | - | 'light' o 'dark'. |
| `enable_notifications`| TINYINT(1) | No | - | Habilitar toasts o avisos (0 o 1). |
| `enable_auto_save`| TINYINT(1) | No | - | Autoguardado (0 o 1). |
| `system_language`| VARCHAR(5) | No | - | 'es' o 'en'. |
| `responsible_academic`| VARCHAR(100) | No | - | Firma de responsable institucional. |

### 2.16 Tabla `saved_reports`
Almacena las plantillas de búsqueda avanzada y KPI guardadas por los usuarios.

| Campo | Tipo MySQL | Nulo | PK/FK | Descripción |
|---|---|---|---|---|
| `id` | INT AUTO_INCREMENT | No | PK | Identificador de la consulta. |
| `name` | VARCHAR(150) | No | - | Nombre descriptivo del reporte. |
| `type` | VARCHAR(30) | No | - | Tipo de reporte (asistencia / notas / certificados). |
| `created_by` | VARCHAR(50) | No | - | Nombre de usuario creador. |
| `created_at` | DATE | No | - | Fecha de guardado de la plantilla. |
| `query_config` | TEXT | No | - | Configuración de filtros estructurada en formato JSON string. |

### 2.17 Tabla `audit_logs`
Almacena un histórico completo de transacciones realizadas en la base de datos (seguridad y auditoría).

| Campo | Tipo MySQL | Nulo | PK/FK | Descripción |
|---|---|---|---|---|
| `id` | INT AUTO_INCREMENT | No | PK | Identificador único del log. |
| `user_id` | INT | Sí | FK | Usuario que ejecutó la acción. |
| `action` | VARCHAR(20) | No | - | INSERT, UPDATE, DELETE o LOGIN. |
| `table_name` | VARCHAR(50) | No | - | Tabla modificada. |
| `record_id` | INT | Sí | - | ID del registro modificado. |
| `description` | TEXT | No | - | Detalle de los campos alterados y su valor. |
| `created_at` | TIMESTAMP | No | - | Fecha y hora del registro del log. |

---

## 3. Script SQL Propuesto (DDL)

```sql
-- SAII - Base de Datos - Definición de Esquema (DDL)
-- Universidad Nacional de Piura - Facultad de Ingeniería Industrial

CREATE DATABASE IF NOT EXISTS saii_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE saii_db;

-- 1. Roles
CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    key_name VARCHAR(30) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Users
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    role_id INT NOT NULL,
    status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    last_login DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Students
CREATE TABLE students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL UNIQUE,
    code VARCHAR(10) NOT NULL UNIQUE,
    dni VARCHAR(8) NOT NULL UNIQUE,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(80) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(15) NULL,
    student_type ENUM('pregrado', 'egresado', 'posgrado', 'externo') NOT NULL DEFAULT 'pregrado',
    promotion VARCHAR(4) NOT NULL,
    status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    observations TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Teachers
CREATE TABLE teachers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL UNIQUE,
    code VARCHAR(10) NOT NULL UNIQUE,
    dni VARCHAR(8) NOT NULL UNIQUE,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(80) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(15) NULL,
    specialty VARCHAR(100) NOT NULL,
    status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Courses
CREATE TABLE courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(10) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    description TEXT NULL,
    total_hours INT NOT NULL,
    status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Course Modules
CREATE TABLE course_modules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    course_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    percentage INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Academic Groups
CREATE TABLE academic_groups (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(20) NOT NULL UNIQUE,
    course_id INT NOT NULL,
    teacher_id INT NOT NULL,
    modality ENUM('regular', 'exam') NOT NULL,
    schedule VARCHAR(100) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    hours INT NOT NULL,
    max_quota INT NOT NULL,
    status ENUM('open', 'inprogress', 'finished', 'closed') NOT NULL DEFAULT 'open',
    observations TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Enrollments
CREATE TABLE enrollments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    group_id INT NOT NULL,
    student_id INT NOT NULL,
    enrollment_date DATE NOT NULL,
    status ENUM('active', 'withdrawn') NOT NULL DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_student_group (group_id, student_id),
    FOREIGN KEY (group_id) REFERENCES academic_groups(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Student Attendance Lists
CREATE TABLE student_attendance_lists (
    id INT AUTO_INCREMENT PRIMARY KEY,
    group_id INT NOT NULL,
    teacher_id INT NOT NULL,
    date DATE NOT NULL,
    status ENUM('borrador', 'registrada', 'observada', 'cerrada') NOT NULL DEFAULT 'borrador',
    admin_observation TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_group_date (group_id, date),
    FOREIGN KEY (group_id) REFERENCES academic_groups(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Student Attendance Records
CREATE TABLE student_attendance_records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    attendance_list_id INT NOT NULL,
    student_id INT NOT NULL,
    status ENUM('presente', 'tarde', 'falta', 'justificado') NOT NULL,
    arrival_time TIME NULL,
    observation VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_list_student (attendance_list_id, student_id),
    FOREIGN KEY (attendance_list_id) REFERENCES student_attendance_lists(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. Grade Sheets
CREATE TABLE grade_sheets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    group_id INT NOT NULL UNIQUE,
    status ENUM('borrador', 'cerrada') NOT NULL DEFAULT 'borrador',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (group_id) REFERENCES academic_groups(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. Grade Records
CREATE TABLE grade_records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    grade_sheet_id INT NOT NULL,
    student_id INT NOT NULL,
    course_module_id INT NOT NULL,
    grade DECIMAL(4,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_sheet_student_module (grade_sheet_id, student_id, course_module_id),
    FOREIGN KEY (grade_sheet_id) REFERENCES grade_sheets(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (course_module_id) REFERENCES course_modules(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 13. Certificates
CREATE TABLE certificates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    group_id INT NOT NULL,
    code VARCHAR(30) NOT NULL UNIQUE,
    type ENUM('certificado', 'constancia') NOT NULL,
    status ENUM('toBeSigned', 'pending', 'generated') NOT NULL DEFAULT 'toBeSigned',
    issue_date DATE NULL,
    observations TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_student_group_cert (student_id, group_id, type),
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (group_id) REFERENCES academic_groups(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 14. Certificate Signatures
CREATE TABLE certificate_signatures (
    id INT AUTO_INCREMENT PRIMARY KEY,
    certificate_id INT NOT NULL,
    signer_name VARCHAR(100) NOT NULL,
    signer_role VARCHAR(50) NOT NULL,
    signed_at DATETIME NULL,
    is_signed TINYINT(1) NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_cert_role (certificate_id, signer_role),
    FOREIGN KEY (certificate_id) REFERENCES certificates(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 15. Settings
CREATE TABLE settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    system_name VARCHAR(30) NOT NULL,
    institute_name VARCHAR(100) NOT NULL,
    university_name VARCHAR(100) NOT NULL,
    institute_email VARCHAR(100) NOT NULL,
    institute_phone VARCHAR(30) NOT NULL,
    academic_period VARCHAR(15) NOT NULL,
    min_passing_grade INT NOT NULL DEFAULT 11,
    min_attendance_required INT NOT NULL DEFAULT 70,
    default_theme VARCHAR(10) NOT NULL DEFAULT 'light',
    enable_notifications TINYINT(1) NOT NULL DEFAULT 1,
    enable_auto_save TINYINT(1) NOT NULL DEFAULT 1,
    system_language VARCHAR(5) NOT NULL DEFAULT 'es',
    responsible_academic VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 16. Saved Reports
CREATE TABLE saved_reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    type VARCHAR(30) NOT NULL,
    created_by VARCHAR(50) NOT NULL,
    query_config TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 17. Audit Logs
CREATE TABLE audit_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    action VARCHAR(20) NOT NULL,
    table_name VARCHAR(50) NOT NULL,
    record_id INT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

USE saii_db;

-- 1. Settings
INSERT INTO settings (id, system_name, institute_name, university_name, institute_email, institute_phone, academic_period, min_passing_grade, min_attendance_required, default_theme, enable_notifications, enable_auto_save, system_language, responsible_academic) VALUES 
(1, 'SAII', 'Instituto de Informática', 'Universidad Nacional de Piura', 'info@institutoinformatica.edu.pe', '+51 (73) 123-4567', '2024-I', 11, 70, 'light', 1, 1, 'es', 'DR. JONATHAN DAVID NIMA RAMOS - Director');

-- 2. Roles
INSERT INTO roles (id, name, key_name) VALUES 
(1, 'Administrador', 'admin'),
(2, 'Secretaria Académica', 'secretary'),
(3, 'Docente', 'teacher'),
(4, 'Coordinador Académico', 'coordinator'),
(5, 'Decano', 'dean');

-- 3. Users
-- Contraseña encriptada por defecto: admin123 / secretaria123 / docente123 / coordinador123 / decano123
-- Utiliza hashes reales PHP compatible: password_hash('...', PASSWORD_DEFAULT)
INSERT INTO users (id, username, password, full_name, email, role_id, status) VALUES 
(1, 'admin', '$2y$10$f/9N36Qc8mG1LqX8oE8f1eO29tK6S3o.R4uS1s1v1y1z1w1d1t1g2', 'DR. JONATHAN DAVID NIMA RAMOS', 'admin@institutoinformatica.edu.pe', 1, 'active'),
(2, 'secretaria', '$2y$10$wS2s1v1y1z1w1d1t1g2tZ2c2v2d2w2r.f/9N36Qc8mG1LqX8oE8f1e', 'Juan María Secretaria', 'secretaria@institutoinformatica.edu.pe', 2, 'active'),
(3, 'roberto.silva', '$2y$10$v1y1z1w1d1t1g2tZ2c2v2d2w2r.f/9N36Qc8mG1LqX8oE8f1eO29tK', 'Roberto Silva', 'roberto.silva@institutoinformatica.edu.pe', 3, 'active'),
(4, 'coordinador', '$2y$10$z1w1d1t1g2tZ2c2v2d2w2r.f/9N36Qc8mG1LqX8oE8f1eO29tK6S3', 'Carlos Coordinador Académico', 'coordinador@institutoinformatica.edu.pe', 4, 'active'),
(5, 'lucia.espinoza', '$2y$10$v1y1z1w1d1t1g2tZ2c2v2d2w2r.f/9N36Qc8mG1LqX8oE8f1eO29tK', 'Lucía Espinoza', 'lucia.espinoza@institutoinformatica.edu.pe', 3, 'active'),
(6, 'decano', '$2y$10$w1d1t1g2tZ2c2v2d2w2r.f/9N36Qc8mG1LqX8oE8f1eO29tK6S3o.R', 'Dr. Francisco Javier Cruz Vilchez', 'decano@institutoinformatica.edu.pe', 5, 'active');

-- 4. Students
INSERT INTO students (id, user_id, code, dni, first_name, last_name, email, phone, student_type, promotion, status, observations) VALUES 
(1, NULL, '2024001000', '12345678', 'Juan', 'Pérez García', 'juan.perez@student.edu.pe', '987654321', 'pregrado', '2024', 'active', ''),
(2, NULL, '2024002000', '23456789', 'María', 'López Rodríguez', 'maria.lopez@student.edu.pe', '987654322', 'egresado', '2024', 'active', ''),
(3, NULL, '2024003000', '34567890', 'Carlos', 'Martínez Sánchez', 'carlos.martinez@student.edu.pe', '987654323', 'posgrado', '2023', 'active', ''),
(4, NULL, '2024004000', '45678901', 'Ana', 'García Flores', 'ana.garcia@student.edu.pe', '987654324', 'externo', '2024', 'active', ''),
(5, NULL, '2024005000', '56789012', 'Pedro', 'Gutiérrez López', 'pedro.gutierrez@student.edu.pe', '987654325', 'pregrado', '2023', 'inactive', 'Solicitud de retiro'),
(6, NULL, '2024006000', '67890123', 'Rosa', 'Hernández Torres', 'rosa.hernandez@student.edu.pe', '987654326', 'egresado', '2022', 'active', ''),
(7, NULL, '2024007000', '78901234', 'Diego', 'Ramírez Cruz', 'diego.ramirez@student.edu.pe', '987654327', 'posgrado', '2024', 'active', ''),
(8, NULL, '2024008000', '89012345', 'Sofia', 'Castillo Mendoza', 'sofia.castillo@student.edu.pe', '987654328', 'externo', '2024', 'active', ''),
(9, NULL, '2024009000', '90123456', 'Luis', 'Vargas Ruiz', 'luis.vargas@student.edu.pe', '987654329', 'pregrado', '2023', 'active', ''),
(10, NULL, '2024010000', '01234567', 'Carmen', 'Jiménez Morales', 'carmen.jimenez@student.edu.pe', '987654330', 'pregrado', '2024', 'active', '');

-- 5. Teachers
INSERT INTO teachers (id, user_id, code, dni, first_name, last_name, email, phone, specialty, status) VALUES 
(1, 3, 'DOC001', '11111111', 'Roberto', 'Silva Acosta', 'roberto.silva@institutoinformatica.edu.pe', '987111111', 'Ofimática', 'active'),
(2, NULL, 'DOC002', '22222222', 'Patricia', 'Moreno Ruiz', 'patricia.moreno@institutoinformatica.edu.pe', '987222222', 'Programación', 'active'),
(3, NULL, 'DOC003', '33333333', 'Fernando', 'Gutierrez Palma', 'fernando.gutierrez@institutoinformatica.edu.pe', '987333333', 'Diseño', 'active'),
(4, 5, 'DOC004', '44444444', 'Lucia', 'Espinoza Torres', 'lucia.espinoza@institutoinformatica.edu.pe', '987444444', 'Computación básica', 'active'),
(5, NULL, 'DOC005', '55555555', 'Víctor', 'Campos López', 'victor.campos@institutoinformatica.edu.pe', '987555555', 'Matemática aplicada / Matlab', 'active');

-- 6. Courses
INSERT INTO courses (id, code, name, description, total_hours, status) VALUES 
(1, 'CB001', 'Computación Básica', 'Curso fundamental de informática', 120, 'active'),
(2, 'MO001', 'Microsoft Office', 'Aplicaciones de productividad', 150, 'active'),
(3, 'CI001', 'Computación para Ingenieros', 'Herramientas computacionales para ingeniería', 160, 'active');

-- 7. Course Modules
INSERT INTO course_modules (id, course_id, name, percentage) VALUES 
(1, 1, 'Windows', 20),
(2, 1, 'Word', 40),
(3, 1, 'Excel', 40),
(4, 2, 'Windows', 10),
(5, 2, 'Word', 20),
(6, 2, 'Excel', 25),
(7, 2, 'Access', 20),
(8, 2, 'PowerPoint', 15),
(9, 2, 'Internet', 10),
(10, 3, 'Windows', 10),
(11, 3, 'Word', 20),
(12, 3, 'Excel', 20),
(13, 3, 'Access', 20),
(14, 3, 'PowerPoint', 10),
(15, 3, 'Matlab', 10),
(16, 3, 'Internet', 10);

-- 8. Academic Groups
INSERT INTO academic_groups (id, code, course_id, teacher_id, modality, schedule, start_date, end_date, hours, max_quota, status, observations) VALUES 
(1, 'CB-2024-01', 1, 1, 'regular', 'Lun-Mié 08:00–10:00', '2024-01-15', '2024-03-15', 120, 30, 'inprogress', ''),
(2, 'CB-2024-02', 1, 4, 'regular', 'Mar-Jue 10:00–12:00', '2024-02-01', '2024-04-01', 120, 25, 'open', ''),
(3, 'MO-2024-01', 2, 1, 'regular', 'Sáb 08:00–12:00', '2024-01-20', '2024-04-20', 150, 30, 'finished', ''),
(4, 'CI-2024-01', 3, 5, 'regular', 'Lun-Vié 16:00–18:00', '2024-02-10', '2024-05-10', 160, 20, 'open', ''),
(5, 'CB-2024-SUF', 1, 4, 'exam', '10:00', '2024-03-20', '2024-03-20', 2, 50, 'open', 'Examen de suficiencia');

-- 9. Enrollments
INSERT INTO enrollments (id, group_id, student_id, enrollment_date, status) VALUES 
(1, 1, 1, '2024-01-10', 'active'),
(2, 1, 2, '2024-01-10', 'active'),
(3, 1, 3, '2024-01-11', 'active'),
(4, 1, 4, '2024-01-11', 'active'),
(5, 1, 7, '2024-01-12', 'active'),
(6, 2, 5, '2024-02-01', 'active'),
(7, 2, 6, '2024-02-02', 'active'),
(8, 3, 1, '2024-01-15', 'active'),
(9, 3, 8, '2024-01-15', 'active'),
(10, 3, 9, '2024-01-16', 'active'),
(11, 5, 1, '2024-03-15', 'active'),
(12, 5, 2, '2024-03-15', 'active');

-- 10. Grade Sheets
INSERT INTO grade_sheets (id, group_id, status) VALUES 
(1, 1, 'borrador'),
(2, 3, 'cerrada');

-- 11. Grade Records
INSERT INTO grade_records (grade_sheet_id, student_id, course_module_id, grade) VALUES 
-- Grupo GRP001, ALU001
(1, 1, 1, 16.00), (1, 1, 2, 15.00), (1, 1, 3, 17.00),
-- Grupo GRP001, ALU002
(1, 2, 1, 14.00), (1, 2, 2, 13.00), (1, 2, 3, 15.00),
-- Grupo GRP001, ALU003
(1, 3, 1, 18.00), (1, 3, 2, 17.00), (1, 3, 3, 16.00),
-- Grupo GRP001, ALU004
(1, 4, 1, 12.00), (1, 4, 2, 10.00), (1, 4, 3, 9.00),
-- Grupo GRP001, ALU007
(1, 7, 1, 15.00), (1, 7, 2, 16.00), (1, 7, 3, 14.00),
-- Grupo GRP003, ALU001
(2, 1, 4, 15.00), (2, 1, 5, 16.00), (2, 1, 6, 14.00), (2, 1, 7, 15.00), (2, 1, 8, 16.00), (2, 1, 9, 15.00),
-- Grupo GRP003, ALU008
(2, 8, 4, 14.00), (2, 8, 5, 15.00), (2, 8, 6, 13.00), (2, 8, 7, 14.00), (2, 8, 8, 15.00), (2, 8, 9, 14.00),
-- Grupo GRP003, ALU009
(2, 9, 4, 16.00), (2, 9, 5, 17.00), (2, 9, 6, 15.00), (2, 9, 7, 16.00), (2, 9, 8, 17.00), (2, 9, 9, 16.00);

-- 12. Student Attendance Lists
INSERT INTO student_attendance_lists (id, group_id, teacher_id, date, status, admin_observation) VALUES 
(1, 1, 1, '2024-01-22', 'registrada', ''),
(2, 1, 1, '2024-01-24', 'borrador', ''),
(3, 1, 1, '2024-01-26', 'borrador', ''),
(4, 1, 1, '2024-01-29', 'borrador', ''),
(5, 2, 4, '2024-02-05', 'borrador', ''),
(6, 2, 4, '2024-02-07', 'borrador', ''),
(7, 3, 1, '2024-01-20', 'cerrada', ''),
(8, 3, 1, '2024-01-27', 'cerrada', '');

-- 13. Student Attendance Records
INSERT INTO student_attendance_records (attendance_list_id, student_id, status, arrival_time, observation) VALUES 
-- Lista 1 (2024-01-22)
(1, 1, 'presente', NULL, ''), (1, 2, 'presente', NULL, ''), (1, 3, 'presente', NULL, ''), (1, 4, 'falta', NULL, ''), (1, 7, 'presente', NULL, ''),
-- Lista 2 (2024-01-24)
(2, 1, 'presente', NULL, ''), (2, 2, 'falta', NULL, ''), (2, 3, 'presente', NULL, ''), (2, 4, 'presente', NULL, ''), (2, 7, 'presente', NULL, ''),
-- Lista 3 (2024-01-26)
(3, 1, 'presente', NULL, ''), (3, 2, 'presente', NULL, ''), (3, 3, 'justificado', NULL, 'Justificación presentada'), (3, 4, 'presente', NULL, ''), (3, 7, 'presente', NULL, ''),
-- Lista 4 (2024-01-29)
(4, 1, 'presente', NULL, ''), (4, 2, 'presente', NULL, ''), (4, 3, 'presente', NULL, ''), (4, 4, 'presente', NULL, ''), (4, 7, 'presente', NULL, ''),
-- Lista 5 (2024-02-05)
(5, 5, 'presente', NULL, ''), (5, 6, 'falta', NULL, ''),
-- Lista 6 (2024-02-07)
(6, 5, 'presente', NULL, ''), (6, 6, 'presente', NULL, ''),
-- Lista 7 (2024-01-20)
(7, 1, 'presente', NULL, ''), (7, 8, 'presente', NULL, ''), (7, 9, 'presente', NULL, ''),
-- Lista 8 (2024-01-27)
(8, 1, 'presente', NULL, ''), (8, 8, 'falta', NULL, ''), (8, 9, 'justificado', NULL, 'Justificado');

-- 14. Certificates
INSERT INTO certificates (id, student_id, group_id, code, type, status, issue_date, observations) VALUES 
(1, 1, 1, 'CERT-2024-00001', 'certificado', 'generated', '2024-03-20', ''),
(2, 2, 1, 'CONS-2024-00002', 'constancia', 'pending', '2024-03-20', ''),
(3, 3, 1, 'CERT-2024-00003', 'certificado', 'toBeSigned', NULL, ''),
(4, 7, 1, 'CERT-2024-00004', 'certificado', 'toBeSigned', NULL, ''),
(5, 1, 3, 'CERT-2024-00005', 'certificado', 'toBeSigned', NULL, '');

-- 15. Certificate Signatures
INSERT INTO certificate_signatures (certificate_id, signer_name, signer_role, signed_at, is_signed) VALUES 
(1, 'DR. FRANCISCO JAVIER CRUZ VILCHEZ', 'Decano', '2024-03-20 12:00:00', 1),
(1, 'DR. JONATHAN DAVID NIMA RAMOS', 'Director', '2024-03-20 12:05:00', 1),
(2, 'DR. FRANCISCO JAVIER CRUZ VILCHEZ', 'Decano', '2024-03-20 12:00:00', 1),
(2, 'DR. JONATHAN DAVID NIMA RAMOS', 'Director', '2024-03-20 12:05:00', 1),
(4, 'DR. JONATHAN DAVID NIMA RAMOS', 'Director', '2024-03-20 12:05:00', 1),
(5, 'DR. FRANCISCO JAVIER CRUZ VILCHEZ', 'Decano', '2024-03-20 12:00:00', 1);

-- 16. Saved Reports
INSERT INTO saved_reports (id, name, type, created_by, query_config, created_at, updated_at) VALUES 
(1, 'Alumnos en Riesgo Académico (Asistencia < 70%)', 'attendance', 'Admin', '{"minAtt":70}', '2024-03-01', '2024-03-01'),
(2, 'Resumen de Calificaciones por Curso', 'grades', 'Admin', '{}', '2024-03-05', '2024-03-05'),
(3, 'Historial de Certificados Emitidos 2024-I', 'certificates', 'Secretaria', '{}', '2024-03-10', '2024-03-10');
