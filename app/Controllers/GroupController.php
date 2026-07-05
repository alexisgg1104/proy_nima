<?php

namespace App\Controllers;

use App\Core\BaseController;
use App\Models\Group;
use App\Models\Course;
use App\Models\Teacher;
use Exception;

class GroupController extends BaseController {

    // Listar todos los grupos académicos (GET /api/groups)
    public function index() {
        $this->requireAuth(['admin', 'secretary']);

        $groupModel = new Group();
        $groups = $groupModel->getAll();

        // Agregar el recuento dinámico de matriculados a cada grupo
        foreach ($groups as &$group) {
            $group['enrolled_count'] = $groupModel->getEnrolledCount((int)$group['id']);
        }

        $this->json($groups);
    }

    // Obtener detalles de un grupo específico (GET /api/groups/{id})
    public function show($id) {
        $this->requireAuth(['admin', 'secretary']);

        $groupModel = new Group();
        $group = $groupModel->getById((int)$id);

        if (!$group) {
            $this->error('Grupo académico no encontrado.', 404);
        }

        $group['enrolled_count'] = $groupModel->getEnrolledCount((int)$id);

        $this->json($group);
    }

    // Registrar grupo académico (POST /api/groups)
    public function create() {
        $this->requireAuth(['admin', 'secretary']);

        $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;

        $code = trim($input['code'] ?? '');
        $courseId = isset($input['course_id']) ? (int)$input['course_id'] : null;
        $teacherId = isset($input['teacher_id']) ? (int)$input['teacher_id'] : null;
        $modality = trim($input['modality'] ?? '');
        $schedule = trim($input['schedule'] ?? '');
        $startDate = trim($input['start_date'] ?? '');
        $endDate = trim($input['end_date'] ?? '');
        $hours = isset($input['hours']) ? (int)$input['hours'] : null;
        $maxQuota = isset($input['max_quota']) ? (int)$input['max_quota'] : null;

        // 1. Validar campos obligatorios
        if (empty($code) || !$courseId || !$teacherId || empty($modality) || empty($schedule) || empty($startDate) || empty($endDate) || !$hours || !$maxQuota) {
            $this->error('Todos los campos excepto observaciones son obligatorios.', 400);
        }

        // 2. Validar valores válidos para modality
        if ($modality !== 'regular' && $modality !== 'exam') {
            $this->error('La modalidad debe ser "regular" o "exam" (Examen de Suficiencia).', 400);
        }

        // 3. Validar capacidad máxima mayor que 0
        if ($maxQuota <= 0) {
            $this->error('La vacante máxima del grupo debe ser un número mayor a 0.', 400);
        }

        $groupModel = new Group();

        // 4. Validar código duplicado
        if ($groupModel->getByCode($code)) {
            $this->error('Ya existe un grupo académico registrado con el mismo código.', 409);
        }

        // 5. Validar existencia y estado del curso
        $courseModel = new Course();
        $course = $courseModel->getById($courseId);
        if (!$course || $course['status'] !== 'active') {
            $this->error('El curso especificado no existe o no se encuentra activo.', 400);
        }

        // 6. Validar existencia y estado del docente
        $teacherModel = new Teacher();
        $teacher = $teacherModel->getById($teacherId);
        if (!$teacher || $teacher['status'] !== 'active') {
            $this->error('El docente especificado no existe o no se encuentra activo.', 400);
        }

        try {
            $groupId = $groupModel->create([
                'code' => $code,
                'course_id' => $courseId,
                'teacher_id' => $teacherId,
                'modality' => $modality,
                'schedule' => $schedule,
                'start_date' => $startDate,
                'end_date' => $endDate,
                'hours' => $hours,
                'max_quota' => $maxQuota,
                'status' => $input['status'] ?? 'open',
                'observations' => trim($input['observations'] ?? '')
            ]);

            $this->json([
                'id' => (int)$groupId,
                'message' => 'Grupo académico registrado exitosamente.'
            ], 201);
        } catch (Exception $e) {
            $this->error('Ocurrió un error al registrar el grupo en la base de datos.', 500);
        }
    }

    // Actualizar grupo académico (PUT /api/groups/{id})
    public function update($id) {
        $this->requireAuth(['admin', 'secretary']);

        $groupModel = new Group();
        $group = $groupModel->getById((int)$id);

        if (!$group) {
            $this->error('Grupo académico no encontrado.', 404);
        }

        $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;

        $code = trim($input['code'] ?? $group['code']);
        $courseId = isset($input['course_id']) ? (int)$input['course_id'] : (int)$group['course_id'];
        $teacherId = isset($input['teacher_id']) ? (int)$input['teacher_id'] : (int)$group['teacher_id'];
        $modality = trim($input['modality'] ?? $group['modality']);
        $schedule = trim($input['schedule'] ?? $group['schedule']);
        $startDate = trim($input['start_date'] ?? $group['start_date']);
        $endDate = trim($input['end_date'] ?? $group['end_date']);
        $hours = isset($input['hours']) ? (int)$input['hours'] : (int)$group['hours'];
        $maxQuota = isset($input['max_quota']) ? (int)$input['max_quota'] : (int)$group['max_quota'];

        // 1. Validar campos obligatorios
        if (empty($code) || !$courseId || !$teacherId || empty($modality) || empty($schedule) || empty($startDate) || empty($endDate) || !$hours || !$maxQuota) {
            $this->error('Todos los campos obligatorios deben ser provistos.', 400);
        }

        // 2. Validar duplicados de código
        $existingCode = $groupModel->getByCode($code);
        if ($existingCode && (int)$existingCode['id'] !== (int)$id) {
            $this->error('Ya existe otro grupo académico registrado con el código proporcionado.', 409);
        }

        // 3. Validar capacidad máxima contra los matriculados actuales
        $enrolledCount = $groupModel->getEnrolledCount((int)$id);
        if ($maxQuota < $enrolledCount) {
            $this->error("La capacidad máxima no puede ser menor que la cantidad de alumnos ya matriculados ($enrolledCount).", 400);
        }

        try {
            $groupModel->update((int)$id, [
                'code' => $code,
                'course_id' => $courseId,
                'teacher_id' => $teacherId,
                'modality' => $modality,
                'schedule' => $schedule,
                'start_date' => $startDate,
                'end_date' => $endDate,
                'hours' => $hours,
                'max_quota' => $maxQuota,
                'status' => $input['status'] ?? $group['status'],
                'observations' => trim($input['observations'] ?? $group['observations'])
            ]);

            $this->json(['message' => 'Grupo académico actualizado exitosamente.']);
        } catch (Exception $e) {
            $this->error('Ocurrió un error al actualizar el grupo en la base de datos.', 500);
        }
    }

    // Eliminar grupo académico (DELETE /api/groups/{id})
    public function delete($id) {
        $this->requireAuth(['admin', 'secretary']);

        $groupModel = new Group();
        $group = $groupModel->getById((int)$id);

        if (!$group) {
            $this->error('Grupo académico no encontrado.', 404);
        }

        try {
            $groupModel->delete((int)$id);
            $this->json(['message' => 'Grupo académico eliminado exitosamente.']);
        } catch (Exception $e) {
            $this->error('No se puede eliminar el grupo porque ya cuenta con alumnos matriculados o sesiones de asistencia registradas.', 400);
        }
    }
}
