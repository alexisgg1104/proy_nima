<?php

namespace App\Models;

use App\Core\BaseModel;
use PDO;
use Exception;

class Attendance extends BaseModel {

    // Obtener listado de cabeceras de asistencia filtradas y con totales agregados
    public function getLists($filters = []) {
        $sql = "
            SELECT al.*, 
                   g.code as group_code, 
                   c.name as course_name, 
                   g.modality,
                   CONCAT(t.first_name, ' ', t.last_name) as teacher_name,
                   (SELECT COUNT(*) FROM student_attendance_records ar WHERE ar.attendance_list_id = al.id) as total_students,
                   (SELECT COUNT(*) FROM student_attendance_records ar WHERE ar.attendance_list_id = al.id AND ar.status = 'presente') as total_present,
                   (SELECT COUNT(*) FROM student_attendance_records ar WHERE ar.attendance_list_id = al.id AND ar.status = 'tarde') as total_tardy,
                   (SELECT COUNT(*) FROM student_attendance_records ar WHERE ar.attendance_list_id = al.id AND ar.status = 'falta') as total_absent,
                   (SELECT COUNT(*) FROM student_attendance_records ar WHERE ar.attendance_list_id = al.id AND ar.status = 'justificado') as total_justified
            FROM student_attendance_lists al
            JOIN academic_groups g ON al.group_id = g.id
            JOIN courses c ON g.course_id = c.id
            JOIN teachers t ON al.teacher_id = t.id
            WHERE 1=1
        ";

        $params = [];

        if (!empty($filters['group_id'])) {
            $sql .= " AND al.group_id = :group_id";
            $params['group_id'] = $filters['group_id'];
        }

        if (!empty($filters['teacher_id'])) {
            $sql .= " AND al.teacher_id = :teacher_id";
            $params['teacher_id'] = $filters['teacher_id'];
        }

        if (!empty($filters['date'])) {
            $sql .= " AND al.date = :date";
            $params['date'] = $filters['date'];
        }

        if (!empty($filters['status'])) {
            $sql .= " AND al.status = :status";
            $params['status'] = $filters['status'];
        }

        if (!empty($filters['course_id'])) {
            $sql .= " AND g.course_id = :course_id";
            $params['course_id'] = $filters['course_id'];
        }

        $sql .= " ORDER BY al.date DESC, al.id DESC";

        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    // Obtener detalles de la cabecera por ID
    public function getListById($id) {
        $stmt = $this->db->prepare("
            SELECT al.*, 
                   g.code as group_code, 
                   c.name as course_name, 
                   g.modality,
                   g.schedule,
                   CONCAT(t.first_name, ' ', t.last_name) as teacher_name
            FROM student_attendance_lists al
            JOIN academic_groups g ON al.group_id = g.id
            JOIN courses c ON g.course_id = c.id
            JOIN teachers t ON al.teacher_id = t.id
            WHERE al.id = :id
        ");
        $stmt->execute(['id' => $id]);
        return $stmt->fetch();
    }

    // Buscar lista por grupo y fecha
    public function getListByGroupAndDate($groupId, $date) {
        $stmt = $this->db->prepare("SELECT * FROM student_attendance_lists WHERE group_id = :group_id AND date = :date");
        $stmt->execute([
            'group_id' => $groupId,
            'date' => $date
        ]);
        return $stmt->fetch();
    }

    // Obtener los registros de alumnos asociados a una lista
    public function getRecords($listId) {
        $stmt = $this->db->prepare("
            SELECT ar.*, 
                   s.code as student_code, 
                   CONCAT(s.first_name, ' ', s.last_name) as student_name, 
                   s.dni
            FROM student_attendance_records ar
            JOIN students s ON ar.student_id = s.id
            WHERE ar.attendance_list_id = :list_id
            ORDER BY s.last_name ASC, s.first_name ASC
        ");
        $stmt->execute(['list_id' => $listId]);
        return $stmt->fetchAll();
    }

    // Crear lista de asistencia y sus registros de alumnos transaccionalmente
    public function createList($headerData, $records) {
        $this->db->beginTransaction();

        try {
            // 1. Insertar cabecera de la lista
            $stmt = $this->db->prepare("
                INSERT INTO student_attendance_lists (group_id, teacher_id, date, status, admin_observation)
                VALUES (:group_id, :teacher_id, :date, :status, :admin_observation)
            ");
            $stmt->execute([
                'group_id' => $headerData['group_id'],
                'teacher_id' => $headerData['teacher_id'],
                'date' => $headerData['date'],
                'status' => $headerData['status'] ?? 'borrador',
                'admin_observation' => $headerData['admin_observation'] ?? null
            ]);
            $listId = $this->db->lastInsertId();

            // 2. Insertar registros por alumno
            $stmtRecord = $this->db->prepare("
                INSERT INTO student_attendance_records (attendance_list_id, student_id, status, arrival_time, observation)
                VALUES (:attendance_list_id, :student_id, :status, :arrival_time, :observation)
            ");
            foreach ($records as $record) {
                $stmtRecord->execute([
                    'attendance_list_id' => $listId,
                    'student_id' => $record['student_id'],
                    'status' => $record['status'],
                    'arrival_time' => !empty($record['arrival_time']) ? $record['arrival_time'] : null,
                    'observation' => !empty($record['observation']) ? trim($record['observation']) : null
                ]);
            }

            $this->db->commit();
            return $listId;
        } catch (Exception $e) {
            $this->db->rollBack();
            throw $e;
        }
    }

    // Actualizar registros y estado de la lista transaccionalmente
    public function updateList($listId, $records, $status, $adminObservation = null) {
        $this->db->beginTransaction();

        try {
            // 1. Actualizar estado y observación en cabecera
            $stmt = $this->db->prepare("
                UPDATE student_attendance_lists 
                SET status = :status,
                    admin_observation = :admin_observation
                WHERE id = :id
            ");
            $stmt->execute([
                'id' => $listId,
                'status' => $status,
                'admin_observation' => $adminObservation
            ]);

            // 2. Eliminar registros de alumnos existentes para esta lista
            $stmtDelete = $this->db->prepare("DELETE FROM student_attendance_records WHERE attendance_list_id = :list_id");
            $stmtDelete->execute(['list_id' => $listId]);

            // 3. Re-insertar los nuevos registros actualizados
            $stmtRecord = $this->db->prepare("
                INSERT INTO student_attendance_records (attendance_list_id, student_id, status, arrival_time, observation)
                VALUES (:attendance_list_id, :student_id, :status, :arrival_time, :observation)
            ");
            foreach ($records as $record) {
                $stmtRecord->execute([
                    'attendance_list_id' => $listId,
                    'student_id' => $record['student_id'],
                    'status' => $record['status'],
                    'arrival_time' => !empty($record['arrival_time']) ? $record['arrival_time'] : null,
                    'observation' => !empty($record['observation']) ? trim($record['observation']) : null
                ]);
            }

            $this->db->commit();
            return true;
        } catch (Exception $e) {
            $this->db->rollBack();
            throw $e;
        }
    }

    // Cambiar solo el estado de la lista (Cerrar / Observar por administrador)
    public function updateListStatus($listId, $status, $adminObservation = null) {
        $stmt = $this->db->prepare("
            UPDATE student_attendance_lists 
            SET status = :status,
                admin_observation = :admin_observation
            WHERE id = :id
        ");
        return $stmt->execute([
            'id' => $listId,
            'status' => $status,
            'admin_observation' => $adminObservation
        ]);
    }

    // Eliminar una lista de asistencia (registros hijos se borran en cascada por FK en MySQL)
    public function deleteList($listId) {
        $stmt = $this->db->prepare("DELETE FROM student_attendance_lists WHERE id = :id");
        return $stmt->execute(['id' => $listId]);
    }
}
