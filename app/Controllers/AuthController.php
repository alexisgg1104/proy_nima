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
        
        // Almacenar el token y el email en la sesión
        $_SESSION['recovery_email'] = $email;
        $_SESSION['recovery_token'] = $token;
        
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
                    'code'    => $token,
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
        
        if (!isset($_SESSION['recovery_token']) || !isset($_SESSION['recovery_email'])) {
            $this->error('No hay una solicitud de recuperación de contraseña activa.', 400);
        }
        
        if ($code !== $_SESSION['recovery_token']) {
            $this->error('El código de recuperación es incorrecto.', 400);
        }
        
        $email = $_SESSION['recovery_email'];
        $db = \Config\Database::getInstance()->getConnection();
        
        // Actualizar contraseña
        $hashed = password_hash($newPassword, PASSWORD_DEFAULT);
        $stmt = $db->prepare("UPDATE users SET password = :password WHERE email = :email");
        $stmt->execute(['password' => $hashed, 'email' => $email]);
        
        // Limpiar variables de recuperación
        unset($_SESSION['recovery_token']);
        unset($_SESSION['recovery_email']);
        
        $this->json([
            'message' => 'Contraseña restablecida correctamente.'
        ]);
    }
}
