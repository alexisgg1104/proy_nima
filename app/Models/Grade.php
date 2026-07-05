<?php

namespace App\Models;

use App\Core\BaseModel;
use PDO;
use Exception;

class Grade extends BaseModel {

    // Obtener la cabecera del acta de notas de un grupo
    public function getGradeSheetByGroup($groupId) {
        $stmt = $this->db->prepare("SELECT * FROM grade_sheets WHERE group_id = :group_id");
        $stmt->execute(['group_id' => $groupId]);
        return $stmt->fetch();
    }

    // Obtener los registros detallados de calificaciones de una acta de notas
    public function getGradeRecords($sheetId) {
        $stmt = $this->db->prepare("
            SELECT gr.*, 
                   s.code as student_code, 
                   CONCAT(s.last_name, ', ', s.first_name) as student_name,
                   cm.name as module_name, 
                   cm.percentage as module_percentage
            FROM grade_records gr
            JOIN students s ON gr.student_id = s.id
            JOIN course_modules cm ON gr.course_module_id = cm.id
            WHERE gr.grade_sheet_id = :sheet_id
            ORDER BY s.last_name ASC, s.first_name ASC, cm.id ASC
        ");
        $stmt->execute(['sheet_id' => $sheetId]);
        return $stmt->fetchAll();
    }

    // Guardar o actualizar la sábana de notas transaccionalmente
    public function saveGrades($groupId, $records, $status = 'borrador') {
        $this->db->beginTransaction();

        try {
            // 1. Obtener o crear la cabecera de la sábana de notas (grade_sheets)
            $sheet = $this->getGradeSheetByGroup($groupId);
            $sheetId = null;

            if ($sheet) {
                if ($sheet['status'] === 'cerrada') {
                    throw new Exception("El acta de calificaciones de este grupo académico ya se encuentra cerrada y no puede ser modificada.");
                }
                $sheetId = (int)$sheet['id'];

                // Actualizar el estado de la sábana de notas
                $stmtUpdateSheet = $this->db->prepare("UPDATE grade_sheets SET status = :status WHERE id = :id");
                $stmtUpdateSheet->execute(['status' => $status, 'id' => $sheetId]);

                // Eliminar calificaciones previas para evitar inconsistencias al guardar de nuevo
                $stmtDelete = $this->db->prepare("DELETE FROM grade_records WHERE grade_sheet_id = :sheet_id");
                $stmtDelete->execute(['sheet_id' => $sheetId]);
            } else {
                // Crear cabecera si no existe
                $stmtInsertSheet = $this->db->prepare("INSERT INTO grade_sheets (group_id, status) VALUES (:group_id, :status)");
                $stmtInsertSheet->execute(['group_id' => $groupId, 'status' => $status]);
                $sheetId = (int)$this->db->lastInsertId();
            }

            // 2. Insertar cada calificación en grade_records
            $stmtInsertRecord = $this->db->prepare("
                INSERT INTO grade_records (grade_sheet_id, student_id, course_module_id, grade)
                VALUES (:grade_sheet_id, :student_id, :course_module_id, :grade)
            ");
            foreach ($records as $record) {
                $stmtInsertRecord->execute([
                    'grade_sheet_id' => $sheetId,
                    'student_id' => $record['student_id'],
                    'course_module_id' => $record['course_module_id'],
                    'grade' => (float)$record['grade']
                ]);
            }

            $this->db->commit();
            return $sheetId;
        } catch (Exception $e) {
            $this->db->rollBack();
            throw $e;
        }
    }
}
