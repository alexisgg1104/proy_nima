<?php

namespace App\Controllers;

use App\Core\BaseController;
use App\Models\Enrollment;
use App\Models\Student;
use App\Models\Group;
use Exception;

class EnrollmentController extends BaseController {

    // Listar todas las matrículas (GET /api/enrollments)
    public function index() {
        $this->requireAuth(['admin', 'secretary']);

        $enrollmentModel = new Enrollment();
        $enrollments = $enrollmentModel->getAll();

        $this->json($enrollments);
    }

    // Obtener detalles de una matrícula (GET /api/enrollments/{id})
    public function show($id) {
        $this->requireAuth(['admin', 'secretary']);

        $enrollmentModel = new Enrollment();
        $enrollment = $enrollmentModel->getById((int)$id);

        if (!$enrollment) {
            $this->error('Matrícula no encontrada.', 404);
        }

        $this->json($enrollment);
    }

    // Registrar matrícula (POST /api/enrollments)
    public function create() {
        $this->requireAuth(['admin', 'secretary']);

        $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;

        $studentId = isset($input['student_id']) ? (int)$input['student_id'] : null;
        $groupId = isset($input['group_id']) ? (int)$input['group_id'] : null;

        if (!$studentId || !$groupId) {
            $this->error('Los campos student_id y group_id son obligatorios.', 400);
        }

        // 1. Validar existencia del alumno
        $studentModel = new Student();
        $student = $studentModel->getById($studentId);
        if (!$student) {
            $this->error('El estudiante especificado no existe.', 404);
        }
        if ($student['status'] !== 'active') {
            $this->error('El estudiante especificado no se encuentra activo.', 400);
        }

        // 2. Validar existencia del grupo
        $groupModel = new Group();
        $group = $groupModel->getById($groupId);
        if (!$group) {
            $this->error('El grupo académico especificado no existe.', 404);
        }

        // 3. Validar que el estudiante no se encuentre matriculado en el mismo grupo
        $enrollmentModel = new Enrollment();
        if ($enrollmentModel->isStudentEnrolledInGroup($studentId, $groupId)) {
            $this->error('El alumno ya se encuentra matriculado en este grupo académico.', 409);
        }

        // 4. Validar disponibilidad de vacante
        $enrolledCount = $groupModel->getEnrolledCount($groupId);
        $maxQuota = (int)$group['max_quota'];

        if ($enrolledCount >= $maxQuota) {
            $this->error('El grupo ha alcanzado el límite de vacantes permitidas.', 400);
        }

        try {
            $enrollmentId = $enrollmentModel->create([
                'student_id' => $studentId,
                'group_id' => $groupId,
                'status' => $input['status'] ?? 'active'
            ]);

            $this->json([
                'id' => (int)$enrollmentId,
                'message' => 'Matrícula registrada exitosamente.'
            ], 201);
        } catch (Exception $e) {
            $this->error('Ocurrió un error al registrar la matrícula en el servidor.', 500);
        }
    }

    // Actualizar matrícula (PUT /api/enrollments/{id})
    public function update($id) {
        $this->requireAuth(['admin', 'secretary']);

        $enrollmentModel = new Enrollment();
        $enrollment = $enrollmentModel->getById((int)$id);

        if (!$enrollment) {
            $this->error('Matrícula no encontrada.', 404);
        }

        $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;

        $studentId = isset($input['student_id']) ? (int)$input['student_id'] : (int)$enrollment['student_id'];
        $groupId = isset($input['group_id']) ? (int)$input['group_id'] : (int)$enrollment['group_id'];
        $status = $input['status'] ?? $enrollment['status'];

        // 1. Validar existencia del alumno
        $studentModel = new Student();
        $student = $studentModel->getById($studentId);
        if (!$student || $student['status'] !== 'active') {
            $this->error('El estudiante especificado no existe o no está activo.', 400);
        }

        // 2. Validar existencia del grupo
        $groupModel = new Group();
        $group = $groupModel->getById($groupId);
        if (!$group) {
            $this->error('El grupo académico especificado no existe.', 404);
        }

        // 3. Validar duplicidad de combinación estudiante-grupo si es que cambia
        if ($studentId !== (int)$enrollment['student_id'] || $groupId !== (int)$enrollment['group_id']) {
            if ($enrollmentModel->isStudentEnrolledInGroup($studentId, $groupId)) {
                $this->error('El alumno ya se encuentra matriculado en este grupo académico.', 409);
            }

            // 4. Validar disponibilidad de vacante en el nuevo grupo
            $enrolledCount = $groupModel->getEnrolledCount($groupId);
            $maxQuota = (int)$group['max_quota'];

            if ($enrolledCount >= $maxQuota) {
                $this->error('El nuevo grupo seleccionado ha alcanzado el límite de vacantes.', 400);
            }
        }

        try {
            $enrollmentModel->update((int)$id, [
                'student_id' => $studentId,
                'group_id' => $groupId,
                'status' => $status
            ]);

            $this->json(['message' => 'Matrícula actualizada exitosamente.']);
        } catch (Exception $e) {
            $this->error('Ocurrió un error al actualizar la matrícula en el servidor.', 500);
        }
    }

    // Eliminar matrícula (DELETE /api/enrollments/{id})
    public function delete($id) {
        $this->requireAuth(['admin', 'secretary']);

        $enrollmentModel = new Enrollment();
        $enrollment = $enrollmentModel->getById((int)$id);

        if (!$enrollment) {
            $this->error('Matrícula no encontrada.', 404);
        }

        try {
            $enrollmentModel->delete((int)$id);
            $this->json(['message' => 'Matrícula eliminada exitosamente.']);
        } catch (Exception $e) {
            $this->error('No se puede eliminar la matrícula porque cuenta con actas de notas o asistencias vinculadas.', 400);
        }
    }
}
