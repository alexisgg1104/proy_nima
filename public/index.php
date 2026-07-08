<?php

// 1. Desviar y servir archivos estáticos si se ejecuta en el servidor de desarrollo CLI de PHP
if (php_sapi_name() === 'cli-server') {
    $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    $filePath = __DIR__ . $path;
    if (file_exists($filePath) && is_file($filePath)) {
        $ext = strtolower(pathinfo($filePath, PATHINFO_EXTENSION));
        $mimes = [
            'html' => 'text/html; charset=UTF-8',
            'css'  => 'text/css',
            'js'   => 'application/javascript',
            'png'  => 'image/png',
            'jpg'  => 'image/jpeg',
            'jpeg' => 'image/jpeg',
            'gif'  => 'image/gif',
            'svg'  => 'image/svg+xml',
            'ico'  => 'image/x-icon',
            'json' => 'application/json'
        ];
        if (isset($mimes[$ext])) {
            header("Content-Type: " . $mimes[$ext]);
        }
        readfile($filePath);
        exit;
    }
}

// 2. Cargar variables de entorno (.env)
function loadEnv($path) {
    if (!file_exists($path)) return;
    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) continue;
        if (strpos($line, '=') === false) continue;
        list($name, $value) = explode('=', $line, 2);
        $_ENV[trim($name)] = trim($value);
    }
}

loadEnv(__DIR__ . '/../.env');

// 3. Configuración de Sesiones Seguras (de acuerdo a SAII_BACKEND_SEGURIDAD.md)
ini_set('session.cookie_httponly', 1);
ini_set('session.use_only_cookies', 1);

$secureCookie = (getenv('SESSION_SECURE') === 'true') || (isset($_ENV['SESSION_SECURE']) && $_ENV['SESSION_SECURE'] === 'true');
if ($secureCookie) {
    ini_set('session.cookie_secure', 1);
}

session_set_cookie_params([
    'lifetime' => 0,
    'path' => '/',
    'secure' => $secureCookie,
    'httponly' => true,
    'samesite' => 'Lax'
]);

// En entornos en la nube como Railway, asegurar que las sesiones se guarden en un directorio escribible (/tmp)
if (getenv('PORT') || getenv('RAILWAY_STATIC_URL')) {
    session_save_path('/tmp');
}

session_start();

