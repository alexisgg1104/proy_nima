<?php

namespace App\Controllers;

use App\Core\BaseController;
use App\Models\User;
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Incluir manualmente la librería (sin composer)
require_once __DIR__ . '/../../lib/PHPMailer/Exception.php';
require_once __DIR__ . '/../../lib/PHPMailer/PHPMailer.php';
require_once __DIR__ . '/../../lib/PHPMailer/SMTP.php';

class AuthController extends BaseController {
    
    // Iniciar Sesión (POST /api/auth/login)
    public function login() {
        // Leer el body JSON de la petición
        $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;

        $username = trim($input['username'] ?? '');
        $password = $input['password'] ?? '';
        $requestedRole = trim($input['role'] ?? ''); // Opcional, pero recomendado si se requiere filtro

        if (empty($username) || empty($password)) {
            $this->error('El usuario y la contraseña son obligatorios.', 400);
        }

        $userModel = new User();
        $user = $userModel->findByUsername($username);

        error_log("LOGIN_DEBUG: username=[$username], password_length=" . strlen($password) . ", requested_role=[$requestedRole]");
        if (!$user) {
            error_log("LOGIN_DEBUG: user not found or inactive for [$username]");
        } else {
            error_log("LOGIN_DEBUG: user found in DB: id={$user['id']}, role_key={$user['role_key']}, password_hash={$user['password']}");
            $verify = password_verify($password, $user['password']);
            error_log("LOGIN_DEBUG: password_verify result=" . ($verify ? "TRUE" : "FALSE"));
        }

        // Validar existencia del usuario y contraseña
        if (!$user || !password_verify($password, $user['password'])) {
            $this->error('Usuario o contraseña incorrectos.', 401);
        }

        // Si se especificó rol, validar que coincida con el rol real del usuario
        if (!empty($requestedRole) && strtolower($user['role_key']) !== strtolower($requestedRole)) {
            $this->error('El rol solicitado no coincide con los privilegios del usuario.', 403);
        }

        // --- PREVENCIÓN DE CONCURRENCIA DE SESIONES ---
        if (!empty($user['session_id']) && !empty($user['last_activity'])) {
            $lastActivity = strtotime($user['last_activity']);
            $diff = time() - $lastActivity;
            
            // Si la última actividad fue hace menos de 300 segundos (5 minutos)
            // y la diferencia es no-negativa (para evitar fallas de timezone si la base de datos se desincroniza)
            // y no es el mismo identificador de sesión actual.
            if ($diff >= 0 && $diff < 300 && $user['session_id'] !== session_id()) {
                $this->error('Ya existe una sesión activa para este usuario en otro dispositivo. Cierre la sesión existente antes de ingresar.', 409);
            }
        }

        // Configurar los datos en la sesión nativa de PHP
        $_SESSION['user'] = [
            'id' => (int)$user['id'],
            'username' => $user['username'],
            'fullName' => $user['full_name'],
            'email' => $user['email'],
            'role' => $user['role_key']
        ];

        // Registrar la fecha del último inicio de sesión en BD
        $userModel->updateLastLogin($user['id']);

        // Registrar el identificador de sesión activa en la base de datos
        $userModel->updateSession($user['id'], session_id());

        // Retornar información del usuario (excluyendo el hash de la contraseña)
        $this->json([
            'id' => (int)$user['id'],
            'username' => $user['username'],
            'fullName' => $user['full_name'],
            'email' => $user['email'],
            'role' => $user['role_key']
        ]);
    }

    // Obtener Datos del Usuario Autenticado (GET /api/auth/me)
    public function me() {
        // requireAuth retornará los datos de la sesión si está autenticado
        // De lo contrario, lanzará un error 401 automáticamente
        $sessionUser = $this->requireAuth();
        
        $this->json($sessionUser);
    }

    // Cerrar Sesión (POST /api/auth/logout)
    public function logout() {
        $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
        $userId = isset($input['userId']) ? (int)$input['userId'] : null;

        $sessionUser = $_SESSION['user'] ?? null;
        if (!$userId && $sessionUser) {
            $userId = (int)$sessionUser['id'];
        }

        if ($userId) {
            $userModel = new User();
            $userModel->clearSession($userId);
        }

        // Limpiar el arreglo de sesión y destruir la sesión del servidor
        $_SESSION = [];

        if (ini_get("session.use_cookies")) {
            $params = session_get_cookie_params();
            setcookie(session_name(), '', time() - 42000,
                $params["path"], $params["domain"],
                $params["secure"], $params["httponly"]
            );
        }

        session_destroy();

        $this->json(['message' => 'Sesión cerrada correctamente.']);
    }

