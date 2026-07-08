<?php

namespace App\Models;

use App\Core\BaseModel;
use PDO;

class Teacher extends BaseModel {

    // Obtener todos los docentes
    public function getAll() {
        $stmt = $this->db->prepare("SELECT * FROM teachers ORDER BY last_name ASC, first_name ASC");
        $stmt->execute();
        return $stmt->fetchAll();
    }

    // Obtener un docente por su ID
    public function getById($id) {
        $stmt = $this->db->prepare("SELECT * FROM teachers WHERE id = :id");
        $stmt->execute(['id' => $id]);
        return $stmt->fetch();
    }

    // Buscar por código (para verificación de duplicados)
    public function getByCode($code) {
        $stmt = $this->db->prepare("SELECT * FROM teachers WHERE code = :code");
        $stmt->execute(['code' => $code]);
        return $stmt->fetch();
    }

    // Buscar por DNI (para verificación de duplicados)
    public function getByDni($dni) {
        $stmt = $this->db->prepare("SELECT * FROM teachers WHERE dni = :dni");
        $stmt->execute(['dni' => $dni]);
        return $stmt->fetch();
    }

    // Buscar por Email (para verificación de duplicados)
    public function getByEmail($email) {
        $stmt = $this->db->prepare("SELECT * FROM teachers WHERE email = :email");
        $stmt->execute(['email' => $email]);
        return $stmt->fetch();
    }

    // Registrar un nuevo docente
    public function create($data) {
        $stmt = $this->db->prepare("
            INSERT INTO teachers (user_id, code, dni, first_name, last_name, email, phone, specialty, status)
            VALUES (:user_id, :code, :dni, :first_name, :last_name, :email, :phone, :specialty, :status)
        ");
        $stmt->execute([
            'user_id' => $data['user_id'] ?? null,
            'code' => $data['code'],
            'dni' => $data['dni'],
            'first_name' => $data['first_name'],
            'last_name' => $data['last_name'],
            'email' => $data['email'],
            'phone' => $data['phone'] ?? null,
            'specialty' => $data['specialty'],
            'status' => $data['status'] ?? 'active'
        ]);
        return $this->db->lastInsertId();
    }

    // Actualizar datos de un docente
    public function update($id, $data) {
        $stmt = $this->db->prepare("
            UPDATE teachers 
            SET user_id = :user_id,
                code = :code,
                dni = :dni,
                first_name = :first_name,
                last_name = :last_name,
                email = :email,
                phone = :phone,
                specialty = :specialty,
                status = :status
            WHERE id = :id
        ");
        return $stmt->execute([
            'id' => $id,
            'user_id' => $data['user_id'] ?? null,
            'code' => $data['code'],
            'dni' => $data['dni'],
            'first_name' => $data['first_name'],
            'last_name' => $data['last_name'],
            'email' => $data['email'],
            'phone' => $data['phone'] ?? null,
            'specialty' => $data['specialty'],
            'status' => $data['status']
        ]);
    }

    // Eliminar un docente
    public function delete($id) {
        $stmt = $this->db->prepare("DELETE FROM teachers WHERE id = :id");
        return $stmt->execute(['id' => $id]);
    }

    // Obtener un docente por su User ID
    public function getByUserId($userId) {
        $stmt = $this->db->prepare("SELECT * FROM teachers WHERE user_id = :user_id");
        $stmt->execute(['user_id' => $userId]);
        return $stmt->fetch();
    }

    // Validar duplicados de una sola vez para mejorar rendimiento
    public function checkDuplicates($code, $dni, $email) {
        $stmt = $this->db->prepare("SELECT code, dni, email FROM teachers WHERE code = :code OR dni = :dni OR email = :email LIMIT 1");
        $stmt->execute(['code' => $code, 'dni' => $dni, 'email' => $email]);
        return $stmt->fetch();
    }

    // Validar duplicados excluyendo al actual para mejorar rendimiento en actualizaciones
    public function checkDuplicatesExclude($code, $dni, $email, $excludeId) {
        $stmt = $this->db->prepare("SELECT code, dni, email FROM teachers WHERE (code = :code OR dni = :dni OR email = :email) AND id != :exclude_id LIMIT 1");
        $stmt->execute(['code' => $code, 'dni' => $dni, 'email' => $email, 'exclude_id' => $excludeId]);
        return $stmt->fetch();
    }
}
