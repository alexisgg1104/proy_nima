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
header('Access-Control-Allow-Origin: *'); // En producción refinar a orígenes de confianza
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-CSRF-TOKEN');

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

// Despachar la petición
$router->dispatch($_SERVER['REQUEST_METHOD'], $_SERVER['REQUEST_URI']);