    // Solicitar recuperación de contraseña (POST /api/auth/forgot-password)
    public function forgotPassword() {
        $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
        $email = trim($input['email'] ?? '');
        
        if (empty($email)) {
            $this->error('El correo electrónico es obligatorio.', 400);
        }
        
        $db = \Config\Database::getInstance()->getConnection();
        $stmt = $db->prepare("SELECT id FROM users WHERE email = :email");
        $stmt->execute(['email' => $email]);
        $user = $stmt->fetch();
        
        if (!$user) {
            $this->error('No se encontró ningún usuario con ese correo electrónico.', 404);
        }
        
        // Generar token de recuperación
        $token = strval(rand(100000, 999999));
        $expires = date('Y-m-d H:i:s', strtotime('+30 minutes'));

        // Guardar token en la BD (funciona en multi-instancia, a diferencia de $_SESSION)
        $db = \Config\Database::getInstance()->getConnection();
        // Crear columnas si no existen (auto-migración ligera)
        try {
            $db->exec("ALTER TABLE users ADD COLUMN reset_token VARCHAR(10) NULL DEFAULT NULL");
        } catch (\Exception $e) { /* columna ya existe, ignorar */ }
        try {
            $db->exec("ALTER TABLE users ADD COLUMN reset_token_expires DATETIME NULL DEFAULT NULL");
        } catch (\Exception $e) { /* columna ya existe, ignorar */ }

        $stmtTok = $db->prepare(
            "UPDATE users SET reset_token = :token, reset_token_expires = :expires WHERE email = :email"
        );
        $stmtTok->execute(['token' => $token, 'expires' => $expires, 'email' => $email]);
        
        // Leer variables de entorno (.env local o Railway variables)
        $env = file_exists(__DIR__ . '/../../.env') ? parse_ini_file(__DIR__ . '/../../.env') : [];
        $resendApiKey = getenv('RESEND_API_KEY') ?: ($env['RESEND_API_KEY'] ?? '');
        $smtpFrom     = getenv('SMTP_FROM')      ?: ($env['SMTP_FROM']      ?? 'onboarding@resend.dev');
        $smtpFromName = getenv('SMTP_FROM_NAME') ?: ($env['SMTP_FROM_NAME'] ?? 'SAII');

        $emailBody = "
            <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;
                        padding: 20px; border: 1px solid #ddd; border-radius: 8px;'>
                <h2 style='color: #0d3580;'>Recuperación de Contraseña — SAII</h2>
                <p>Hola,</p>
                <p>Has solicitado restablecer tu contraseña en el <strong>Sistema Administrativo del Instituto de Informática (SAII)</strong>.</p>
                <p style='font-size: 1.1rem;'>Tu código de seguridad es:</p>
                <p style='font-size: 2rem; font-weight: bold; letter-spacing: 8px;
                           text-align: center; color: #0d3580; padding: 16px;
                           background: #f0f4ff; border-radius: 6px;'>{$token}</p>
                <p>Ingresa este código en la pantalla de recuperación para crear tu nueva contraseña.</p>
                <hr style='border: 0; border-top: 1px solid #eee; margin: 20px 0;'>
                <p style='font-size: 12px; color: #777;'>Si no solicitaste este cambio, ignora este correo de forma segura.</p>
            </div>
        ";

        // ── Intento 1: API HTTP de Resend (funciona en Railway, no usa SMTP) ──────
        if (!empty($resendApiKey)) {
            $payload = json_encode([
                'from'    => "{$smtpFromName} <{$smtpFrom}>",
                'to'      => [$email],
                'subject' => 'Código de recuperación de contraseña — SAII',
                'html'    => $emailBody,
            ]);

            $ch = curl_init('https://api.resend.com/emails');
            curl_setopt_array($ch, [
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_POST           => true,
                CURLOPT_POSTFIELDS     => $payload,
                CURLOPT_TIMEOUT        => 10,
                CURLOPT_HTTPHEADER     => [
                    'Content-Type: application/json',
                    "Authorization: Bearer {$resendApiKey}",
                ],
            ]);
            $response   = curl_exec($ch);
            $httpStatus = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            $curlError  = curl_error($ch);
            curl_close($ch);

            if ($httpStatus === 200 || $httpStatus === 201) {
                $this->json([
                    'message' => 'Código de recuperación enviado. Por favor, revisa tu bandeja de entrada o spam.',
                    // No se incluye 'code' cuando el correo se envió realmente
                ]);
                return;
            }

            // Si Resend falló, loggear el error y continuar al fallback PHPMailer
            error_log("Resend API error ({$httpStatus}): {$response} | cURL: {$curlError}");
        }

        // ── Intento 2: PHPMailer SMTP (para entorno local con XAMPP) ────────────
        $smtpHost = getenv('SMTP_HOST') ?: ($env['SMTP_HOST'] ?? 'smtp.gmail.com');
        $smtpUser = getenv('SMTP_USER') ?: ($env['SMTP_USER'] ?? '');
        $smtpPass = getenv('SMTP_PASS') ?: ($env['SMTP_PASS'] ?? '');
        $smtpPort = intval(getenv('SMTP_PORT') ?: ($env['SMTP_PORT'] ?? 587));

        $mail = new PHPMailer(true);
        try {
            $mail->isSMTP();
            $mail->Host      = $smtpHost;
            $mail->SMTPAuth  = !empty($smtpUser);
            $mail->Username  = $smtpUser;
            $mail->Password  = $smtpPass;
            $mail->SMTPSecure = ($smtpPort === 465)
                ? PHPMailer::ENCRYPTION_SMTPS
                : PHPMailer::ENCRYPTION_STARTTLS;
            $mail->Port    = $smtpPort;
            $mail->Timeout = 5;
            $mail->SMTPOptions = ['ssl' => [
                'verify_peer'       => false,
                'verify_peer_name'  => false,
                'allow_self_signed' => true,
            ]];

            $mail->setFrom($smtpFrom, $smtpFromName);
            $mail->addAddress($email);
            $mail->isHTML(true);
            $mail->CharSet = 'UTF-8';
            $mail->Subject = 'Código de recuperación de contraseña — SAII';
            $mail->Body    = $emailBody;
            $mail->send();

            $this->json([
                'message' => 'Código de recuperación enviado. Por favor, revisa tu bandeja de entrada o spam.',
                'code'    => $token,
            ]);
        } catch (Exception $e) {
            error_log("Error SMTP PHPMailer: " . $e->getMessage());
            // Fallback final: mostrar el código en pantalla
            $this->json([
                'message' => 'No se pudo enviar el correo (SMTP bloqueado en el servidor). Usa el código de recuperación que aparece a continuación.',
                'code'    => $token,
            ]);
        }
    }

