<?php

namespace App\Models;

use App\Core\BaseModel;
use PDO;

class Group extends BaseModel {

    // Obtener todos los grupos académicos con relaciones
    public function getAll() {
        $stmt = $this->db->prepare("
            SELECT g.*, c.name as course_name, CONCAT(t.first_name, ' ', t.last_name) as teacher_name
            FROM academic_groups g
            JOIN courses c ON g.course_id = c.id
            JOIN teachers t ON g.teacher_id = t.id
            ORDER BY g.id DESC
        ");
        $stmt->execute();
        return $stmt->fetchAll();
    }

    // Obtener un grupo por su ID
    public function getById($id) {
        $stmt = $this->db->prepare("
            SELECT g.*, c.name as course_name, CONCAT(t.first_name, ' ', t.last_name) as teacher_name
            FROM academic_groups g
            JOIN courses c ON g.course_id = c.id
            JOIN teachers t ON g.teacher_id = t.id
            WHERE g.id = :id
        ");
        $stmt->execute(['id' => $id]);
        return $stmt->fetch();
    }

    // Buscar por código de grupo (para duplicados)
    public function getByCode($code) {
        $stmt = $this->db->prepare("SELECT * FROM academic_groups WHERE code = :code");
        $stmt->execute(['code' => $code]);
        return $stmt->fetch();
    }

    // Obtener la cantidad de alumnos matriculados en un grupo específico
    public function getEnrolledCount($groupId) {
        $stmt = $this->db->prepare("SELECT COUNT(*) FROM enrollments WHERE group_id = :group_id");
        $stmt->execute(['group_id' => $groupId]);
        return (int)$stmt->fetchColumn();
    }

    // Registrar un nuevo grupo académico
    public function create($data) {
        $stmt = $this->db->prepare("
            INSERT INTO academic_groups (code, course_id, teacher_id, modality, schedule, start_date, end_date, hours, max_quota, status, observations)
            VALUES (:code, :course_id, :teacher_id, :modality, :schedule, :start_date, :end_date, :hours, :max_quota, :status, :observations)
        ");
        $stmt->execute([
            'code' => $data['code'],
            'course_id' => $data['course_id'],
            'teacher_id' => $data['teacher_id'],
            'modality' => $data['modality'],
            'schedule' => $data['schedule'],
            'start_date' => $data['start_date'],
            'end_date' => $data['end_date'],
            'hours' => $data['hours'],
            'max_quota' => $data['max_quota'],
            'status' => $data['status'] ?? 'open',
            'observations' => $data['observations'] ?? null
        ]);
        return $this->db->lastInsertId();
    }

    // Actualizar datos de un grupo
    public function update($id, $data) {
        $stmt = $this->db->prepare("
            UPDATE academic_groups 
            SET code = :code,
                course_id = :course_id,
                teacher_id = :teacher_id,
                modality = :modality,
                schedule = :schedule,
                start_date = :start_date,
                end_date = :end_date,
                hours = :hours,
                max_quota = :max_quota,
                status = :status,
                observations = :observations
            WHERE id = :id
        ");
        return $stmt->execute([
            'id' => $id,
            'code' => $data['code'],
            'course_id' => $data['course_id'],
            'teacher_id' => $data['teacher_id'],
            'modality' => $data['modality'],
            'schedule' => $data['schedule'],
            'start_date' => $data['start_date'],
            'end_date' => $data['end_date'],
            'hours' => $data['hours'],
            'max_quota' => $data['max_quota'],
            'status' => $data['status'],
            'observations' => $data['observations'] ?? null
        ]);
    }

    // Eliminar grupo académico
    public function delete($id) {
        $stmt = $this->db->prepare("DELETE FROM academic_groups WHERE id = :id");
        return $stmt->execute(['id' => $id]);
    }
}
