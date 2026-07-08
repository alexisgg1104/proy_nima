<?php

namespace App\Controllers;

use App\Core\BaseController;
use App\Models\Teacher;
use Exception;

class TeacherController extends BaseController {

    // Listar todos los docentes (GET /api/teachers)
    public function index() {
        $this->requireAuth(['admin', 'secretary', 'teacher', 'dean']);

        $teacherModel = new Teacher();
        $teachers = $teacherModel->getAll();

        $this->json($teachers);
    }

    // Obtener un docente por ID (GET /api/teachers/{id})
    public function show($id) {
        $this->requireAuth(['admin', 'secretary']);

        $teacherModel = new Teacher();
        $teacher = $teacherModel->getById((int)$id);

        if (!$teacher) {
            $this->error('Docente no encontrado.', 404);
        }

        $this->json($teacher);
    }

    // Registrar docente (POST /api/teachers)
    public function create() {
        $this->requireAuth(['admin', 'secretary']);

        $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;

        $code = trim($input['code'] ?? '');
        $dni = trim($input['dni'] ?? '');
        $firstName = trim($input['first_name'] ?? '');
        $lastName = trim($input['last_name'] ?? '');
        $email = trim($input['email'] ?? '');
        $specialty = trim($input['specialty'] ?? '');

        // 1. Validar campos obligatorios
        if (empty($code) || empty($dni) || empty($firstName) || empty($lastName) || empty($email) || empty($specialty)) {
            $this->error('Todos los campos excepto teléfono son obligatorios.', 400);
        }

        // 2. Validar formato de DNI (exactamente 8 dígitos)
        if (!preg_match('/^\d{8}$/', $dni)) {
            $this->error('El DNI debe tener exactamente 8 dígitos numéricos.', 400);
        }

        // 3. Validar formato de Código (3 a 15 caracteres alfanuméricos)
        if (!preg_match('/^[A-Za-z0-9]{3,15}$/', $code)) {
            $this->error('El código del docente debe tener entre 3 y 15 caracteres alfanuméricos.', 400);
        }

        // 4. Validar formato de correo electrónico
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $this->error('El correo electrónico no tiene un formato válido.', 400);
        }

        $teacherModel = new Teacher();

        // 5. Validar duplicados en BD usando una sola consulta para mejorar rendimiento
        $duplicate = $teacherModel->checkDuplicates($code, $dni, $email);
        if ($duplicate) {
            if ($duplicate['dni'] === $dni) {
                $this->error('Ya existe un docente registrado con este mismo DNI.', 409);
            }
            if ($duplicate['code'] === $code) {
                $this->error('Ya existe un docente registrado con este mismo código académico.', 409);
            }
            if ($duplicate['email'] === $email) {
                $this->error('Ya existe un docente registrado con este mismo correo electrónico.', 409);
            }
        }

        try {
            $teacherId = $teacherModel->create([
                'user_id' => $input['user_id'] ?? null,
                'code' => $code,
                'dni' => $dni,
                'first_name' => $firstName,
                'last_name' => $lastName,
                'email' => $email,
                'phone' => trim($input['phone'] ?? ''),
                'specialty' => $specialty,
                'status' => $input['status'] ?? 'active'
            ]);

            $this->json([
                'id' => (int)$teacherId,
                'message' => 'Docente registrado exitosamente.'
            ], 201);
        } catch (Exception $e) {
            $this->error('Ocurrió un error al registrar el docente en la base de datos.', 500);
        }
    }

    // Actualizar docente (PUT /api/teachers/{id})
    public function update($id) {
        $this->requireAuth(['admin', 'secretary']);

        $teacherModel = new Teacher();
        $teacher = $teacherModel->getById((int)$id);

        if (!$teacher) {
            $this->error('Docente no encontrado.', 404);
        }

        $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;

        $code = trim($input['code'] ?? $teacher['code']);
        $dni = trim($input['dni'] ?? $teacher['dni']);
        $firstName = trim($input['first_name'] ?? $teacher['first_name']);
        $lastName = trim($input['last_name'] ?? $teacher['last_name']);
        $email = trim($input['email'] ?? $teacher['email']);
        $specialty = trim($input['specialty'] ?? $teacher['specialty']);

        // 1. Validar campos obligatorios
        if (empty($code) || empty($dni) || empty($firstName) || empty($lastName) || empty($email) || empty($specialty)) {
            $this->error('Todos los campos obligatorios deben ser completados.', 400);
        }

        // 2. Validar formatos
        if (!preg_match('/^\d{8}$/', $dni)) {
            $this->error('El DNI debe tener exactamente 8 dígitos numéricos.', 400);
        }
        if (!preg_match('/^[A-Za-z0-9]{3,15}$/', $code)) {
            $this->error('El código del docente debe tener entre 3 y 15 caracteres alfanuméricos.', 400);
        }
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $this->error('El correo electrónico no tiene un formato válido.', 400);
        }

        // 3. Validar duplicados en BD usando una sola consulta excluyendo al actual para mejorar rendimiento
        $duplicate = $teacherModel->checkDuplicatesExclude($code, $dni, $email, $id);
        if ($duplicate) {
            if ($duplicate['dni'] === $dni) {
                $this->error('Ya existe otro docente registrado con el DNI proporcionado.', 409);
            }
            if ($duplicate['code'] === $code) {
                $this->error('Ya existe otro docente registrado con el código académico proporcionado.', 409);
            }
            if ($duplicate['email'] === $email) {
                $this->error('Ya existe otro docente registrado con el correo proporcionado.', 409);
            }
        }

        try {
            $teacherModel->update((int)$id, [
                'user_id' => $input['user_id'] ?? $teacher['user_id'],
                'code' => $code,
                'dni' => $dni,
                'first_name' => $firstName,
                'last_name' => $lastName,
                'email' => $email,
                'phone' => trim($input['phone'] ?? $teacher['phone']),
                'specialty' => $specialty,
                'status' => $input['status'] ?? $teacher['status']
            ]);

            $this->json(['message' => 'Datos del docente actualizados exitosamente.']);
        } catch (Exception $e) {
            $this->error('Ocurrió un error al actualizar el docente en la base de datos.', 500);
        }
    }

    // Eliminar docente (DELETE /api/teachers/{id})
    public function delete($id) {
        $this->requireAuth(['admin', 'secretary']);

        $teacherModel = new Teacher();
        $teacher = $teacherModel->getById((int)$id);

        if (!$teacher) {
            $this->error('Docente no encontrado.', 404);
        }

        try {
            $teacherModel->delete((int)$id);
            $this->json(['message' => 'Docente eliminado exitosamente.']);
        } catch (Exception $e) {
            // Si el docente tiene grupos asociados
            $this->error('No se puede eliminar el docente porque cuenta con grupos académicos asignados.', 400);
        }
    }
}
