<?php

namespace App\Models;

use App\Core\BaseModel;
use PDO;
use Exception;

class Certificate extends BaseModel {

    // Obtener todos los certificados con detalles
    public function getAll() {
        $stmt = $this->db->prepare("
            SELECT c.*, 
                   s.code as student_code, 
                   CONCAT(s.last_name, ', ', s.first_name) as student_name,
                   g.code as group_code, 
                   crs.name as course_name
            FROM certificates c
            JOIN students s ON c.student_id = s.id
            JOIN academic_groups g ON c.group_id = g.id
            JOIN courses crs ON g.course_id = crs.id
            ORDER BY c.id DESC
        ");
        $stmt->execute();
        return $stmt->fetchAll();
    }

    // Obtener detalles de un certificado específico por ID
    public function getById($id) {
        $stmt = $this->db->prepare("
            SELECT c.*, 
                   s.code as student_code, 
                   CONCAT(s.last_name, ', ', s.first_name) as student_name,
                   g.code as group_code, 
                   crs.name as course_name
            FROM certificates c
            JOIN students s ON c.student_id = s.id
            JOIN academic_groups g ON c.group_id = g.id
            JOIN courses crs ON g.course_id = crs.id
            WHERE c.id = :id
        ");
        $stmt->execute(['id' => $id]);
        return $stmt->fetch();
    }

    // Buscar certificado por código único
    public function getByCode($code) {
        $stmt = $this->db->prepare("SELECT * FROM certificates WHERE code = :code");
        $stmt->execute(['code' => $code]);
        return $stmt->fetch();
    }

    // Buscar si ya existe un certificado de cierto tipo para el alumno en el grupo
    public function getByStudentAndGroup($studentId, $groupId, $type) {
        $stmt = $this->db->prepare("SELECT * FROM certificates WHERE student_id = :student_id AND group_id = :group_id AND type = :type");
        $stmt->execute([
            'student_id' => $studentId,
            'group_id' => $groupId,
            'type' => $type
        ]);
        return $stmt->fetch();
    }

    // Obtener las firmas de un certificado
    public function getSignatures($certificateId) {
        $stmt = $this->db->prepare("SELECT * FROM certificate_signatures WHERE certificate_id = :certificate_id ORDER BY id ASC");
        $stmt->execute(['certificate_id' => $certificateId]);
        return $stmt->fetchAll();
    }

    // Emitir/Generar un nuevo certificado y sus firmas vacías de forma Transaccional
    public function create($data) {
        $this->db->beginTransaction();

        try {
            // 1. Insertar el certificado
            $stmt = $this->db->prepare("
                INSERT INTO certificates (student_id, group_id, code, type, status, issue_date, observations)
                VALUES (:student_id, :group_id, :code, :type, :status, :issue_date, :observations)
            ");
            $stmt->execute([
                'student_id' => $data['student_id'],
                'group_id' => $data['group_id'],
                'code' => $data['code'],
                'type' => $data['type'],
                'status' => $data['status'] ?? 'toBeSigned',
                'issue_date' => $data['issue_date'] ?? null,
                'observations' => $data['observations'] ?? null
            ]);
            $certificateId = $this->db->lastInsertId();

            // 2. Generar las dos firmas iniciales en estado pendiente (is_signed = 0)
            $stmtSig = $this->db->prepare("
                INSERT INTO certificate_signatures (certificate_id, signer_name, signer_role, is_signed)
                VALUES (:certificate_id, '', :signer_role, 0)
            ");
            
            $stmtSig->execute(['certificate_id' => $certificateId, 'signer_role' => 'director']);
            $stmtSig->execute(['certificate_id' => $certificateId, 'signer_role' => 'decano']);

            $this->db->commit();
            return $certificateId;
        } catch (Exception $e) {
            $this->db->rollBack();
            throw $e;
        }
    }

    // Firmar electrónicamente el certificado
    public function sign($certificateId, $role, $signerName) {
        $this->db->beginTransaction();

        try {
            // 1. Actualizar el registro de la firma correspondiente
            $stmt = $this->db->prepare("
                UPDATE certificate_signatures 
                SET is_signed = 1,
                    signed_at = NOW(),
                    signer_name = :signer_name
                WHERE certificate_id = :certificate_id AND signer_role = :signer_role
            ");
            $stmt->execute([
                'certificate_id' => $certificateId,
                'signer_role' => $role,
                'signer_name' => $signerName
            ]);

            // 2. Comprobar si ambas firmas están firmadas
            $stmtCheck = $this->db->prepare("
                SELECT COUNT(*) FROM certificate_signatures 
                WHERE certificate_id = :certificate_id AND is_signed = 1
            ");
            $stmtCheck->execute(['certificate_id' => $certificateId]);
            $signedCount = (int)$stmtCheck->fetchColumn();

            // Si ambas firmas están listas, el estado del certificado pasa a "generated" e "issue_date" se establece al día de hoy
            if ($signedCount === 2) {
                $stmtUpdateCert = $this->db->prepare("
                    UPDATE certificates 
                    SET status = 'generated',
                        issue_date = CURDATE()
                    WHERE id = :id
                ");
                $stmtUpdateCert->execute(['id' => $certificateId]);
            } else {
                // Si falta alguna firma, el estado es "pending"
                $stmtUpdateCert = $this->db->prepare("
                    UPDATE certificates 
                    SET status = 'pending'
                    WHERE id = :id
                ");
                $stmtUpdateCert->execute(['id' => $certificateId]);
            }

            $this->db->commit();
            return true;
        } catch (Exception $e) {
            $this->db->rollBack();
            throw $e;
        }
    }

    // Verificar si un estudiante es elegible para recibir un certificado
    public function checkEligibility($studentId, $groupId) {
        // 1. Obtener los parámetros de aprobación configurados en la tabla settings
        $stmtSettings = $this->db->prepare("SELECT min_passing_grade, min_attendance_required FROM settings LIMIT 1");
        $stmtSettings->execute();
        $settings = $stmtSettings->fetch();

        // Parámetros por defecto si no existen configuraciones en BD
        $minPassingGrade = $settings ? (float)$settings['min_passing_grade'] : 11.00;
        $minAttendanceRequired = $settings ? (float)$settings['min_attendance_required'] : 70.00;

        // 2. Calcular el promedio ponderado del alumno en base al porcentaje de los módulos del curso
        $stmtGrades = $this->db->prepare("
            SELECT gr.grade, cm.percentage
            FROM grade_records gr
            JOIN grade_sheets gs ON gr.grade_sheet_id = gs.id
            JOIN course_modules cm ON gr.course_module_id = cm.id
            WHERE gs.group_id = :group_id AND gr.student_id = :student_id
        ");
        $stmtGrades->execute([
            'group_id' => $groupId,
            'student_id' => $studentId
        ]);
        $grades = $stmtGrades->fetchAll();

        $averageGrade = 0.00;
        if (!empty($grades)) {
            $weightedSum = 0.00;
            $percentageSum = 0;
            foreach ($grades as $g) {
                $weightedSum += (float)$g['grade'] * ((int)$g['percentage'] / 100.00);
                $percentageSum += (int)$g['percentage'];
            }
            $averageGrade = $weightedSum;
        }

        // 3. Calcular el porcentaje de asistencia del alumno en el grupo
        // Consultar el total de listas de asistencia pasadas (que estén registradas u oficializadas)
        $stmtTotalLists = $this->db->prepare("
            SELECT COUNT(*) FROM student_attendance_lists 
            WHERE group_id = :group_id AND status != 'borrador'
        ");
        $stmtTotalLists->execute(['group_id' => $groupId]);
        $totalClasses = (int)$stmtTotalLists->fetchColumn();

        $attendancePercentage = 100.00; // Por defecto 100% si no se ha tomado asistencia
        if ($totalClasses > 0) {
            $stmtAttended = $this->db->prepare("
                SELECT COUNT(*) 
                FROM student_attendance_records ar
                JOIN student_attendance_lists al ON ar.attendance_list_id = al.id
                WHERE al.group_id = :group_id 
                  AND al.status != 'borrador'
                  AND ar.student_id = :student_id 
                  AND ar.status IN ('presente', 'tarde', 'justificado')
            ");
            $stmtAttended->execute([
                'group_id' => $groupId,
                'student_id' => $studentId
            ]);
            $attendedClasses = (int)$stmtAttended->fetchColumn();
            $attendancePercentage = ($attendedClasses / $totalClasses) * 100.00;
        }

        // 4. Evaluar elegibilidad
        $reasons = [];
        $isEligible = true;

        if ($averageGrade < $minPassingGrade) {
            $isEligible = false;
            $reasons[] = "Nota promedio ponderada desaprobatoria ($averageGrade < $minPassingGrade).";
        }

        if ($attendancePercentage < $minAttendanceRequired) {
            $isEligible = false;
            $reasons[] = "Porcentaje de asistencia insuficiente ($attendancePercentage% < $minAttendanceRequired%).";
        }

        return [
            'eligible' => $isEligible,
            'average_grade' => round($averageGrade, 2),
            'attendance_percentage' => round($attendancePercentage, 2),
            'min_passing_grade' => $minPassingGrade,
            'min_attendance_required' => $minAttendanceRequired,
            'reasons' => $reasons
        ];
    }
}
