<?php

namespace App\Models;

use App\Core\BaseModel;

class Role extends BaseModel {
    
    // Obtener la lista de todos los roles
    public function getAll() {
        $stmt = $this->db->prepare("SELECT * FROM roles ORDER BY id ASC");
        $stmt->execute();
        return $stmt->fetchAll();
    }
}
