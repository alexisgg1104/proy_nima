<?php

namespace App\Controllers;

use App\Core\BaseController;
use App\Models\Report;
use App\Models\Certificate;
use Exception;
use PDO;

// Clase auxiliar autocontenida para compilar un archivo binario PDF (Especificación 1.4) de manera dinámica
class SimplePDF {
    private $buffer = '';
    private $offsets = [];
    private $objects = [];

    public function __construct() {
        $this->buffer = "%PDF-1.4\n";
    }

    private function newObject() {
        $id = count($this->objects) + 1;
        $this->offsets[$id] = strlen($this->buffer);
        $this->objects[$id] = true;
        $this->buffer .= "$id 0 obj\n";
        return $id;
    }

    public function generate($title, $studentName, $courseName, $grade, $groupCode, $date, $signatures = []) {
        // Catalog
        $this->newObject(); // Obj 1
        $this->buffer .= "<< /Type /Catalog /Pages 2 0 R >>\nendobj\n";

        // Pages
        $this->newObject(); // Obj 2
        $this->buffer .= "<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n";

        // Page (Tamaño A4 horizontal: 841.89 x 595.27 puntos)
        $this->newObject(); // Obj 3
        $this->buffer .= "<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /MediaBox [0 0 841.89 595.27] /Contents 6 0 R >>\nendobj\n";

        // Font 1 (Bold)
        $this->newObject(); // Obj 4
        $this->buffer .= "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj\n";

        // Font 2 (Regular)
        $this->newObject(); // Obj 5
        $this->buffer .= "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n";

        // Escapar caracteres en PDF (paréntesis)
        $titleEsc = str_replace(['(', ')'], ['\\(', '\\)'], $title);
        $studentEsc = str_replace(['(', ')'], ['\\(', '\\)'], $studentName);
        $courseEsc = str_replace(['(', ')'], ['\\(', '\\)'], $courseName);
        $gradeEsc = str_replace(['(', ')'], ['\\(', '\\)'], $grade);
        $groupEsc = str_replace(['(', ')'], ['\\(', '\\)'], $groupCode);
        $dateEsc = str_replace(['(', ')'], ['\\(', '\\)'], $date);

        // Flujo del contenido gráfico
        $stream = "BT\n";
        
        // Título del documento
        $stream .= "/F1 24 Tf\n";
        $stream .= "200 480 Td\n";
        $stream .= "(" . strtoupper($titleEsc) . ") Tj\n";

        // Encabezado institucional
        $stream .= "-80 -60 Td\n";
        $stream .= "/F2 16 Tf\n";
        $stream .= "(La Facultad de Ingenieria Industrial de la Universidad Nacional de Piura certifica que:) Tj\n";

        // Nombre del Alumno
        $stream .= "80 -60 Td\n";
        $stream .= "/F1 22 Tf\n";
        $stream .= "(" . $studentEsc . ") Tj\n";

        // Texto de logro
        $stream .= "-80 -50 Td\n";
        $stream .= "/F2 14 Tf\n";
        $stream .= "(Ha completado y aprobado satisfactoriamente los modulos academicos del curso:) Tj\n";

        // Curso
        $stream .= "40 -40 Td\n";
        $stream .= "/F1 18 Tf\n";
        $stream .= "(" . $courseEsc . ") Tj\n";

        // Detalles del Grupo, Promedio y Emisión
        $stream .= "-40 -40 Td\n";
        $stream .= "/F2 12 Tf\n";
        $stream .= "(Codigo de Grupo: " . $groupEsc . "   |   Promedio Ponderado: " . $gradeEsc . "   |   Fecha de Emision: " . $dateEsc . ") Tj\n";

        // Bloque de Firmas y Validación
        if (!empty($signatures)) {
            $stream .= "0 -90 Td\n";
            $stream .= "/F1 11 Tf\n";
            $stream .= "(Firmas Digitales de Autoridades:) Tj\n";
            
            $stream .= "0 -20 Td\n";
            $stream .= "/F2 10 Tf\n";
            $yOffset = 0;
            foreach ($signatures as $sig) {
                $status = $sig['is_signed'] ? "FIRMADO POR: " . $sig['signer_name'] : "FIRMA PENDIENTE";
                $stream .= "0 $yOffset Td\n";
                $stream .= "(" . strtoupper($sig['signer_role']) . " - " . $status . ") Tj\n";
                $yOffset = -15;
            }
        }

        $stream .= "ET\n";

        // Contenido Obj 6 (Stream)
        $this->newObject(); // Obj 6
        $this->buffer .= "<< /Length " . strlen($stream) . " >>\nstream\n" . $stream . "endstream\nendobj\n";

        // Tabla de referencias cruzadas (Xref)
        $xrefPos = strlen($this->buffer);
        $this->buffer .= "xref\n0 " . (count($this->objects) + 1) . "\n";
        $this->buffer .= "0000000000 65535 f \n";
        for ($i = 1; $i <= count($this->objects); $i++) {
            $this->buffer .= sprintf("%010d 00000 n \n", $this->offsets[$i]);
        }

        // Tráiler del PDF
        $this->buffer .= "trailer\n<< /Size " . (count($this->objects) + 1) . " /Root 1 0 R >>\n";
        $this->buffer .= "startxref\n$xrefPos\n%%EOF\n";

        return $this->buffer;
    }
}

