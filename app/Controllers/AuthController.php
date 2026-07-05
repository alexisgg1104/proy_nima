<?php

namespace App\Controllers;

use App\Core\BaseController;
use App\Models\User;

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
}
