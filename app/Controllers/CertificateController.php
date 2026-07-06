<?php

namespace App\Controllers;

use App\Core\BaseController;
use App\Models\Certificate;
use App\Models\Student;
use App\Models\Group;
use Exception;

class CertificateController extends BaseController {

    // Listar todos los certificados (GET /api/certificates)
    public function index() {
        $this->requireAuth(['admin', 'secretary', 'dean']);

        $certModel = new Certificate();
        $certs = $certModel->getAll();

        foreach ($certs as &$cert) {
            $cert['signatures'] = $certModel->getSignatures((int)$cert['id']);
        }

        $this->json($certs);
    }

    // Obtener detalles de un certificado y sus firmas (GET /api/certificates/{id})
    public function show($id) {
        $this->requireAuth(['admin', 'secretary', 'dean']);

        $certModel = new Certificate();
        $cert = $certModel->getById((int)$id);

        if (!$cert) {
            $this->error('Certificado no encontrado.', 404);
        }

        $cert['signatures'] = $certModel->getSignatures((int)$id);

        $this->json($cert);
    }

    // Emitir un nuevo certificado (POST /api/certificates)
    public function create() {
        $this->requireAuth(['admin', 'secretary']);

        $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;

        $studentId = isset($input['student_id']) ? (int)$input['student_id'] : null;
        $groupId = isset($input['group_id']) ? (int)$input['group_id'] : null;
        $type = trim($input['type'] ?? ''); // 'certificado' o 'constancia'

        if (!$studentId || !$groupId || empty($type)) {
            $this->error('Los campos student_id, group_id y type son obligatorios.', 400);
        }

        if ($type !== 'certificado' && $type !== 'constancia') {
            $this->error('El tipo debe ser "certificado" o "constancia".', 400);
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

        $certModel = new Certificate();

        // 3. Validar si ya existe este certificado/constancia emitido
        if ($certModel->getByStudentAndGroup($studentId, $groupId, $type)) {
            $this->error('El estudiante ya cuenta con un certificado o constancia registrado para este grupo académico.', 409);
        }

        // 4. Validar elegibilidad del alumno (Promedio >= 11 y Asistencia >= 70%)
        $eligibility = $certModel->checkEligibility($studentId, $groupId);
        if (!$eligibility['eligible']) {
            $reasonsStr = implode(' ', $eligibility['reasons']);
            $this->error("El estudiante no cumple con los requisitos mínimos de emisión. Detalle: $reasonsStr", 400);
        }

        // 5. Generar código único para el certificado (Ej. CERT-CB-2024-01-S01-12345)
        $cleanGroupCode = preg_replace('/[^A-Za-z0-9\-]/', '', $group['code']);
        $uniqueCode = strtoupper(substr($type, 0, 4)) . '-' . $cleanGroupCode . '-' . $student['code'];
        
        // Comprobar que no exista duplicado del código (por seguridad)
        $counter = 1;
        $finalCode = $uniqueCode;
        while ($certModel->getByCode($finalCode)) {
            $finalCode = $uniqueCode . '-' . $counter;
            $counter++;
        }

        try {
            $certId = $certModel->create([
                'student_id' => $studentId,
                'group_id' => $groupId,
                'code' => $finalCode,
                'type' => $type,
                'status' => 'toBeSigned',
                'observations' => trim($input['observations'] ?? '')
            ]);

            $this->json([
                'id' => (int)$certId,
                'code' => $finalCode,
                'message' => 'Certificado generado en estado pendiente de firmas.'
            ], 201);
        } catch (Exception $e) {
            $this->error('Ocurrió un error al registrar el certificado en el servidor.', 500);
        }
    }

    // Registrar firma de certificado (POST /api/certificates/{id}/sign)
    public function sign($id) {
        $this->requireAuth(['admin', 'secretary', 'dean']);

        $certModel = new Certificate();
        $cert = $certModel->getById((int)$id);

        if (!$cert) {
            $this->error('Certificado no encontrado.', 404);
        }

        $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
        $signerName = trim($input['signer_name'] ?? '');
        $role = trim($input['role'] ?? ''); // 'director' o 'decano'

        if (empty($signerName) || empty($role)) {
            $this->error('Los campos signer_name y role son obligatorios.', 400);
        }

        if ($role !== 'director' && $role !== 'decano') {
            $this->error('El rol del firmante debe ser "director" o "decano".', 400);
        }

        try {
            $certModel->sign((int)$id, $role, $signerName);
            $this->json(['message' => "Firma del $role registrada de manera exitosa."]);
        } catch (Exception $e) {
            $this->error('Ocurrió un error al registrar la firma electrónica en el servidor.', 500);
        }
    }

    // Registrar observación de certificado (POST /api/certificates/{id}/observation)
    public function saveObservation($id) {
        $this->requireAuth(['admin', 'secretary', 'dean']);

        $certModel = new Certificate();
        $cert = $certModel->getById((int)$id);

        if (!$cert) {
            $this->error('Certificado no encontrado.', 404);
        }

        $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
        $observations = trim($input['observations'] ?? '');

        $db = \Config\Database::getInstance()->getConnection();
        $stmt = $db->prepare("UPDATE certificates SET observations = :observations WHERE id = :id");
        $stmt->execute(['observations' => $observations, 'id' => (int)$id]);

        $this->json(['message' => 'Observación guardada correctamente.']);
    }
}
}