class ReportController extends BaseController {

    // Obtener KPIs generales del Dashboard (GET /api/reports/dashboard)
    public function dashboard() {
        $this->requireAuth(['admin', 'secretary', 'teacher', 'dean']);

        $reportModel = new Report();
        $kpis = $reportModel->getDashboardKPIs();

        $this->json($kpis);
    }

    // Listar reportes guardados (GET /api/reports/saved)
    public function listSaved() {
        $this->requireAuth(['admin', 'secretary', 'teacher', 'dean']);

        $reportModel = new Report();
        $reports = $reportModel->getSavedReports();

        // Deserializar la configuración JSON de consultas para comodidad del frontend
        foreach ($reports as &$r) {
            $r['query_config'] = json_decode($r['query_config'], true);
        }

        $this->json($reports);
    }

    // Obtener detalles de un reporte guardado (GET /api/reports/saved/{id})
    public function showSaved($id) {
        $this->requireAuth(['admin', 'secretary', 'teacher', 'dean']);

        $reportModel = new Report();
        $report = $reportModel->getSavedReportById((int)$id);

        if (!$report) {
            $this->error('Reporte guardado no encontrado.', 404);
        }

        $report['query_config'] = json_decode($report['query_config'], true);

        $this->json($report);
    }

    // Registrar plantilla de reporte (POST /api/reports/saved)
    public function createSaved() {
        $user = $this->requireAuth(['admin', 'secretary']);

        $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;

        $name = trim($input['name'] ?? '');
        $type = trim($input['type'] ?? '');
        $queryConfig = $input['query_config'] ?? null;

        if (empty($name) || empty($type) || empty($queryConfig)) {
            $this->error('Los campos name, type y query_config son obligatorios.', 400);
        }

        $reportModel = new Report();

        try {
            $reportId = $reportModel->createSavedReport([
                'name' => $name,
                'type' => $type,
                'created_by' => $user['username'],
                'query_config' => json_encode($queryConfig)
            ]);

            $this->json([
                'id' => (int)$reportId,
                'message' => 'Plantilla de reporte guardada exitosamente.'
            ], 201);
        } catch (Exception $e) {
            $this->error('Ocurrió un error al guardar la plantilla de reporte.', 500);
        }
    }

    // Actualizar plantilla de reporte (PUT /api/reports/saved/{id})
    public function updateSaved($id) {
        $this->requireAuth(['admin', 'secretary']);

        $reportModel = new Report();
        $report = $reportModel->getSavedReportById((int)$id);

        if (!$report) {
            $this->error('Reporte guardado no encontrado.', 404);
        }

        $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;

        $name = trim($input['name'] ?? $report['name']);
        $type = trim($input['type'] ?? $report['type']);
        $queryConfig = isset($input['query_config']) ? $input['query_config'] : json_decode($report['query_config'], true);

        try {
            $reportModel->updateSavedReport((int)$id, [
                'name' => $name,
                'type' => $type,
                'query_config' => json_encode($queryConfig)
            ]);

            $this->json(['message' => 'Plantilla de reporte actualizada exitosamente.']);
        } catch (Exception $e) {
            $this->error('Ocurrió un error al actualizar la plantilla de reporte.', 500);
        }
    }

    // Eliminar plantilla de reporte (DELETE /api/reports/saved/{id})
    public function deleteSaved($id) {
        $this->requireAuth(['admin', 'secretary']);

        $reportModel = new Report();
        $report = $reportModel->getSavedReportById((int)$id);

        if (!$report) {
            $this->error('Reporte guardado no encontrado.', 404);
        }

        try {
            $reportModel->deleteSavedReport((int)$id);
            $this->json(['message' => 'Plantilla de reporte eliminada exitosamente.']);
        } catch (Exception $e) {
            $this->error('Ocurrió un error al intentar eliminar la plantilla de reporte.', 500);
        }
    }

