<?php

// 1. Desviar archivos estáticos si se ejecuta en el servidor de desarrollo CLI de PHP
if (php_sapi_name() === 'cli-server') {
    $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    if (file_exists(__DIR__ . $path) && is_file(__DIR__ . $path)) {
        return false;
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

$secureCookie = isset($_ENV['SESSION_SECURE']) && $_ENV['SESSION_SECURE'] === 'true';
if ($secureCookie) {
    ini_set('session.cookie_secure', 1);
}

session_set_cookie_params([
    'lifetime' => 0,
    'path' => '/',
    'domain' => '',
    'secure' => $secureCookie,
    'httponly' => true,
    'samesite' => 'Lax'
]);

session_start();

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
    http_response_code(200);
    header('Content-Type: application/json');
    echo json_encode([
        'status' => 'success',
        'message' => 'Backend SAII de Informática operando con éxito'
    ], JSON_UNESCAPED_UNICODE);
    exit;
});

use App\Controllers\AuthController;
use App\Controllers\UserController;

// Rutas de Autenticación (Fase B3)
$router->addRoute('POST', '/api/auth/login', [AuthController::class, 'login']);
$router->addRoute('POST', '/api/auth/logout', [AuthController::class, 'logout']);
$router->addRoute('GET', '/api/auth/me', [AuthController::class, 'me']);

// Rutas de Gestión de Usuarios - CRUD (Fase B3)
$router->addRoute('GET', '/api/users', [UserController::class, 'index']);
$router->addRoute('GET', '/api/users/{id}', [UserController::class, 'show']);
$router->addRoute('POST', '/api/users', [UserController::class, 'create']);
$router->addRoute('PUT', '/api/users/{id}', [UserController::class, 'update']);
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
        SELECT ar.student_id, ar.status, al.group_id, al.date
        FROM student_attendance_records ar
        JOIN student_attendance_lists al ON ar.attendance_list_id = al.id
        WHERE al.status != 'borrador'
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

// Rutas de Certificados y Constancias (Fase B7)
$router->addRoute('GET', '/api/certificates', [CertificateController::class, 'index']);
$router->addRoute('GET', '/api/certificates/{id}', [CertificateController::class, 'show']);
$router->addRoute('POST', '/api/certificates', [CertificateController::class, 'create']);
$router->addRoute('POST', '/api/certificates/{id}/sign', [CertificateController::class, 'sign']);

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

// Rutas de Gestión de Usuarios y Roles (Fase B9)
$router->addRoute('GET', '/api/users', function() {
    if (!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'admin') {
        http_response_code(403);
        header('Content-Type: application/json');
        echo json_encode(['status' => 'error', 'message' => 'Acceso denegado.']);
        exit;
    }
    $db = \Config\Database::getInstance()->getConnection();
    $stmt = $db->query("SELECT id, username, full_name as fullName, email, role, status, last_login as lastLogin FROM users ORDER BY id ASC");
    $users = $stmt->fetchAll(\PDO::FETCH_ASSOC);
    http_response_code(200);
    header('Content-Type: application/json');
    echo json_encode(['status' => 'success', 'data' => $users]);
    exit;
});

$router->addRoute('POST', '/api/users', function() {
    if (!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'admin') {
        http_response_code(403);
        header('Content-Type: application/json');
        echo json_encode(['status' => 'error', 'message' => 'Acceso denegado.']);
        exit;
    }
    $input = json_decode(file_get_contents('php://input'), true);
    $db = \Config\Database::getInstance()->getConnection();
    $stmt = $db->prepare("INSERT INTO users (username, password, full_name, email, role, status) VALUES (:username, :password, :full_name, :email, :role, :status)");
    $stmt->execute([
        'username' => trim($input['username']),
        'password' => password_hash($input['password'] ?? 'admin123', PASSWORD_DEFAULT),
        'full_name' => trim($input['fullName']),
        'email' => trim($input['email']),
        'role' => trim($input['role']),
        'status' => $input['status'] ?? 'active'
    ]);
    $userId = $db->lastInsertId();
    http_response_code(201);
    header('Content-Type: application/json');
    echo json_encode(['status' => 'success', 'data' => ['id' => (int)$userId]]);
    exit;
});

