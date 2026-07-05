<?php

namespace App\Models;

use App\Core\BaseModel;
use PDO;
use Exception;

class Course extends BaseModel {

    // Listar todos los cursos
    public function getAll() {
        $stmt = $this->db->prepare("SELECT * FROM courses ORDER BY name ASC");
        $stmt->execute();
        return $stmt->fetchAll();
    }

    // Obtener un curso por su ID
    public function getById($id) {
        $stmt = $this->db->prepare("SELECT * FROM courses WHERE id = :id");
        $stmt->execute(['id' => $id]);
        return $stmt->fetch();
    }

    // Obtener los módulos de un curso
    public function getModules($courseId) {
        $stmt = $this->db->prepare("SELECT id, name, percentage FROM course_modules WHERE course_id = :course_id ORDER BY id ASC");
        $stmt->execute(['course_id' => $courseId]);
        return $stmt->fetchAll();
    }

    // Buscar por código (para verificación de duplicados)
    public function getByCode($code) {
        $stmt = $this->db->prepare("SELECT * FROM courses WHERE code = :code");
        $stmt->execute(['code' => $code]);
        return $stmt->fetch();
    }

    // Crear un curso y sus módulos de forma Transaccional
    public function create($courseData, $modules) {
        $this->db->beginTransaction();

        try {
            // 1. Insertar el curso
            $stmt = $this->db->prepare("
                INSERT INTO courses (code, name, description, total_hours, status)
                VALUES (:code, :name, :description, :total_hours, :status)
            ");
            $stmt->execute([
                'code' => $courseData['code'],
                'name' => $courseData['name'],
                'description' => $courseData['description'] ?? null,
                'total_hours' => $courseData['total_hours'],
                'status' => $courseData['status'] ?? 'active'
            ]);
            $courseId = $this->db->lastInsertId();

            // 2. Insertar cada módulo asociado
            $stmtModule = $this->db->prepare("
                INSERT INTO course_modules (course_id, name, percentage)
                VALUES (:course_id, :name, :percentage)
            ");
            foreach ($modules as $module) {
                $stmtModule->execute([
                    'course_id' => $courseId,
                    'name' => $module['name'],
                    'percentage' => (int)$module['percentage']
                ]);
            }

            $this->db->commit();
            return $courseId;
        } catch (Exception $e) {
            $this->db->rollBack();
            throw $e;
        }
    }

    // Actualizar un curso y re-crear sus módulos de forma Transaccional
    public function update($id, $courseData, $modules) {
        $this->db->beginTransaction();

        try {
            // 1. Actualizar datos del curso
            $stmt = $this->db->prepare("
                UPDATE courses 
                SET code = :code,
                    name = :name,
                    description = :description,
                    total_hours = :total_hours,
                    status = :status
                WHERE id = :id
            ");
            $stmt->execute([
                'id' => $id,
                'code' => $courseData['code'],
                'name' => $courseData['name'],
                'description' => $courseData['description'] ?? null,
                'total_hours' => $courseData['total_hours'],
                'status' => $courseData['status']
            ]);

            // 2. Eliminar módulos antiguos (para evitar inconsistencias)
            $stmtDelete = $this->db->prepare("DELETE FROM course_modules WHERE course_id = :course_id");
            $stmtDelete->execute(['course_id' => $id]);

            // 3. Insertar la nueva lista de módulos
            $stmtModule = $this->db->prepare("
                INSERT INTO course_modules (course_id, name, percentage)
                VALUES (:course_id, :name, :percentage)
            ");
            foreach ($modules as $module) {
                $stmtModule->execute([
                    'course_id' => $id,
                    'name' => $module['name'],
                    'percentage' => (int)$module['percentage']
                ]);
            }

            $this->db->commit();
            return true;
        } catch (Exception $e) {
            $this->db->rollBack();
            throw $e;
        }
    }

    // Eliminar un curso (y sus módulos en cascada automática por FK de la BD)
    public function delete($id) {
        $stmt = $this->db->prepare("DELETE FROM courses WHERE id = :id");
        return $stmt->execute(['id' => $id]);
    }
}
