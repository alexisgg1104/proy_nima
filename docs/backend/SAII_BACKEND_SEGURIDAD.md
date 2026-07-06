# SAII_BACKEND_SEGURIDAD.md — Manual de Seguridad del Backend

Este documento establece las políticas y el diseño de controles de seguridad obligatorios que deben implementarse en el backend en PHP y la base de datos de SAII.

---

## 1. Checklist de Seguridad Obligatoria

- [ ] **Sin contraseñas en texto plano:** Almacenar contraseñas únicamente usando hashes robustos.
- [ ] **Consultas SQL parametrizadas:** Queda prohibida la concatenación de variables en consultas SQL.
- [ ] **Validación y sanitización en el servidor:** Todo dato proveniente del cliente es malicioso hasta probar lo contrario.
- [ ] **Sesiones seguras y HttpOnly:** Configurar cookies de sesión seguras para mitigar ataques XSS y secuestros.
- [ ] **Validación de Roles (RBAC):** Verificar la autorización en el servidor para cada recurso y endpoint sensible.
- [ ] **Protección CSRF:** Validar tokens únicos en operaciones que alteran el estado de la base de datos (POST/PUT/DELETE).
- [ ] **Manejo controlado de errores:** Ocultar excepciones técnicas en producción y escribir logs en archivos del servidor.
- [ ] **Registro de auditoría (Audit Logs):** Guardar registro de acciones administrativas críticas en base de datos.

---

## 2. Prevención de Inyección SQL (PDO con Consultas Preparadas)

Para evitar inyecciones de código SQL, se utilizarán exclusivamente sentencias preparadas de PDO.

### Ejemplo de Implementación Incorrecta (Prohibido):
```php
// VULNERABLE A SQL INJECTION
$db->query("SELECT * FROM students WHERE code = '" . $_POST['code'] . "'");
```

### Ejemplo de Implementación Correcta (Obligatorio):
```php
// SEGURO - CONSULTA PARAMETRIZADA
$stmt = $db->prepare("SELECT * FROM students WHERE code = :code");
$stmt->bindValue(':code', $code, PDO::PARAM_STR);
$stmt->execute();
$student = $stmt->fetch(PDO::FETCH_ASSOC);
```

---

## 3. Manejo Seguro de Contraseñas

Las contraseñas de los usuarios deben encriptarse utilizando la función nativa de PHP `password_hash()` con el algoritmo por defecto (Bcrypt/Argon2id).

### Registro o Actualización de Usuario:
```php
$plainPassword = $_POST['password'];
$hashedPassword = password_hash($plainPassword, PASSWORD_DEFAULT);

// Guardar $hashedPassword en la base de datos
```

### Verificación en Login:
```php
// Obtener el hash de la base de datos para el usuario especificado
$userHash = $dbUser['password'];

if (password_verify($plainPassword, $userHash)) {
    // Autenticación correcta, iniciar sesión
} else {
    // Error de credenciales
}
```

---

## 4. Configuración de Sesiones Seguras

Antes de ejecutar `session_start()`, se deben configurar los parámetros de las cookies de sesión en PHP para evitar ataques de fijación o secuestro de sesión.

```php
ini_set('session.cookie_httponly', 1); // Evita lectura de la cookie mediante JavaScript (XSS)
ini_set('session.use_only_cookies', 1); // Obliga a usar solo cookies (no pasar ID por URL)

if (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on') {
    ini_set('session.cookie_secure', 1); // Solo transmitir cookie sobre canales cifrados HTTPS
}

session_set_cookie_params([
    'lifetime' => 0, // Expira al cerrar el navegador
    'path' => '/',
    'domain' => '',
    'secure' => isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on',
    'httponly' => true,
    'samesite' => 'Lax' // Mitigación básica contra ataques CSRF
]);

session_start();
session_regenerate_id(true); // Regenera el ID de sesión en el login para mitigar fijación de sesión
```

---

## 5. Control de Roles (RBAC en Backend)

El backend debe validar que el usuario cuente con los permisos necesarios para ejecutar una acción, independientemente de si la interfaz de usuario oculta o muestra el botón.

```php
class BaseController {
    protected function checkRole($allowedRoles) {
        if (!isset($_SESSION['user'])) {
            $this->respondError("No autorizado", 401);
        }
        
        $userRole = $_SESSION['user']['role']; // admin, teacher, etc.
        if (!in_array($userRole, $allowedRoles)) {
            $this->respondError("Permisos insuficientes", 403);
        }
    }
}
```

### Uso en un Controlador:
```php
class StudentController extends BaseController {
    public function create() {
        // Solo administradores y secretarias pueden crear alumnos
        $this->checkRole(['admin', 'secretary']);
        
        // Continuar con la creación...
    }
}
```

---

## 6. Protección CSRF (Cross-Site Request Forgery)

Para peticiones que modifican la base de datos (POST, PUT, DELETE) consumidas mediante fetch, el servidor generará un token único por sesión que el cliente deberá enviar en los encabezados HTTP.

### Generación en el Servidor (PHP):
```php
if (empty($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}
```

### Verificación en el Servidor (Middleware / Router):
```php
$headers = getallheaders();
$clientToken = $headers['X-CSRF-TOKEN'] ?? '';

if (!hash_equals($_SESSION['csrf_token'], $clientToken)) {
    http_response_code(403);
    echo json_encode(["status" => "error", "message" => "Token CSRF inválido o ausente"]);
    exit;
}
```

---

## 7. Manejo de Errores y Excepciones

No se deben imprimir errores técnicos detallados en la respuesta HTTP, ya que exponen nombres de tablas y variables del servidor que facilitan ataques dirigidos.

### Configuración en `php.ini` (o vía PHP en index.php):
```php
ini_set('display_errors', 0); // No mostrar errores en pantalla
ini_set('log_errors', 1);     // Registrar errores en el archivo de log del servidor
```

### Bloque Try-Catch Seguro:
```php
try {
    // Código de base de datos
} catch (PDOException $e) {
    // Escribir el error real en el archivo log seguro de PHP
    error_log("Error de BD: " . $e->getMessage());
    
    // Retornar un mensaje genérico al cliente
    $this->respondError("Ha ocurrido un error interno en el servidor", 500);
}
```