$router->addRoute('PUT', '/api/users/{id}', function($id) {
    if (!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'admin') {
        http_response_code(403);
        header('Content-Type: application/json');
        echo json_encode(['status' => 'error', 'message' => 'Acceso denegado.']);
        exit;
    }
    $input = json_decode(file_get_contents('php://input'), true);
    $db = \Config\Database::getInstance()->getConnection();
    
    $sql = "UPDATE users SET username = :username, full_name = :full_name, email = :email, role = :role, status = :status";
    $params = [
        'username' => trim($input['username']),
        'full_name' => trim($input['fullName']),
        'email' => trim($input['email']),
        'role' => trim($input['role']),
        'status' => trim($input['status']),
        'id' => (int)$id
    ];
    if (!empty($input['password'])) {
        $sql .= ", password = :password";
        $params['password'] = password_hash($input['password'], PASSWORD_DEFAULT);
    }
    $sql .= " WHERE id = :id";
    
    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    http_response_code(200);
    header('Content-Type: application/json');
    echo json_encode(['status' => 'success', 'message' => 'Usuario actualizado exitosamente.']);
    exit;
});

$router->addRoute('DELETE', '/api/certificates/{id}', function($id) {
    if (!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'admin') {
        http_response_code(403);
        header('Content-Type: application/json');
        echo json_encode(['status' => 'error', 'message' => 'Acceso denegado.']);
        exit;
    }
    
    $db = \Config\Database::getInstance()->getConnection();
    $stmtS = $db->prepare("DELETE FROM certificate_signatures WHERE certificate_id = :id");
    $stmtS->execute(['id' => $id]);
    
    $stmtC = $db->prepare("DELETE FROM certificates WHERE id = :id");
    $stmtC->execute(['id' => $id]);

    http_response_code(200);
    header('Content-Type: application/json');
    echo json_encode([
        'status' => 'success',
        'message' => 'Certificado eliminado exitosamente.'
    ]);
    exit;
});

// Rutas de Consulta Global de Notas y Asistencia (Fase B9 Helper)
$router->addRoute('GET', '/api/grades', function() {
    if (!isset($_SESSION['user'])) {
        http_response_code(401);
        header('Content-Type: application/json');
        echo json_encode(['status' => 'error', 'message' => 'No autenticado.']);
        exit;
    }
    $db = \Config\Database::getInstance()->getConnection();
    $stmt = $db->query("
        SELECT gr.student_id, gr.course_module_id, gr.grade, gs.group_id
        FROM grade_records gr
        JOIN grade_sheets gs ON gr.grade_sheet_id = gs.id
    ");
    $records = $stmt->fetchAll(\PDO::FETCH_ASSOC);
    http_response_code(200);
    header('Content-Type: application/json');
    echo json_encode(['status' => 'success', 'data' => $records]);
    exit;
});



// Rutas de Configuración del Sistema (Fase B9)
$router->addRoute('GET', '/api/settings', function() {
    if (!isset($_SESSION['user'])) {
        http_response_code(401);
        header('Content-Type: application/json');
        echo json_encode(['status' => 'error', 'message' => 'No autenticado. Por favor inicie sesión.']);
        exit;
    }
    
    $db = \Config\Database::getInstance()->getConnection();
    $stmt = $db->query("SELECT * FROM settings LIMIT 1");
    $settings = $stmt->fetch(\PDO::FETCH_ASSOC);

    http_response_code(200);
    header('Content-Type: application/json');
    echo json_encode([
        'status' => 'success',
        'data' => $settings
    ]);
    exit;
});

$router->addRoute('PUT', '/api/settings', function() {
    if (!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'admin') {
        http_response_code(403);
        header('Content-Type: application/json');
        echo json_encode(['status' => 'error', 'message' => 'Acceso denegado. Permisos insuficientes.']);
        exit;
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

    http_response_code(200);
    header('Content-Type: application/json');
    echo json_encode([
        'status' => 'success',
        'message' => 'Configuración actualizada exitosamente.'
    ]);
    exit;
});

// Despachar la petición
$router->dispatch($_SERVER['REQUEST_METHOD'], $_SERVER['REQUEST_URI']);
