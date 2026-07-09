<?php

namespace App\Controllers;

use App\Core\BaseController;
use App\Models\Student;
use Exception;

class StudentController extends BaseController {

    // Listar todos los estudiantes (GET /api/students)
    public function index() {
        $this->requireAuth(['admin', 'secretary', 'teacher', 'dean']);

        $studentModel = new Student();
        $students = $studentModel->getAll();

        $this->json($students);
    }

    // Obtener un estudiante por ID (GET /api/students/{id})
    public function show($id) {
        $this->requireAuth(['admin', 'secretary']);

        $studentModel = new Student();
        $student = $studentModel->getById((int)$id);

        if (!$student) {
            $this->error('Estudiante no encontrado.', 404);
        }

        $this->json($student);
    }

    // Registrar estudiante (POST /api/students)
    public function create() {
        $this->requireAuth(['admin', 'secretary']);

        $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;

        $code = strtoupper(trim($input['code'] ?? ''));
        $dni = trim($input['dni'] ?? '');
        $firstName = trim($input['first_name'] ?? '');
        $lastName = trim($input['last_name'] ?? '');
        $email = trim($input['email'] ?? '');
        $studentType = trim($input['student_type'] ?? 'pregrado');
        $promotion = trim($input['promotion'] ?? '');

        // 1. Validar campos obligatorios
        if (empty($code) || empty($dni) || empty($firstName) || empty($lastName) || empty($email) || empty($promotion)) {
            $this->error('Todos los campos excepto teléfono y observaciones son obligatorios.', 400);
        }

        // 2. Validar formato de DNI (exactamente 8 dígitos)
        if (!preg_match('/^\d{8}$/', $dni)) {
            $this->error('El DNI debe tener exactamente 8 dígitos numéricos.', 400);
        }

        // 3. Validar formato de Código (según tipo de estudiante)
        if ($studentType === 'externo') {
            if (!preg_match('/^E\d{9}$/', $code)) {
                $this->error('El código para estudiantes externos debe empezar con "E" seguido de 9 dígitos.', 400);
            }
        } else {
            if (!preg_match('/^\d{10}$/', $code)) {
                $this->error('El código debe tener exactamente 10 dígitos numéricos.', 400);
            }
        }

        // 4. Validar formato de correo electrónico
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $this->error('El correo electrónico no tiene un formato válido.', 400);
        }

        $studentModel = new Student();

        // 5. Validar duplicados de DNI, Código y Email en BD
        if ($studentModel->getByDni($dni)) {
            $this->error('Ya existe un estudiante registrado con este mismo DNI.', 409);
        }
        if ($studentModel->getByCode($code)) {
            $this->error('Ya existe un estudiante registrado con este mismo código académico.', 409);
        }
        if ($studentModel->getByEmail($email)) {
            $this->error('Ya existe un estudiante registrado con este mismo correo electrónico.', 409);
        }

        try {
            $studentId = $studentModel->create([
                'user_id' => $input['user_id'] ?? null,
                'code' => $code,
                'dni' => $dni,
                'first_name' => $firstName,
                'last_name' => $lastName,
                'email' => $email,
                'phone' => trim($input['phone'] ?? ''),
                'student_type' => $studentType,
                'promotion' => $promotion,
                'status' => $input['status'] ?? 'active',
                'observations' => trim($input['observations'] ?? '')
            ]);

            $this->json([
                'id' => (int)$studentId,
                'message' => 'Estudiante registrado exitosamente.'
            ], 201);
        } catch (Exception $e) {
            $this->error('Ocurrió un error al registrar el estudiante en la base de datos.', 500);
        }
    }

    // Actualizar estudiante (PUT /api/students/{id})
    public function update($id) {
        $this->requireAuth(['admin', 'secretary']);

        $studentModel = new Student();
        $student = $studentModel->getById((int)$id);

        if (!$student) {
            $this->error('Estudiante no encontrado.', 404);
        }

        $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;

        $code = strtoupper(trim($input['code'] ?? $student['code']));
        $dni = trim($input['dni'] ?? $student['dni']);
        $firstName = trim($input['first_name'] ?? $student['first_name']);
        $lastName = trim($input['last_name'] ?? $student['last_name']);
        $email = trim($input['email'] ?? $student['email']);
        $studentType = trim($input['student_type'] ?? $student['student_type'] ?? 'pregrado');
        $promotion = trim($input['promotion'] ?? $student['promotion']);

        // 1. Validar campos obligatorios
        if (empty($code) || empty($dni) || empty($firstName) || empty($lastName) || empty($email) || empty($promotion)) {
            $this->error('Todos los campos obligatorios deben ser completados.', 400);
        }

        // 2. Validar formatos
        if (!preg_match('/^\d{8}$/', $dni)) {
            $this->error('El DNI debe tener exactamente 8 dígitos numéricos.', 400);
        }
        if ($studentType === 'externo') {
            if (!preg_match('/^E\d{9}$/', $code)) {
                $this->error('El código para estudiantes externos debe empezar con "E" seguido de 9 dígitos.', 400);
            }
        } else {
            if (!preg_match('/^\d{10}$/', $code)) {
                $this->error('El código debe tener exactamente 10 dígitos numéricos.', 400);
            }
        }
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $this->error('El correo electrónico no tiene un formato válido.', 400);
        }

        // 3. Validar duplicados excluyendo al estudiante actual
        $existingDni = $studentModel->getByDni($dni);
        if ($existingDni && (int)$existingDni['id'] !== (int)$id) {
            $this->error('Ya existe otro estudiante registrado con el DNI proporcionado.', 409);
        }

        $existingCode = $studentModel->getByCode($code);
        if ($existingCode && (int)$existingCode['id'] !== (int)$id) {
            $this->error('Ya existe otro estudiante registrado con el código académico proporcionado.', 409);
        }

        $existingEmail = $studentModel->getByEmail($email);
        if ($existingEmail && (int)$existingEmail['id'] !== (int)$id) {
            $this->error('Ya existe otro estudiante registrado con el correo proporcionado.', 409);
        }

        try {
            $studentModel->update((int)$id, [
                'user_id' => $input['user_id'] ?? $student['user_id'],
                'code' => $code,
                'dni' => $dni,
                'first_name' => $firstName,
                'last_name' => $lastName,
                'email' => $email,
                'phone' => trim($input['phone'] ?? $student['phone']),
                'student_type' => $studentType,
                'promotion' => $promotion,
                'status' => $input['status'] ?? $student['status'],
                'observations' => trim($input['observations'] ?? $student['observations'])
            ]);

            $this->json(['message' => 'Datos del estudiante actualizados exitosamente.']);
        } catch (Exception $e) {
            $this->error('Ocurrió un error al actualizar el estudiante en la base de datos.', 500);
        }
    }

    // Eliminar estudiante (DELETE /api/students/{id})
    public function delete($id) {
        $this->requireAuth(['admin', 'secretary']);

        $studentModel = new Student();
        $student = $studentModel->getById((int)$id);

        if (!$student) {
            $this->error('Estudiante no encontrado.', 404);
        }

        try {
            $studentModel->delete((int)$id);
            $this->json(['message' => 'Estudiante eliminado exitosamente.']);
        } catch (Exception $e) {
            // Si el alumno tiene matrículas o actas
            $this->error('No se puede eliminar el estudiante porque cuenta con matrículas o calificaciones registradas.', 400);
        }
    }
}
