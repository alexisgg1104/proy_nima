<?php

namespace App\Controllers;

use App\Core\BaseController;
use App\Models\Attendance;
use App\Models\Group;
use App\Models\Teacher;
use App\Models\Enrollment;
use Exception;

class AttendanceController extends BaseController {

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

    // Listar cabeceras de asistencia (GET /api/attendance)
    public function index() {
        $this->requireAuth(['admin', 'secretary', 'teacher']);

        $filters = [];
        $teacherId = $this->getTeacherIdForUser();

        // Si es docente, se fuerza que solo vea sus propias asistencias
        if ($teacherId !== null) {
            $filters['teacher_id'] = $teacherId;
        } else {
            // Si es admin o secretaria, puede filtrar por cualquier docente
            if (!empty($_GET['teacher_id'])) {
                $filters['teacher_id'] = (int)$_GET['teacher_id'];
            }
        }

        if (!empty($_GET['group_id'])) {
            $filters['group_id'] = (int)$_GET['group_id'];
        }
        if (!empty($_GET['course_id'])) {
            $filters['course_id'] = (int)$_GET['course_id'];
        }
        if (!empty($_GET['date'])) {
            $filters['date'] = trim($_GET['date']);
        }
        if (!empty($_GET['status'])) {
            $filters['status'] = trim($_GET['status']);
        }

        $attendanceModel = new Attendance();
        $lists = $attendanceModel->getLists($filters);

        $this->json($lists);
    }

    // Obtener detalle de una lista de asistencia (GET /api/attendance/{id})
    public function show($id) {
        $this->requireAuth(['admin', 'secretary', 'teacher']);

        $attendanceModel = new Attendance();
        $list = $attendanceModel->getListById((int)$id);

        if (!$list) {
            $this->error('Lista de asistencia no encontrada.', 404);
        }

        // Si es docente, verificar que sea el propietario
        $teacherId = $this->getTeacherIdForUser();
        if ($teacherId !== null && (int)$list['teacher_id'] !== $teacherId) {
            $this->error('Acceso denegado. No está autorizado para visualizar la asistencia de este grupo.', 403);
        }

        $list['records'] = $attendanceModel->getRecords((int)$id);

        $this->json($list);
    }

    // Obtener los alumnos matriculados en un grupo para generar la asistencia (GET /api/attendance/group/{groupId}/students)
    public function getTemplateStudents($groupId) {
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
            $this->error('Acceso denegado. No está autorizado para gestionar este grupo académico.', 403);
        }

        // 3. Consultar alumnos matriculados activos en el grupo
        $db = \Config\Database::getInstance()->getConnection();
        $stmt = $db->prepare("
            SELECT s.id as student_id, 
                   s.code as student_code, 
                   CONCAT(s.last_name, ', ', s.first_name) as student_name, 
                   s.dni
            FROM enrollments e
            JOIN students s ON e.student_id = s.id
            WHERE e.group_id = :group_id AND e.status = 'active'
            ORDER BY s.last_name ASC, s.first_name ASC
        ");
        $stmt->execute(['group_id' => $groupId]);
        $students = $stmt->fetchAll();

        $this->json($students);
    }

    // Registrar asistencia (POST /api/attendance)
    public function create() {
        $this->requireAuth(['admin', 'secretary', 'teacher']);

        $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;

        $groupId = isset($input['group_id']) ? (int)$input['group_id'] : null;
        $date = trim($input['date'] ?? '');
        $status = trim($input['status'] ?? 'borrador');
        $records = $input['records'] ?? [];

        if (!$groupId || empty($date) || empty($records)) {
            $this->error('Los campos group_id, date y records son obligatorios.', 400);
        }

        // 1. Validar existencia del grupo
        $groupModel = new Group();
        $group = $groupModel->getById($groupId);
        if (!$group) {
            $this->error('Grupo académico no encontrado.', 404);
        }

        // 2. Control de rol para el Docente
        $teacherId = $this->getTeacherIdForUser();
        if ($teacherId !== null) {
            if ((int)$group['teacher_id'] !== $teacherId) {
                $this->error('Acceso denegado. No está autorizado para registrar asistencia en este grupo académico.', 403);
            }
            // Los docentes no pueden forzar estados de cierre directamente al crear
            if ($status !== 'borrador' && $status !== 'registrada') {
                $this->error('Estado no permitido para el docente.', 400);
            }
            $finalTeacherId = $teacherId;
        } else {
            $finalTeacherId = (int)$group['teacher_id'];
        }

        // 3. Validar que la fecha esté dentro de la vigencia del grupo
        if ($date < $group['start_date'] || $date > $group['end_date']) {
            $this->error('La fecha seleccionada se encuentra fuera del rango de vigencia de las clases de este grupo académico.', 400);
        }

        $attendanceModel = new Attendance();

        // 4. Validar duplicidad de fecha para el mismo grupo (Unique Key)
        if ($attendanceModel->getListByGroupAndDate($groupId, $date)) {
            $this->error('Ya existe asistencia registrada para este grupo académico en la fecha especificada.', 409);
        }

        // 5. Validar que existan alumnos matriculados en el grupo
        $enrolledCount = $groupModel->getEnrolledCount($groupId);
        if ($enrolledCount === 0) {
            $this->error('No se puede registrar asistencia. No hay alumnos matriculados en este grupo.', 400);
        }

        // 6. Validar formato de records
        $validStatuses = ['presente', 'tarde', 'falta', 'justificado'];
        foreach ($records as $record) {
            if (empty($record['student_id']) || empty($record['status'])) {
                $this->error('Todos los registros de alumnos deben incluir student_id y status.', 400);
            }
            if (!in_array($record['status'], $validStatuses)) {
                $this->error('El estado de asistencia del estudiante debe ser presente, tarde, falta o justificado.', 400);
            }
        }

        try {
            $listId = $attendanceModel->createList([
                'group_id' => $groupId,
                'teacher_id' => $finalTeacherId,
                'date' => $date,
                'status' => $status,
                'admin_observation' => $input['admin_observation'] ?? null
            ], $records);

            $this->json([
                'id' => (int)$listId,
                'message' => 'Asistencia registrada exitosamente.'
            ], 201);
        } catch (Exception $e) {
            $this->error('Ocurrió un error al guardar la asistencia en el servidor.', 500);
        }
    }

