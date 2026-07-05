<?php

namespace App\Models;

use App\Core\BaseModel;
use PDO;

class Student extends BaseModel {

    // Obtener todos los alumnos
    public function getAll() {
        $stmt = $this->db->prepare("SELECT * FROM students ORDER BY last_name ASC, first_name ASC");
        $stmt->execute();
        return $stmt->fetchAll();
    }

    // Obtener un alumno por su ID
    public function getById($id) {
        $stmt = $this->db->prepare("SELECT * FROM students WHERE id = :id");
        $stmt->execute(['id' => $id]);
        return $stmt->fetch();
    }

    // Buscar por código (para verificación de duplicados)
    public function getByCode($code) {
        $stmt = $this->db->prepare("SELECT * FROM students WHERE code = :code");
        $stmt->execute(['code' => $code]);
        return $stmt->fetch();
    }

    // Buscar por DNI (para verificación de duplicados)
    public function getByDni($dni) {
        $stmt = $this->db->prepare("SELECT * FROM students WHERE dni = :dni");
        $stmt->execute(['dni' => $dni]);
        return $stmt->fetch();
    }

    // Buscar por Email (para verificación de duplicados)
    public function getByEmail($email) {
        $stmt = $this->db->prepare("SELECT * FROM students WHERE email = :email");
        $stmt->execute(['email' => $email]);
        return $stmt->fetch();
    }

    // Registrar un nuevo alumno
    public function create($data) {
        $stmt = $this->db->prepare("
            INSERT INTO students (user_id, code, dni, first_name, last_name, email, phone, cycle, promotion, status, observations)
            VALUES (:user_id, :code, :dni, :first_name, :last_name, :email, :phone, :cycle, :promotion, :status, :observations)
        ");
        $stmt->execute([
            'user_id' => $data['user_id'] ?? null,
            'code' => $data['code'],
            'dni' => $data['dni'],
            'first_name' => $data['first_name'],
            'last_name' => $data['last_name'],
            'email' => $data['email'],
            'phone' => $data['phone'] ?? null,
            'cycle' => $data['cycle'],
            'promotion' => $data['promotion'],
            'status' => $data['status'] ?? 'active',
            'observations' => $data['observations'] ?? null
        ]);
        return $this->db->lastInsertId();
    }

    // Actualizar datos de un alumno
    public function update($id, $data) {
        $stmt = $this->db->prepare("
            UPDATE students 
            SET user_id = :user_id,
                code = :code,
                dni = :dni,
                first_name = :first_name,
                last_name = :last_name,
                email = :email,
                phone = :phone,
                cycle = :cycle,
                promotion = :promotion,
                status = :status,
                observations = :observations
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
            'cycle' => $data['cycle'],
            'promotion' => $data['promotion'],
            'status' => $data['status'],
            'observations' => $data['observations'] ?? null
        ]);
    }

    // Eliminar físicamente un alumno
    public function delete($id) {
        $stmt = $this->db->prepare("DELETE FROM students WHERE id = :id");
        return $stmt->execute(['id' => $id]);
    }
}
