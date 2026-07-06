# SAII_BACKEND_API_CONTRATO.md — Contrato de la API RESTful JSON

Este documento define las especificaciones formales de los endpoints de la API en PHP que el cliente JavaScript consumirá. Todas las peticiones y respuestas utilizarán formato JSON (`Content-Type: application/json`).

---

## 1. Estructura Estándar de Respuesta API

Para facilitar el control de errores en el frontend, todas las respuestas de la API seguirán esta estructura base:

### Respuesta Exitosa (HTTP 200/201)
```json
{
  "status": "success",
  "data": { ... } // Objeto o Arreglo con la información solicitada
}
```

### Respuesta con Error (HTTP 400/401/403/404/500)
```json
{
  "status": "error",
  "message": "Descripción amigable del error para el usuario"
}
```

---

## 2. Endpoints de Autenticación y Sesión

### 2.1 Iniciar Sesión
* **Método:** `POST`
* **Ruta:** `/api/auth/login`
* **Rol Permitido:** Público (Cualquiera)
* **Cuerpo Esperado (JSON):**
  ```json
  {
    "username": "admin",
    "password": "adminpassword",
    "role": "admin"
  }
  ```
* **Respuesta Exitosa (200 OK):**
  ```json
  {
    "status": "success",
    "data": {
      "id": "USR001",
      "username": "admin",
      "fullName": "DR. JONATHAN DAVID NIMA RAMOS",
      "role": "admin",
      "email": "admin@institutoinformatica.edu.pe",
      "teacherId": null
    }
  }
  ```

### 2.2 Obtener Usuario Actual
* **Método:** `GET`
* **Ruta:** `/api/auth/me`
* **Rol Permitido:** Todos (Requiere sesión activa)
* **Respuesta Exitosa (200 OK):** Retorna la estructura del perfil de la sesión.
* **Respuesta Error (401 Unauthorized):**
  ```json
  {
    "status": "error",
    "message": "No hay sesión activa"
  }
  ```

### 2.3 Cerrar Sesión
* **Método:** `POST`
* **Ruta:** `/api/auth/logout`
* **Rol Permitido:** Todos

---

## 3. Endpoints Académicos Base

### 3.1 Listar Alumnos
* **Método:** `GET`
* **Ruta:** `/api/students`
* **Roles Permitidos:** `admin`, `secretary`, `coordinator`
* **Parámetros Query (Opcionales):** `search` (búsqueda por código/DNI/nombre), `status` (`active`/`inactive`), `cycle`, `promotion`.
* **Respuesta Exitosa (200 OK):**
  ```json
  {
    "status": "success",
    "data": [
      { "id": "ALU001", "code": "2024001000", "dni": "12345678", "firstName": "Juan", "lastName": "Pérez García", "email": "juan.perez@student.edu.pe", "phone": "987654321", "cycle": "I", "promotion": "2024", "status": "active", "observations": "" }
    ]
  }
  ```

### 3.2 Crear Alumno
* **Método:** `POST`
* **Ruta:** `/api/students`
* **Roles Permitidos:** `admin`, `secretary`
* **Cuerpo Esperado:** Objeto con datos de alumno sin ID.
* **Respuesta Exitosa (201 Created):** Retorna el objeto alumno creado con su ID auto-asignado.

### 3.3 Actualizar Alumno
* **Método:** `PUT`
* **Ruta:** `/api/students/{id}`
* **Roles Permitidos:** `admin`, `secretary`

### 3.4 Desactivar Alumno (Borrado Lógico)
* **Método:** `DELETE`
* **Ruta:** `/api/students/{id}`
* **Roles Permitidos:** `admin`, `secretary`

---

## 4. Endpoints de Matrícula y Grupos

### 4.1 Obtener Alumnos Matriculados en un Grupo
* **Método:** `GET`
* **Ruta:** `/api/enrollments`
* **Roles Permitidos:** `admin`, `secretary`, `coordinator`, `teacher`
* **Parámetros Query:** `groupId` (Obligatorio)
* **Respuesta Exitosa (200 OK):** Lista de registros de matrícula.

### 4.2 Matricular Alumno
* **Método:** `POST`
* **Ruta:** `/api/enrollments`
* **Roles Permitidos:** `admin`, `secretary`
* **Cuerpo Esperado:**
  ```json
  {
    "groupId": "GRP001",
    "studentId": "ALU001"
  }
  ```