    // Actualizar asistencia (PUT /api/attendance/{id})
    public function update($id) {
        $this->requireAuth(['admin', 'secretary', 'teacher']);

        $attendanceModel = new Attendance();
        $list = $attendanceModel->getListById((int)$id);

        if (!$list) {
            $this->error('Lista de asistencia no encontrada.', 404);
        }

        // 1. Si la lista está cerrada, nadie (excepto posiblemente reabrir mediante endpoint especial) puede editarla
        if ($list['status'] === 'cerrada') {
            $this->error('La lista de asistencia cerrada ya no puede ser modificada.', 400);
        }

        $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;

        $status = trim($input['status'] ?? $list['status']);
        $records = $input['records'] ?? [];
        $adminObservation = isset($input['admin_observation']) ? trim($input['admin_observation']) : $list['admin_observation'];

        // 2. Control de rol para el Docente
        $teacherId = $this->getTeacherIdForUser();
        if ($teacherId !== null) {
            if ((int)$list['teacher_id'] !== $teacherId) {
                $this->error('Acceso denegado. No está autorizado para modificar la asistencia de este grupo académico.', 403);
            }
            // Si la asistencia ya estaba en "registrada" (y no estaba en borrador u observada), el docente ya no puede tocarla
            if ($list['status'] === 'registrada') {
                $this->error('La lista ya ha sido registrada oficialmente y no puede ser modificada por el docente.', 403);
            }
            // Los docentes solo pueden cambiar a borrador o registrada
            if ($status !== 'borrador' && $status !== 'registrada') {
                $this->error('Estado de lista no permitido para el docente.', 400);
            }
            $adminObservation = $list['admin_observation']; // El docente no edita observaciones del administrador
        }

        // 3. Validar registros de alumnos si se envían
        if (!empty($records)) {
            $validStatuses = ['presente', 'tarde', 'falta', 'justificado'];
            foreach ($records as $record) {
                if (empty($record['student_id']) || empty($record['status'])) {
                    $this->error('Los registros de alumnos deben incluir student_id y status.', 400);
                }
                if (!in_array($record['status'], $validStatuses)) {
                    $this->error('El estado de asistencia debe ser presente, tarde, falta o justificado.', 400);
                }
            }
        } else {
            // Si no se envían registros nuevos, mantener los existentes
            $records = $attendanceModel->getRecords((int)$id);
        }

        try {
            $attendanceModel->updateList((int)$id, $records, $status, $adminObservation);
            $this->json(['message' => 'Lista de asistencia actualizada exitosamente.']);
        } catch (Exception $e) {
            $this->error('Ocurrió un error al actualizar la asistencia en el servidor.', 500);
        }
    }

    // Cambiar estado administrativamente (POST /api/attendance/{id}/status)
    public function updateStatus($id) {
        $this->requireAuth(['admin', 'secretary', 'teacher']);

        $attendanceModel = new Attendance();
        $list = $attendanceModel->getListById((int)$id);

        if (!$list) {
            $this->error('Lista de asistencia no encontrada.', 404);
        }

        $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
        $status = trim($input['status'] ?? '');
        $adminObservation = isset($input['admin_observation']) ? trim($input['admin_observation']) : null;

        if (empty($status)) {
            $this->error('El campo status es obligatorio.', 400);
        }

        $validStatuses = ['borrador', 'registrada', 'observada', 'cerrada'];
        if (!in_array($status, $validStatuses)) {
            $this->error('El estado especificado no es válido.', 400);
        }

        try {
            $attendanceModel->updateListStatus((int)$id, $status, $adminObservation);
            $this->json(['message' => "Estado de la asistencia actualizado exitosamente a '$status'."]);
        } catch (Exception $e) {
            $this->error('Ocurrió un error al cambiar el estado de la asistencia en el servidor.', 500);
        }
    }

    // Eliminar asistencia (DELETE /api/attendance/{id})
    public function delete($id) {
        $this->requireAuth(['admin', 'secretary']);

        $attendanceModel = new Attendance();
        $list = $attendanceModel->getListById((int)$id);

        if (!$list) {
            $this->error('Lista de asistencia no encontrada.', 404);
        }

        try {
            $attendanceModel->deleteList((int)$id);
            $this->json(['message' => 'Lista de asistencia eliminada exitosamente.']);
        } catch (Exception $e) {
            $this->error('Ocurrió un error al intentar eliminar la lista de asistencia.', 500);
        }
    }
}
