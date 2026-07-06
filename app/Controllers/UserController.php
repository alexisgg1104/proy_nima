<?php

namespace App\Controllers;

use App\Core\BaseController;
use App\Models\User;
use Exception;

class UserController extends BaseController {

    // Listar todos los usuarios (GET /api/users) - Protegido: Solo Admin
    public function index() {
        $this->requireAuth(['admin']);

        $userModel = new User();
        $users = $userModel->getAll();

        $this->json($users);
    }

    // Obtener un usuario específico (GET /api/users/{id}) - Protegido: Solo Admin
    public function show($id) {
        $this->requireAuth(['admin']);

        $userModel = new User();
        $user = $userModel->getById((int)$id);

        if (!$user) {
            $this->error('Usuario no encontrado.', 404);
        }

        $this->json($user);
    }

    // Registrar un nuevo usuario (POST /api/users) - Protegido: Solo Admin
    public function create() {
        $this->requireAuth(['admin']);

        $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;

        $username = trim($input['username'] ?? '');
        $password = $input['password'] ?? '';
        $fullName = trim($input['full_name'] ?? '');
        $email = trim($input['email'] ?? '');
        $roleId = isset($input['role_id']) ? (int)$input['role_id'] : null;

        if (empty($username) || empty($password) || empty($fullName) || empty($email) || !$roleId) {
            $this->error('Todos los campos son obligatorios.', 400);
        }

        $userModel = new User();

        try {
            $userId = $userModel->create([
                'username' => $username,
                'password' => $password,
                'full_name' => $fullName,
                'email' => $email,
                'role_id' => $roleId,
                'status' => $input['status'] ?? 'active'
            ]);

            $this->json([
                'id' => (int)$userId,
                'message' => 'Usuario creado exitosamente.'
            ], 201);
        } catch (Exception $e) {
            if (strpos($e->getMessage(), 'Duplicate entry') !== false || $e->getCode() == 23000) {
                $this->error('El nombre de usuario o el correo electrónico ya está registrado.', 409);
            }
            $this->error('Ocurrió un error al registrar el usuario en el servidor.', 500);
        }
    }

    // Actualizar datos de un usuario (PUT /api/users/{id}) - Protegido: Solo Admin
    public function update($id) {
        $this->requireAuth(['admin']);

        $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;

        $userModel = new User();
        $user = $userModel->getById((int)$id);

        if (!$user) {
            $this->error('Usuario no encontrado.', 404);
        }

        // Si los campos no vienen en la petición, mantener los valores actuales
        $data = [
            'username' => trim($input['username'] ?? $user['username']),
            'full_name' => trim($input['full_name'] ?? $user['full_name']),
            'email' => trim($input['email'] ?? $user['email']),
            'role_id' => isset($input['role_id']) ? (int)$input['role_id'] : (int)$user['role_id'],
            'status' => $input['status'] ?? $user['status'],
            'password' => $input['password'] ?? null // Solo se actualiza si no viene vacío
        ];

        try {
            $userModel->update((int)$id, $data);
            $this->json(['message' => 'Usuario actualizado exitosamente.']);
        } catch (Exception $e) {
            if (strpos($e->getMessage(), 'Duplicate entry') !== false || $e->getCode() == 23000) {
                $this->error('El nombre de usuario o el correo electrónico ya está registrado.', 409);
            }
            $this->error('Ocurrió un error al actualizar el usuario en el servidor.', 500);
        }
    }

    // Eliminar un usuario (DELETE /api/users/{id}) - Protegido: Solo Admin
    public function delete($id) {
        $currentUser = $this->requireAuth(['admin']);

        // Evitar que el administrador se elimine a sí mismo
        if ((int)$id === (int)$currentUser['id']) {
            $this->error('No puedes eliminar tu propia cuenta de usuario en sesión.', 400);
        }

        $userModel = new User();
        $user = $userModel->getById((int)$id);

        if (!$user) {
            $this->error('Usuario no encontrado.', 404);
        }

        try {
            $userModel->delete((int)$id);
            $this->json(['message' => 'Usuario eliminado exitosamente.']);
        } catch (Exception $e) {
            // Si tiene registros dependientes en cascada restringida
            $this->error('No se puede eliminar el usuario porque tiene registros dependientes (alumnos o docentes).', 400);
        }
    }

    // Listar todos los roles con sus permisos (GET /api/roles)
    public function getRoles() {
        $this->requireAuth(['admin']);
        $roleModel = new \App\Models\Role();
        $roles = $roleModel->getAll();
        
        $result = [];
        $roleLabels = [
            'admin' => 'Administrador',
            'secretary' => 'Secretaria Académica',
            'teacher' => 'Docente',
            'coordinator' => 'Coordinador Académico',
            'dean' => 'decano'
        ];
        
        foreach ($roles as $r) {
            $perms = json_decode($r['permissions'] ?? '[]', true);
            $result[] = [
                'id' => $r['key_name'],
                'name' => $roleLabels[$r['key_name']] ?? $r['name'],
                'permissions' => $perms
            ];
        }
        
        $this->json($result);
    }

    // Actualizar permisos de un rol (PUT /api/roles/{key}/permissions)
    public function updateRolePermissions($key) {
        $this->requireAuth(['admin']);
        $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
        
        $permissions = $input['permissions'] ?? [];
        if (!is_array($permissions)) {
            $this->error('Formato de permisos inválido.', 400);
        }
        
        $roleModel = new \App\Models\Role();
        try {
            $roleModel->updatePermissions($key, $permissions);
            $this->json(['message' => 'Permisos actualizados correctamente.']);
        } catch (Exception $e) {
            $this->error('Error al actualizar permisos en el servidor.', 500);
        }
    }

    // Cambiar contraseña de un usuario (PUT /api/users/{id}/password)
    public function changePassword($id) {
        if (!isset($_SESSION['user'])) {
            $this->error('No autorizado.', 401);
        }
        $currentUser = $_SESSION['user'];
        if ($currentUser['role'] !== 'admin' && (int)$currentUser['id'] !== (int)$id) {
            $this->error('Acceso denegado.', 403);
        }
        $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
        
        $currentPassword = $input['current_password'] ?? '';
        $newPassword = $input['new_password'] ?? '';
        
        $isOwnPassword = (int)$currentUser['id'] === (int)$id;
        $isAdminBypass = $currentUser['role'] === 'admin' && !$isOwnPassword;

        if ($isAdminBypass) {
            if (empty($newPassword)) {
                $this->error('La nueva contraseña es obligatoria.', 400);
            }
        } else {
            if (empty($currentPassword) || empty($newPassword)) {
                $this->error('La contraseña actual y la nueva son obligatorias.', 400);
            }
        }
        
        $db = \Config\Database::getInstance()->getConnection();
        $stmt = $db->prepare("SELECT password FROM users WHERE id = :id");
        $stmt->execute(['id' => (int)$id]);
        $user = $stmt->fetch();
        
        if (!$user) {
            $this->error('Usuario no encontrado.', 404);
        }
        
        // Verificar contraseña actual solo si no es admin bypass
        if (!$isAdminBypass) {
            if (!password_verify($currentPassword, $user['password'])) {
                $this->error('La contraseña actual es incorrecta.', 400);
            }
        }
        
        // Actualizar contraseña
        $hashed = password_hash($newPassword, PASSWORD_DEFAULT);
        $stmtUpdate = $db->prepare("UPDATE users SET password = :password WHERE id = :id");
        $stmtUpdate->execute(['password' => $hashed, 'id' => (int)$id]);
        
        $this->json(['message' => 'Contraseña actualizada correctamente.']);
    }
}