    // Exportar datos reales a CSV en formato Excel-friendly con UTF-8 BOM (GET /api/reports/export/csv)
    public function exportCSV() {
        $this->requireAuth(['admin', 'secretary']);

        $type = trim($_GET['type'] ?? 'students');
        $db = \Config\Database::getInstance()->getConnection();

        // 1. Establecer cabeceras HTTP de descarga de archivo CSV
        header('Content-Type: text/csv; charset=utf-8');
        header('Content-Disposition: attachment; filename="reporte_' . $type . '_' . date('Ymd_His') . '.csv"');

        // 2. Emitir la marca de orden de bytes (BOM) de UTF-8 para que Excel lo abra con las tildes y eñes correctamente
        echo "\xEF\xBB\xBF";

        $output = fopen('php://output', 'w');

        if ($type === 'students') {
            // Escribir cabeceras
            fputcsv($output, ['ID', 'Código', 'DNI', 'Apellidos y Nombres', 'Correo', 'Teléfono', 'Estado'], ';');

            $stmt = $db->query("SELECT id, code, dni, CONCAT(last_name, ', ', first_name) as full_name, email, phone, status FROM students ORDER BY last_name ASC");
            while ($row = $stmt->fetch(PDO::FETCH_NUM)) {
                fputcsv($output, $row, ';');
            }
        } elseif ($type === 'groups') {
            // Escribir cabeceras
            fputcsv($output, ['ID', 'Código Grupo', 'Curso', 'Docente', 'Modalidad', 'Fecha Inicio', 'Fecha Fin', 'Horas', 'Aforo', 'Estado'], ';');

            $stmt = $db->query("
                SELECT g.id, g.code, c.name as course_name, CONCAT(t.last_name, ', ', t.first_name) as teacher_name, 
                       g.modality, g.start_date, g.end_date, g.hours, g.max_quota, g.status
                FROM academic_groups g
                JOIN courses c ON g.course_id = c.id
                JOIN teachers t ON g.teacher_id = t.id
                ORDER BY g.code ASC
            ");
            while ($row = $stmt->fetch(PDO::FETCH_NUM)) {
                fputcsv($output, $row, ';');
            }
        } elseif ($type === 'certificates') {
            // Escribir cabeceras
            fputcsv($output, ['ID', 'Código Certificado', 'Código Alumno', 'Alumno', 'Código Grupo', 'Tipo', 'Estado', 'Fecha Emisión'], ';');

            $stmt = $db->query("
                SELECT c.id, c.code, s.code as student_code, CONCAT(s.last_name, ', ', s.first_name) as student_name, 
                       g.code as group_code, c.type, c.status, c.issue_date
                FROM certificates c
                JOIN students s ON c.student_id = s.id
                JOIN academic_groups g ON c.group_id = g.id
                ORDER BY c.id DESC
            ");
            while ($row = $stmt->fetch(PDO::FETCH_NUM)) {
                fputcsv($output, $row, ';');
            }
        } else {
            fputcsv($output, ['Error: Tipo de reporte no compatible.'], ';');
        }

        fclose($output);
        exit;
    }

    // Exportar e imprimir Certificado/Constancia en formato PDF (GET /api/reports/pdf/certificate/{id})
    public function exportPDF($id) {
        $this->requireAuth(['admin', 'secretary']);

        // 1. Obtener datos del certificado
        $certModel = new Certificate();
        $cert = $certModel->getById((int)$id);

        if (!$cert) {
            $this->error('Certificado no encontrado.', 404);
        }

        // 2. Obtener las firmas asociadas
        $signatures = $certModel->getSignatures((int)$id);

        // 3. Obtener el promedio de notas del alumno en ese grupo académico
        $eligibility = $certModel->checkEligibility((int)$cert['student_id'], (int)$cert['group_id']);
        $finalGrade = number_format($eligibility['average_grade'], 2);

        // 4. Instanciar y compilar el documento PDF
        $title = ($cert['type'] === 'certificado') ? 'CERTIFICADO ACADEMICO' : 'CONSTANCIA ACADEMICA';
        
        $pdfBuilder = new SimplePDF();
        $pdfContent = $pdfBuilder->generate(
            $title,
            $cert['student_name'],
            $cert['course_name'],
            $finalGrade,
            $cert['group_code'],
            $cert['issue_date'] ?? date('Y-m-d'),
            $signatures
        );

        // 5. Servir el flujo del archivo PDF al navegador
        header('Content-Type: application/pdf');
        header('Content-Disposition: inline; filename="documento_' . $cert['code'] . '.pdf"');
        header('Content-Length: ' . strlen($pdfContent));
        
        echo $pdfContent;
        exit;
    }
}
