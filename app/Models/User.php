<?php

namespace App\Models;

use App\Core\BaseModel;
use PDO;

class User extends BaseModel {
    
    // Buscar un usuario activo por su nombre de usuario (para login)
    public function findByUsername($username) {
        $stmt = $this->db->prepare("
            SELECT u.*, r.key_name as role_key, r.name as role_name
            FROM users u
            JOIN roles r ON u.role_id = r.id
            WHERE u.username = :username AND u.status = 'active'
        ");
        $stmt->execute(['username' => $username]);
        return $stmt->fetch();
    }

    // Listar todos los usuarios registrados (para administrador)
    public function getAll() {
        $stmt = $this->db->prepare("
            SELECT u.id, u.username, u.full_name, u.email, u.role_id, u.status, u.last_login, u.created_at, u.updated_at,
                   r.key_name as role_key, r.name as role_name
            FROM users u
            JOIN roles r ON u.role_id = r.id
            ORDER BY u.id DESC
        ");
        $stmt->execute();
        return $stmt->fetchAll();
    }

    // Obtener un usuario por su ID
    public function getById($id) {
        $stmt = $this->db->prepare("
            SELECT u.id, u.username, u.full_name, u.email, u.role_id, u.status, u.last_login, u.created_at, u.updated_at,
                   r.key_name as role_key, r.name as role_name
            FROM users u
            JOIN roles r ON u.role_id = r.id
            WHERE u.id = :id
        ");
        $stmt->execute(['id' => $id]);
        return $stmt->fetch();
    }

    // Crear un nuevo usuario en la base de datos
    public function create($data) {
        $stmt = $this->db->prepare("
            INSERT INTO users (username, password, full_name, email, role_id, status)
            VALUES (:username, :password, :full_name, :email, :role_id, :status)
        ");
        $stmt->execute([
            'username' => $data['username'],
            'password' => password_hash($data['password'], PASSWORD_DEFAULT),
            'full_name' => $data['full_name'],
            'email' => $data['email'],
            'role_id' => $data['role_id'],
            'status' => $data['status'] ?? 'active'
        ]);
        return $this->db->lastInsertId();
    }

    // Actualizar datos de un usuario
    public function update($id, $data) {
        $fields = "username = :username, full_name = :full_name, email = :email, role_id = :role_id, status = :status";
        $params = [
            'id' => $id,
            'username' => $data['username'],
            'full_name' => $data['full_name'],
            'email' => $data['email'],
            'role_id' => $data['role_id'],
            'status' => $data['status'] ?? 'active'
        ];

        // Si se provee una nueva contraseña, se hashea y se agrega a la consulta
        if (!empty($data['password'])) {
            $fields .= ", password = :password";
            $params['password'] = password_hash($data['password'], PASSWORD_DEFAULT);
        }

        $stmt = $this->db->prepare("UPDATE users SET $fields WHERE id = :id");
        return $stmt->execute($params);
    }

    // Eliminar un usuario
    public function delete($id) {
        $stmt = $this->db->prepare("DELETE FROM users WHERE id = :id");
        return $stmt->execute(['id' => $id]);
    }

    // Registrar la última fecha/hora de login del usuario
    public function updateLastLogin($id) {
        $stmt = $this->db->prepare("UPDATE users SET last_login = NOW() WHERE id = :id");
        return $stmt->execute(['id' => $id]);
    }

    // Registrar el ID de sesión y actualizar fecha/hora de actividad
    public function updateSession($id, $sessionId) {
        $stmt = $this->db->prepare("UPDATE users SET session_id = :session_id, last_activity = NOW() WHERE id = :id");
        return $stmt->execute(['id' => $id, 'session_id' => $sessionId]);
    }

    // Actualizar fecha/hora de última actividad en la sesión activa
    public function updateLastActivity($id) {
        $stmt = $this->db->prepare("UPDATE users SET last_activity = NOW() WHERE id = :id");
        return $stmt->execute(['id' => $id]);
    }

    // Limpiar el ID de sesión al cerrar sesión
    public function clearSession($id) {
        $stmt = $this->db->prepare("UPDATE users SET session_id = NULL, last_activity = NULL WHERE id = :id");
        return $stmt->execute(['id' => $id]);
    }
}