---

## 5. Endpoints de Asistencia (Matriz de Asistencia de Alumnos)

### 5.1 Obtener Asistencia por Grupo (Formato Matriz)
* **Método:** `GET`
* **Ruta:** `/api/attendance`
* **Roles Permitidos:** `admin`, `teacher`, `coordinator`
* **Parámetros Query:** `groupId` (Obligatorio)
* **Respuesta Exitosa (200 OK):**
  ```json
  {
    "status": "success",
    "data": {
      "id": "AST-CB-2024-01",
      "groupId": "GRP001",
      "teacherId": "TCH001",
      "status": "borrador",
      "days": ["2024-01-22", "2024-01-24"],
      "students": [
        {
          "studentId": "ALU001",
          "attendance": { "2024-01-22": "presente", "2024-01-24": "presente" }
        }
      ]
    }
  }
  ```

### 5.2 Actualizar Celda de Asistencia en la Matriz
* **Método:** `PUT`
* **Ruta:** `/api/attendance/{attendanceId}/record`
* **Roles Permitidos:** `admin`, `teacher`
* **Cuerpo Esperado:**
  ```json
  {
    "studentId": "ALU001",
    "date": "2024-01-22",
    "value": "presente" // presente | tarde | falta | justificado
  }
  ```

### 5.3 Cambiar Estado General de la Asistencia (Registrar / Cerrar)
* **Método:** `PUT`
* **Ruta:** `/api/attendance/{attendanceId}/status`
* **Roles Permitidos:** `admin` (Cerrar/Reabrir), `teacher` (Registrar/Guardar)
* **Cuerpo Esperado:**
  ```json
  {
    "status": "cerrado" // borrador | registrada | observada | cerrado
  }
  ```

---

## 6. Endpoints de Calificaciones

### 6.1 Obtener Acta de Calificaciones del Grupo
* **Método:** `GET`
* **Ruta:** `/api/grades`
* **Roles Permitidos:** `admin`, `teacher`
* **Parámetros Query:** `groupId` (Obligatorio)

### 6.2 Guardar Calificación de Alumno
* **Método:** `POST`
* **Ruta:** `/api/grades`
* **Roles Permitidos:** `admin`, `teacher`
* **Cuerpo Esperado:**
  ```json
  {
    "groupId": "GRP001",
    "studentId": "ALU001",
    "moduleGrades": {
      "MOD001": 15,
      "MOD002": 16,
      "MOD003": 14
    }
  }
  ```

---

## 7. Mapeo: DataManager actual vs Endpoints Nuevos

Para integrar el backend, las llamadas síncronas del `DataManager` en `app.js` se convertirán en peticiones asíncronas fetch de la siguiente forma:

| Función DataManager (data.js) | Endpoint de la API REST (PHP) | Método HTTP |
|---|---|---|
| `validateLogin(user, pass, role)` | `/api/auth/login` | `POST` |
| `getStudents()` | `/api/students` | `GET` |
| `addStudent(studentData)` | `/api/students` | `POST` |
| `updateStudent(id, updates)` | `/api/students/{id}` | `PUT` |
| `getTeachers()` | `/api/teachers` | `GET` |
| `getGroups()` | `/api/groups` | `GET` |
| `addEnrollment(groupId, studentId)`| `/api/enrollments` | `POST` |
| `removeEnrollment(enrollmentId)` | `/api/enrollments/{id}` | `DELETE` |
| `getStudentAttendanceByGroup(gId)`| `/api/attendance?groupId={gId}` | `GET` |
| `updateStudentAttendanceRecord(...)`| `/api/attendance/{attId}/record`| `PUT` |
| `updateStudentAttendanceStatus(...)`| `/api/attendance/{attId}/status`| `PUT` |
| `getGradeSheetByGroup(gId)` | `/api/grade-sheets?groupId={gId}`| `GET` |
| `saveGrade(gId, sId, grades)` | `/api/grades` | `POST` |
| `generateCertificate(sId, gId)` | `/api/certificates` | `POST` |
| `getSavedReports()` | `/api/reports/saved` | `GET` |
| `getSettings()` | `/api/settings` | `GET` |
| `saveSettings(data)` | `/api/settings` | `PUT` |
