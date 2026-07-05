<?php

namespace App\Controllers;

use App\Core\BaseController;
use App\Models\Course;
use Exception;

class CourseController extends BaseController {

    // Listar todos los cursos (GET /api/courses)
    public function index() {
        $this->requireAuth(['admin', 'secretary']);

        $courseModel = new Course();
        $courses = $courseModel->getAll();

        // Para cada curso, obtener sus módulos correspondientes
        foreach ($courses as &$course) {
            $course['modules'] = $courseModel->getModules((int)$course['id']);
        }

        $this->json($courses);
    }

    // Obtener un curso por ID (GET /api/courses/{id})
    public function show($id) {
        $this->requireAuth(['admin', 'secretary']);

        $courseModel = new Course();
        $course = $courseModel->getById((int)$id);

        if (!$course) {
            $this->error('Curso no encontrado.', 404);
        }

        $course['modules'] = $courseModel->getModules((int)$id);

        $this->json($course);
    }

    // Registrar curso y módulos (POST /api/courses)
    public function create() {
        $this->requireAuth(['admin', 'secretary']);

        $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;

        $code = trim($input['code'] ?? '');
        $name = trim($input['name'] ?? '');
        $totalHours = isset($input['total_hours']) ? (int)$input['total_hours'] : null;
        $modules = $input['modules'] ?? [];

        // 1. Validar campos obligatorios
        if (empty($code) || empty($name) || !$totalHours) {
            $this->error('Los campos código, nombre y horas totales son obligatorios.', 400);
        }

        // 2. Validar que tenga módulos registrados
        if (empty($modules) || !is_array($modules)) {
            $this->error('Debe registrar al menos un módulo para el curso.', 400);
        }

        // 3. Validar que los porcentajes de los módulos sumen exactamente 100%
        $sum = 0;
        foreach ($modules as $module) {
            $sum += isset($module['percentage']) ? (int)$module['percentage'] : 0;
        }

        if ($sum !== 100) {
            $this->error("La suma de los porcentajes de los módulos debe ser exactamente 100%. Suma actual: $sum%.", 400);
        }

        $courseModel = new Course();

        // 4. Validar código duplicado
        if ($courseModel->getByCode($code)) {
            $this->error('Ya existe un curso registrado con el mismo código.', 409);
        }

        try {
            $courseId = $courseModel->create([
                'code' => $code,
                'name' => $name,
                'description' => trim($input['description'] ?? ''),
                'total_hours' => $totalHours,
                'status' => $input['status'] ?? 'active'
            ], $modules);

            $this->json([
                'id' => (int)$courseId,
                'message' => 'Curso y módulos registrados exitosamente.'
            ], 201);
        } catch (Exception $e) {
            $this->error('Ocurrió un error al registrar el curso en la base de datos.', 500);
        }
    }

    // Actualizar curso y módulos (PUT /api/courses/{id})
    public function update($id) {
        $this->requireAuth(['admin', 'secretary']);

        $courseModel = new Course();
        $course = $courseModel->getById((int)$id);

        if (!$course) {
            $this->error('Curso no encontrado.', 404);
        }

        $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;

        $code = trim($input['code'] ?? $course['code']);
        $name = trim($input['name'] ?? $course['name']);
        $totalHours = isset($input['total_hours']) ? (int)$input['total_hours'] : (int)$course['total_hours'];
        $modules = $input['modules'] ?? null;

        // 1. Validar campos obligatorios
        if (empty($code) || empty($name) || !$totalHours) {
            $this->error('Los campos código, nombre y horas totales son obligatorios.', 400);
        }

        // 2. Si vienen módulos en el body, validar que sumen 100%
        if ($modules !== null) {
            if (empty($modules) || !is_array($modules)) {
                $this->error('Debe registrar al menos un módulo para el curso.', 400);
            }

            $sum = 0;
            foreach ($modules as $module) {
                $sum += isset($module['percentage']) ? (int)$module['percentage'] : 0;
            }

            if ($sum !== 100) {
                $this->error("La suma de los porcentajes de los módulos debe ser exactamente 100%. Suma actual: $sum%.", 400);
            }
        } else {
            // Si no vienen módulos, mantenemos los que ya tiene en BD
            $modules = $courseModel->getModules((int)$id);
        }

        // 3. Validar duplicados de código
        $existingCode = $courseModel->getByCode($code);
        if ($existingCode && (int)$existingCode['id'] !== (int)$id) {
            $this->error('Ya existe otro curso registrado con el código proporcionado.', 409);
        }

        try {
            $courseModel->update((int)$id, [
                'code' => $code,
                'name' => $name,
                'description' => trim($input['description'] ?? $course['description']),
                'total_hours' => $totalHours,
                'status' => $input['status'] ?? $course['status']
            ], $modules);

            $this->json(['message' => 'Curso y módulos actualizados exitosamente.']);
        } catch (Exception $e) {
            $this->error('Ocurrió un error al actualizar el curso en la base de datos.', 500);
        }
    }

    // Eliminar curso (DELETE /api/courses/{id})
    public function delete($id) {
        $this->requireAuth(['admin', 'secretary']);

        $courseModel = new Course();
        $course = $courseModel->getById((int)$id);

        if (!$course) {
            $this->error('Curso no encontrado.', 404);
        }

        try {
            $courseModel->delete((int)$id);
            $this->json(['message' => 'Curso y módulos asociados eliminados exitosamente.']);
        } catch (Exception $e) {
            $this->error('No se puede eliminar el curso porque tiene grupos académicos asociados en el sistema.', 400);
        }
    }
}