    // Restablecer contraseña con el código (POST /api/auth/reset-password)
    public function resetPassword() {
        $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
        $code = trim($input['code'] ?? '');
        $newPassword = $input['new_password'] ?? '';
        
        if (empty($code) || empty($newPassword)) {
            $this->error('El código y la nueva contraseña son obligatorios.', 400);
        }
        
        // Verificar token desde la base de datos (no desde sesión, para multi-instancia)
        $db = \Config\Database::getInstance()->getConnection();
        $stmtFind = $db->prepare(
            "SELECT id, email FROM users
             WHERE reset_token = :code
               AND reset_token_expires > NOW()"
        );
        $stmtFind->execute(['code' => $code]);
        $user = $stmtFind->fetch(\PDO::FETCH_ASSOC);

        if (!$user) {
            $this->error('El código de recuperación es incorrecto o ha expirado (válido 30 minutos).', 400);
        }

        // Actualizar contraseña y limpiar token
        $hashed = password_hash($newPassword, PASSWORD_DEFAULT);
        $stmtUp = $db->prepare(
            "UPDATE users
             SET password = :password, reset_token = NULL, reset_token_expires = NULL
             WHERE id = :id"
        );
        $stmtUp->execute(['password' => $hashed, 'id' => $user['id']]);

        $this->json([
            'message' => 'Contraseña restablecida correctamente.',
        ]);
    }
}
