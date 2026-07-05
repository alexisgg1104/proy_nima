<?php

namespace App\Models;

use App\Core\BaseModel;
use PDO;

class Report extends BaseModel {

    // Obtener las métricas y KPIs clave para el Dashboard administrativo
    public function getDashboardKPIs() {
        // 1. Obtener la nota mínima aprobatoria global
        $stmtSettings = $this->db->prepare("SELECT min_passing_grade FROM settings LIMIT 1");
        $stmtSettings->execute();
        $settings = $stmtSettings->fetch();
        $minPassingGrade = $settings ? (float)$settings['min_passing_grade'] : 11.00;

        // 2. Estudiantes activos
        $stmtActiveStudents = $this->db->prepare("SELECT COUNT(*) FROM students WHERE status = 'active'");
        $stmtActiveStudents->execute();
        $activeStudents = (int)$stmtActiveStudents->fetchColumn();

        // 3. Docentes totales
        $stmtTotalTeachers = $this->db->prepare("SELECT COUNT(*) FROM teachers");
        $stmtTotalTeachers->execute();
        $totalTeachers = (int)$stmtTotalTeachers->fetchColumn();

        // 4. Grupos académicos totales
        $stmtTotalGroups = $this->db->prepare("SELECT COUNT(*) FROM academic_groups");
        $stmtTotalGroups->execute();
        $totalGroups = (int)$stmtTotalGroups->fetchColumn();

        // 5. Certificados emitidos firmados
        $stmtCerts = $this->db->prepare("SELECT COUNT(*) FROM certificates WHERE type = 'certificado' AND status = 'generated'");
        $stmtCerts->execute();
        $certifiedCount = (int)$stmtCerts->fetchColumn();

        // 6. Constancias emitidas firmadas
        $stmtConstancias = $this->db->prepare("SELECT COUNT(*) FROM certificates WHERE type = 'constancia' AND status = 'generated'");
        $stmtConstancias->execute();
        $constanciasCount = (int)$stmtConstancias->fetchColumn();

        // 7. Nota promedio de la institución
        $stmtAvgGrade = $this->db->prepare("SELECT AVG(grade) FROM grade_records");
        $stmtAvgGrade->execute();
        $avgGradeVal = $stmtAvgGrade->fetchColumn();
        $averageGrade = $avgGradeVal !== null ? round((float)$avgGradeVal, 2) : 0.00;

        // 8. Tasa de aprobación
        // Calculamos el promedio ponderado final por estudiante en cada grupo
        $stmtGroupGrades = $this->db->prepare("
            SELECT SUM(gr.grade * cm.percentage / 100) as final_grade
            FROM grade_records gr
            JOIN course_modules cm ON gr.course_module_id = cm.id
            GROUP BY gr.grade_sheet_id, gr.student_id
        ");
        $stmtGroupGrades->execute();
        $finalGrades = $stmtGroupGrades->fetchAll(PDO::FETCH_COLUMN);

        $approved = 0;
        $disapproved = 0;
        foreach ($finalGrades as $grade) {
            if ((float)$grade >= $minPassingGrade) {
                $approved++;
            } else {
                $disapproved++;
            }
        }

        $totalGraded = $approved + $disapproved;
        $approvalRate = $totalGraded > 0 ? round(($approved / $totalGraded) * 100, 2) : 0.00;

        return [
            'active_students' => $activeStudents,
            'total_teachers' => $totalTeachers,
            'total_groups' => $totalGroups,
            'certificates_generated' => $certifiedCount,
            'constancias_generated' => $constanciasCount,
            'average_grade' => $averageGrade,
            'approval_rate' => $approvalRate,
            'graded_count' => $totalGraded,
            'approved_count' => $approved,
            'disapproved_count' => $disapproved
        ];
    }

    // Listar todos los reportes / plantillas guardadas
    public function getSavedReports() {
        $stmt = $this->db->prepare("SELECT * FROM saved_reports ORDER BY id DESC");
        $stmt->execute();
        return $stmt->fetchAll();
    }

    // Obtener un reporte guardado por su ID
    public function getSavedReportById($id) {
        $stmt = $this->db->prepare("SELECT * FROM saved_reports WHERE id = :id");
        $stmt->execute(['id' => $id]);
        return $stmt->fetch();
    }

    // Registrar una nueva plantilla de reporte
    public function createSavedReport($data) {
        $stmt = $this->db->prepare("
            INSERT INTO saved_reports (name, type, created_by, query_config)
            VALUES (:name, :type, :created_by, :query_config)
        ");
        $stmt->execute([
            'name' => $data['name'],
            'type' => $data['type'],
            'created_by' => $data['created_by'],
            'query_config' => $data['query_config']
        ]);
        return $this->db->lastInsertId();
    }

    // Actualizar una plantilla de reporte
    public function updateSavedReport($id, $data) {
        $stmt = $this->db->prepare("
            UPDATE saved_reports
            SET name = :name,
                type = :type,
                query_config = :query_config
            WHERE id = :id
        ");
        return $stmt->execute([
            'id' => $id,
            'name' => $data['name'],
            'type' => $data['type'],
            'query_config' => $data['query_config']
        ]);
    }

    // Eliminar una plantilla de reporte
    public function deleteSavedReport($id) {
        $stmt = $this->db->prepare("DELETE FROM saved_reports WHERE id = :id");
        return $stmt->execute(['id' => $id]);
    }
}
