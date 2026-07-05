<?php

namespace App\Models;

use App\Core\BaseModel;
use PDO;

class Enrollment extends BaseModel {

    // Obtener todas las matrículas con relaciones detalladas
    public function getAll() {
        $stmt = $this->db->prepare("
            SELECT e.*, 
                   s.code as student_code, CONCAT(s.first_name, ' ', s.last_name) as student_name,
                   g.code as group_code, c.name as course_name
            FROM enrollments e
            JOIN students s ON e.student_id = s.id
            JOIN academic_groups g ON e.group_id = g.id
            JOIN courses c ON g.course_id = c.id
            ORDER BY e.id DESC
        ");
        $stmt->execute();
        return $stmt->fetchAll();
    }

    // Obtener una matrícula por su ID
    public function getById($id) {
        $stmt = $this->db->prepare("
            SELECT e.*, 
                   s.code as student_code, CONCAT(s.first_name, ' ', s.last_name) as student_name,
                   g.code as group_code, c.name as course_name
            FROM enrollments e
            JOIN students s ON e.student_id = s.id
            JOIN academic_groups g ON e.group_id = g.id
            JOIN courses c ON g.course_id = c.id
            WHERE e.id = :id
        ");
        $stmt->execute(['id' => $id]);
        return $stmt->fetch();
    }

    // Verificar si un estudiante ya se encuentra matriculado en un grupo
    public function isStudentEnrolledInGroup($studentId, $groupId) {
        $stmt = $this->db->prepare("SELECT COUNT(*) FROM enrollments WHERE student_id = :student_id AND group_id = :group_id");
        $stmt->execute([
            'student_id' => $studentId,
            'group_id' => $groupId
        ]);
        return (int)$stmt->fetchColumn() > 0;
    }

    // Registrar matrícula
    public function create($data) {
        $stmt = $this->db->prepare("
            INSERT INTO enrollments (student_id, group_id, status)
            VALUES (:student_id, :group_id, :status)
        ");
        $stmt->execute([
            'student_id' => $data['student_id'],
            'group_id' => $data['group_id'],
            'status' => $data['status'] ?? 'active'
        ]);
        return $this->db->lastInsertId();
    }

    // Actualizar matrícula
    public function update($id, $data) {
        $stmt = $this->db->prepare("
            UPDATE enrollments 
            SET student_id = :student_id,
                group_id = :group_id,
                status = :status
            WHERE id = :id
        ");
        return $stmt->execute([
            'id' => $id,
            'student_id' => $data['student_id'],
            'group_id' => $data['group_id'],
            'status' => $data['status']
        ]);
    }

    // Eliminar matrícula
    public function delete($id) {
        $stmt = $this->db->prepare("DELETE FROM enrollments WHERE id = :id");
        return $stmt->execute(['id' => $id]);
    }
}
