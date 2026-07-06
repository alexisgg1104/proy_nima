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

    // Actualizar los permisos de un rol
    public function updatePermissions($keyName, $permissions) {
        $stmt = $this->db->prepare("UPDATE roles SET permissions = :permissions WHERE key_name = :key_name");
        return $stmt->execute([
            'permissions' => json_encode($permissions),
            'key_name' => $keyName
        ]);
    }
}