// 4.2. Inicialización de Protección CSRF (Debe hacerse antes de liberar el bloqueo para persistir en disco)
if (empty($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}

// Liberar el bloqueo de sesión inmediatamente para peticiones concurrentes si no modifican la sesión (Fase B9 Perf)
$requestUri = $_SERVER['REQUEST_URI'] ?? '';
$isSessionWriter = (strpos($requestUri, '/api/auth/login') !== false) || 
                   (strpos($requestUri, '/api/auth/logout') !== false) || 
                   (strpos($requestUri, '/api/auth/csrf') !== false);

if (!$isSessionWriter) {
    session_write_close();
}
header('X-Debug-Session: ' . session_id());

// 4. Registro del cargador de clases (PSR-4 Autoloader Autogestionado)
spl_autoload_register(function ($class) {
    // Espacio de nombres App\
    if (strpos($class, 'App\\') === 0) {
        $relativeClass = substr($class, 4);
        $file = __DIR__ . '/../app/' . str_replace('\\', '/', $relativeClass) . '.php';
        if (file_exists($file)) {
            require_once $file;
            return;
        }
    }
    
    // Espacio de nombres Config\
    if (strpos($class, 'Config\\') === 0) {
        $relativeClass = substr($class, 7);
        $file = __DIR__ . '/../config/' . str_replace('\\', '/', $relativeClass) . '.php';
        if (file_exists($file)) {
            require_once $file;
            return;
        }
    }
});

// 4.1. Configuración de Errores y Logs para Producción
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/../logs/php_errors.log');

set_exception_handler(function ($exception) {
    error_log("Uncaught Exception: " . $exception->getMessage() . " in " . $exception->getFile() . " on line " . $exception->getLine());
    \App\Core\BaseController::sendError("Ha ocurrido un error interno en el servidor.", 500);
});

set_error_handler(function ($errno, $errstr, $errfile, $errline) {
    if (!(error_reporting() & $errno)) {
        return false;
    }
    error_log("PHP Error ($errno): $errstr in $errfile on line $errline");
    if (in_array($errno, [E_USER_ERROR, E_RECOVERABLE_ERROR])) {
        \App\Core\BaseController::sendError("Ha ocurrido un error interno en el servidor.", 500);
    }
    return true;
});

// 4.2. Protección CSRF inicializada arriba al arrancar la sesión

// 5. Configurar Cabeceras CORS
if (isset($_SERVER['HTTP_ORIGIN'])) {
    $origin = $_SERVER['HTTP_ORIGIN'];
    if (preg_match('/^https?:\/\/(localhost|127\.0\.0\.1|192\.168\.\d+\.\d+)(:\d+)?$/', $origin)) {
        header("Access-Control-Allow-Origin: $origin");
    }
}
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-CSRF-TOKEN, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// 6. Instanciar enrutador y declarar endpoints base
use App\Core\Router;

$router = new Router();

// Endpoint de Prueba (Fase B2)
$router->addRoute('GET', '/api/test', function() {
    \App\Core\BaseController::sendJson([
        'message' => 'Backend SAII de Informática operando con éxito'
    ]);
});

// Endpoint temporal para migrar los permisos de roles en Aiven
$router->addRoute('GET', '/api/migrate-permissions', function() {
    try {
        $db = \Config\Database::getInstance()->getConnection();
        
        // 1. Agregar columna
        $columns = $db->query("SHOW COLUMNS FROM roles LIKE 'permissions'")->fetchAll();
        if (empty($columns)) {
            $db->exec("ALTER TABLE roles ADD COLUMN permissions TEXT NULL");
            $msg1 = "Columna 'permissions' creada con éxito.";
        } else {
            $msg1 = "La columna 'permissions' ya existe.";
        }
        
        // 2. Poblar permisos por defecto
        $rolePermissions = [
            'admin' => ["dashboard", "students", "courses", "teachers", "groups", "enrollments", "attendance", "grades", "certificates", "reports", "users", "settings"],
            'secretary' => ["dashboard", "students", "enrollments", "certificates", "reports"],
            'teacher' => ["dashboard", "grades", "attendance", "reports"],
            'coordinator' => ["dashboard", "courses", "groups", "reports", "students"],
            'dean' => ["dashboard", "certificates"]
        ];
        
        $stmt = $db->prepare("UPDATE roles SET permissions = :permissions WHERE key_name = :key_name");
        foreach ($rolePermissions as $key => $perms) {
            $stmt->execute([
                'permissions' => json_encode($perms),
                'key_name' => $key
            ]);
        }
        
        // 3. Crear tabla specialties
        $db->exec("CREATE TABLE IF NOT EXISTS specialties (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL UNIQUE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
        
        // Poblar specialties si está vacía
        $countSpec = $db->query("SELECT COUNT(*) FROM specialties")->fetchColumn();
        if ($countSpec == 0) {
            $specs = ['Ofimática', 'Programación', 'Diseño', 'Computación básica', 'Matemática aplicada / Matlab'];
            $stmtSpec = $db->prepare("INSERT INTO specialties (name) VALUES (:name)");
            foreach ($specs as $s) {
                $stmtSpec->execute(['name' => $s]);
            }
        }
        
        // 4. Crear tabla classrooms
        $db->exec("CREATE TABLE IF NOT EXISTS classrooms (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL UNIQUE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
        
        // Poblar classrooms si está vacía
        $countClass = $db->query("SELECT COUNT(*) FROM classrooms")->fetchColumn();
        if ($countClass == 0) {
            $classes = ['Lab. Informática 1', 'Lab. Informática 2', 'Lab. Informática 3', 'Aula 101', 'Aula 102'];
            $stmtClass = $db->prepare("INSERT INTO classrooms (name) VALUES (:name)");
            foreach ($classes as $c) {
                $stmtClass->execute(['name' => $c]);
            }
        }
        
        \App\Core\BaseController::sendJson([
            'message' => "Migración completada con éxito. $msg1 y tablas de Especialidades/Aulas inicializadas."
        ]);
    } catch (\Exception $e) {
        \App\Core\BaseController::sendError($e->getMessage(), 500);
    }
});

// Rutas de Especialidades y Aulas (Para poblar comboboxes)
$router->addRoute('GET', '/api/specialties', function() {
    $db = \Config\Database::getInstance()->getConnection();
    $stmt = $db->query("SELECT id, name FROM specialties ORDER BY name ASC");
    $data = $stmt->fetchAll(\PDO::FETCH_ASSOC);
    \App\Core\BaseController::sendJson($data);
});

$router->addRoute('GET', '/api/classrooms', function() {
    $db = \Config\Database::getInstance()->getConnection();
    $stmt = $db->query("SELECT id, name FROM classrooms ORDER BY name ASC");
    $data = $stmt->fetchAll(\PDO::FETCH_ASSOC);
    \App\Core\BaseController::sendJson($data);
});

$router->addRoute('GET', '/api/preload', function() {
    if (!isset($_SESSION['user'])) {
        \App\Core\BaseController::sendError('No autenticado.', 401);
    }
    
    try {
        $db = \Config\Database::getInstance()->getConnection();
        
        // 1. Students
        $students = $db->query("SELECT * FROM students ORDER BY last_name ASC, first_name ASC")->fetchAll(\PDO::FETCH_ASSOC);
        
        // 2. Teachers
        $teachers = $db->query("SELECT * FROM teachers ORDER BY last_name ASC, first_name ASC")->fetchAll(\PDO::FETCH_ASSOC);
        
        // 3. Courses & Modules
        $courses = $db->query("SELECT * FROM courses ORDER BY code ASC")->fetchAll(\PDO::FETCH_ASSOC);
        $modules = $db->query("SELECT * FROM course_modules ORDER BY course_id ASC, id ASC")->fetchAll(\PDO::FETCH_ASSOC);
        // Group modules by course
        $modulesByCourse = [];
        foreach ($modules as $m) {
            $modulesByCourse[$m['course_id']][] = [
                'id' => (int)$m['id'],
                'course_module_id' => (int)$m['id'],
                'name' => $m['name'],
                'module_name' => $m['name'],
                'percentage' => (float)$m['percentage'],
                'module_percentage' => (float)$m['percentage']
            ];
        }
        foreach ($courses as &$c) {
            $c['modules'] = $modulesByCourse[$c['id']] ?? [];
        }
        unset($c);
        
        // 4. Academic Groups
        $groups = $db->query("
            SELECT g.*, c.name AS course_name, CONCAT(t.first_name, ' ', t.last_name) AS teacher_name
            FROM academic_groups g
            LEFT JOIN courses c ON g.course_id = c.id
            LEFT JOIN teachers t ON g.teacher_id = t.id
            ORDER BY g.code ASC
        ")->fetchAll(\PDO::FETCH_ASSOC);
        
        // 5. Enrollments
        $enrollments = $db->query("
            SELECT e.*, 
                   CONCAT(s.first_name, ' ', s.last_name) AS student_name,
                   s.code AS student_code,
                   g.code AS group_code,
                   c.name AS course_name
            FROM enrollments e
            LEFT JOIN students s ON e.student_id = s.id
            LEFT JOIN academic_groups g ON e.group_id = g.id
            LEFT JOIN courses c ON g.course_id = c.id
            ORDER BY e.id DESC
        ")->fetchAll(\PDO::FETCH_ASSOC);
        
        // 6. Settings
        $settings = $db->query("SELECT * FROM settings LIMIT 1")->fetch(\PDO::FETCH_ASSOC);
        
        // 7. Saved Reports
        $reports = $db->query("SELECT * FROM saved_reports ORDER BY id DESC")->fetchAll(\PDO::FETCH_ASSOC);
        
        // 8. Certificates
        $certificates = $db->query("
            SELECT cert.*,
                   CONCAT(s.first_name, ' ', s.last_name) AS student_name,
                   s.code AS student_code,
                   g.code AS group_code,
                   c.name AS course_name
            FROM certificates cert
            LEFT JOIN students s ON cert.student_id = s.id
            LEFT JOIN academic_groups g ON cert.group_id = g.id
            LEFT JOIN courses c ON g.course_id = c.id
            ORDER BY cert.id DESC
        ")->fetchAll(\PDO::FETCH_ASSOC);
        
        $certSignatures = $db->query("SELECT * FROM certificate_signatures")->fetchAll(\PDO::FETCH_ASSOC);
        $signaturesByCert = [];
        foreach ($certSignatures as $sig) {
            $signaturesByCert[$sig['certificate_id']][] = [
                'signer_name' => $sig['signer_name'],
                'signer_role' => $sig['signer_role'],
                'signed_at' => $sig['signed_at'],
                'is_signed' => (bool)$sig['is_signed']
            ];
        }
        foreach ($certificates as &$cert) {
            $cert['signatures'] = $signaturesByCert[$cert['id']] ?? [];
        }
        unset($cert);
        
        // 9. Grades
        $grades = $db->query("
            SELECT gs.group_id, gr.student_id, gr.course_module_id, gr.grade
            FROM grade_records gr
            JOIN grade_sheets gs ON gr.grade_sheet_id = gs.id
        ")->fetchAll(\PDO::FETCH_ASSOC);
        
        // 10. Grade Sheets
        $gradeSheets = $db->query("SELECT id, group_id, status, updated_at FROM grade_sheets")->fetchAll(\PDO::FETCH_ASSOC);
        
        // 11. Attendance Lists
        $attendanceLists = $db->query("SELECT * FROM student_attendance_lists ORDER BY date DESC")->fetchAll(\PDO::FETCH_ASSOC);
        
        // 12. Attendance Records
        $attendanceRecords = $db->query("
            SELECT ar.student_id, ar.status, al.group_id, al.date, ar.attendance_list_id AS list_id
            FROM student_attendance_records ar
            JOIN student_attendance_lists al ON ar.attendance_list_id = al.id
        ")->fetchAll(\PDO::FETCH_ASSOC);
        
        // 13. Users
        $users = $db->query("
            SELECT u.id, u.username, u.full_name, u.email, u.status, r.key_name AS role_key
            FROM users u
            LEFT JOIN roles r ON u.role_id = r.id
            ORDER BY u.username ASC
        ")->fetchAll(\PDO::FETCH_ASSOC);
        
        // 14. Roles
        $roles = $db->query("SELECT * FROM roles ORDER BY id ASC")->fetchAll(\PDO::FETCH_ASSOC);
        
        \App\Core\BaseController::sendJson([
            'students' => $students,
            'teachers' => $teachers,
            'courses' => $courses,
            'groups' => $groups,
            'enrollments' => $enrollments,
            'settings' => $settings,
            'reports' => $reports,
            'certificates' => $certificates,
            'grades' => $grades,
            'gradeSheets' => $gradeSheets,
            'attendanceLists' => $attendanceLists,
            'attendanceRecords' => $attendanceRecords,
            'users' => $users,
            'roles' => $roles
        ]);
        
    } catch (\Exception $e) {
        \App\Core\BaseController::sendError($e->getMessage(), 500);
    }
});

use App\Controllers\AuthController;
use App\Controllers\UserController;

// Rutas de Autenticación (Fase B3)
$router->addRoute('POST', '/api/auth/login', [AuthController::class, 'login']);
$router->addRoute('POST', '/api/auth/logout', [AuthController::class, 'logout']);
$router->addRoute('GET', '/api/auth/me', [AuthController::class, 'me']);
$router->addRoute('POST', '/api/auth/forgot-password', [AuthController::class, 'forgotPassword']);
$router->addRoute('POST', '/api/auth/reset-password', [AuthController::class, 'resetPassword']);
$router->addRoute('GET', '/api/auth/csrf', function() {
    \App\Core\BaseController::sendJson([
        'csrfToken' => $_SESSION['csrf_token']
    ]);
});

// Rutas de Gestión de Usuarios - CRUD (Fase B3)
$router->addRoute('GET', '/api/users', [UserController::class, 'index']);
$router->addRoute('GET', '/api/users/{id}', [UserController::class, 'show']);
$router->addRoute('POST', '/api/users', [UserController::class, 'create']);
$router->addRoute('PUT', '/api/users/{id}', [UserController::class, 'update']);
$router->addRoute('PUT', '/api/users/{id}/password', [UserController::class, 'changePassword']);
$router->addRoute('DELETE', '/api/users/{id}', [UserController::class, 'delete']);

use App\Controllers\StudentController;
use App\Controllers\TeacherController;
use App\Controllers\CourseController;

// Rutas de Alumnos - CRUD (Fase B4)
$router->addRoute('GET', '/api/students', [StudentController::class, 'index']);
$router->addRoute('GET', '/api/students/{id}', [StudentController::class, 'show']);
$router->addRoute('POST', '/api/students', [StudentController::class, 'create']);
$router->addRoute('PUT', '/api/students/{id}', [StudentController::class, 'update']);
$router->addRoute('DELETE', '/api/students/{id}', [StudentController::class, 'delete']);

// Rutas de Docentes - CRUD (Fase B4)
$router->addRoute('GET', '/api/teachers', [TeacherController::class, 'index']);
$router->addRoute('GET', '/api/teachers/{id}', [TeacherController::class, 'show']);
$router->addRoute('POST', '/api/teachers', [TeacherController::class, 'create']);
$router->addRoute('PUT', '/api/teachers/{id}', [TeacherController::class, 'update']);
$router->addRoute('DELETE', '/api/teachers/{id}', [TeacherController::class, 'delete']);

// Rutas de Cursos y Módulos - CRUD (Fase B4)
$router->addRoute('GET', '/api/courses', [CourseController::class, 'index']);
$router->addRoute('GET', '/api/courses/{id}', [CourseController::class, 'show']);
$router->addRoute('POST', '/api/courses', [CourseController::class, 'create']);
$router->addRoute('PUT', '/api/courses/{id}', [CourseController::class, 'update']);
$router->addRoute('DELETE', '/api/courses/{id}', [CourseController::class, 'delete']);

use App\Controllers\GroupController;
use App\Controllers\EnrollmentController;

// Rutas de Grupos Académicos - CRUD (Fase B5)
$router->addRoute('GET', '/api/groups', [GroupController::class, 'index']);
$router->addRoute('GET', '/api/groups/{id}', [GroupController::class, 'show']);
$router->addRoute('POST', '/api/groups', [GroupController::class, 'create']);
$router->addRoute('PUT', '/api/groups/{id}', [GroupController::class, 'update']);
$router->addRoute('DELETE', '/api/groups/{id}', [GroupController::class, 'delete']);

// Rutas de Matrículas - CRUD (Fase B5)
$router->addRoute('GET', '/api/enrollments', [EnrollmentController::class, 'index']);
$router->addRoute('GET', '/api/enrollments/{id}', [EnrollmentController::class, 'show']);
$router->addRoute('POST', '/api/enrollments', [EnrollmentController::class, 'create']);
$router->addRoute('PUT', '/api/enrollments/{id}', [EnrollmentController::class, 'update']);
$router->addRoute('DELETE', '/api/enrollments/{id}', [EnrollmentController::class, 'delete']);

use App\Controllers\AttendanceController;

// Rutas de Control de Asistencia (Fase B6)
$router->addRoute('GET', '/api/attendance', [AttendanceController::class, 'index']);
$router->addRoute('GET', '/api/attendance/records', function() {
    if (!isset($_SESSION['user'])) {
        http_response_code(401);
        header('Content-Type: application/json');
        echo json_encode(['status' => 'error', 'message' => 'No autenticado.']);
        exit;
    }
    $db = \Config\Database::getInstance()->getConnection();
    $stmt = $db->query("
        SELECT ar.student_id, ar.status, al.group_id, al.date, ar.attendance_list_id AS list_id
        FROM student_attendance_records ar
        JOIN student_attendance_lists al ON ar.attendance_list_id = al.id
    ");
    $records = $stmt->fetchAll(\PDO::FETCH_ASSOC);
    http_response_code(200);
    header('Content-Type: application/json');
    echo json_encode(['status' => 'success', 'data' => $records]);
    exit;
});
$router->addRoute('GET', '/api/attendance/{id}', [AttendanceController::class, 'show']);
$router->addRoute('GET', '/api/attendance/group/{groupId}/students', [AttendanceController::class, 'getTemplateStudents']);
$router->addRoute('POST', '/api/attendance', [AttendanceController::class, 'create']);
$router->addRoute('PUT', '/api/attendance/{id}', [AttendanceController::class, 'update']);
$router->addRoute('DELETE', '/api/attendance/{id}', [AttendanceController::class, 'delete']);
$router->addRoute('POST', '/api/attendance/{id}/status', [AttendanceController::class, 'updateStatus']);

use App\Controllers\GradeController;
use App\Controllers\CertificateController;

// Rutas de Calificaciones (Fase B7)
$router->addRoute('GET', '/api/grades/group/{groupId}', [GradeController::class, 'showGroupGrades']);
$router->addRoute('POST', '/api/grades/group/{groupId}', [GradeController::class, 'saveGroupGrades']);
$router->addRoute('POST', '/api/grades/group/{groupId}/status', [GradeController::class, 'updateStatus']);
$router->addRoute('GET', '/api/grades', function() {
    if (!isset($_SESSION['user'])) {
        http_response_code(401);
        header('Content-Type: application/json');
        echo json_encode(['status' => 'error', 'message' => 'No autenticado.']);
        exit;
    }
    $db = \Config\Database::getInstance()->getConnection();
    $stmt = $db->query("
        SELECT gs.group_id, gr.student_id, gr.course_module_id, gr.grade
        FROM grade_records gr
        JOIN grade_sheets gs ON gr.grade_sheet_id = gs.id
    ");
    $records = $stmt->fetchAll(\PDO::FETCH_ASSOC);
    http_response_code(200);
    header('Content-Type: application/json');
    echo json_encode(['status' => 'success', 'data' => $records]);
    exit;
});
$router->addRoute('GET', '/api/grades/sheets', function() {
    if (!isset($_SESSION['user'])) {
        http_response_code(401);
        header('Content-Type: application/json');
        echo json_encode(['status' => 'error', 'message' => 'No autenticado.']);
        exit;
    }
    $db = \Config\Database::getInstance()->getConnection();
    $stmt = $db->query("SELECT id, group_id, status, updated_at FROM grade_sheets");
    $sheets = $stmt->fetchAll(\PDO::FETCH_ASSOC);
    http_response_code(200);
    header('Content-Type: application/json');
    echo json_encode(['status' => 'success', 'data' => $sheets]);
    exit;
});

// Rutas de Certificados y Constancias (Fase B7)
$router->addRoute('GET', '/api/certificates', [CertificateController::class, 'index']);
$router->addRoute('GET', '/api/certificates/{id}', [CertificateController::class, 'show']);
$router->addRoute('POST', '/api/certificates', [CertificateController::class, 'create']);
$router->addRoute('POST', '/api/certificates/{id}/sign', [CertificateController::class, 'sign']);
$router->addRoute('POST', '/api/certificates/{id}/observation', [CertificateController::class, 'saveObservation']);

use App\Controllers\ReportController;

// Rutas de Reportes, Gráficos y Exportaciones (Fase B8)
$router->addRoute('GET', '/api/reports/dashboard', [ReportController::class, 'dashboard']);
$router->addRoute('GET', '/api/reports/saved', [ReportController::class, 'listSaved']);
$router->addRoute('GET', '/api/reports/saved/{id}', [ReportController::class, 'showSaved']);
$router->addRoute('POST', '/api/reports/saved', [ReportController::class, 'createSaved']);
$router->addRoute('PUT', '/api/reports/saved/{id}', [ReportController::class, 'updateSaved']);
$router->addRoute('DELETE', '/api/reports/saved/{id}', [ReportController::class, 'deleteSaved']);
$router->addRoute('GET', '/api/reports/export/csv', [ReportController::class, 'exportCSV']);
$router->addRoute('GET', '/api/reports/pdf/certificate/{id}', [ReportController::class, 'exportPDF']);

// Rutas de Gestión de Roles y Permisos (Fase B9)
$router->addRoute('GET', '/api/roles', [UserController::class, 'getRoles']);
$router->addRoute('PUT', '/api/roles/{key}/permissions', [UserController::class, 'updateRolePermissions']);

$router->addRoute('DELETE', '/api/certificates/{id}', function($id) {
    if (!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'admin') {
        \App\Core\BaseController::sendError('Acceso denegado.', 403);
    }
    
    $db = \Config\Database::getInstance()->getConnection();
    $stmtS = $db->prepare("DELETE FROM certificate_signatures WHERE certificate_id = :id");
    $stmtS->execute(['id' => $id]);
    
    $stmtC = $db->prepare("DELETE FROM certificates WHERE id = :id");
    $stmtC->execute(['id' => $id]);

    \App\Core\BaseController::sendJson(['message' => 'Certificado eliminado exitosamente.']);
});

// Rutas de Consulta Global de Notas y Asistencia (Fase B9 Helper)
$router->addRoute('GET', '/api/grades', function() {
    if (!isset($_SESSION['user'])) {
        \App\Core\BaseController::sendError('No autenticado.', 401);
    }
    $db = \Config\Database::getInstance()->getConnection();
    $stmt = $db->query("
        SELECT gr.student_id, gr.course_module_id, gr.grade, gs.group_id
        FROM grade_records gr
        JOIN grade_sheets gs ON gr.grade_sheet_id = gs.id
    ");
    $records = $stmt->fetchAll(\PDO::FETCH_ASSOC);
    \App\Core\BaseController::sendJson($records);
});

// Rutas de Configuración del Sistema (Fase B9)
$router->addRoute('GET', '/api/settings', function() {
    if (!isset($_SESSION['user'])) {
        \App\Core\BaseController::sendError('No autenticado. Por favor inicie sesión.', 401);
    }
    
    $db = \Config\Database::getInstance()->getConnection();
    $stmt = $db->query("SELECT * FROM settings LIMIT 1");
    $settings = $stmt->fetch(\PDO::FETCH_ASSOC);

    \App\Core\BaseController::sendJson($settings);
});

$router->addRoute('PUT', '/api/settings', function() {
    if (!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'admin') {
        \App\Core\BaseController::sendError('Acceso denegado. Permisos insuficientes.', 403);
    }

    $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;

    $db = \Config\Database::getInstance()->getConnection();
    $stmt = $db->prepare("
        UPDATE settings 
        SET system_name = :system_name,
            institute_name = :institute_name,
            university_name = :university_name,
            institute_email = :institute_email,
            institute_phone = :institute_phone,
            academic_period = :academic_period,
            min_passing_grade = :min_passing_grade,
            min_attendance_required = :min_attendance_required,
            default_theme = :default_theme,
            enable_notifications = :enable_notifications,
            enable_auto_save = :enable_auto_save,
            system_language = :system_language,
            responsible_academic = :responsible_academic
        WHERE id = 1
    ");

    $stmt->execute([
        'system_name' => trim($input['system_name'] ?? 'SAII'),
        'institute_name' => trim($input['institute_name'] ?? 'Instituto de Informática'),
        'university_name' => trim($input['university_name'] ?? 'Universidad Nacional de Piura'),
        'institute_email' => trim($input['institute_email'] ?? ''),
        'institute_phone' => trim($input['institute_phone'] ?? ''),
        'academic_period' => trim($input['academic_period'] ?? '2024-I'),
        'min_passing_grade' => (int)($input['min_passing_grade'] ?? 11),
        'min_attendance_required' => (int)($input['min_attendance_required'] ?? 70),
        'default_theme' => trim($input['default_theme'] ?? 'light'),
        'enable_notifications' => (int)($input['enable_notifications'] ?? 1),
        'enable_auto_save' => (int)($input['enable_auto_save'] ?? 1),
        'system_language' => trim($input['system_language'] ?? 'es'),
        'responsible_academic' => trim($input['responsible_academic'] ?? '')
    ]);

    \App\Core\BaseController::sendJson(['message' => 'Configuración actualizada exitosamente.']);
});

// Validar tokens CSRF para peticiones POST/PUT/DELETE que modifican datos
if (in_array($_SERVER['REQUEST_METHOD'], ['POST', 'PUT', 'DELETE'])) {
    // Buscar el token en $_SERVER (HTTP_X_CSRF_TOKEN) o getallheaders() de forma insensible a mayúsculas/minúsculas
    $clientToken = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
    if (empty($clientToken)) {
        $headers = function_exists('getallheaders') ? array_change_key_case(getallheaders(), CASE_LOWER) : [];
        $clientToken = $headers['x-csrf-token'] ?? '';
    }
    
    // Cabeceras de depuración para diagnosticar el problema exacto en la respuesta
    header('X-Debug-CSRF-Session: ' . ($_SESSION['csrf_token'] ?? 'empty'));
    header('X-Debug-CSRF-Client: ' . $clientToken);
    
    if (empty($_SESSION['csrf_token']) || !hash_equals($_SESSION['csrf_token'], $clientToken)) {
        \App\Core\BaseController::sendError("Token CSRF inválido o ausente.", 403);
    }
}

// Despachar la petición
$router->dispatch($_SERVER['REQUEST_METHOD'], $_SERVER['REQUEST_URI']);
