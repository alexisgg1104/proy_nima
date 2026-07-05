# SAII — Guía de Configuración de la Base de Datos MySQL

Esta carpeta contiene los scripts para inicializar la base de datos relacional MySQL/MariaDB del **Sistema Administrativo del Instituto de Informática (SAII)** de la Universidad Nacional de Piura.

---

## 1. Archivos en esta Carpeta

* `schema.sql` — Script DDL que crea la base de datos `saii_db`, define las 17 tablas con sus respectivos campos, llaves primarias, foráneas, índices de unicidad y marcas de tiempo.
* `seeds.sql` — Script DML que inserta los registros iniciales equivalentes a los datos simulados en `public/js/data.js` para realizar pruebas de login, matrícula, calificaciones, certificados, etc.
* `reset.sql` — Script de conveniencia para desarrolladores que elimina la base de datos anterior y realiza todo el proceso de carga de estructura y semillas de forma automática.

---

## 2. Configuración e Importación en XAMPP (phpMyAdmin)

### Paso 1: Crear la Base de Datos
1. Inicie su Panel de Control de XAMPP y active los servicios de **Apache** y **MySQL**.
2. Abra su navegador e ingrese a **phpMyAdmin**: `http://localhost/phpmyadmin/`
3. En la barra lateral izquierda, haga clic en **Nueva**.
4. Configure la base de datos:
   * **Nombre de la base de datos:** `saii_db`
   * **Cotejamiento:** `utf8mb4_unicode_ci`
5. Haga clic en **Crear**.

### Paso 2: Importar la Estructura de Tablas (Schema)
1. Seleccione la base de datos `saii_db` en la barra lateral.
2. Haga clic en la pestaña **Importar** en el menú superior.
3. Presione "Seleccionar archivo" y cargue el archivo `database/schema.sql`.
4. Deje las configuraciones por defecto y haga clic en el botón **Importar** (o Continuar) al final de la página.

### Paso 3: Importar los Datos Iniciales (Seeds)
1. Con la base de datos `saii_db` aún seleccionada, vuelva a hacer clic en la pestaña **Importar**.
2. Presione "Seleccionar archivo" y cargue el archivo `database/seeds.sql`.
3. Haga clic en el botón **Importar** al final de la página.

---

## 3. Inicialización Rápida vía Terminal (Alternativa)

Si prefiere utilizar la consola de comandos de MySQL desde la terminal de XAMPP:

1. Abra su consola y acceda a la carpeta del proyecto:
   ```bash
   cd "C:\Users\manue\Downloads\saii-frontend-development (2)\database"
   ```
2. Ejecute el script de reinicio con sus credenciales de MySQL (por defecto usuario `root` sin contraseña en XAMPP):
   ```bash
   mysql -u root < reset.sql
   ```

---

## 4. Verificación de la Base de Datos

### 4.1 Comprobar Estructura de Tablas
Tras la importación, en la barra lateral de phpMyAdmin bajo `saii_db` deben figurar exactamente **17 tablas**:
1. `roles` (Roles del sistema)
2. `users` (Usuarios y contraseñas hash)
3. `students` (Estudiantes)
4. `teachers` (Docentes)
5. `courses` (Cursos)
6. `course_modules` (Módulos de cada curso)
7. `academic_groups` (Grupos académicos)
8. `enrollments` (Matrículas)
9. `student_attendance_lists` (Asistencia cabeceras)
10. `student_attendance_records` (Asistencia detalles)
11. `grade_sheets` (Actas de notas cabeceras)
12. `grade_records` (Calificaciones detalladas)
13. `certificates` (Diplomas y constancias)
14. `certificate_signatures` (Firmas de actas/certificados)
15. `settings` (Configuración del sistema)
16. `saved_reports` (Plantillas de reportes guardados)
17. `audit_logs` (Histórico de transacciones de auditoría)

### 4.2 Comprobar Datos Semilla
Puede hacer clic en la tabla `users` o `students` y dirigirse a la pestaña **Examinar** para confirmar que la información del prototipo frontend ya se encuentra persistida en las filas de las tablas.

---

## 5. Credenciales Iniciales para Pruebas de Login

Las contraseñas de los usuarios de prueba se almacenan encriptadas con `Bcrypt` en el campo `password`. Utilice las siguientes combinaciones de credenciales durante la etapa de integración del backend:

| Usuario | Contraseña | Rol en el Sistema | Nombre Completo |
|---|---|---|---|
| `admin` | `admin123` | Administrador | DR. JONATHAN DAVID NIMA RAMOS |
| `secretaria` | `secretaria123` | Secretaria Académica | Juan María Secretaria |
| `roberto.silva` | `docente123` | Docente | Roberto Silva |
| `coordinador` | `coordinador123` | Coordinador Académico | Carlos Coordinador Académico |
| `decano` | `decano123` | Decano | Dr. Francisco Javier Cruz Vilchez |

---

## 6. Solución de Problemas Comunes

### Error: `Cannot add or update a child row: a foreign key constraint fails`
* **Causa:** Este error ocurre si intenta importar `seeds.sql` antes de `schema.sql`, o si intenta insertar un registro con una llave foránea (`FK`) cuyo identificador no existe en la tabla de referencia (ej: insertar un grupo con `teacher_id = 99` cuando el ID de docente más alto es `5`).
* **Solución:**
  1. Utilice el script `database/reset.sql` para borrar la base de datos y recrear la estructura en el orden correcto.
  2. Si está agregando datos manuales, verifique que los registros padres existan en sus respectivas tablas antes de crear filas hijas.
