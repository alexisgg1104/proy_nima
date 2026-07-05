<?php

namespace App\Controllers;

use App\Core\BaseController;
use App\Models\Grade;
use App\Models\Group;
use App\Models\Teacher;
use App\Models\Course;
use Exception;

class GradeController extends BaseController {

    // Obtener ID del docente asociado al usuario en sesión
    private function getTeacherIdForUser() {
        if (isset($_SESSION['user']) && $_SESSION['user']['role'] === 'teacher') {
            $teacherModel = new Teacher();
            $teacher = $teacherModel->getByUserId((int)$_SESSION['user']['id']);
            if (!$teacher) {
                $this->error('No se encontró el registro de docente asociado al usuario.', 403);
            }
            return (int)$teacher['id'];
        }
        return null;
    }

    // Obtener sábana de notas de un grupo (GET /api/grades/group/{groupId})
    public function showGroupGrades($groupId) {
        $this->requireAuth(['admin', 'secretary', 'teacher']);

        // 1. Validar existencia del grupo
        $groupModel = new Group();
        $group = $groupModel->getById((int)$groupId);
        if (!$group) {
            $this->error('Grupo académico no encontrado.', 404);
        }

        // 2. Si es docente, verificar que sea el propietario
        $teacherId = $this->getTeacherIdForUser();
        if ($teacherId !== null && (int)$group['teacher_id'] !== $teacherId) {
            $this->error('Acceso denegado. No está autorizado para gestionar las calificaciones de este grupo.', 403);
        }

        $gradeModel = new Grade();
        $sheet = $gradeModel->getGradeSheetByGroup((int)$groupId);

        if (!$sheet) {
            // Generar plantilla inicial vacía (sin guardarla en BD aún)
            // Obtener módulos del curso
            $db = \Config\Database::getInstance()->getConnection();
            $stmtModules = $db->prepare("
                SELECT id as course_module_id, name as module_name, percentage as module_percentage 
                FROM course_modules 
                WHERE course_id = :course_id 
                ORDER BY id ASC
            ");
            $stmtModules->execute(['course_id' => (int)$group['course_id']]);
            $modules = $stmtModules->fetchAll();

            // Obtener alumnos matriculados
            $stmtStudents = $db->prepare("
                SELECT s.id as student_id, 
                       s.code as student_code, 
                       CONCAT(s.last_name, ', ', s.first_name) as student_name
                FROM enrollments e
                JOIN students s ON e.student_id = s.id
                WHERE e.group_id = :group_id AND e.status = 'active'
                ORDER BY s.last_name ASC, s.first_name ASC
            ");
            $stmtStudents->execute(['group_id' => (int)$groupId]);
            $students = $stmtStudents->fetchAll();

            // Armar los registros de notas vacíos (nota = 0.00 por defecto)
            $records = [];
            foreach ($students as $student) {
                foreach ($modules as $module) {
                    $records[] = [
                        'student_id' => (int)$student['student_id'],
                        'student_code' => $student['student_code'],
                        'student_name' => $student['student_name'],
                        'course_module_id' => (int)$module['course_module_id'],
                        'module_name' => $module['module_name'],
                        'module_percentage' => (int)$module['module_percentage'],
                        'grade' => 0.00
                    ];
                }
            }

            $this->json([
                'group_id' => (int)$groupId,
                'status' => 'borrador',
                'is_new' => true,
                'records' => $records
            ]);
        } else {
            // Cargar registros existentes
            $records = $gradeModel->getGradeRecords((int)$sheet['id']);
            $this->json([
                'group_id' => (int)$groupId,
                'status' => $sheet['status'],
                'is_new' => false,
                'records' => $records
            ]);
        }
    }

    // Guardar / Actualizar calificaciones (POST /api/grades/group/{groupId})
    public function saveGroupGrades($groupId) {
        $this->requireAuth(['admin', 'secretary', 'teacher']);

        // 1. Validar existencia del grupo
        $groupModel = new Group();
        $group = $groupModel->getById((int)$groupId);
        if (!$group) {
            $this->error('Grupo académico no encontrado.', 404);
        }

        // 2. Si es docente, verificar que sea el propietario
        $teacherId = $this->getTeacherIdForUser();
        if ($teacherId !== null && (int)$group['teacher_id'] !== $teacherId) {
            $this->error('Acceso denegado. No está autorizado para registrar calificaciones en este grupo.', 403);
        }

        $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;

        $status = trim($input['status'] ?? 'borrador');
        $records = $input['records'] ?? [];

        if (empty($records)) {
            $this->error('Debe enviar la lista de calificaciones a registrar.', 400);
        }

        if ($status !== 'borrador' && $status !== 'cerrada') {
            $this->error('El estado del acta de calificaciones debe ser "borrador" o "cerrada".', 400);
        }

        $gradeModel = new Grade();

        // 3. Validar si la sábana actual ya está cerrada
        $sheet = $gradeModel->getGradeSheetByGroup((int)$groupId);
        if ($sheet && $sheet['status'] === 'cerrada') {
            $this->error('El acta de calificaciones de este grupo académico ya se encuentra cerrada y no puede ser modificada.', 400);
        }

        // 4. Validar rangos de calificaciones (0.00 a 20.00)
        foreach ($records as $record) {
            if (!isset($record['student_id']) || !isset($record['course_module_id']) || !isset($record['grade'])) {
                $this->error('Todos los registros de calificaciones deben incluir student_id, course_module_id y grade.', 400);
            }
            
            $gradeVal = $record['grade'];
            if (!is_numeric($gradeVal)) {
                $this->error('La calificación debe ser un valor numérico.', 400);
            }

            $gradeFloat = (float)$gradeVal;
            if ($gradeFloat < 0.00 || $gradeFloat > 20.00) {
                $this->error('La calificación debe estar estrictamente en el rango de 0.00 a 20.00.', 400);
            }
        }

        try {
            $sheetId = $gradeModel->saveGrades((int)$groupId, $records, $status);
            $this->json([
                'id' => (int)$sheetId,
                'message' => 'Calificaciones guardadas exitosamente.'
            ]);
        } catch (Exception $e) {
            $this->error($e->getMessage(), 400);
        }
    }
}
